import React from 'react';
import { Loader2, Cpu, Network, Search } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      {/* Center Console */}
      <div className="relative z-10 glass-card p-12 rounded-3xl border-t border-indigo-500/20 max-w-md w-full flex flex-col items-center">
        
        {/* Animated Icon Ring */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
            <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-4 border-2 border-slate-700 rounded-full border-b-transparent animate-spin-slow" />
            
            <div className="absolute inset-0 flex items-center justify-center">
                 <Cpu className="w-10 h-10 text-white animate-pulse" />
            </div>
        </div>
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-6 animate-pulse">
          Architecting Strategy
        </h2>
        
        {/* Steps Animation */}
        <div className="w-full space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-slate-400 animate-enter-up">
                <Search className="w-4 h-4 text-emerald-500" />
                <span>Analyzing Market Signals...</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400 animate-enter-up animate-delay-200">
                <Network className="w-4 h-4 text-indigo-500" />
                <span>Mapping Competitor Nodes...</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400 animate-enter-up animate-delay-400">
                <Loader2 className="w-4 h-4 text-pink-500 animate-spin" />
                <span>Synthesizing Quarterly Roadmap...</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;