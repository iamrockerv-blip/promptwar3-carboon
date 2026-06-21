// src/components/replay/LifeReplay.tsx
'use client';
import { m } from 'framer-motion';
import { useCarbonStore } from '@/store/carbon-store';
import { getAuraDefinition } from '@/lib/aura-definitions';
import { useTypewriter } from '@/hooks/useTypewriter';
import AuraOrb from '../aura/AuraOrb';

/**
 * Animated narrative sequence that replays a typical day to show carbon impacts.
 * Displays the AI-generated story beats in 3 columns/cards, and auto-advances in 4s.
 */
export default function LifeReplay() {
  const twin = useCarbonStore((state) => state.twin);
  const advanceToResults = useCarbonStore((state) => state.advanceToResults);
  const { displayedText } = useTypewriter(
    twin?.lifeReplay.narrative || '',
    18 // Speed up slightly to finish under 1.2 seconds
  );

  if (!twin) return null;

  const definition = getAuraDefinition(twin.aura);

  return (
    <div className="w-full min-h-screen bg-bg-primary px-4 md:px-8 pt-8 pb-32 flex flex-col items-center">
      {/* Background glow */}
      <div 
        style={{ background: `radial-gradient(circle at 10% 10%, ${definition.glowColor} 0%, transparent 60%)` }}
        className="absolute inset-0 pointer-events-none opacity-20"
      />

      <div className="max-w-4xl w-full flex flex-col gap-6 md:gap-8 items-center z-10 my-auto">
        
        {/* Shrunk Aura Indicator at Top */}
        <m.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <AuraOrb aura={twin.aura} size="sm" />
          <div>
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-widest">Digital Twin</h3>
            <h4 className="text-md font-bold" style={{ color: definition.gradient[0] }}>
              {definition.name}
            </h4>
          </div>
        </m.div>

        {/* Narrative Box */}
        <div className="min-h-[72px] md:min-h-[60px] text-center max-w-2xl px-4">
          {/* Static full text for screen readers, announced immediately */}
          <p className="sr-only">
            {twin.lifeReplay.narrative}
          </p>
          {/* Animating text hidden from screen readers to prevent speech disruption */}
          <p className="text-base md:text-lg font-body text-text-primary leading-relaxed antialiased" aria-hidden="true">
            {displayedText}
          </p>
        </div>

        {/* Chapter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {twin.lifeReplay.chapters.map((chapter, index) => {
            const cardDirection = index % 2 === 0 ? -40 : 40;
            return (
              <m.div
                key={chapter.title}
                initial={{ x: cardDirection, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.8 + index * 0.25, // Staggers in at T+0.8, T+1.05, T+1.30
                  ease: 'easeOut'
                }}
                className="glass-card p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-white/15 transition-colors"
              >
                {/* Floating Chapter Icon */}
                <div className="text-3xl" aria-hidden="true">
                  {chapter.icon}
                </div>

                <h4 className="text-base font-semibold text-text-primary">
                  {chapter.title}
                </h4>

                <p className="text-sm text-text-secondary leading-relaxed flex-grow">
                  {chapter.body}
                </p>

                {/* Score Counter */}
                <m.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 2.0, duration: 0.4 }} // Animates simultaneously at T+2.0s
                  className="mt-2 text-right text-xs font-mono font-semibold"
                  style={{ color: definition.gradient[0] }}
                >
                  +{chapter.co2Contribution.toFixed(1)} t CO₂e/yr
                </m.div>
              </m.div>
            );
          })}
        </div>

        {/* Closing Stat fading in */}
        <m.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.5 }}
          className="text-center mt-4"
        >
          <span className="text-sm font-semibold tracking-wider text-text-secondary uppercase">
            Total Footprint Profile
          </span>
          <div className="text-3xl font-display font-extrabold tracking-tight mt-1 text-text-primary">
            {twin.score.toFixed(1)} Tonnes <span className="text-lg font-medium text-text-secondary">CO₂e / year</span>
          </div>
        </m.div>

        {/* Action Button */}
        <m.button
          onClick={advanceToResults}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.0, duration: 0.3 }}
          className="px-6 py-2.5 rounded-lg bg-white text-bg-primary hover:bg-white/90 active:scale-95 font-semibold text-sm transition-all cursor-pointer outline-none shadow-md"
        >
          See Your Full Impact →
        </m.button>

      </div>
    </div>
  );
}
