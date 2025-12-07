import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader } from 'lucide-react';
import { GTMPlan, FormData } from '../types';
import { startCopilotChat } from '../services/geminiService';
import { Chat } from '@google/genai';

interface GTMCopilotProps {
  plan: GTMPlan;
  data: FormData;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const GTMCopilot: React.FC<GTMCopilotProps> = ({ plan, data }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const chat = await startCopilotChat(plan, data);
        setChatSession(chat);
        setMessages([{ role: 'model', text: `I'm your GTM Copilot for ${data.projectName}. Stuck on a task? Ask me to draft content, explain a tactic, or critique your approach.` }]);
      } catch (e) {
        console.error("Failed to init copilot", e);
      }
    };
    init();
  }, [plan, data]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || !chatSession || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: textToSend });
      const responseText = result.text;
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "I ran into an issue. Could you try asking that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Draft the cold outreach email for Q1 partners",
    "Explain the 'Wedge' strategy against competitors",
    "What are 3 tweet ideas for my launch?",
    "How do I measure success for Q2?"
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
          <Bot className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-slate-100 font-bold flex items-center gap-2">
            GTM Copilot
          </h3>
          <p className="text-xs text-slate-400">Your AI execution partner</p>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-900/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-500/10 border border-indigo-500/20'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Sparkles className="w-4 h-4 text-indigo-400" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-slate-700 text-white rounded-tr-none' 
                  : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                   <Loader className="w-4 h-4 text-indigo-400 animate-spin" />
                </div>
                <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none text-sm text-slate-400">
                    Thinking...
                </div>
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-slate-950 p-4 border-t border-slate-800 space-y-4">
        {/* Suggestions */}
        {messages.length < 3 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {suggestions.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSend(s)}
                        className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 transition-colors"
                    >
                        {s}
                    </button>
                ))}
            </div>
        )}

        <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
        >
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me how to execute a specific step..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-900/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GTMCopilot;