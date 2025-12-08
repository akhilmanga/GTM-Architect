import React, { useState } from 'react';
import { Domain, FormData, Web3Inputs, Web2Inputs } from '../types';
import { ArrowLeft, Sparkles, ChevronRight } from 'lucide-react';

interface IntakeFormProps {
  domain: Domain;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ domain, onBack, onSubmit }) => {
  // Web3 State
  const [w3Name, setW3Name] = useState('');
  const [w3Desc, setW3Desc] = useState('');
  const [w3Chain, setW3Chain] = useState('');
  const [w3User, setW3User] = useState('');
  const [w3Tokens, setW3Tokens] = useState<string[]>([]);
  const [w3Deck, setW3Deck] = useState('');
  const [w3Competitors, setW3Competitors] = useState('');

  // Web2 State
  const [w2Name, setW2Name] = useState('');
  const [w2Desc, setW2Desc] = useState('');
  const [w2Pricing, setW2Pricing] = useState<string[]>([]);
  const [w2Customer, setW2Customer] = useState('');
  const [w2Edge, setW2Edge] = useState('');
  const [w2Deck, setW2Deck] = useState('');
  const [w2Competitors, setW2Competitors] = useState('');

  const toggleSelection = (list: string[], item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain === Domain.WEB3) {
      onSubmit({
        projectName: w3Name,
        description: w3Desc,
        targetChains: w3Chain,
        firstUser: w3User,
        tokenStrategy: w3Tokens,
        pitchDeck: w3Deck,
        competitors: w3Competitors,
      } as Web3Inputs);
    } else {
      onSubmit({
        projectName: w2Name,
        description: w2Desc,
        pricingModel: w2Pricing,
        firstCustomer: w2Customer,
        techEdge: w2Edge,
        pitchDeck: w2Deck,
        competitors: w2Competitors,
      } as Web2Inputs);
    }
  };

  const isWeb3 = domain === Domain.WEB3;
  const accentColor = isWeb3 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
  const ringColor = isWeb3 ? 'focus:ring-emerald-500/50' : 'focus:ring-indigo-500/50';
  const buttonGradient = isWeb3 ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500';

  const deckPlaceholder = "One Line: ...\nProblem: ...\nSolution: ...\nMarket: ...\nTraction: ...\nGoal: ...";

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center relative overflow-hidden">
      {/* Ambient BG */}
      <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 -z-10 ${isWeb3 ? 'bg-emerald-600' : 'bg-indigo-600'}`} />
      
      <div className="w-full max-w-5xl z-10 animate-enter-up">
        <button onClick={onBack} className="group flex items-center text-slate-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Selection
        </button>

        <div className="mb-8 p-6 glass-card rounded-2xl border-l-4 border-l-slate-700">
            <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-bold tracking-widest uppercase border rounded px-2 py-0.5 ${accentColor}`}>
                    {domain} Protocol
                </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-100">Initialize Project</h2>
            <p className="text-slate-400 mt-1">Configure your parameters for the GTM engine.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-8 rounded-3xl space-y-8 animate-enter-up animate-delay-100">
          {isWeb3 ? (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-emerald-400 transition-colors">Project Name</label>
                    <input required value={w3Name} onChange={e => setW3Name(e.target.value)} className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all placeholder:text-slate-700`} placeholder="e.g. EtherVault" />
                  </div>
                  <div className="space-y-2 group">
                     <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-emerald-400 transition-colors">Target Chain</label>
                     <input required value={w3Chain} onChange={e => setW3Chain(e.target.value)} className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all placeholder:text-slate-700`} placeholder="e.g. Arbitrum, Solana" />
                  </div>
              </div>
              
              <div className="space-y-2 group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-emerald-400 transition-colors">One-sentence description</label>
                <input required value={w3Desc} onChange={e => setW3Desc(e.target.value)} className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all placeholder:text-slate-700`} placeholder="Decentralized yield aggregator for..." />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-emerald-400 transition-colors">First Stakeholder/User</label>
                    <input required value={w3User} onChange={e => setW3User(e.target.value)} className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all placeholder:text-slate-700`} placeholder="e.g. EigenLayer restakers, NFT collectors" />
                  </div>

                  <div className="space-y-2 group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-emerald-400 transition-colors">Top Competitors</label>
                    <input value={w3Competitors} onChange={e => setW3Competitors(e.target.value)} className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all placeholder:text-slate-700`} placeholder="e.g. Uniswap, Aave, or 'None'" />
                  </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Token Strategy</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Token has clear utility', 'TGE planned within 12 months', 'Airdrop/Quest planned'].map((opt) => (
                    <div 
                        key={opt}
                        onClick={() => toggleSelection(w3Tokens, opt, setW3Tokens)}
                        className={`cursor-pointer p-4 rounded-xl border flex items-center transition-all duration-300 ${w3Tokens.includes(opt) ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                    >
                        <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors flex-shrink-0 ${w3Tokens.includes(opt) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                            {w3Tokens.includes(opt) && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        <span className="text-sm font-medium">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-emerald-400 transition-colors">Pitch Deck Key Points</label>
                <textarea 
                    value={w3Deck} 
                    onChange={e => setW3Deck(e.target.value)} 
                    className={`w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all text-sm font-mono leading-relaxed placeholder:text-slate-700`} 
                    placeholder={deckPlaceholder}
                />
              </div>
            </>
          ) : (
            <>
              {/* Web2 Inputs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-indigo-400 transition-colors">Project Name</label>
                    <input required value={w2Name} onChange={e => setW2Name(e.target.value)} className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all placeholder:text-slate-700`} placeholder="e.g. NexusAI" />
                </div>
                <div className="space-y-2 group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-indigo-400 transition-colors">Tech Edge</label>
                    <input required value={w2Edge} onChange={e => setW2Edge(e.target.value)} className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all placeholder:text-slate-700`} placeholder="e.g. Proprietary model" />
                </div>
              </div>
              
              <div className="space-y-2 group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-indigo-400 transition-colors">One-sentence description</label>
                <input required value={w2Desc} onChange={e => setW2Desc(e.target.value)} className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all placeholder:text-slate-700`} placeholder="AI-powered analytics for..." />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-indigo-400 transition-colors">First Customer Profile</label>
                    <input required value={w2Customer} onChange={e => setW2Customer(e.target.value)} className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all placeholder:text-slate-700`} placeholder="e.g. Head of DevOps, Indie hackers" />
                </div>

                <div className="space-y-2 group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-indigo-400 transition-colors">Top Competitors</label>
                    <input value={w2Competitors} onChange={e => setW2Competitors(e.target.value)} className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all placeholder:text-slate-700`} placeholder="e.g. Databricks, Vercel" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Pricing Model</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Free tier + paid upgrade', 'Usage-based (e.g., per API call)', 'Enterprise contracts'].map((opt) => (
                    <div 
                        key={opt}
                        onClick={() => toggleSelection(w2Pricing, opt, setW2Pricing)}
                        className={`cursor-pointer p-4 rounded-xl border flex items-center transition-all duration-300 ${w2Pricing.includes(opt) ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                    >
                        <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors flex-shrink-0 ${w2Pricing.includes(opt) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                            {w2Pricing.includes(opt) && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        <span className="text-sm font-medium">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-indigo-400 transition-colors">Pitch Deck Key Points</label>
                <textarea 
                    value={w2Deck} 
                    onChange={e => setW2Deck(e.target.value)} 
                    className={`w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:ring-2 ${ringColor} focus:border-transparent outline-none transition-all text-sm font-mono leading-relaxed placeholder:text-slate-700`} 
                    placeholder={deckPlaceholder}
                />
              </div>
            </>
          )}
          </div>

          <div className="pt-2 animate-enter-up animate-delay-200">
            <button 
                type="submit"
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${buttonGradient}`}
            >
                <Sparkles className="w-5 h-5 animate-pulse" /> 
                Generate GTM Playbook
                <ChevronRight className="w-5 h-5 opacity-50" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntakeForm;