import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Loader, PenTool } from 'lucide-react';
import { generatePostDrafts } from '../services/geminiService';
import { FormData, ContentDraft } from '../types';

interface ContentDrafterProps {
  actionTitle: string;
  platform: string;
  data: FormData;
  onClose: () => void;
}

const ContentDrafter: React.FC<ContentDrafterProps> = ({ actionTitle, platform, data, onClose }) => {
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const results = await generatePostDrafts(actionTitle, platform, data);
        setDrafts(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, [actionTitle, platform, data]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/10 rounded-full">
              <PenTool className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Content Drafter</h3>
              <p className="text-xs text-slate-400 truncate max-w-sm">Drafting for: {platform}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader className="w-8 h-8 animate-spin text-pink-500" />
              <p className="text-slate-400 animate-pulse">Cooking up some viral hooks...</p>
            </div>
          ) : (
            <>
              <div className="text-sm text-slate-500 mb-4 p-3 bg-slate-950 rounded border border-slate-800">
                <span className="font-bold uppercase text-xs mr-2 text-slate-400">Context:</span>
                "{actionTitle}"
              </div>
              
              <div className="grid gap-6">
                {drafts.map((draft, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group hover:border-slate-700 transition-all">
                    <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-pink-400">{draft.style}</span>
                      <button 
                        onClick={() => handleCopy(draft.content, idx)}
                        className="text-slate-500 hover:text-white transition-colors"
                      >
                        {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="p-4 text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {draft.content}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDrafter;