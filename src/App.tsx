/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  Terminal,
  Zap,
  ShieldAlert,
  RefreshCw,
  Network,
  ChevronRight,
  Copy,
  Check,
  Github,
  ExternalLink,
  BookOpen,
  Users,
  Clock,
  Play,
  FileCode,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

import siteData from './site-data.json';

const { install: installCommands, stats, links, commandDemos: commandDemosData, configPresets, teamPitch, demoScript, setupSteps, homebrew, mcpClients, contributor } = siteData;

interface CommandDemo {
  id: string;
  label: string;
  command: string;
  output: string[];
}

type ConfigPresetKey = keyof typeof configPresets;

export default function App() {
  const [selectedCmd, setSelectedCmd] = useState<string>('init');
  const [typedOutput, setTypedOutput] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Copy helper
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Configuration playground states
  const [selectedConfigPreset, setSelectedConfigPreset] = useState<ConfigPresetKey>('default');

  // Interactive Code Graph states
  const [hoveredGraphNode, setHoveredGraphNode] = useState<string | null>(null);

  // Custom alert subscription demo
  const [demoEmail, setDemoEmail] = useState('');
  const [subscribedDemo, setSubscribedDemo] = useState(false);

  // Factual FAQ Sandbox Question Index
  const [activeQuestion, setActiveQuestion] = useState<number>(0);

  // Interactive Node explanation from Logo
  const [activeLogoNode, setActiveLogoNode] = useState<{
    name: string;
    role: string;
    details: string;
    color: string;
  } | null>(null);

  // Command demos (synced from reponerve/reponerve via scripts/sync-site-data.mjs)
  const commandDemos: Record<string, CommandDemo> = commandDemosData as Record<string, CommandDemo>;

  // Simulate command typing output
  useEffect(() => {
    setIsTyping(true);
    setTypedOutput([]);
    let currentLine = 0;
    const lines = commandDemos[selectedCmd]?.output || [];

    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        const lineVal = lines[currentLine];
        if (lineVal !== undefined) {
          setTypedOutput(prev => [...prev, lineVal]);
        }
        currentLine++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [selectedCmd]);

  // Scroll to bottom of terminal output
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [typedOutput]);

  // Copy click handler
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => {
      copiedText === id && setCopiedText(null);
    }, 2000);
  };

  // Demo Newsletter sign up action
  const handleSubscribeDemo = (e: FormEvent) => {
    e.preventDefault();
    if (!demoEmail) return;
    setSubscribedDemo(true);
    setTimeout(() => {
      setSubscribedDemo(false);
      setDemoEmail('');
    }, 5000);
  };

  // Logo nodes explanation mapping
  const selectLogoNode = (node: string) => {
    switch (node) {
      case 'central':
        setActiveLogoNode({
          name: 'Central Memory Core',
          role: 'Relational database and index store',
          details: 'Directly coordinates the scanning of code files, manages local SQLite memory storage, handles code symbol trees, and updates .reponerve/memory.db as your codebase changes.',
          color: 'text-zinc-900 border-zinc-200'
        });
        break;
      case 'top-right':
        setActiveLogoNode({
          name: 'Context Query Engine',
          role: 'High-speed retrieval system',
          details: 'Executes fast SQLite FTS5 search queries, git history alignments, and custom design rule lookups to retrieve highly relevant code context and decisions in <50ms.',
          color: 'text-zinc-900 border-zinc-200'
        });
        break;
      case 'bottom':
        setActiveLogoNode({
          name: 'Model Context Protocol (MCP) Server',
          role: 'Unified AI assistant connector',
          details: 'Bridges the codebase with AI clients. Serves ask, plan, explain, reuse_check, ship_check, and 44 more tools to Cursor, VS Code Copilot, JetBrains, and Claude Desktop.',
          color: 'text-zinc-900 border-zinc-200'
        });
        break;
      case 'top-left':
        setActiveLogoNode({
          name: 'AST Parser & Code Intelligence',
          role: 'Deep syntactic code analyzer',
          details: 'Analyzes source code hierarchies, extracts classes, functions, variables, and comments, building an intelligent symbol table for precise query alignment.',
          color: 'text-zinc-900 border-zinc-200'
        });
        break;
      default:
        setActiveLogoNode(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200 selection:text-zinc-800 overflow-x-hidden antialiased">
      
      {/* Grid Pattern Background - Extremely subtle for minimal elegance */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e730_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e730_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a href="#hero" className="flex items-center gap-2.5 group" id="nav-brand-logo">
            <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center p-1 group-hover:border-zinc-400 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="40" fill="none" stroke="#18181b" strokeWidth="6" />
                <path d="M 100,100 L 140,60" stroke="#71717a" strokeWidth="12" strokeLinecap="round" />
                <path d="M 100,100 L 60,60" stroke="#71717a" strokeWidth="12" strokeLinecap="round" />
                <path d="M 100,100 L 100,155" stroke="#71717a" strokeWidth="12" strokeLinecap="round" />
                <circle cx="100" cy="100" r="15" fill="#18181b" />
                <circle cx="140" cy="60" r="10" fill="#18181b" />
                <circle cx="60" cy="60" r="8" fill="#71717a" />
                <circle cx="100" cy="155" r="10" fill="#18181b" />
              </svg>
            </div>
            <span className="font-mono text-base tracking-widest font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">
              reponerve
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors" id="nav-link-features">Features</a>
            <a href="#terminal" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors" id="nav-link-terminal">Terminal Demo</a>
            <a href="#playbook" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors" id="nav-link-playbook">Playbook</a>
            <a href="#architecture" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors" id="nav-link-architecture">Architecture</a>
            <a href="#installation" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors" id="nav-link-installation">Install</a>
            <a href={links.docs} target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors" id="nav-link-docs">Docs</a>
            <a href="#contribute" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors" id="nav-link-contribute">Contribute</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a 
              href={links.github}
              target="_blank" 
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              id="header-btn-github"
            >
              <Github className="w-4 h-4" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs text-zinc-600 mb-6 font-mono shadow-sm" id="hero-version-tag">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{siteData.version} Released</span>
              <span className="text-zinc-300">|</span>
              <span className="text-zinc-800 font-semibold">Local-First · Open Source</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-zinc-900 leading-[1.15] mb-6" id="hero-main-heading">
              Local-First <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-stone-800">Software Understanding</span> for Developers &amp; AI Agents
            </h1>

            {/* Subtext */}
            <p className="text-zinc-500 text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-8 max-w-2xl" id="hero-description">
              RepoNerve scans your repository once — git history, ADRs, and code structure — and builds local software memory. Query <em>why</em> code exists, <em>who</em> owns it, and <em>what breaks</em> if you change it. Works in AI chat via MCP or CLI. No cloud required.
            </p>

            {/* Quick Install Bar Widget */}
            <div className="w-full max-w-md bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-8 relative group shadow-[0_2px_8px_rgba(0,0,0,0.02)]" id="hero-install-widget">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 font-mono text-sm overflow-x-auto whitespace-nowrap scrollbar-none py-1">
                  <span className="text-zinc-400 select-none">$</span>
                  <span className="text-zinc-800 font-mono">{installCommands.script}</span>
                </div>
                <button
                  onClick={() => handleCopy(installCommands.script, 'hero-install')}
                  className="p-2 rounded-lg bg-white text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all border border-zinc-200 hover:border-zinc-300 active:scale-95 shadow-sm"
                  title="Copy command"
                  id="btn-hero-copy"
                >
                  {copiedText === 'hero-install' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {/* Copied Popup Alert Indicator */}
              {copiedText === 'hero-install' && (
                <div className="absolute -top-10 right-4 px-2.5 py-1 bg-zinc-900 text-white rounded text-[11px] font-mono animate-fade-in shadow-md">
                  Copied! Ready to paste
                </div>
              )}
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="#terminal" 
                className="px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
                id="btn-hero-cta-demo"
              >
                <Play className="w-4 h-4 fill-white text-transparent" />
                <span>See Interactive Demo</span>
              </a>
              <a 
                href="#installation" 
                className="px-6 py-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 font-medium text-sm flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                id="btn-hero-cta-install"
              >
                <BookOpen className="w-4 h-4" />
                <span>Quick Setup</span>
              </a>
            </div>

            {/* Performance Stats row */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-6 border-t border-zinc-200/80 w-full text-left" id="hero-performance-stats">
              <div>
                <span className="block text-xl md:text-2xl font-bold font-mono text-zinc-900">{stats.languages}</span>
                <span className="text-xs text-zinc-500 font-medium">Indexed Languages</span>
              </div>
              <div>
                <span className="block text-xl md:text-2xl font-bold font-mono text-zinc-900">{stats.mcpTools}</span>
                <span className="text-xs text-zinc-500 font-medium">MCP Tools</span>
              </div>
              <div>
                <span className="block text-xl md:text-2xl font-bold font-mono text-zinc-900">Local</span>
                <span className="text-xs text-zinc-500 font-medium">First · No Cloud</span>
              </div>
            </div>

          </div>

          {/* Hero Right Content - Interactive Radar Logo */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Glow backing */}
            <div className="absolute inset-0 bg-zinc-100/50 rounded-full filter blur-3xl" />

            {/* Interactive Logo Stage */}
            <div className="w-72 h-72 sm:w-85 sm:h-85 md:w-96 md:h-96 relative border border-zinc-200 rounded-full p-4 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]" id="logo-radar-stage">
              
              {/* Interactive SVG logo implementation */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
                <defs>
                  <filter id="glow-pulse" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <style>{`
                    @keyframes radar-pulse-pulse {
                      0% { r: 10px; opacity: 1; }
                      50% { opacity: 0.5; }
                      100% { r: 85px; opacity: 0.05; }
                    }
                    @keyframes signal-flow-pulse {
                      0% { stroke-dashoffset: 200; }
                      100% { stroke-dashoffset: 0; }
                    }
                    .radar-ring-pulse {
                      animation: radar-pulse-pulse 4s infinite cubic-bezier(0.1, 0.8, 0.3, 1);
                    }
                    .flow-line-pulse {
                      stroke-dasharray: 12, 6;
                      animation: signal-flow-pulse 4s infinite linear;
                    }
                  `}</style>
                </defs>

                {/* Background Grid */}
                <g stroke="#18181b" strokeOpacity="0.04" strokeWidth="0.5">
                  <circle cx="100" cy="100" r="30" fill="none" />
                  <circle cx="100" cy="100" r="60" fill="none" />
                  <circle cx="100" cy="100" r="90" fill="none" />
                  <line x1="100" y1="0" x2="100" y2="200" />
                  <line x1="0" y1="100" x2="200" y2="100" />
                </g>

                {/* Radar Pulsing System Activity */}
                <circle cx="100" cy="100" r="40" fill="none" stroke="#18181b" strokeWidth="1" className="radar-ring-pulse" filter="url(#glow-pulse)" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#18181b" strokeWidth="0.5" className="radar-ring-pulse" style={{ animationDelay: '2s' }} filter="url(#glow-pulse)" />

                {/* Connection Guides */}
                <circle cx="100" cy="100" r="55" fill="none" stroke="#18181b" strokeOpacity="0.04" strokeWidth="1" />
                <circle cx="100" cy="100" r="25" fill="none" stroke="#18181b" strokeOpacity="0.06" strokeWidth="1.2" />

                {/* Synaptic Signal Pathways */}
                <g strokeLinecap="round" fill="none">
                  {/* Center to Top Right branch */}
                  <path d="M 100,100 L 140,60" stroke="#71717a" strokeOpacity="0.3" strokeWidth="2.5" />
                  <path d="M 100,100 L 140,60" stroke="#18181b" strokeWidth="3" className="flow-line-pulse" filter="url(#glow-pulse)" />

                  {/* Center to Top Left branch */}
                  <path d="M 100,100 L 60,60" stroke="#71717a" strokeOpacity="0.3" strokeWidth="2.5" />
                  <path d="M 100,100 L 60,60" stroke="#18181b" strokeWidth="3" className="flow-line-pulse" style={{ animationDelay: '1s' }} filter="url(#glow-pulse)" />

                  {/* Center to Bottom branch */}
                  <path d="M 100,100 L 100,155" stroke="#71717a" strokeOpacity="0.3" strokeWidth="2.5" />
                  <path d="M 100,100 L 100,155" stroke="#18181b" strokeWidth="3" className="flow-line-pulse" style={{ animationDelay: '2.5s' }} filter="url(#glow-pulse)" />
                </g>

                {/* Nodes & Interactive Targets */}
                {/* Central Brain Core */}
                <g 
                  className="cursor-pointer group/node"
                  onMouseEnter={() => selectLogoNode('central')}
                  onMouseLeave={() => selectLogoNode('')}
                >
                  <circle cx="100" cy="100" r="14" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
                  <circle cx="100" cy="100" r="8" fill="#18181b" filter="url(#glow-pulse)" />
                  <circle cx="100" cy="100" r="3.5" fill="#ffffff" />
                </g>

                {/* Top-Right branch (Reflexes) */}
                <g 
                  className="cursor-pointer group/node"
                  transform="translate(140, 60)"
                  onMouseEnter={() => selectLogoNode('top-right')}
                  onMouseLeave={() => selectLogoNode('')}
                >
                  <circle cx="0" cy="0" r="12" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="6" fill="#18181b" filter="url(#glow-pulse)" />
                  <circle cx="0" cy="0" r="9" fill="none" stroke="#18181b" strokeOpacity="0.5" strokeWidth="0.8" className="animate-ping" />
                </g>

                {/* Top-Left branch (Sync) */}
                <g 
                  className="cursor-pointer group/node"
                  transform="translate(60, 60)"
                  onMouseEnter={() => selectLogoNode('top-left')}
                  onMouseLeave={() => selectLogoNode('')}
                >
                  <circle cx="0" cy="0" r="11" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="5" fill="#71717a" />
                </g>

                {/* Bottom branch (Telemetry) */}
                <g 
                  className="cursor-pointer group/node"
                  transform="translate(100, 155)"
                  onMouseEnter={() => selectLogoNode('bottom')}
                  onMouseLeave={() => selectLogoNode('')}
                >
                  <circle cx="0" cy="0" r="13" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="6.5" fill="#18181b" filter="url(#glow-pulse)" />
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#e4e4e7" strokeWidth="0.8" />
                </g>

                {/* Secondary Small Accents */}
                <circle cx="120" cy="80" r="3" fill="#a1a1aa" opacity="0.8" />
                <circle cx="80" cy="80" r="3" fill="#a1a1aa" opacity="0.8" />
                <circle cx="100" cy="125" r="3.5" fill="#18181b" opacity="0.9" />
                <circle cx="150" cy="110" r="2.5" fill="#a1a1aa" opacity="0.6" />
                <circle cx="50" cy="110" r="2.5" fill="#a1a1aa" opacity="0.6" />
              </svg>

              {/* Central text indicator helper */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mt-20 text-center">
                <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">Interactive Node</p>
                <p className="text-xs font-mono font-bold text-zinc-500 animate-pulse">Hover circles to examine</p>
              </div>

            </div>

            {/* Simulated Live Signal readout card responding to user hovering */}
            <div className="absolute -bottom-6 w-full max-w-sm" id="logo-interactive-panel">
              {activeLogoNode ? (
                <div className={`p-4 rounded-xl border border-zinc-200 bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ${activeLogoNode.color}`}>
                  <h4 className="text-sm font-bold font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-ping" />
                    {activeLogoNode.name}
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-400 mb-1.5">{activeLogoNode.role}</p>
                  <p className="text-xs text-zinc-600 leading-relaxed font-normal">{activeLogoNode.details}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-zinc-200 bg-white/60 backdrop-blur-md text-zinc-400 text-center text-xs font-mono">
                  💡 Hover nodes in the neural graphic to inspect active architectural layers.
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Live Terminal Demo Simulator Section */}
      <section id="terminal" className="py-20 border-t border-b border-zinc-200/60 bg-zinc-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Description */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4" id="heading-terminal">
              Command-Line Simplicity. Real Output.
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg" id="desc-terminal">
              See RepoNerve in action with the official recording, or click any command below to instantly preview its exact workspace outputs.
            </p>
          </div>

          {/* New Simplified Layout: Side-by-Side Live Demo & Command Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="terminal-simplified-showcase">
            
            {/* Left Column: Official Recording GIF */}
            <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[440px]" id="terminal-demo-gif-window">
              
              {/* Window Header */}
              <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 font-medium">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>reponerve — official-recording.gif</span>
                </div>
                <div className="w-12" />
              </div>

              {/* GIF display stage */}
              <div className="flex-1 bg-zinc-950 p-5 flex flex-col items-center justify-center relative min-h-[320px]">
                <img
                  src={links.demoGif}
                  alt="RepoNerve Official Demo"
                  className="w-full h-auto max-h-[300px] object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                
                {/* Caption info bar */}
                <div className="mt-4 w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between shadow-lg">
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Actual Terminal Performance
                  </span>
                  <a 
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-zinc-300 hover:text-white underline flex items-center gap-1 transition-colors"
                  >
                    View on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Command Playbook & Real Output Preview */}
            <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="terminal-playbook-card">
              
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-3">
                  Select a Command:
                </span>
                
                {/* Clean Horizontal/Grid Selectors */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Object.values(commandDemos).map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => setSelectedCmd(demo.id)}
                      className={`px-3 py-2.5 text-xs font-mono font-bold rounded-lg border transition-all text-center ${
                        selectedCmd === demo.id
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm font-semibold'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 font-semibold'
                      }`}
                    >
                      {demo.id}
                    </button>
                  ))}
                </div>

                {/* Selected Command Description */}
                <div className="mb-4 font-sans">
                  <p className="text-xs text-zinc-500 font-normal leading-relaxed mb-3">
                    {selectedCmd === 'init' && 'Initializes the local .reponerve directory, SQLite memory instance, custom rules, and the default config file.'}
                    {selectedCmd === 'scan' && `Ingests git history, ADRs, and code intelligence (${stats.languagesLabel}). No LLM required.`}
                    {selectedCmd === 'doctor' && 'Performs diagnostics on repository health, DB alignment, and MCP state to ensure indexing is healthy.'}
                    {selectedCmd === 'onboard' && 'Creates a compact repository orientation pack outlining key decisions, creators, and codebase architecture.'}
                    {selectedCmd === 'plan' && 'Analyzes the codebase and maps edits, file impacts, and sequential execution steps for a chosen development task.'}
                    {selectedCmd === 'mcp' && `Boots the MCP server over stdio — ${stats.mcpTools} tools for Cursor, VS Code, Copilot, and other MCP hosts.`}
                  </p>

                  {/* Copyable Command execution bar */}
                  <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 font-mono text-xs text-zinc-800">
                    <span className="font-bold text-zinc-900 select-all">$ {commandDemos[selectedCmd].command}</span>
                    <button
                      onClick={() => handleCopy(commandDemos[selectedCmd].command, selectedCmd)}
                      className="text-zinc-400 hover:text-zinc-900 transition-colors p-1"
                      title="Copy command"
                    >
                      {copiedText === selectedCmd ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulated terminal output */}
              <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-950 overflow-hidden">
                <div className="px-3 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  <span className="text-[10px] font-mono text-zinc-500 ml-1">output preview</span>
                </div>
                <div className="p-4 font-mono text-[11px] text-zinc-300 leading-relaxed max-h-[180px] overflow-y-auto">
                  <p className="text-zinc-500 mb-2">$ {commandDemos[selectedCmd].command}</p>
                  {typedOutput.map((line, i) => (
                    <p key={i} className="mb-1">{line}</p>
                  ))}
                  {isTyping && (
                    <span className="inline-block w-2 h-3.5 bg-zinc-400 animate-pulse ml-0.5" />
                  )}
                  <div ref={terminalBottomRef} />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Highlights & Core Features Section */}
      <section id="features" className="py-24 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest pl-1">Key Nerve Centers</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 mt-3 mb-5" id="heading-features">
              Engineered for Complete Visibility
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg font-normal leading-relaxed" id="desc-features">
              RepoNerve delivers evidence-backed repository intelligence — scan once, query forever. Every answer traces back to code, commits, or ADRs in your local memory database.
            </p>
          </div>

          {/* Features Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="features-bento-grid">
            
            {/* Grid 1: AST & Symbol Code Graphs */}
            <div className="md:col-span-2 lg:col-span-2 p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50/80 hover:border-zinc-300 transition-all flex flex-col justify-between group hover:shadow-sm h-[360px] relative overflow-hidden" id="card-neural-graphs">
              
              <div>
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center p-2 text-zinc-700 mb-6">
                  <Network className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-mono text-zinc-900 mb-2">AST & Symbol Code Graphs</h3>
                <p className="text-zinc-500 text-sm font-normal leading-relaxed max-w-md">
                  Map your repository's files, internal modules, and context dependencies. Analyze file dependencies and AST relationships to construct pristine structural indexes.
                </p>
              </div>

              {/* Interactive Micro Graphic representation inside bento */}
              <div className="w-full h-28 bg-white border border-zinc-200 rounded-lg p-3 relative overflow-hidden flex items-center justify-center select-none" id="mini-graph-canvas">
                
                {/* Nodes rendering */}
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Connection lines */}
                  <line x1="15%" y1="50%" x2="40%" y2="25%" stroke="#d4d4d8" strokeWidth="1.5" />
                  <line x1="15%" y1="50%" x2="40%" y2="75%" stroke="#d4d4d8" strokeWidth="1.5" />
                  <line x1="40%" y1="25%" x2="70%" y2="25%" stroke="#18181b" strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="40%" y1="75%" x2="70%" y2="75%" stroke="#d4d4d8" strokeWidth="1.5" />
                  <line x1="70%" y1="25%" x2="90%" y2="50%" stroke="#d4d4d8" strokeWidth="1.5" />
                  <line x1="70%" y1="75%" x2="90%" y2="50%" stroke="#d4d4d8" strokeWidth="1.5" />

                  {/* Nodes */}
                  <g className="cursor-pointer" onMouseEnter={() => setHoveredGraphNode('main.go')} onMouseLeave={() => setHoveredGraphNode(null)}>
                    <circle cx="15%" cy="50%" r="6" fill="#18181b" className="animate-pulse" />
                    <text x="15%" y="75%" fill="#71717a" fontSize="10" textAnchor="middle" fontFamily="monospace">main.go</text>
                  </g>

                  <g className="cursor-pointer" onMouseEnter={() => setHoveredGraphNode('auth.go')} onMouseLeave={() => setHoveredGraphNode(null)}>
                    <circle cx="40%" cy="25%" r="5" fill="#71717a" />
                    <text x="40%" y="15%" fill="#71717a" fontSize="10" textAnchor="middle" fontFamily="monospace">auth.go</text>
                  </g>

                  <g className="cursor-pointer" onMouseEnter={() => setHoveredGraphNode('db.go')} onMouseLeave={() => setHoveredGraphNode(null)}>
                    <circle cx="40%" cy="75%" r="5" fill="#a1a1aa" />
                    <text x="40%" y="92%" fill="#71717a" fontSize="10" textAnchor="middle" fontFamily="monospace">db.go</text>
                  </g>

                  <g className="cursor-pointer" onMouseEnter={() => setHoveredGraphNode('server.go')} onMouseLeave={() => setHoveredGraphNode(null)}>
                    <circle cx="70%" cy="25%" r="7" fill="#18181b" />
                    <circle cx="70%" cy="25%" r="11" fill="none" stroke="#18181b" strokeOpacity="0.2" strokeWidth="1" className="animate-ping" />
                    <text x="70%" y="15%" fill="#71717a" fontSize="10" textAnchor="middle" fontFamily="monospace">server.go</text>
                  </g>

                  <g className="cursor-pointer" onMouseEnter={() => setHoveredGraphNode('config.yaml')} onMouseLeave={() => setHoveredGraphNode(null)}>
                    <circle cx="70%" cy="75%" r="5" fill="#71717a" />
                    <text x="70%" y="92%" fill="#71717a" fontSize="10" textAnchor="middle" fontFamily="monospace">config.yaml</text>
                  </g>

                  <g className="cursor-pointer" onMouseEnter={() => setHoveredGraphNode('memory.db')} onMouseLeave={() => setHoveredGraphNode(null)}>
                    <circle cx="90%" cy="50%" r="6" fill="#18181b" />
                    <text x="90%" y="75%" fill="#18181b" fontSize="10" textAnchor="middle" fontFamily="monospace">memory.db</text>
                  </g>
                </svg>

                {/* Node details floating state */}
                <div className="absolute right-3 bottom-3 text-right">
                  {hoveredGraphNode ? (
                    <span className="text-[10px] font-mono bg-zinc-900 text-white px-2 py-1 rounded shadow">
                      Module: {hoveredGraphNode} (Active Dependency)
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-400">Hover files to trace connections</span>
                  )}
                </div>
              </div>

            </div>

            {/* Grid 2: Active Context Retrieval */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50/80 hover:border-zinc-300 transition-all flex flex-col justify-between group hover:shadow-sm h-[360px]" id="card-active-reflexes">
              <div>
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center p-2 text-zinc-700 mb-6">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-mono text-zinc-900 mb-2">Context Retrieval</h3>
                <p className="text-zinc-500 text-sm font-normal leading-relaxed">
                  Provide instant codebase context. Build light, lightning-fast query retrieval systems that feed accurate AST trees and code modules straight to your AI prompt requests.
                </p>
              </div>

              {/* Status checkboxes representation */}
              <div className="space-y-2 mt-4">
                <div className="p-2.5 rounded bg-white border border-zinc-200 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-600 font-medium">fts5_search_engine</span>
                  <span className="text-zinc-800 font-bold bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">Active</span>
                </div>
                <div className="p-2.5 rounded bg-white border border-zinc-200 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-600 font-medium">ast_definition_mapper</span>
                  <span className="text-zinc-800 font-bold bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">Active</span>
                </div>
                <div className="p-2.5 rounded bg-white border border-zinc-200 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-600 font-medium">file_watch_auto_scan</span>
                  <span className="text-zinc-800 font-bold bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded">Active</span>
                </div>
              </div>
            </div>

            {/* Grid 3: AI Client Connectors */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50/80 hover:border-zinc-300 transition-all flex flex-col justify-between group hover:shadow-sm h-[360px]" id="card-synaptic-sync">
              <div>
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center p-2 text-zinc-700 mb-6">
                  <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <h3 className="text-xl font-bold font-mono text-zinc-900 mb-2">AI Integrations</h3>
                <p className="text-zinc-500 text-sm font-normal leading-relaxed">
                  Connect your favorite development clients. Standard Model Context Protocol supports streaming tools and context sources directly into IDE extensions and custom agents.
                </p>
              </div>

              {/* Connected remotes display */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 text-center">
                {mcpClients.map((client) => (
                  <div key={client.name} className="p-2 rounded bg-white border border-zinc-200">
                    <span className="block text-[10px] font-mono text-zinc-400">{client.label}</span>
                    <span className="text-xs font-bold text-zinc-800">{client.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid 4: Context Density Watch */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50/80 hover:border-zinc-300 transition-all flex flex-col justify-between group hover:shadow-sm h-[360px]" id="card-telemetry-pulse">
              <div>
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center p-2 text-zinc-700 mb-6">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold font-mono text-zinc-900 mb-2">Context Coverage</h3>
                <p className="text-zinc-500 text-sm font-normal leading-relaxed">
                  Track real-time index coverage. reponerve monitors code changes, keeping your local SQLite memory in sync so that AI queries never miss a structural block.
                </p>
              </div>

              {/* Minimalist SVG Pulse Graph representation */}
              <div className="h-20 bg-white rounded-lg border border-zinc-200 p-2 relative flex items-center overflow-hidden">
                <svg viewBox="0 0 100 30" className="w-full h-full text-zinc-300">
                  <path
                    d="M 0,25 L 10,20 L 20,25 L 30,5 L 40,25 L 50,15 L 60,18 L 70,2 L 80,18 L 90,15 L 100,28"
                    fill="none"
                    stroke="#18181b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  <path
                    d="M 0,25 L 10,20 L 20,25 L 30,5 L 40,25 L 50,15 L 60,18 L 70,2 L 80,18 L 90,15 L 100,28 L 100,30 L 0,30 Z"
                    fill="rgba(24, 24, 27, 0.01)"
                  />
                </svg>
                <div className="absolute top-1.5 left-2 text-[8px] font-mono text-zinc-400">Code & Decision Index Coverage History</div>
              </div>
            </div>

            {/* Grid 5: Unrivaled Micro Efficiency */}
            <div className="md:col-span-2 lg:col-span-1 p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50/80 hover:border-zinc-300 transition-all flex flex-col justify-between group hover:shadow-sm h-[360px]" id="card-rust-efficiency">
              <div>
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center p-2 text-zinc-700 mb-6">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-mono text-zinc-900 mb-2">Blistering Go Core</h3>
                <p className="text-zinc-500 text-sm font-normal leading-relaxed">
                  Engineered strictly in Go to provide instant index parsing. Zero Node startup delays, no heavy background Python processes—just pure native memory engine efficiency.
                </p>
              </div>

              {/* Micro specs chart */}
              <div className="space-y-1.5 mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Search Overhead</span>
                  <span className="text-zinc-700 font-medium">0.04ms</span>
                </div>
                <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="w-1/12 h-full bg-zinc-800" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Memory Footprint</span>
                  <span className="text-zinc-700 font-medium">14 MB avg</span>
                </div>
                <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="w-3/12 h-full bg-zinc-800" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Team Playbook, Q&A Sandbox & Copy-Paste Demo */}
      <section id="playbook" className="py-24 relative bg-zinc-50 border-t border-b border-zinc-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest pl-1">Ecosystem Integration</span>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mt-3 mb-5">
              Team Playbook & Factual Search Sandbox
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
              Equip your development team with local codebase intelligence. Learn how to present RepoNerve, explore what questions it resolves instantly, and try the sandbox copy-paste script.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Hand: Explain it to your team (30 seconds) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-300 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-zinc-800" />
                  <span className="font-mono text-xs font-bold text-zinc-800 uppercase tracking-wider">Explain it to your team (30 seconds)</span>
                </div>
                
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-mono leading-relaxed space-y-3 relative overflow-hidden">
                  <p>{teamPitch}</p>
                  
                  {/* Speech bubble pin tail decorative element */}
                  <div className="absolute right-4 bottom-1 w-20 h-20 bg-zinc-200/10 rounded-full blur-xl pointer-events-none" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400">Share this message on Slack or Teams</span>
                  <button
                    onClick={() => handleCopy(teamPitch, 'slack-pitch')}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-white transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
                    id="btn-copy-pitch"
                  >
                    {copiedText === 'slack-pitch' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied Pitch!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Team Pitch
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Copy-Paste Demo Script */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-300 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="w-4 h-4 text-zinc-800" />
                  <span className="font-mono text-xs font-bold text-zinc-800 uppercase tracking-wider">Copy-Paste Sandbox Demo Script</span>
                </div>
                <p className="text-zinc-500 text-xs mb-4">
                  Run this rapid demo sequence locally in your git repository to bootstrap RepoNerve and test planning/onboarding commands immediately.
                </p>

                <div className="relative group">
                  <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed text-left">
                    <code>{demoScript}</code>
                  </pre>
                  <button
                    onClick={() => handleCopy(
                      demoScript.split('\n').filter((l) => !l.startsWith('#') && l.trim()).join(' && '),
                      "copy-demo-script"
                    )}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
                    id="btn-copy-demo-script"
                    title="Copy shell script"
                  >
                    {copiedText === 'copy-demo-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Hand: Factual Codebase Q&A */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-6 text-left shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-300 transition-all h-full">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-200">
                <HelpCircle className="w-4 h-4 text-zinc-800" />
                <span className="font-mono text-xs font-bold text-zinc-800 uppercase tracking-wider">Factual Codebase Intelligence Q&A</span>
              </div>
              
              <p className="text-zinc-500 text-xs sm:text-sm mb-6">
                Understand how RepoNerve processes high-level developer queries, locating precise code definitions and symbol structures to serve as accurate prompt context. Click a query below to see the matched index result.
              </p>

              {/* Clickable Question Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6" id="faq-questions-grid">
                {[
                  {
                    q: "“Where is our main server router initialized?”",
                    desc: "Finds application entrypoint routing logic"
                  },
                  {
                    q: "“Which database tables are modified by migrations?”",
                    desc: "Traces DDL statements in schema files"
                  },
                  {
                    q: "“How is JWT session validation structured?”",
                    desc: "Locates specific middleware security handlers"
                  },
                  {
                    q: "“Are there utility helpers for parsing date strings?”",
                    desc: "Scans for specific formatting files"
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveQuestion(idx)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      activeQuestion === idx 
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm' 
                        : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                    }`}
                    id={`btn-faq-q-${idx}`}
                  >
                    <p className={`text-xs font-mono font-bold ${activeQuestion === idx ? 'text-white' : 'text-zinc-900'}`}>{item.q}</p>
                    <p className={`text-[10px] font-mono mt-1 ${activeQuestion === idx ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Verified Answer Panel */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-inner bg-zinc-50 p-4" id="faq-answer-simulator">
                <div className="flex items-center justify-between mb-2 text-[10px] font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-200/80">
                  <span>RepoNerve Codebase Q&A Response</span>
                  <span className="text-zinc-800 font-bold bg-zinc-200 border border-zinc-300 px-1.5 py-0.5 rounded">STATUS: RESOLVED</span>
                </div>

                {activeQuestion === 0 && (
                  <div className="space-y-3 font-mono text-xs text-left">
                    <p className="text-zinc-500 font-mono text-[11px]">
                      $ reponerve ask "Where is our main server router initialized?"
                    </p>
                    <div className="p-4 bg-white border border-zinc-200 rounded-lg text-zinc-800 text-[11px] leading-relaxed">
                      <span className="text-zinc-400 text-[10px] block mb-2 font-mono uppercase tracking-wider">🎯 AST CODE EVIDENCE MATCH</span>
                      <p className="mb-2 font-sans text-zinc-600">
                        Based on AST index evidence, the main HTTP router is initialized in <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">internal/server/router.go</code> via the <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">InitRouter</code> function, which registers auth, user, and system route groups using the routing framework:
                      </p>
                      <pre className="font-mono text-[10.5px] text-zinc-700 bg-zinc-50 p-2.5 rounded border border-zinc-100">
<code>{`func InitRouter() *gin.Engine {
    r := gin.New()
    r.Use(gin.Recovery(), middleware.Logger())
    // ... registers routes
    return r
}`}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {activeQuestion === 1 && (
                  <div className="space-y-3 font-mono text-xs text-left">
                    <p className="text-zinc-500 font-mono text-[11px]">
                      $ reponerve ask "Which database tables are modified by migrations?"
                    </p>
                    <div className="p-4 bg-white border border-zinc-200 rounded-lg text-zinc-800 text-[11px] leading-relaxed">
                      <span className="text-zinc-400 text-[10px] block mb-2 font-mono uppercase tracking-wider">🎯 MIGRATION HISTORY TRACK</span>
                      <p className="mb-2 font-sans text-zinc-600">
                        Based on repository migration event tracking, the <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">users</code>, <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">sessions</code>, and <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">audit_logs</code> tables are modified in migration <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">001_create_users_table.sql</code>:
                      </p>
                      <pre className="font-mono text-[10.5px] text-zinc-700 bg-zinc-50 p-2.5 rounded border border-zinc-100">
<code>{`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {activeQuestion === 2 && (
                  <div className="space-y-3 font-mono text-xs text-left">
                    <p className="text-zinc-500 font-mono text-[11px]">
                      $ reponerve explain-function "ValidateJWT" --package "auth"
                    </p>
                    <div className="p-4 bg-white border border-zinc-200 rounded-lg text-zinc-800 text-[11px] leading-relaxed">
                      <span className="text-zinc-400 text-[10px] block mb-2 font-mono uppercase tracking-wider">🎯 AST SYMBOL SPECIFICATION</span>
                      <p className="mb-2 font-sans text-zinc-600">
                        Function <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">ValidateJWT(tokenString string)</code> is defined in <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">internal/auth/jwt.go</code> (line 24). It parses incoming claims using the verified secret, returns claims data, and checks token expiration validity.
                      </p>
                      <pre className="font-mono text-[10.5px] text-zinc-700 bg-zinc-50 p-2.5 rounded border border-zinc-100">
<code>{`func ValidateJWT(tokenString string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
        return []byte(os.Getenv("JWT_SECRET")), nil
    })
    // ... validates claims
    return claims, nil
}`}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {activeQuestion === 3 && (
                  <div className="space-y-3 font-mono text-xs text-left">
                    <p className="text-zinc-500 font-mono text-[11px]">
                      $ reponerve explain-file "internal/utils/date.go"
                    </p>
                    <div className="p-4 bg-white border border-zinc-200 rounded-lg text-zinc-800 text-[11px] leading-relaxed">
                      <span className="text-zinc-400 text-[10px] block mb-2 font-mono uppercase tracking-wider">🎯 FILE ANALYSIS</span>
                      <p className="mb-2 font-sans text-zinc-600">
                        File <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">internal/utils/date.go</code> provides date formatting helpers, including <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">ParseISOToLocal</code> which parses UTC ISO strings into standard local time values:
                      </p>
                      <pre className="font-mono text-[10.5px] text-zinc-700 bg-zinc-50 p-2.5 rounded border border-zinc-100">
<code>{`func ParseISOToLocal(isoString string) (time.Time, error) {
    layout := "2006-01-02T15:04:05Z07:00"
    t, err := time.Parse(layout, isoString)
    return t.Local(), nil
}`}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Configuration Playground */}
      <section id="architecture" className="py-20 border-t border-b border-zinc-200/60 bg-zinc-50/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left description text info */}
            <div className="lg:col-span-5 text-left">
              <span className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest pl-1">Configuration Architecture</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mt-3 mb-6" id="heading-playground">
                Flexible & Declarative Nervous Controls
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base font-normal leading-relaxed mb-8">
                RepoNerve reads <code className="text-zinc-700 bg-zinc-100 px-1 rounded">.reponerve/config.yaml</code> for repository path, SQLite storage, optional document ingestion paths (RFC-005), and AI provider settings.
              </p>

              {/* Presets trigger choices */}
              <div className="space-y-3" id="playground-preset-buttons">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 pl-1 block">Choose Preset Profile:</span>

                {(Object.keys(configPresets) as ConfigPresetKey[]).map((key) => (
                  <button
                    key={key}
                    id={`btn-preset-${key}`}
                    onClick={() => setSelectedConfigPreset(key)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      selectedConfigPreset === key
                        ? 'bg-white border-zinc-400 text-zinc-900 shadow-sm'
                        : 'bg-zinc-100/40 border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <span className="block font-mono text-sm font-bold text-zinc-800">{configPresets[key].title}</span>
                      <span className="text-xs text-zinc-400 font-normal">{configPresets[key].subtitle}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${selectedConfigPreset === key ? 'text-zinc-800' : 'text-zinc-300'}`} />
                  </button>
                ))}
              </div>

            </div>

            {/* Right Interactive Code Box */}
            <div className="lg:col-span-7" id="playground-code-screen">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm relative text-left">
                
                {/* File tab label */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-zinc-800" />
                    <span className="font-mono text-xs font-bold text-zinc-700">.reponerve/config.yaml</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded uppercase">Preset active</span>
                    <button
                      onClick={() => handleCopy(configPresets[selectedConfigPreset].code, 'preset-config')}
                      className="p-1.5 rounded bg-white text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all border border-zinc-200 shadow-sm"
                      title="Copy config content"
                      id="btn-playground-copy"
                    >
                      {copiedText === 'preset-config' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Copied configuration flag */}
                {copiedText === 'preset-config' && (
                  <div className="absolute top-14 right-6 px-2.5 py-1 bg-zinc-900 text-white rounded text-[11px] font-mono animate-fade-in shadow-md z-10">
                    Config copied!
                  </div>
                )}

                {/* Code display */}
                <pre className="font-mono text-xs text-zinc-800 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200 overflow-x-auto min-h-[220px]">
                  <code>{configPresets[selectedConfigPreset].code}</code>
                </pre>

                {/* Active outcomes list */}
                <div className="mt-5">
                  <span className="block text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-2 pl-0.5">Compiled Active Reflexes:</span>
                  <div className="flex flex-wrap gap-2">
                    {configPresets[selectedConfigPreset].outcomes.map((outcome, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-100/80 border border-zinc-200 text-zinc-700 text-xs font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Quick Setup / Installation Section */}
      <section id="installation" className="py-24 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest pl-1">Get Started Instantly</span>
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mt-3 mb-5" id="heading-installation">
              Zero Dependencies. Pure Binary Power.
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg" id="desc-installation">
              Install reponerve globally on your machine using your favorite package manager. It compiles cleanly down to a single self-contained native executable.
            </p>
          </div>

          {/* Installation guides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="install-guide-grid">
            
            {/* Guide Card 1 */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white text-left flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-300 transition-all" id="install-card-npm">
              <div>
                <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 text-zinc-700 font-mono text-xs rounded-md">npm (Node 18+)</span>
                <h4 className="text-lg font-bold font-mono text-zinc-800 mt-4 mb-2">Install via npm</h4>
                <p className="text-zinc-500 text-xs font-normal leading-relaxed mb-6">
                  Recommended for JavaScript/Node.js environments. Downloads and installs the optimized cross-platform native binary globally.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <code className="font-mono text-xs text-zinc-800">$ {installCommands.npm}</code>
                <button
                  onClick={() => handleCopy(installCommands.npm, 'install-npm')}
                  className="p-1.5 rounded bg-white hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 border border-zinc-200 shadow-sm transition-all"
                  id="btn-copy-npm"
                >
                  {copiedText === 'install-npm' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Guide Card 2 */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white text-left flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-300 transition-all" id="install-card-shell">
              <div>
                <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 font-mono text-xs rounded-md">No Go Required</span>
                <h4 className="text-lg font-bold font-mono text-zinc-800 mt-4 mb-2">Install via Script</h4>
                <p className="text-zinc-500 text-xs font-normal leading-relaxed mb-6">
                  Perfect for systems without Go or Node. Runs a shell script that resolves your OS/architecture and registers the native binary.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <code className="font-mono text-xs text-zinc-800 truncate mr-2">{installCommands.script}</code>
                <button
                  onClick={() => handleCopy(installCommands.script, 'install-script')}
                  className="p-1.5 rounded bg-white hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 border border-zinc-200 shadow-sm transition-all"
                  id="btn-copy-script"
                >
                  {copiedText === 'install-script' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Guide Card 3 */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white text-left flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-zinc-300 transition-all md:col-span-2 lg:col-span-1" id="install-card-go">
              <div>
                <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 font-mono text-xs rounded-md">Go Developers</span>
                <h4 className="text-lg font-bold font-mono text-zinc-800 mt-4 mb-2">Install via Go</h4>
                <p className="text-zinc-500 text-xs font-normal leading-relaxed mb-6">
                  Compile and install directly from the source repository using standard Go tooling. Installs the latest release directly.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <code className="font-mono text-xs text-zinc-800">$ {installCommands.go}</code>
                <button
                  onClick={() => handleCopy(installCommands.go, 'install-go')}
                  className="p-1.5 rounded bg-white hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 border border-zinc-200 shadow-sm transition-all"
                  id="btn-copy-go"
                >
                  {copiedText === 'install-go' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>

          {/* Planned Homebrew Banner */}
          <div className="mt-8 p-4 bg-zinc-100/60 border border-zinc-200 rounded-xl flex items-center justify-between max-w-4xl mx-auto text-left shadow-sm">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider rounded border border-amber-200">
                Planned
              </span>
              <p className="text-xs text-zinc-600 font-mono">
                <strong>{homebrew.note}</strong> When published: <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-800 font-mono">{homebrew.tap}</code> then <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-800 font-mono">{homebrew.install}</code>
              </p>
            </div>
          </div>

          {/* Core setup workflow guide */}
          <div className="mt-16 bg-zinc-50 border border-zinc-200 rounded-2xl p-8 max-w-4xl mx-auto" id="install-instructions-step-list">
            <h4 className="text-lg font-bold font-mono text-zinc-900 text-center mb-2">Setup and Use (6 Exact Steps)</h4>
            <p className="text-xs text-zinc-500 text-center mb-10 max-w-lg mx-auto font-sans">
              Follow these precise, community-tested steps to integrate RepoNerve's codebase memory core into your active repository workspace.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {setupSteps.map((step, index) => (
                <div key={step.title} className="text-left relative pl-10" id={`step-${index + 1}`}>
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-mono text-xs font-extrabold text-zinc-800 shadow-sm">{index + 1}</div>
                  <h5 className="font-semibold text-sm text-zinc-800 mb-1.5 font-mono">{step.title}</h5>
                  <p className="text-zinc-500 text-xs leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Contributor Center Section */}
      <section id="contribute" className="py-20 border-t border-zinc-200 bg-zinc-50/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left contribution explanation block */}
            <div className="lg:col-span-5 text-left">
              <span className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-widest pl-1">Open Source Ecosystem</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mt-3 mb-5" id="heading-contribute">
                Build the Future of Code Intelligence
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base font-normal leading-relaxed mb-6">
                reponerve is an entirely community-driven open source utility. We believe repository intelligence tools should be transparent, fully extensible, and free.
              </p>
              
              {/* Clone command help block */}
              <div className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-zinc-200 max-w-md shadow-sm mb-6">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest pl-0.5">Local Compile Command:</span>
                <div className="flex items-center justify-between gap-2 bg-zinc-50 p-2.5 rounded border border-zinc-200">
                  <code className="font-mono text-xs text-zinc-800 truncate">{contributor.cloneCommand}</code>
                  <button
                    onClick={() => handleCopy(contributor.cloneCommand, 'clone-cmd')}
                    className="p-1 rounded bg-white hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 border border-zinc-200 shadow-sm"
                    id="btn-copy-clone"
                  >
                    {copiedText === 'clone-cmd' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <a 
                  href={links.issues} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold bg-zinc-950 hover:bg-zinc-800 text-white transition-all active:scale-95 shadow-sm inline-flex items-center gap-2"
                  id="btn-github-issues"
                >
                  <Github className="w-4 h-4" />
                  <span>Browse GitHub Issues</span>
                </a>
              </div>

            </div>

            {/* Right Active Technical Focus Areas */}
            <div className="lg:col-span-7" id="contribute-issues-sandbox">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm relative">
                
                {/* Header title */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-800" />
                    <span className="font-mono text-xs font-bold text-zinc-700">Active Technical Focus Areas</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-700 font-mono">Open Opportunities</span>
                </div>

                {/* Tasks List */}
                <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
                  {[
                    {
                      title: "AST-aware Parser Performance Optimizations",
                      category: "Go Core",
                      difficulty: "Hard",
                      desc: "Refactor multi-package parser traversal routines in Go to reduce tree matching memory overhead."
                    },
                    {
                      title: "Expand AST Interpreter for Rust & Python files",
                      category: "Go Core",
                      difficulty: "Medium",
                      desc: "Extend codebase scanning layers to parse and map Rust struct/impl blocks and Python decorators."
                    },
                    {
                      title: "Local MCP Client Connection Presets",
                      category: "Integrations",
                      difficulty: "Medium",
                      desc: "Construct native protocol descriptors for seamless, secure integrations with secondary editor clients."
                    },
                    {
                      title: "Incremental indexing using dirty git diff tracking",
                      category: "Go Core",
                      difficulty: "Hard",
                      desc: "Skip unchanged files by querying local git hashes to accelerate incremental index database writes."
                    },
                    {
                      title: "Unified Markdown & JSON-LD Schema Documentation",
                      category: "Documentation",
                      difficulty: "Easy",
                      desc: "Optimize layout and write setup guidelines for setting up RepoNerve in distributed monorepos."
                    }
                  ].map((task, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 shadow-sm transition-all text-left"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                            task.difficulty === 'Hard' ? 'bg-red-50 text-red-700 border border-red-100' :
                            task.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-zinc-50 text-zinc-700 border border-zinc-200'
                          }`}>
                            {task.difficulty}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {task.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-normal leading-relaxed">
                          {task.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Subscription Callout alert alerts */}
      <section className="py-20 border-t border-zinc-200/60 bg-zinc-50/50 relative text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-8 sm:p-12 rounded-3xl border border-zinc-200 bg-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm" id="subscription-alert-block">
            
            {/* Inner background grid overlay accent */}
            <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

            <div className="space-y-2 max-w-md relative z-10">
              <h3 className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">
                Stay in the Loop
              </h3>
              <p className="text-zinc-500 text-xs sm:text-sm font-normal leading-relaxed">
                Get release notes and updates for RepoNerve — new MCP tools, discipline features, and integration guides.
              </p>
            </div>

            <form onSubmit={handleSubscribeDemo} className="w-full max-w-sm flex flex-col sm:flex-row gap-2 relative z-10" id="form-newsletter">
              {subscribedDemo ? (
                <div className="w-full p-3 bg-zinc-900 text-white font-mono text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm">
                  <Check className="w-4 h-4 text-white animate-bounce" />
                  <span>Subscribed — watch GitHub releases for updates</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    required
                    className="flex-1 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-zinc-400 focus:outline-none rounded-xl px-4 py-3 text-xs font-mono text-zinc-800 placeholder-zinc-400 transition-all"
                    id="input-newsletter-email"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-xs font-bold transition-all active:scale-95 flex-shrink-0 border border-zinc-800"
                    id="btn-newsletter-submit"
                  >
                    Subscribe
                  </button>
                </>
              )}
            </form>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center">
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-5 h-5 opacity-80">
              <circle cx="100" cy="100" r="40" fill="none" stroke="#18181b" strokeWidth="15" />
              <circle cx="100" cy="100" r="15" fill="#27272a" />
            </svg>
            <span className="font-mono text-sm tracking-widest font-bold text-zinc-800">reponerve</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-mono">
            <a href={links.github} target="_blank" rel="noreferrer" className="hover:text-zinc-900 transition-colors" id="footer-link-github">GitHub</a>
            <a href={links.license} target="_blank" rel="noreferrer" className="hover:text-zinc-900 transition-colors" id="footer-link-license">Apache-2.0 License</a>
            <a href={links.docs} target="_blank" rel="noreferrer" className="hover:text-zinc-900 transition-colors" id="footer-link-docs">Documentation</a>
            <a href={links.issues} target="_blank" rel="noreferrer" className="hover:text-zinc-900 transition-colors" id="footer-link-issues">Report Issue</a>
          </div>

          <div className="font-mono text-[11px] text-zinc-400">
            <span>© 2026 reponerve. Open Source project.</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
