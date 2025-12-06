import React, { useState } from 'react';
import { Domain, FormData, Web3Inputs, Web2Inputs } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';

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
  const accentColor = isWeb3 ? 'text-emerald-400 border-emerald-500/50' : 'text-indigo-400 border-indigo-500/50';
  const buttonColor = isWeb3 ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500';

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-300 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Selection
        </button>

        <div className="mb-8">
            <span className={`text-xs font-bold tracking-wider uppercase border rounded-full px-3 py-1 ${accentColor} bg-slate-900`}>
                {domain} Intake
            </span>
            <h2 className="text-3xl font-bold text-slate-100 mt-4">Tell us about your project</h2>
            <p className="text-slate-400 mt-2">We'll use this to architect your custom GTM strategy.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {isWeb3 ? (
            <>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Project Name</label>
                <input required value={w3Name} onChange={e => setW3Name(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="e.g. EtherVault" />
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">One-sentence description</label>
                <input required value={w3Desc} onChange={e => setW3Desc(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="Decentralized yield aggregator for..." />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Target Chain(s) or Network</label>
                <input required value={w3Chain} onChange={e => setW3Chain(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="e.g. Ethereum, Solana, Arbitrum" />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Who’s your first real user or stakeholder?</label>
                <input required value={w3User} onChange={e => setW3User(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="e.g. EigenLayer restakers, NFT collectors" />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Token Strategy?</label>
                <div className="grid grid-cols-1 gap-3">
                  {['Token has clear utility', 'TGE planned within 12 months', 'Airdrop or on-chain quest in the works?'].map((opt) => (
                    <div 
                        key={opt}
                        onClick={() => toggleSelection(w3Tokens, opt, setW3Tokens)}
                        className={`cursor-pointer p-3 rounded-lg border flex items-center transition-all ${w3Tokens.includes(opt) ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                        <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${w3Tokens.includes(opt) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                            {w3Tokens.includes(opt) && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Top Competitors</label>
                <input value={w3Competitors} onChange={e => setW3Competitors(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="e.g. Uniswap, Aave, or 'None'" />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Pitch Deck Key Points</label>
                <textarea 
                    value={w3Deck} 
                    onChange={e => setW3Deck(e.target.value)} 
                    className="w-full h-40 bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-sm font-mono leading-relaxed" 
                    placeholder="[Project Name]&#10;[One-sentence mission]&#10;&#10;Problem: ...&#10;Solution: ...&#10;Market: ...&#10;Traction: ...&#10;Ask/Goal: ..." 
                />
              </div>
            </>
          ) : (
            <>
              {/* Web2 Inputs */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Project Name</label>
                <input required value={w2Name} onChange={e => setW2Name(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" placeholder="e.g. NexusAI" />
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">One-sentence description</label>
                <input required value={w2Desc} onChange={e => setW2Desc(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" placeholder="AI-powered analytics for..." />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Pricing Model</label>
                <div className="grid grid-cols-1 gap-3">
                  {['Free tier + paid upgrade', 'Usage-based (e.g., per API call)', 'Enterprise contracts'].map((opt) => (
                    <div 
                        key={opt}
                        onClick={() => toggleSelection(w2Pricing, opt, setW2Pricing)}
                        className={`cursor-pointer p-3 rounded-lg border flex items-center transition-all ${w2Pricing.includes(opt) ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                        <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${w2Pricing.includes(opt) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                            {w2Pricing.includes(opt) && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Who’s your first real customer?</label>
                <input required value={w2Customer} onChange={e => setW2Customer(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" placeholder="e.g. Head of DevOps, Indie hackers" />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">What’s your technical or data edge?</label>
                <input required value={w2Edge} onChange={e => setW2Edge(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" placeholder="e.g. Fine-tuned open-weight model" />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Top Competitors</label>
                <input value={w2Competitors} onChange={e => setW2Competitors(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" placeholder="e.g. Databricks, Vercel" />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Pitch Deck Key Points</label>
                <textarea 
                    value={w2Deck} 
                    onChange={e => setW2Deck(e.target.value)} 
                    className="w-full h-40 bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-mono leading-relaxed" 
                    placeholder="[Project Name]&#10;[One-sentence mission]&#10;&#10;Problem: ...&#10;Solution: ...&#10;Market: ...&#10;Traction: ...&#10;Ask/Goal: ..." 
                />
              </div>
            </>
          )}

          <div className="pt-6">
            <button 
                type="submit"
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] ${buttonColor}`}
            >
                <Sparkles className="w-5 h-5" /> Generate GTM Playbook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntakeForm;