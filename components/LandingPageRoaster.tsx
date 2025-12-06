import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Flame, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { GTMPlan, RoastResult } from '../types';
import { roastLandingPage } from '../services/geminiService';

interface LandingPageRoasterProps {
  plan: GTMPlan;
  onClose: () => void;
}

const LandingPageRoaster: React.FC<LandingPageRoasterProps> = ({ plan, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix for API
        const base64Data = base64.split(',')[1];
        setImage(base64Data);
        handleRoast(base64Data);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []},
    maxFiles: 1 
  });

  const handleRoast = async (base64Data: string) => {
    setLoading(true);
    setError('');
    try {
      const roast = await roastLandingPage(base64Data, plan);
      setResult(roast);
    } catch (e) {
        console.error(e);
      setError("Failed to analyze image. Please try a clearer screenshot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Landing Page Roaster</h3>
              <p className="text-xs text-slate-400">AI Vision critique from your MVCC persona</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel: Upload/Preview */}
            <div className="w-full md:w-1/2 p-6 bg-slate-900 border-r border-slate-800 flex flex-col">
                {!image ? (
                    <div 
                        {...getRootProps()} 
                        className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            isDragActive ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="w-10 h-10 text-slate-500 mb-4" />
                        <p className="text-slate-300 font-medium">Drop your landing page screenshot</p>
                        <p className="text-xs text-slate-500 mt-2">Supports PNG, JPG</p>
                    </div>
                ) : (
                    <div className="relative flex-1 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center">
                        <img 
                            src={`data:image/png;base64,${image}`} 
                            alt="Preview" 
                            className="max-w-full max-h-full object-contain opacity-80"
                        />
                        {loading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <div className="text-center">
                                    <Loader className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-2" />
                                    <p className="text-orange-400 font-bold animate-pulse">Analyzing UX & Copy...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Panel: The Roast */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-slate-950/50">
                {!result && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <Flame className="w-12 h-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 max-w-xs">
                            Upload a screenshot to see if your landing page actually converts {plan.mvcc}.
                        </p>
                    </div>
                )}

                {result && (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500">
                        {/* Score */}
                        <div className="flex items-center gap-4">
                            <div className={`text-5xl font-black ${result.score > 70 ? 'text-emerald-500' : result.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {result.score}
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Conversion Score</div>
                                <div className="text-sm text-slate-300">{result.score > 70 ? "Ready to ship" : "Needs work"}</div>
                            </div>
                        </div>

                        {/* Brutal Truth */}
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                            <h4 className="text-xs text-orange-500 uppercase font-bold mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" /> The Brutal Truth
                            </h4>
                            <p className="text-slate-200 text-lg font-medium leading-relaxed">
                                "{result.brutalTruth}"
                            </p>
                        </div>

                        {/* Fixes */}
                        <div className="space-y-4">
                             <h4 className="text-xs text-slate-500 uppercase font-bold">Recommended Fixes</h4>
                             {result.fixes.map((fix, idx) => (
                                 <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                                     <div className="flex items-center justify-between mb-2">
                                         <span className="text-xs font-bold px-2 py-1 bg-slate-950 rounded text-slate-400 border border-slate-800">
                                            {fix.area}
                                         </span>
                                     </div>
                                     <div className="space-y-2">
                                         <div className="flex items-start gap-2 text-sm text-red-400/80">
                                             <X className="w-4 h-4 mt-0.5 shrink-0" />
                                             <p>{fix.problem}</p>
                                         </div>
                                         <div className="flex items-start gap-2 text-sm text-emerald-400">
                                             <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                             <p>{fix.solution}</p>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
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