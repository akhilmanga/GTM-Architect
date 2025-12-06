import React, { useState } from 'react';
import { GTMPlan, Domain, FormData, WarRoomResult } from '../types';
import { Download, RefreshCw, ArrowLeft, Target, Users, Zap, MessageSquare, PlayCircle, Swords, AlertTriangle, ShieldCheck, PenTool, Flame, Radio, ExternalLink, Loader } from 'lucide-react';
import { downloadMarkdown } from '../utils/exportUtils';
import { regenerateQuarter, getCompetitorIntel } from '../services/geminiService';
import PersonaSimulator from './PersonaSimulator';
import ContentDrafter from './ContentDrafter';
import LandingPageRoaster from './LandingPageRoaster';

interface DashboardProps {
  initialPlan: GTMPlan;
  domainData: FormData;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ initialPlan, domainData, onReset }) => {
  const [plan, setPlan] = useState<GTMPlan>(initialPlan);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [showPersonaChat, setShowPersonaChat] = useState(false);
  const [showRoaster, setShowRoaster] = useState(false);
  const [draftingConfig, setDraftingConfig] = useState<{action: string, platform: string} | null>(null);
  
  // War Room State
  const [intelLoading, setIntelLoading] = useState<Record<string, boolean>>({});
  const [intelResults, setIntelResults] = useState<Record<string, WarRoomResult>>({});

  const isWeb3 = plan.domain === 'Web3' || plan.domain.includes('Web3');
  const accentText = isWeb3 ? 'text-emerald-400' : 'text-indigo-400';
  const accentBg = isWeb3 ? 'bg-emerald-500/10' : 'bg-indigo-500/10';
  const accentBorder = isWeb3 ? 'border-emerald-500/20' : 'border-indigo-500/20';
  const buttonHover = isWeb3 ? 'hover:bg-emerald-500/10' : 'hover:bg-indigo-500/10';

  const handleRegenerateQuarter = async (index: number) => {
    setRegeneratingIndex(index);
    try {
      const domainEnum = isWeb3 ? Domain.WEB3 : Domain.WEB2;
      const newQuarter = await regenerateQuarter(domainEnum, domainData, plan, index);
      const newRoadmap = [...plan.roadmap];
      newRoadmap[index] = newQuarter;
      setPlan({ ...plan, roadmap: newRoadmap });
    } catch (e) {
      console.error(e);
      alert("Failed to regenerate. Please check your API key.");
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleFetchIntel = async (competitorName: string) => {
    if (intelLoading[competitorName] || intelResults[competitorName]) return;

    setIntelLoading(prev => ({ ...prev, [competitorName]: true }));
    try {
        const result = await getCompetitorIntel(competitorName, domainData);
        setIntelResults(prev => ({ ...prev, [competitorName]: result }));
    } catch (e) {
        console.error(e);
    } finally {
        setIntelLoading(prev => ({ ...prev, [competitorName]: false }));
    }
  };

  const handleTextEdit = (section: keyof GTMPlan, value: string) => {
    // @ts-ignore
    setPlan({ ...plan, [section]: value });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {showPersonaChat && (
        <PersonaSimulator 
            plan={plan} 
            data={domainData} 
            onClose={() => setShowPersonaChat(false)} 
        />
      )}

      {showRoaster && (
        <LandingPageRoaster
            plan={plan}
            onClose={() => setShowRoaster(false)}
        />
      )}

      {draftingConfig && (
        <ContentDrafter
            actionTitle={draftingConfig.action}
            platform={draftingConfig.platform}
            data={domainData}
            onClose={() => setDraftingConfig(null)}
        />
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-slate-800 no-print">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={onReset} className="text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold text-slate-100 hidden sm:block">GTM Playbook</h1>
            </div>
            <div className="flex gap-2">
                <button onClick={() => downloadMarkdown(plan)} className={`p-2 rounded-lg ${buttonHover} text-slate-300 transition-colors flex items-center gap-2 text-sm`}>
                    <Download className="w-4 h-4" /> <span className="hidden sm:inline">Markdown</span>
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        
        {/* Executive Snapshot */}
        <section className={`p-6 rounded-2xl border ${accentBorder} ${accentBg} print-break-inside`}>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Target className={`w-4 h-4 ${accentText}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${accentText} opacity-80`}>
                        Executive Snapshot
                    </span>
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xs text-slate-400 uppercase tracking-wide mb-2">Minimum Viable Customer Category (MVCC)</h3>
                    <div 
                        contentEditable 
                        suppressContentEditableWarning
                        onBlur={(e) => handleTextEdit('mvcc', e.currentTarget.innerText)}
                        className="text-xl font-bold text-white outline-none border-b border-transparent focus:border-slate-700 leading-relaxed"
                    >
                        {plan.mvcc}
                    </div>
                </div>
                <div>
                    <h3 className="text-xs text-slate-400 uppercase tracking-wide mb-2">Primary GTM Motion</h3>
                    <div 
                        contentEditable 
                        suppressContentEditableWarning
                        onBlur={(e) => handleTextEdit('primaryMotion', e.currentTarget.innerText)}
                        className={`text-xl font-bold outline-none border-b border-transparent focus:border-slate-700 ${accentText}`}
                    >
                        {plan.primaryMotion}
                    </div>
                </div>
            </div>
        </section>

        {/* GTM Toolkit Section */}
        <section className="grid md:grid-cols-2 gap-4 print:hidden">
            <button 
                onClick={() => setShowRoaster(true)}
                className="group p-5 bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-xl text-left transition-all hover:bg-slate-900/80 flex flex-col gap-2 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <Flame className="w-24 h-24 text-orange-500" />
                </div>
                <div className="flex items-center gap-2 text-orange-500 font-bold uppercase text-xs tracking-wider z-10">
                    <Flame className="w-4 h-4" /> Vision Analysis
                </div>
                <h3 className="text-xl font-bold text-slate-100 z-10">Landing Page Roaster</h3>
                <p className="text-sm text-slate-400 z-10 max-w-[90%]">
                    Upload your site screenshot. AI critiques UX, copy, and trust signals specifically for {plan.mvcc}.
                </p>
            </button>

            <button 
                onClick={() => setShowPersonaChat(true)}
                className={`group p-5 bg-slate-900 border border-slate-800 hover:border-${isWeb3 ? 'emerald' : 'indigo'}-500/50 rounded-xl text-left transition-all hover:bg-slate-900/80 flex flex-col gap-2 relative overflow-hidden`}
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <PlayCircle className={`w-24 h-24 ${accentText}`} />
                </div>
                <div className={`flex items-center gap-2 font-bold uppercase text-xs tracking-wider ${accentText} z-10`}>
                    <MessageSquare className="w-4 h-4" /> Roleplay Simulation
                </div>
                <h3 className="text-xl font-bold text-slate-100 z-10">Pitch The Persona</h3>
                <p className="text-sm text-slate-400 z-10 max-w-[90%]">
                    Test your pitch live against a skeptical AI simulating your target user. Get a resonance score.
                </p>
            </button>
        </section>

        {/* Competitor Battle Cards (War Room Enhanced) */}
        {plan.competitorAnalysis && plan.competitorAnalysis.length > 0 && (
          <section className="space-y-6 print-break-inside">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-red-500">///</span> Competitor War Room
                </h2>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                        Live Search Active
                    </span>
                </div>
             </div>
             
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.competitorAnalysis.map((comp, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-slate-700 transition-colors flex flex-col h-full">
                  <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Swords className="w-4 h-4 text-red-400" />
                        <span className="font-bold text-slate-200">{comp.competitorName}</span>
                    </div>
                    
                    {/* Live Intel Button */}
                    <button 
                        onClick={() => handleFetchIntel(comp.competitorName)}
                        disabled={intelLoading[comp.competitorName] || !!intelResults[comp.competitorName]}
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded flex items-center gap-1 transition-all ${
                            intelResults[comp.competitorName] 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700'
                        }`}
                    >
                        {intelLoading[comp.competitorName] ? (
                            <>
                                <Loader className="w-3 h-3 animate-spin" /> Scanning...
                            </>
                        ) : intelResults[comp.competitorName] ? (
                            <>
                                <Radio className="w-3 h-3 animate-pulse" /> Live
                            </>
                        ) : (
                            <>
                                <Zap className="w-3 h-3" /> Get Live Intel
                            </>
                        )}
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-4 flex-1">
                    {/* Static Analysis */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase mb-1">
                        <AlertTriangle className="w-3 h-3" /> Their Weakness
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{comp.weakness}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-800/50">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase mb-1">
                        <ShieldCheck className="w-3 h-3" /> Your Wedge
                      </div>
                      <p className="text-sm text-slate-300 font-medium leading-relaxed">{comp.ourWedge}</p>
                    </div>
                  </div>

                  {/* Dynamic War Room Intel */}
                  {intelResults[comp.competitorName] && (
                    <div className="bg-red-500/5 border-t border-red-500/20 p-4 animate-in slide-in-from-bottom duration-500">
                        <div className="mb-3">
                            <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Radio className="w-3 h-3 animate-pulse" /> Latest Signal
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed font-mono">
                                "{intelResults[comp.competitorName].signal}"
                            </p>
                        </div>
                        
                        <div className="mb-3">
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-2">
                                Counter-Move
                            </h4>
                            <p className="text-xs text-white leading-relaxed font-bold">
                                {intelResults[comp.competitorName].action}
                            </p>
                        </div>

                        {/* Citations */}
                        {intelResults[comp.competitorName].sources.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-red-500/10">
                                {intelResults[comp.competitorName].sources.map((source, sIdx) => (
                                    <a 
                                        key={sIdx} 
                                        href={source.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white px-2 py-1 rounded-full border border-slate-800 transition-colors"
                                    >
                                        <ExternalLink className="w-2.5 h-2.5" />
                                        <span className="truncate max-w-[100px]">{source.title}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Roadmap */}
        <section className="space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className={accentText}>///</span> Quarterly Roadmap
            </h2>
            
            <div className="space-y-10">
                {plan.roadmap.map((q, qIndex) => (
                    <div key={qIndex} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden print-break-inside relative group">
                        
                        {/* Quarter Header */}
                        <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-3xl font-bold text-white tracking-tight">{q.quarterName}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${accentBorder} ${accentText} bg-slate-950`}>
                                        {q.focus}
                                    </span>
                                </div>
                                <div className="text-slate-400 text-sm flex items-center gap-2">
                                    <Target className="w-3 h-3" /> Goal: {q.successMetric.target} {q.successMetric.name}
                                </div>
                            </div>
                            <button 
                                onClick={() => handleRegenerateQuarter(qIndex)}
                                disabled={regeneratingIndex === qIndex}
                                className="text-xs text-slate-500 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all no-print"
                            >
                                <RefreshCw className={`w-3 h-3 ${regeneratingIndex === qIndex ? 'animate-spin' : ''}`} /> 
                                {regeneratingIndex === qIndex ? 'Regenerating...' : 'Regenerate Quarter'}
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-8">
                            {/* Actions List */}
                            <div className="space-y-6">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Core Actions</h4>
                                {q.actions.map((action, aIndex) => (
                                    <div key={aIndex} className="relative pl-6 border-l-2 border-slate-800 hover:border-slate-700 transition-colors">
                                        <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 ${isWeb3 ? 'border-emerald-500' : 'border-indigo-500'}`} />
                                        
                                        <div className="mb-3 flex justify-between items-start gap-4">
                                            <div>
                                                <div className="text-lg font-medium text-slate-200 mb-1">
                                                    {action.title}
                                                </div>
                                                <div className="text-xs text-slate-500 font-mono bg-slate-950 inline-block px-2 py-1 rounded border border-slate-800">
                                                    Resources: {action.resources}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setDraftingConfig({action: action.title, platform: action.channels[0].name})}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20 transition-all text-xs font-medium whitespace-nowrap"
                                            >
                                                <PenTool className="w-3 h-3" /> Draft This
                                            </button>
                                        </div>

                                        {/* Channels & Sample Posts */}
                                        <div className="mt-3 bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
                                            {action.channels.map((ch, cIndex) => (
                                                <div key={cIndex} className="text-sm">
                                                    <div className="flex items-start gap-2">
                                                        <span className={`text-xs font-bold uppercase mt-0.5 ${accentText}`}>{ch.name}</span>
                                                        <p className="text-slate-400 italic">"{ch.samplePost}"</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tactical Partners */}
                            {q.partners.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Users className="w-3 h-3" /> Tactical Partnerships
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {q.partners.map((p, pIndex) => (
                                            <div key={pIndex} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                <div className="font-bold text-slate-200 mb-2">{p.name}</div>
                                                <div className="text-xs text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 font-mono">
                                                    Outreach: "{p.outreach}"
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Strategic Partnerships (Global) */}
        <section className="space-y-6 print-break-inside">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className={accentText}>///</span> Strategic Partnership Playbook
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
                {plan.strategicPartnerships.map((p, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className={`w-4 h-4 ${accentText}`} />
                            <div className="font-bold text-slate-200">{p.target}</div>
                        </div>
                        <div className="text-sm text-slate-400 leading-relaxed">{p.leverage}</div>
                    </div>
                ))}
            </div>
        </section>

         {/* Content Plan */}
         <section className="space-y-6 print-break-inside">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className={accentText}>///</span> Content Pillars & Hooks
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {plan.contentPlan.map((c, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-3 bg-slate-950 border-b border-slate-800 font-bold text-slate-200 flex items-center gap-2">
                           <MessageSquare className="w-4 h-4 text-slate-500" /> {c.platform}
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Pillars</span>
                                <div className="flex flex-wrap gap-2">
                                    {c.pillars.map((pillar, idx) => (
                                        <span key={idx} className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300 border border-slate-700">
                                            {pillar}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Engagement Hooks</span>
                                <ul className="space-y-1">
                                    {c.hooks.map((hook, idx) => (
                                        <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                                            <span className={accentText}>•</span> {hook}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;