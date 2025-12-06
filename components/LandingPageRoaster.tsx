import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Flame, AlertTriangle, CheckCircle, Loader, Link, Trash2, Plus } from 'lucide-react';
import { GTMPlan, RoastResult } from '../types';
import { roastLandingPage } from '../services/geminiService';

interface LandingPageRoasterProps {
  plan: GTMPlan;
  onClose: () => void;
}

const LandingPageRoaster: React.FC<LandingPageRoasterProps> = ({ plan, onClose }) => {
  const [images, setImages] = useState<string[]>([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        setImages(prev => [...prev, base64Data].slice(0, 5)); // Limit to 5
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []},
    maxFiles: 5,
    disabled: images.length >= 5
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRoast = async () => {
    if (images.length === 0) {
        setError("Please upload at least one screenshot.");
        return;
    }
    setLoading(true);
    setError('');
    try {
      const roast = await roastLandingPage(images, url, plan);
      setResult(roast);
    } catch (e) {
        console.error(e);
      setError("Failed to analyze. Ensure images are valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Landing Page Roaster</h3>
              <p className="text-xs text-slate-400">Multi-shot visual critique (Max 5 screens)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel: Inputs & Previews */}
            <div className="w-full md:w-5/12 p-6 bg-slate-900 border-r border-slate-800 flex flex-col gap-6 overflow-y-auto">
                
                {/* URL Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Link className="w-3 h-3" /> Website URL (Optional Context)
                    </label>
                    <input 
                        type="url" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://yourproject.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    />
                </div>

                {/* Dropzone */}
                <div className="space-y-2 flex-1 flex flex-col">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        Screenshots ({images.length}/5)
                    </label>
                    
                    {images.length < 5 && (
                        <div 
                            {...getRootProps()} 
                            className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                                isDragActive ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="w-8 h-8 text-slate-500 mb-2" />
                            <p className="text-sm text-slate-300 font-medium text-center">
                                Drop screenshots here<br/>
                                <span className="text-xs text-slate-500 font-normal">(Hero, Features, Pricing, etc.)</span>
                            </p>
                        </div>
                    )}

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative group aspect-video bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                                <img 
                                    src={`data:image/png;base64,${img}`} 
                                    alt={`Screenshot ${idx + 1}`} 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <button 
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] font-mono text-white">
                                    #{idx + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleRoast}
                    disabled={loading || images.length === 0}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20"
                >
                    {loading ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" /> Analyzing {images.length} Screenshots...
                        </>
                    ) : (
                        <>
                            <Flame className="w-5 h-5" /> Roast My Page
                        </>
                    )}
                </button>
            </div>

            {/* Right Panel: The Roast */}
            <div className="w-full md:w-7/12 p-6 overflow-y-auto bg-slate-950/50">
                {!result && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <Flame className="w-16 h-16 text-slate-700 mb-4" />
                        <h3 className="text-xl font-bold text-slate-500 mb-2">Ready to Roast</h3>
                        <p className="text-slate-600 max-w-xs">
                            Upload screenshots of your different page sections for a full UX critique.
                        </p>
                    </div>
                )}

                {result && (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
                        {/* Score */}
                        <div className="flex items-center gap-6 p-6 bg-slate-900 rounded-2xl border border-slate-800">
                            <div className={`text-6xl font-black tracking-tighter ${result.score > 70 ? 'text-emerald-500' : result.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {result.score}
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Conversion Score</div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                    {result.score > 70 ? "Ready for Traffic 🚀" : result.score > 40 ? "Leaky Bucket 🕳️" : "Total Rewrite Needed 🚧"}
                                </h3>
                                <p className="text-sm text-slate-400">
                                    Based on visual hierarchy, copy, and trust signals for <span className="text-slate-300 font-medium">{plan.mvcc}</span>.
                                </p>
                            </div>
                        </div>

                        {/* Brutal Truth */}
                        <div className="relative">
                             <div className="absolute -left-3 top-4 w-1 h-12 bg-orange-500 rounded-full"></div>
                             <div className="pl-6">
                                <h4 className="text-sm text-orange-500 uppercase font-bold mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> The Brutal Truth
                                </h4>
                                <p className="text-xl text-slate-200 font-medium leading-relaxed">
                                    "{result.brutalTruth}"
                                </p>
                             </div>
                        </div>

                        {/* Fixes */}
                        <div className="space-y-4">
                             <h4 className="text-xs text-slate-500 uppercase font-bold tracking-wider">Priority Fixes</h4>
                             {result.fixes.map((fix, idx) => (
                                 <div key={idx} className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group">
                                     <div className="flex items-center justify-between mb-3">
                                         <span className="text-xs font-bold px-2 py-1 bg-slate-950 rounded text-slate-400 border border-slate-800 group-hover:border-slate-600 transition-colors">
                                            {fix.area}
                                         </span>
                                         <span className="text-[10px] text-slate-600 font-mono">#{idx + 1}</span>
                                     </div>
                                     <div className="grid md:grid-cols-2 gap-6">
                                         <div className="space-y-1">
                                             <div className="text-xs font-bold text-red-500/80 uppercase flex items-center gap-1">
                                                <X className="w-3 h-3" /> Problem
                                             </div>
                                             <p className="text-sm text-slate-400 leading-relaxed">{fix.problem}</p>
                                         </div>
                                         <div className="space-y-1">
                                             <div className="text-xs font-bold text-emerald-500/80 uppercase flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Solution
                                             </div>
                                             <p className="text-sm text-slate-300 leading-relaxed font-medium">{fix.solution}</p>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center flex flex-col items-center">
                        <AlertTriangle className="w-6 h-6 mb-2" />
                        {error}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageRoaster;