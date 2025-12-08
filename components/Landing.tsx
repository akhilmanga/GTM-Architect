import React from 'react';
import { Domain } from '../types';
import { Blocks, BrainCircuit, ArrowRight, Zap } from 'lucide-react';

interface LandingProps {
  onSelect: (domain: Domain) => void;
}

const Landing: React.FC<LandingProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-grid z-0 opacity-50 pointer-events-none" />
      
      {/* Animated Orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-pulse-slow animation-delay-2000" />
      
      {/* Scanline Overlay */}
      <div className="scanline pointer-events-none" />

      <div className="max-w-7xl w-full z-10 space-y-16">
        
        {/* Hero Text */}
        <div className="space-y-6 text-center animate-enter-up">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
            GTM <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 animate-shimmer bg-[length:200%_100%]">Architect</span>
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Generate an execution-ready Go-To-Market playbook in seconds.
            Tailored specifically for your domain.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          
          {/* Web3 Card */}
          <button
            onClick={() => onSelect(Domain.WEB3)}
            className="group relative flex flex-col items-center justify-center p-12 h-96 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] hover:-translate-y-2 animate-enter-up animate-delay-200 overflow-hidden"
          >
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl group-hover:border-emerald-500/30">
                <Blocks className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-100 mb-3 tracking-tight">Web3 / Blockchain</h2>
              <p className="text-sm text-slate-500 text-center px-4 max-w-xs leading-relaxed group-hover:text-slate-400 transition-colors">
                DeFi, wallets, L1/L2s, infra, NFTs, token projects
              </p>
            </div>

            <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-emerald-400 flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
              Generate GTM <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Web2 Card */}
          <button
            onClick={() => onSelect(Domain.WEB2)}
            className="group relative flex flex-col items-center justify-center p-12 h-96 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] hover:-translate-y-2 animate-enter-up animate-delay-300 overflow-hidden"
          >
             {/* Hover Gradient Background */}
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-xl group-hover:border-indigo-500/30">
                <BrainCircuit className="w-12 h-12 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-100 mb-3 tracking-tight">Web2 / AI</h2>
              <p className="text-sm text-slate-500 text-center px-4 max-w-xs leading-relaxed group-hover:text-slate-400 transition-colors">
                SaaS, AI agents, dev tools, B2B software, marketplaces
              </p>
            </div>
            
            <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-indigo-400 flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
              Generate GTM <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        <div className="flex justify-center animate-enter-up animate-delay-500">
           <div className="flex items-center gap-6 text-slate-600 text-sm">
              <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Instant Strategy</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span>4-Quarter Roadmap</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span>Competitor Intel</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;