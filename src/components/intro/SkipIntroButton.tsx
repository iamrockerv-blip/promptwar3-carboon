// src/components/intro/SkipIntroButton.tsx
'use client';
import { useCarbonStore } from '@/store/carbon-store';

/**
 * A floating skip button positioned at the bottom-center of the viewport.
 * Only visible during intro phases ('aura-reveal' and 'life-replay').
 */
export default function SkipIntroButton() {
  const phase = useCarbonStore((state) => state.phase);
  const skipIntro = useCarbonStore((state) => state.skipIntro);

  const isIntroPhase = phase === 'aura-reveal' || phase === 'life-replay';

  if (!isIntroPhase) return null;

  return (
    <button
      type="button"
      onClick={skipIntro}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full glass-card hover:bg-white/10 active:scale-95 transition-all text-sm font-medium tracking-wide flex items-center gap-2 cursor-pointer shadow-lg outline-none focus:ring-2 focus:ring-accent-sapphire border border-white/15"
      aria-label="Skip introduction animation and go to results"
    >
      Skip Intro ⏭️
    </button>
  );
}
