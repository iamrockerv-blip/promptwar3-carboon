// src/components/aura/AuraReveal.tsx
'use client';
import { useEffect } from 'react';
import { m } from 'framer-motion';
import { useCarbonStore } from '@/store/carbon-store';
import { getAuraDefinition } from '@/lib/aura-definitions';
import AuraOrb from './AuraOrb';

/**
 * Cinematic 2-second visual reveal of the user's deterministic Carbon Aura.
 * Automatically advances to the 'life-replay' phase.
 */
export default function AuraReveal() {
  const twin = useCarbonStore((state) => state.twin);
  const advanceToLifeReplay = useCarbonStore((state) => state.advanceToLifeReplay);

  useEffect(() => {
    // Auto-advance to next phase after 2 seconds
    const timer = setTimeout(() => {
      advanceToLifeReplay();
    }, 2000);

    return () => clearTimeout(timer);
  }, [advanceToLifeReplay]);

  if (!twin) return null;

  const definition = getAuraDefinition(twin.aura);

  return (
    <div className="w-full min-h-screen bg-bg-primary flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background bleed gradient */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{
          background: `radial-gradient(circle, ${definition.glowColor} 0%, transparent 70%)`
        }}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Cinematic Full-screen Shockwave Overlay */}
      <m.div
        initial={{ scale: 0.01, opacity: 0 }}
        animate={{ scale: [0.01, 1.2, 2.5], opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
        className="absolute w-[120vmax] h-[120vmax] rounded-full pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${definition.glowColor} 0%, rgba(0, 0, 0, 0) 70%)`
        }}
      />

      {/* Sharp Shockwave Wavefront Ring 1 */}
      <m.div
        initial={{ scale: 0.01, opacity: 0.8 }}
        animate={{ scale: 4.5, opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        className="absolute w-[200px] h-[200px] pointer-events-none z-0"
      >
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <defs>
            <radialGradient id={`glow-grad-1-${definition.name}`} cx="50%" cy="50%" r="50%">
              <stop offset="90%" stopColor={definition.glowColor} stopOpacity="1" />
              <stop offset="100%" stopColor={definition.glowColor} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle 
            cx="100" 
            cy="100" 
            r="96" 
            fill="none" 
            stroke={`url(#glow-grad-1-${definition.name})`} 
            strokeWidth="3" 
          />
        </svg>
      </m.div>

      {/* Sharp Shockwave Wavefront Ring 2 */}
      <m.div
        initial={{ scale: 0.01, opacity: 0.5 }}
        animate={{ scale: 3.5, opacity: 0 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.45 }}
        className="absolute w-[200px] h-[200px] pointer-events-none z-0"
      >
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <defs>
            <radialGradient id={`glow-grad-2-${definition.name}`} cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor={definition.glowColor} stopOpacity="1" />
              <stop offset="100%" stopColor={definition.glowColor} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle 
            cx="100" 
            cy="100" 
            r="94" 
            fill="none" 
            stroke={`url(#glow-grad-2-${definition.name})`} 
            strokeWidth="6" 
          />
        </svg>
      </m.div>


      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Scaling core orb */}
        <m.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 14,
            delay: 0.3
          }}
        >
          <AuraOrb aura={twin.aura} size="lg" />
        </m.div>

        {/* Aura Name Display */}
        <m.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0, ease: 'easeOut' }}
          className="text-4xl md:text-5xl font-display font-extrabold tracking-wider mt-4"
          style={{
            background: `linear-gradient(135deg, ${definition.gradient[0]}, ${definition.gradient[1]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {definition.name.toUpperCase()}
        </m.h2>

        {/* Tagline */}
        <m.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.3, ease: 'easeOut' }}
          className="text-text-secondary text-lg md:text-xl font-medium"
        >
          &ldquo;{definition.tagline}&rdquo;
        </m.p>
      </div>
    </div>
  );
}
