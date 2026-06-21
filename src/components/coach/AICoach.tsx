// src/components/coach/AICoach.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCarbonStore } from '@/store/carbon-store';
import { Send, Sparkles, MessageCircle } from 'lucide-react';


export default function AICoach() {
  const twin = useCarbonStore((state) => state.twin);
  const coachMessages = useCarbonStore((state) => state.coachMessages);
  const sendCoachMessage = useCarbonStore((state) => state.sendCoachMessage);
  const quizAnswers = useCarbonStore((state) => state.quizAnswers);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = React.useMemo(() => {
    const defaultPresets = [
      'How do I improve my Aura?',
      'Explain my travel carbon cost.',
      'Quickest way to save 1 tonne.',
      'Give me green diet tips.'
    ];
    if (!twin) return defaultPresets;

    const list: string[] = [];
    
    // 1. Aura-specific suggestion
    list.push(`How do I improve my ${twin.aura.toUpperCase()} Aura?`);

    // 2. Highest carbon category suggestion
    const breakdown = twin.breakdown;
    const categories = Object.keys(breakdown) as Array<keyof typeof breakdown>;
    const maxCategory = categories.reduce((a, b) => (breakdown[a] > breakdown[b] ? a : b), 'transport');
    const categoryScores = {
      transport: `${breakdown.transport}t`,
      diet: `${breakdown.diet}t`,
      energy: `${breakdown.energy}t`,
      travel: `${breakdown.travel}t`,
      consumption: `${breakdown.consumption}t`
    };

    if (maxCategory === 'transport') {
      list.push(`How can I cut my transport score (${categoryScores.transport})? 🚗`);
    } else if (maxCategory === 'diet') {
      list.push(`How can I reduce my diet emissions (${categoryScores.diet})? 🥗`);
    } else if (maxCategory === 'energy') {
      list.push(`How to cut my home energy cost (${categoryScores.energy})? ⚡`);
    } else if (maxCategory === 'travel') {
      list.push(`What is the travel footprint of my flights (${categoryScores.travel})? ✈️`);
    } else {
      list.push(`How do I lower my consumption score (${categoryScores.consumption})? 🛍️`);
    }

    // 3. Specific suggestions based on quiz answers
    const transportAnswer = quizAnswers.find(a => a.category === 'transport')?.value;
    const dietAnswer = quizAnswers.find(a => a.category === 'diet')?.value;

    if (transportAnswer === 'car_petrol') {
      list.push(`What is the best green alternative to my Petrol Car? 🔌`);
    } else if (transportAnswer === 'car_diesel') {
      list.push(`How does my Diesel Car affect the air? 💨`);
    } else {
      list.push(`How can I make my daily commute even greener? 🚲`);
    }

    if (dietAnswer === 'meat_regular' || dietAnswer === 'meat_heavy') {
      list.push(`Can swapping beef for chicken make a difference? 🍗`);
    } else {
      list.push(`Tell me about a high-impact low-carbon recipe! 🥑`);
    }

    return list;
  }, [twin, quizAnswers]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [coachMessages]);

  if (!twin) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const text = input;
    setInput('');
    setIsSending(true);

    try {
      await sendCoachMessage(text);
    } catch {
      // Component-level error swallowed; store handles fallbacks
    } finally {
      setIsSending(false);
    }
  };

  const handlePresetClick = async (presetText: string) => {
    if (isSending) return;
    setIsSending(true);
    try {
      await sendCoachMessage(presetText);
    } catch {
      // Component-level error swallowed; store handles fallbacks
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div 
      id="ai-coach"
      className="w-full"
    >
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
              AI Carbon Coach
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-[9px] font-extrabold text-indigo-400 uppercase tracking-wider font-mono border border-indigo-500/20 animate-pulse">
                SYS_ACTIVE // V2
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Ask customized questions to receive tailored advice on how to drop emissions.
            </p>
          </div>
        </div>

        {/* Chat Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Chat Box - AI Terminal style */}
          <div className="lg:col-span-8 flex flex-col h-[400px] rounded-2xl bg-neutral-950/80 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)] overflow-hidden">
            
            {/* Scrollable messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/40">
              {coachMessages.map((msg) => {
                const isCoach = msg.sender === 'coach';
                return (
                  <div 
                    key={msg.id}
                    className={`flex ${isCoach ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed border transition-all ${
                      isCoach 
                        ? 'bg-neutral-900/60 text-white rounded-tl-none border-white/5 shadow-sm' 
                        : 'bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white rounded-tr-none border-indigo-500/30 shadow-[0_4px_12px_rgba(79,70,229,0.35)]'
                    }`}>
                      {isCoach && (
                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1.5 font-mono">
                          <Sparkles className="w-3 h-3 text-indigo-400" /> 
                          <span>COACH_ENGINE</span>
                        </div>
                      )}
                      <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900/60 text-white rounded-2xl rounded-tl-none p-4 border border-white/5">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1.5 font-mono">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>COACH_CALCULATING</span>
                    </div>
                    <div className="flex gap-1.5 items-center py-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-smooth-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-smooth-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-smooth-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-neutral-950 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your sustainability query here..."
                aria-label="Ask how to reduce carbon footprints..."
                disabled={isSending}
                className="flex-1 bg-black/50 border border-white/5 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 placeholder-neutral-600 disabled:opacity-50 font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)] active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Preset Prompts / Quick actions - Terminal themed */}
          <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-neutral-950/50 border border-white/5">
            <div>
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 font-mono">
                System Presets //
              </h4>
              <div className="space-y-2.5">
                {suggestions.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => handlePresetClick(preset)}
                    disabled={isSending}
                    className="w-full text-left p-3.5 rounded-xl bg-neutral-900/30 border border-white/5 text-xs text-white/90 hover:bg-indigo-950/45 hover:border-indigo-500/35 hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-between group shadow-sm"
                  >
                    <span className="font-medium">{preset}</span>
                    <Sparkles className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-300 transition-colors shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/15 text-[11px] text-indigo-200 leading-relaxed font-sans">
              💡 <span className="font-semibold text-white">Pro Tip:</span> Ask about specific alternatives in your area, or ask how your simulator toggles can save you money.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
