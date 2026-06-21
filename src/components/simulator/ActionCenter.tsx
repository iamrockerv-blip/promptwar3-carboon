// src/components/simulator/ActionCenter.tsx
'use client';

import { useState } from 'react';
import { useCarbonStore } from '@/store/carbon-store';
import { getAvailableShifts } from '@/lib/simulator-options';
import { Sliders, Sparkles, CheckCircle2, Trophy, RefreshCw } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
}

export default function ActionCenter() {
  const twin = useCarbonStore((state) => state.twin);
  const quizAnswers = useCarbonStore((state) => state.quizAnswers);
  const activeShifts = useCarbonStore((state) => state.simulator.activeShifts);
  const toggleShift = useCarbonStore((state) => state.toggleShift);
  const resetSimulator = useCarbonStore((state) => state.resetSimulator);

  const quests = useCarbonStore((state) => state.quests);
  const totalCarbonSavedKg = useCarbonStore((state) => state.totalCarbonSavedKg);
  const completeQuest = useCarbonStore((state) => state.completeQuest);
  const resetQuests = useCarbonStore((state) => state.resetQuests);

  const [activeTab, setActiveTab] = useState<'shifts' | 'quests'>('shifts');
  const [particles, setParticles] = useState<Particle[]>([]);

  if (!twin) return null;

  // Shifts list
  const availableShifts = getAvailableShifts(quizAnswers, twin.breakdown);

  // Quests metadata
  const completedQuestsCount = quests.filter((q) => q.completed).length;
  const allQuestsCompleted = completedQuestsCount === quests.length && quests.length > 0;

  const handleQuestToggle = (questId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    completeQuest(questId);

    const quest = quests.find((q) => q.id === questId);
    if (quest && !quest.completed) {
      const rect = event.currentTarget.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      const colors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#60A5FA', '#F59E0B'];
      const newParticles = Array.from({ length: 24 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 160,
        y: (Math.random() - 0.5) * 160,
        originX,
        originY,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));

      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
      }, 1000);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl space-y-6 overflow-hidden">
      {/* Particle Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((p) => (
          <m.div
            key={p.id}
            initial={{ opacity: 1, scale: 1.5, x: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 0.2, 
              x: p.x, 
              y: p.y,
              rotate: 360
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed w-2 h-2 rounded-full pointer-events-none"
            style={{ 
              left: `${p.originX}px`,
              top: `${p.originY}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`
            }}
          />
        ))}
      </div>

      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('shifts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'shifts' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Quick Wins Sandbox
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('quests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'quests' 
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/10' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Purification Quests
            
            {completedQuestsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-green-500 text-[8px] font-black text-white leading-none border border-neutral-900">
                {completedQuestsCount}
              </span>
            )}
          </button>
        </div>

        {/* Global Reset Buttons per tab */}
        {activeTab === 'shifts' && activeShifts.length > 0 && (
          <button
            type="button"
            onClick={resetSimulator}
            className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
        {activeTab === 'quests' && completedQuestsCount > 0 && (
          <button
            type="button"
            onClick={resetQuests}
            className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Tabs Content */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === 'shifts' ? (
            <m.div
              key="shifts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-sm font-bold text-white">Interactive Sandbox</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Toggle potential changes to optimize your twin score.</p>
              </div>

              <div className="space-y-2.5">
                {availableShifts.map((shift) => {
                  const isEnabled = activeShifts.includes(shift.id);
                  return (
                    <button
                      type="button"
                      key={shift.id}
                      onClick={() => toggleShift(shift.id)}
                      aria-pressed={isEnabled}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${
                        isEnabled 
                          ? 'bg-indigo-500/10 border-indigo-500/30' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl mt-0.5 shrink-0" aria-hidden="true">
                        {shift.icon}
                      </span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white text-xs truncate">
                            {shift.label}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                            shift.difficulty === 'hard' 
                              ? 'bg-red-500/10 text-red-400' 
                              : shift.difficulty === 'moderate' 
                                ? 'bg-yellow-500/10 text-yellow-400' 
                                : 'bg-green-500/10 text-green-400'
                          }`}>
                            {shift.difficulty}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed truncate">
                          {shift.description}
                        </p>
                        <p className="text-[10px] font-semibold text-emerald-400 mt-1">
                          -{shift.co2Reduction.toFixed(1)} t CO₂e/year
                        </p>
                      </div>

                      <div className="shrink-0 self-center">
                        <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                          isEnabled 
                            ? 'border-indigo-500 bg-indigo-500 text-white' 
                            : 'border-white/20'
                        }`}>
                          {isEnabled && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </m.div>
          ) : (
            <m.div
              key="quests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Progress Summary Mini Panel */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Total Purified</p>
                  <p className="text-xl font-black text-white mt-0.5">
                    {totalCarbonSavedKg.toFixed(1)} <span className="text-xs font-normal text-neutral-400">kg CO₂e</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Status</p>
                  <p className={`text-xs font-bold mt-1.5 flex items-center gap-1 ${
                    allQuestsCompleted ? 'text-yellow-400 font-extrabold' : 'text-neutral-400'
                  }`}>
                    <Trophy className="w-3.5 h-3.5" />
                    {completedQuestsCount}/{quests.length} Completed
                  </p>
                </div>
              </div>

              {/* Quests List */}
              <div className="space-y-2.5">
                {quests.map((quest) => (
                  <button
                    type="button"
                    key={quest.id}
                    onClick={(e) => handleQuestToggle(quest.id, e)}
                    aria-pressed={quest.completed}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500/50 ${
                      quest.completed 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl p-1.5 rounded-xl bg-white/5 shrink-0" aria-hidden="true">
                      {quest.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs truncate">
                          {quest.label}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-[8px] font-bold text-green-400 uppercase tracking-wider shrink-0">
                          -{quest.co2SavedKg.toFixed(1)} kg CO₂
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed truncate">
                        {quest.description}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        quest.completed 
                          ? 'border-green-500 bg-green-500 text-white' 
                          : 'border-white/20'
                      }`}>
                        {quest.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
