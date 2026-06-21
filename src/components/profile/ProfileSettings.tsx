// src/components/profile/ProfileSettings.tsx
'use client';

import { useState } from 'react';
import { useCarbonStore } from '@/store/carbon-store';
import { getAuraDefinition, getAuraColorWithAlpha } from '@/lib/aura-definitions';
import { QUIZ_QUESTIONS } from '../quiz/questions';
import { UserCheck, AlertCircle } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'diet', label: 'Dietary', icon: '🥗' },
  { id: 'energy', label: 'Home Energy', icon: '⚡' },
  { id: 'travel', label: 'Aviation', icon: '✈️' },
  { id: 'consumption', label: 'Shopping', icon: '🛍️' }
] as const;

export default function ProfileSettings() {
  const twin = useCarbonStore((state) => state.twin);
  const quizAnswers = useCarbonStore((state) => state.quizAnswers);
  const updateTwinAnswers = useCarbonStore((state) => state.updateTwinAnswers);
  const [activeCategory, setActiveCategory] = useState<'transport' | 'diet' | 'energy' | 'travel' | 'consumption'>('transport');

  if (!twin) return null;

  const auraDef = getAuraDefinition(twin.aura);

  // Find the current active question to display
  const activeQuestionIndex = QUIZ_QUESTIONS.findIndex(q => q.category === activeCategory);
  const question = QUIZ_QUESTIONS[activeQuestionIndex];
  const currentAnswer = quizAnswers.find((a) => a.category === activeCategory)?.value;

  return (
    <div className="w-full space-y-6">
      
      {/* Header Info */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
                Baseline Twin Settings
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider font-mono border border-emerald-500/20">
                  Editable
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Refine your baseline answers to instantly recalculate your Carbon Twin&apos;s profile.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-2.5 text-xs text-neutral-400 leading-normal">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p>
            Adjusting these answers updates your <span className="font-semibold text-white">baseline lifestyle</span>. 
            If you want to simulate temporary habit shifts (like a sandbox test), use the <span className="font-semibold text-white">Habit Sandbox</span> tab instead.
          </p>
        </div>
      </div>

      {/* Horizontal Category Tab Bar Selector */}
      <div className="flex overflow-x-auto gap-2 bg-neutral-950/40 border border-white/5 p-1.5 rounded-2xl backdrop-blur-md">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Single Active Category Card */}
      {question && (
        <div className="p-6 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl space-y-4">
          <div>
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest font-mono">
              Category 0{activeQuestionIndex + 1} | {question.category}
            </span>
            <h4 className="text-base font-bold text-white mt-1 font-display">
              {question.text}
            </h4>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option) => {
              const isSelected = currentAnswer === option.value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => updateTwinAnswers(question.category, option.value)}
                  aria-pressed={isSelected}
                  className="w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50 hover:scale-[1.01]"
                  style={{
                    borderColor: isSelected 
                      ? getAuraColorWithAlpha(auraDef.glowColor, 0.4) 
                      : 'rgba(255,255,255,0.05)',
                    backgroundColor: isSelected 
                      ? getAuraColorWithAlpha(auraDef.glowColor, 0.1) 
                      : 'rgba(255,255,255,0.02)'
                  }}
                >
                  <span className="text-2xl mt-0.5 shrink-0" aria-hidden="true">
                    {option.icon}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <span className={`font-bold text-xs ${isSelected ? 'text-white font-extrabold' : 'text-neutral-300'}`}>
                      {option.label}
                    </span>
                    <p className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed truncate">
                      {option.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        backgroundColor: auraDef.glowColor,
                        color: '#000000'
                      }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Danger Zone: Manual Storage Purge */}
      <div className="p-6 rounded-3xl bg-red-950/10 border border-red-500/10 backdrop-blur-xl space-y-4">
        <div>
          <h4 className="text-sm font-bold text-red-400 font-display">
            Danger Zone
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            Purging your twin data will delete all saved habits, twin scores, and local coach history from your device.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Are you sure you want to purge all local twin data? This will reset your progress.")) {
              localStorage.removeItem('carbon-store-v2');
              window.location.reload();
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 text-xs font-bold transition-all cursor-pointer"
        >
          Purge Twin Data & Reset
        </button>
      </div>

    </div>
  );
}
