#!/usr/bin/env node
/**
 * Sync website facts from the reponerve/reponerve product repository.
 * Target site: https://reponerve.github.io/ (repo: reponerve/reponerve.github.io)
 *
 * Usage:
 *   node scripts/sync-site-data.mjs
 *   REPONERVE_LOCAL=/path/to/reponerve node scripts/sync-site-data.mjs
 *
 * Reads version from GitHub Releases (or local `git describe`), language and MCP
 * counts from source files, and writes src/site-data.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'site-data.json');

const WEBSITE_URL = 'https://reponerve.github.io/';
const PRODUCT_REPO = 'reponerve/reponerve';
const WEBSITE_REPO = 'reponerve/reponerve.github.io';

const REPO = process.env.REPONERVE_REPO || PRODUCT_REPO;
const REF = process.env.REPONERVE_REF || 'main';
const LOCAL = process.env.REPONERVE_LOCAL || '';

function readLocal(relPath) {
  const full = path.join(LOCAL, relPath);
  return fs.readFileSync(full, 'utf8');
}

async function readRemote(relPath) {
  const url = `https://raw.githubusercontent.com/${REPO}/${REF}/${relPath}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.text();
}

async function readSource(relPath) {
  if (LOCAL) {
    return readLocal(relPath);
  }
  return readRemote(relPath);
}

function localGitVersion() {
  if (!LOCAL) return null;
  try {
    return execSync('git describe --tags --abbrev=0', {
      cwd: LOCAL,
      encoding: 'utf8',
    }).trim();
  } catch {
    return null;
  }
}

async function latestReleaseVersion() {
  const local = localGitVersion();
  if (local) return local;

  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`);
  if (res.ok) {
    const data = await res.json();
    if (data.tag_name) return data.tag_name;
  }

  const versionGo = await readSource('internal/version/version_test.go');
  const match = versionGo.match(/Version = "(v[^"]+)"/);
  if (match) return match[1];

  return 'v1.5.1';
}

function countLanguages(langGo) {
  const block = langGo.match(/SupportedTreeSitterLanguages = \[\]string\{([^}]+)\}/s);
  if (!block) return 20;
  const treeSitter = block[1].split(',').filter((s) => s.trim().length > 0).length;
  return treeSitter + 1; // Go + Tree-sitter set
}

function countMcpTools(registryGo) {
  return (registryGo.match(/\.Register\(/g) || []).length;
}

function buildSiteData({ version, languageCount, mcpToolCount }) {
  const versionTag = version.startsWith('v') ? version : `v${version}`;
  const semver = versionTag.replace(/^v/, '');

  return {
    generatedAt: new Date().toISOString(),
    source: {
      repository: REPO,
      ref: LOCAL ? `local:${LOCAL}` : REF,
    },
    version: versionTag,
    install: {
      script:
        'curl -fsSL https://raw.githubusercontent.com/reponerve/reponerve/main/scripts/install.sh | bash',
      npm: 'npm install -g reponerve',
      go: `go install github.com/reponerve/reponerve/cmd/reponerve@${versionTag}`,
    },
    stats: {
      languages: languageCount,
      languagesLabel: `Go + ${languageCount - 1} Tree-sitter languages`,
      mcpTools: mcpToolCount,
    },
    links: {
      website: WEBSITE_URL,
      websiteRepo: `https://github.com/${WEBSITE_REPO}`,
      github: `https://github.com/${PRODUCT_REPO}`,
      docs: `https://github.com/${PRODUCT_REPO}/tree/main/docs`,
      install: `https://github.com/${PRODUCT_REPO}/blob/main/docs/install.md`,
      license: `https://github.com/${PRODUCT_REPO}/blob/main/LICENSE`,
      demoGif: `https://github.com/${PRODUCT_REPO}/blob/main/docs/assets/reponerve-demo.gif?raw=true`,
      releases: `https://github.com/${PRODUCT_REPO}/releases`,
      issues: `https://github.com/${PRODUCT_REPO}/issues`,
      contributing: `https://github.com/${PRODUCT_REPO}/blob/main/docs/governance/contribution-guide.md`,
    },
    contributor: {
      cloneCommand: `git clone https://github.com/${PRODUCT_REPO} && cd reponerve && make install`,
    },
    mcpClients: [
      { label: 'PRIMARY', name: 'Cursor' },
      { label: 'CLIENT', name: 'VS Code Copilot' },
      { label: 'SUPPORTED', name: 'JetBrains' },
      { label: 'SUPPORTED', name: 'Continue' },
      { label: 'SUPPORTED', name: 'Claude Desktop' },
    ],
    homebrew: {
      status: 'tap-in-progress',
      note: 'Homebrew tap packaging exists; until published, use the install script or release archives.',
      tap: 'brew tap reponerve/tap',
      install: 'brew install reponerve',
    },
    teamPitch:
      "Hey team, we're setting up RepoNerve for our repository. It scans git, ADRs, and code structure once and builds local software memory (.reponerve/memory.db). Developers and AI agents query that memory for why something exists, who owns it, and what breaks if we change it — instead of grepping every session. Run reponerve init and reponerve scan; it plugs into Cursor, Copilot, and other MCP hosts. No cloud required.",
    demoScript: `# 1. Install & verify binary
reponerve --version

# 2. Go to your local git repository
cd /path/to/your-repo

# 3. Initialize workspace database
reponerve init

# 4. Scan repository & build memory
reponerve scan

# 5. Diagnostic check & orientation onboarding
reponerve doctor
reponerve onboard

# 6. Task planning, reuse check, and code review
reponerve plan "Add webhook notifications"
reponerve reuse-check "add webhook"
reponerve review "webhook"
reponerve ship-check "webhook"`,
    commandDemos: {
      init: {
        id: 'init',
        label: 'reponerve init',
        command: 'reponerve init',
        output: [
          '✓ Workspace created',
          '✓ Configuration created',
          '✓ Database initialized',
          '✓ IDE integration installed (Cursor skill + MCP + development discipline rules)',
          '  Chat without MCP: reponerve ask "..." --json  (or /reponerve in chat)',
          '  + .cursor/mcp.json',
          '  + .cursor/skills/reponerve/SKILL.md',
          '  → Restart MCP in your IDE, then use Agent chat with RepoNerve',
          '✓ RepoNerve ready',
          '  → Run: reponerve scan',
        ],
      },
      scan: {
        id: 'scan',
        label: 'reponerve scan',
        command: 'reponerve scan',
        output: [
          'Scanning repository...',
          '✓ Repository discovered',
          '✓ 45 commits indexed',
          '✓ 12 ADRs indexed',
          '✓ Code intelligence indexed',
          '✓ Repository-code links updated',
          '✓ Search index rebuilt',
          '✓ Discipline policy updated',
          `Scan completed. (${languageCount} languages via Go + Tree-sitter)`,
        ],
      },
      doctor: {
        id: 'doctor',
        label: 'reponerve doctor',
        command: 'reponerve doctor',
        output: [
          'RepoNerve doctor: all checks passed.',
          '  [ok] workspace: .reponerve workspace present',
          '  [ok] database: memory.db readable',
          '  [ok] git_head: scan matches current HEAD',
          '  [ok] code_index: code intelligence index fresh',
          '  [warn] post_commit_hook: post-commit hook not installed (optional)',
        ],
      },
      onboard: {
        id: 'onboard',
        label: 'reponerve onboard',
        command: 'reponerve onboard --format compact --token-budget 400',
        output: [
          'RepoNerve onboarding evidence pack',
          'Repository: your-repo (Go)',
          'Key decisions: Local-first SQLite, MCP agent surface, evidence-backed outputs',
          'Starting points: cmd/, internal/, docs/adr/',
          'Next: reponerve plan "your task" --json',
        ],
      },
      plan: {
        id: 'plan',
        label: 'reponerve plan',
        command: 'reponerve plan "Add OAuth login"',
        output: [
          'Planning task: "Add OAuth login"',
          'Retrieving relevant contexts from codebase memory...',
          'Impact: internal/auth/oauth.go, cmd/reponerve/main.go',
          'Suggested steps:',
          '  1. Review ADRs constraining auth changes',
          '  2. Read entity briefings for auth package symbols',
          '  3. Run reuse-check before adding new middleware',
          'Tip: reponerve reuse-check "OAuth middleware" --json',
        ],
      },
      mcp: {
        id: 'mcp',
        label: 'reponerve mcp',
        command: 'reponerve mcp',
        output: [
          'Starting RepoNerve MCP server (stdio)...',
          `Registered ${mcpToolCount} tools (ask, plan, explain, reuse_check, ship_check, doctor, …)`,
          'Workspace: .reponerve',
          'Client connected: Cursor',
          'Tool call: ask — "Where is rate limiting configured?"',
          'Response: evidence pack (completeness: full, 214 tokens)',
        ],
      },
    },
    configPresets: {
      default: {
        title: 'Default Profile',
        subtitle: 'Local-first SQLite memory and ADR ingestion',
        description: 'Default local-first settings: SQLite memory, ADR ingestion, no external AI provider.',
        code: `repository:
  path: "."

storage:
  sqlite_path: ".reponerve/memory.db"

ai:
  provider: "none"

ingestion:
  document_paths:
    - path: "docs/adr"
      format: "markdown"`,
        outcomes: [
          'Local SQLite memory at .reponerve/memory.db',
          'ADR document indexing from docs/adr',
          'AI provider disabled (deterministic scan and query)',
        ],
      },
      adrExtended: {
        title: 'Extended Decisions',
        subtitle: 'Additional docs/decisions folder indexing',
        description: 'Index additional decision folders alongside ADRs for broader repository intelligence.',
        code: `repository:
  path: "."

storage:
  sqlite_path: ".reponerve/memory.db"

ai:
  provider: "none"

ingestion:
  document_paths:
    - path: "docs/adr"
      format: "markdown"
    - path: "docs/decisions"
      format: "markdown"`,
        outcomes: [
          'Multi-directory ADR and decision ingestion',
          'Same local-first SQLite storage model',
          'Configurable paths per RFC-005',
        ],
      },
      rfcPaths: {
        title: 'RFC Ingestion',
        subtitle: 'Include docs/rfc in document_paths',
        description: 'Include RFC documents in scan ingestion for architecture-heavy repositories.',
        code: `repository:
  path: "."

storage:
  sqlite_path: ".reponerve/memory.db"

ai:
  provider: "none"

ingestion:
  document_paths:
    - path: "docs/adr"
      format: "markdown"
    - path: "docs/rfc"
      format: "markdown"`,
        outcomes: [
          'RFC markdown ingestion enabled',
          'Repository + code linking unchanged',
          'Document paths merged at scan time',
        ],
      },
    },
    setupSteps: [
      {
        title: 'Step 1 — Install RepoNerve',
        body: 'Install globally via npm, the install script, or go install — then run reponerve --version.',
      },
      {
        title: 'Step 2 — Initialize & Scan',
        body: 'From your repo root: reponerve init then reponerve scan to build local memory.',
      },
      {
        title: 'Step 3 — Verify Setup',
        body: 'Run reponerve doctor to check memory health, scan freshness, and MCP configuration.',
      },
      {
        title: 'Step 4 — Understand Code',
        body: 'Use reponerve onboard, reponerve ask, and reponerve explain-* before editing.',
      },
      {
        title: 'Step 5 — Plan and Ship',
        body: 'Run reponerve plan, reuse-check, review, and ship-check before merge.',
      },
      {
        title: 'Step 6 — Connect AI Tools',
        body: 'Run reponerve mcp or use MCP config installed by init in Cursor, VS Code, or Copilot.',
      },
    ],
  };
}

async function main() {
  const [langGo, registryGo, version] = await Promise.all([
    readSource('internal/code/lang/lang.go'),
    readSource('internal/mcp/registry.go'),
    latestReleaseVersion(),
  ]);

  const languageCount = countLanguages(langGo);
  const mcpToolCount = countMcpTools(registryGo);

  if (mcpToolCount === 0) {
    throw new Error('MCP tool count parsed as 0 — check registry.go path');
  }

  const data = buildSiteData({ version, languageCount, mcpToolCount });
  fs.writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Wrote ${OUT}`);
  console.log(`  version: ${data.version}`);
  console.log(`  languages: ${data.stats.languages}`);
  console.log(`  mcpTools: ${data.stats.mcpTools}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
