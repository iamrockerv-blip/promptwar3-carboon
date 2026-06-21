// src/components/landing/DemoModeToggle.tsx
'use client';
import { useCarbonStore } from '@/store/carbon-store';

/**
 * Muted, accessible CTA link specifically for hackathon judges to trigger Demo Mode.
 * Bypasses the quiz questions to display results immediately.
 */
export default function DemoModeToggle() {
  const activateDemoMode = useCarbonStore((state) => state.activateDemoMode);

  return (
    <button
      type="button"
      onClick={activateDemoMode}
      className="text-xs md:text-sm text-text-secondary hover:text-text-primary transition-all underline decoration-dotted underline-offset-4 cursor-pointer outline-none hover:scale-102 focus:ring-2 focus:ring-accent-sapphire px-4 py-2 rounded-lg"
      aria-label="Explore with sample profile"
    >
      {"Explore with sample profile ⚡"}
    </button>
  );
}
