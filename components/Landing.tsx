import React from 'react';
import { Domain } from '../types';
import { Blocks, BrainCircuit, ArrowRight } from 'lucide-react';

interface LandingProps {
  onSelect: (domain: Domain) => void;
}

const Landing: React.FC<LandingProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-4xl w-full text-center z-10 space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-500">
            GTM Architect
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Generate an execution-ready Go-To-Market playbook in minutes.
            Tailored for your domain.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
          <button
            onClick={() => onSelect(Domain.WEB3)}
            className="group relative flex flex-col items-center justify-center p-12 h-80 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]"
          >
            <div className="p-4 rounded-full bg-slate-800 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Blocks className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Web3 / Blockchain</h2>
            <p className="text-sm text-slate-500 text-center px-4">
              DeFi, wallets, L1/L2s, infra, NFTs, token projects
            </p>
            <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-emerald-400 flex items-center gap-2 text-sm font-medium">
              Start Building <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onSelect(Domain.WEB2)}
            className="group relative flex flex-col items-center justify-center p-12 h-80 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]"
          >
            <div className="p-4 rounded-full bg-slate-800 mb-6 group-hover:scale-110 transition-transform duration-300">
              <BrainCircuit className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Web2 / AI</h2>
            <p className="text-sm text-slate-500 text-center px-4">
              SaaS, AI agents, dev tools, B2B software
            </p>
            <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-indigo-400 flex items-center gap-2 text-sm font-medium">
              Start Building <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;