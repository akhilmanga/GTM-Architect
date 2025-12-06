import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, Bot, Loader, Activity, CheckCircle2, Trophy } from 'lucide-react';
import { startPersonaChat } from '../services/geminiService';
import { GTMPlan, FormData } from '../types';

interface PersonaSimulatorProps {
  plan: GTMPlan;
  data: FormData;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const PersonaSimulator: React.FC<PersonaSimulatorProps> = ({ plan, data, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const [resonance, setResonance] = useState(15);
  const [isValidated, setIsValidated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const processResponse = (rawText: string | undefined): string => {
    if (!rawText) return "";
    
    let cleanText = rawText;

    // Check for validation tag
    if (cleanText.includes("<<VALIDATED>>")) {
        setIsValidated(true);
        cleanText = cleanText.replace("<<VALIDATED>>", "");
    }
    
    // Parse Score: <<SCORE: 50>>
    const scoreMatch = cleanText.match(/<<SCORE:\s*(\d+)>>/);
    if (scoreMatch) {
        const newScore = parseInt(scoreMatch[1]);
        if (!isNaN(newScore)) {
            setResonance(newScore);
        }
        cleanText = cleanText.replace(/<<SCORE:\s*\d+>>/, '');
    }
    
    return cleanText.trim();
  };

  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      try {
        const { chat, initialMessage } = await startPersonaChat(plan, data);
        setChatSession(chat);
        const cleanText = processResponse(initialMessage);
        setMessages([{ role: 'model', text: cleanText || "Hello." }]);
      } catch (e) {
        console.error(e);
        setMessages([{ role: 'model', text: "Connection failed. Please try again." }]);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, []); 

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isValidated]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !chatSession || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // FIX: Ensure message is passed as an object to satisfy ContentUnion
      const result = await chatSession.sendMessage({ message: userMsg });
      const rawText = result.text;
      const cleanText = processResponse(rawText);
      
      if (cleanText) {
        setMessages(prev => [...prev, { role: 'model', text: cleanText }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "I didn't catch that. Say again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate meter color
  const getMeterColor = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden relative">
        
        {/* Validation Overlay (Success State) */}
        {isValidated && (
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in zoom-in duration-500">
                <div className="bg-slate-900 border border-emerald-500/50 p-8 rounded-2xl text-center shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)] max-w-sm mx-4">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Pitch Validated!</h2>
                    <p className="text-slate-300 mb-6">
                        You hit the resonance threshold. This pitch is ready for real humans.
                    </p>
                    <button 
                        onClick={onClose} 
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        )}

        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-full">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">{plan.mvcc}</h3>
              <p className="text-xs text-slate-400">Validate your pitch live.</p>
            </div>
          </div>

          {/* Resonance Meter */}
          <div className="hidden sm:flex flex-col items-end gap-1 mr-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Activity className="w-3 h-3" /> Resonance Score: <span className={isValidated ? 'text-emerald-400' : 'text-white'}>{resonance}%</span>
            </div>
            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${getMeterColor(resonance)}`} 
                    style={{ width: `${Math.min(resonance, 100)}%` }} 
                />
            </div>
          </div>

          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Meter (Visible only on small screens) */}
        <div className="sm:hidden px-4 py-2 bg-slate-950/50 border-b border-slate-800 flex items-center gap-3">
             <div className="text-xs font-bold text-slate-400">Score: {resonance}%</div>
             <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${getMeterColor(resonance)}`} 
                    style={{ width: `${Math.min(resonance, 100)}%` }} 
                />
            </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700 flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-xs text-slate-400">Evaluating...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
          <input
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pitch your idea or ask a question..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonaSimulator;