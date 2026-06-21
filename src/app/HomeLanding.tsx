// src/app/HomeLanding.tsx
'use client';

import { LazyMotion, domMax, MotionConfig } from 'framer-motion';
import Hero from '@/components/landing/Hero';

export default function HomeLanding() {

  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">
        <main className="min-h-screen relative bg-bg-primary overflow-x-hidden">
          <Hero />
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
