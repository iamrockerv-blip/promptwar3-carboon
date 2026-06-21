// src/components/dashboard/HeroSummaryZone.tsx
'use client';

import { useCarbonStore } from '@/store/carbon-store';
import { getAuraDefinition, getAuraColorWithAlpha } from '@/lib/aura-definitions';
import AuraOrb from '../aura/AuraOrb';
import { m } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';

export default function HeroSummaryZone() {
  const twin = useCarbonStore((state) => state.twin);
  const simulatedScore = useCarbonStore((state) => state.simulator.simulatedScore);
  const simulatedAura = useCarbonStore((state) => state.simulator.simulatedAura);
  const baselineScore = useCarbonStore((state) => state.simulator.baselineScore);
  const totalReduction = useCarbonStore((state) => state.simulator.totalReduction);

  if (!twin) return null;

  const currentScore = simulatedScore;
  const currentAura = simulatedAura;
  const auraDef = getAuraDefinition(currentAura);

  const reductionPercentage = baselineScore > 0 
    ? Math.round((totalReduction / baselineScore) * 100) 
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-6">
      <div 
        style={{ 
          background: `radial-gradient(circle at 90% 10%, ${getAuraColorWithAlpha(auraDef.glowColor, 0.15)}, transparent), linear-gradient(135deg, rgba(23, 23, 23, 0.4), rgba(10, 10, 10, 0.4))`,
          borderColor: getAuraColorWithAlpha(auraDef.glowColor, 0.3),
          boxShadow: `0 16px 48px -12px ${getAuraColorWithAlpha(auraDef.glowColor, 0.4)}`
        }}
        className="p-6 md:p-8 rounded-3xl border backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 overflow-hidden"
      >
        
        {/* Left Section: Aura Orb and Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative shrink-0">
            <AuraOrb aura={currentAura} size="md" />
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span 
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300"
                style={{ 
                  color: auraDef.glowColor, 
                  borderColor: getAuraColorWithAlpha(auraDef.glowColor, 0.4),
                  backgroundColor: getAuraColorWithAlpha(auraDef.glowColor, 0.1)
                }}
              >
                {auraDef.name}
              </span>
              
              {totalReduction > 0 && (
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-[9px] font-extrabold text-green-400 uppercase tracking-wider border border-green-500/20">
                  Purified
                </span>
              )}
            </div>
            
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
              &ldquo;{auraDef.tagline}&rdquo;
            </h2>
            
            <p className="text-xs text-neutral-400 max-w-sm">
              {twin.auraExplanation || auraDef.description}
            </p>
          </div>
        </div>

        {/* Right Section: Score Mirror & Savings */}
        <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
          
          {/* Carbon Score Meter */}
          <div className="text-center sm:text-right space-y-1">
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
              Carbon footprint
            </p>
            
            <div className="flex items-center justify-center sm:justify-end gap-3">
              {totalReduction > 0 ? (
                <>
                  <span className="text-lg font-bold text-neutral-500 line-through">
                    {baselineScore.toFixed(1)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-500" />
                  <m.span
                    key={currentScore}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-black text-white"
                  >
                    {currentScore.toFixed(1)}
                  </m.span>
                </>
              ) : (
                <span className="text-4xl font-black text-white">
                  {currentScore.toFixed(1)}
                </span>
              )}
              <span className="text-xs text-neutral-400 font-semibold mt-2.5">t/yr</span>
            </div>
            
            {totalReduction > 0 && (
              <m.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold text-emerald-400 flex items-center justify-center sm:justify-end gap-1"
              >
                <Leaf className="w-3 h-3" />
                Saved -{totalReduction.toFixed(1)} t ({reductionPercentage}%)
              </m.div>
            )}
          </div>

          {/* Quick Wins info panel */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center items-center text-center sm:items-start sm:text-left min-w-[150px] w-full sm:w-auto">
            <span className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Quick Action
            </span>
            <p className="text-xs font-bold text-white mt-1">
              {totalReduction > 0 
                ? 'Habit shifts applied!' 
                : 'Reduce up to 46%'}
            </p>
            <p className="text-[10px] text-neutral-500 mt-0.5 max-w-[140px] leading-tight">
              {totalReduction > 0 
                ? 'See dynamic timeline & consequence savings.'
                : 'Toggle shifts below to optimize your twin.'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
