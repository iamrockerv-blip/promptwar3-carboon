// src/components/aura/AuraOrb.tsx
'use client';
import { m } from 'framer-motion';
import { CarbonAura } from '@/types';
import { getAuraDefinition } from '@/lib/aura-definitions';

interface AuraOrbProps {
  aura: CarbonAura;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-12 h-12 shadow-[0_0_20px_var(--glow)]',
  md: 'w-32 h-32 shadow-[0_0_40px_var(--glow)]',
  lg: 'w-48 h-48 shadow-[0_0_80px_var(--glow)]'
};

/**
 * Animated glowing orb component that themes itself to the assigned Carbon Aura.
 * Uses Framer Motion for smooth, hardware-accelerated breathing animations.
 */
export default function AuraOrb({ aura, size = 'md' }: AuraOrbProps) {
  const definition = getAuraDefinition(aura);

  // Extract HSL values for the shadow styling
  const glowStyle = {
    '--glow': definition.glowColor,
    background: `linear-gradient(135deg, ${definition.gradient[0]}, ${definition.gradient[1]})`
  } as React.CSSProperties;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer breathing halo */}
      <m.div
        style={glowStyle}
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`absolute rounded-full filter blur-md ${sizeClasses[size]}`}
      />

      {/* Main core orb */}
      <m.div
        style={glowStyle}
        animate={{
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`relative rounded-full z-10 ${sizeClasses[size]}`}
      >
        {/* Inner core highlights */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/0 via-white/10 to-white/40 filter blur-xs" />
      </m.div>
    </div>
  );
}
