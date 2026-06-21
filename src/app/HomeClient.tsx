// src/app/HomeClient.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCarbonStore } from '@/store/carbon-store';
import QuizContainer from '@/components/quiz/QuizContainer';
import LoadingState from '@/components/ui/LoadingState';
import AuraReveal from '@/components/aura/AuraReveal';
import LifeReplay from '@/components/replay/LifeReplay';
import SkipIntroButton from '@/components/intro/SkipIntroButton';
import { AnimatePresence, LazyMotion, domMax, MotionConfig, m } from 'framer-motion';
import { LayoutDashboard, Sliders, MessageSquare, Globe, Share2, RefreshCw, Settings } from 'lucide-react';
import dynamic from 'next/dynamic';

// Phase 2 Dashboard Sections
import HeroSummaryZone from '@/components/dashboard/HeroSummaryZone';
import TwinProfile from '@/components/twin/TwinProfile';
import TimelineEngine from '@/components/timeline/TimelineEngine';

const ProfileSettings = dynamic(() => import('@/components/profile/ProfileSettings'), { ssr: false });
const EarthConsequence = dynamic(() => import('@/components/consequence/EarthConsequence'), { ssr: false });
const ActionCenter = dynamic(() => import('@/components/simulator/ActionCenter'), { ssr: false });
const AICoach = dynamic(() => import('@/components/coach/AICoach'), { ssr: false });
const ShareCard = dynamic(() => import('@/components/share/ShareCard'), { ssr: false });

export default function HomeClient() {
  const phase = useCarbonStore((state) => state.phase);
  const twin = useCarbonStore((state) => state.twin);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      // Trigger hydration re-render
      useCarbonStore.persist.rehydrate();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    // Avoid SSR hydration warning, render black screen while hydrating store
    return <main className="min-h-screen bg-bg-primary" />;
  }

  // Derive the effective active view phase on the /app route
  let effectivePhase = phase;
  if (phase === 'landing') {
    effectivePhase = 'quiz';
  } else if (twin && phase === 'quiz') {
    effectivePhase = 'results';
  }

  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">
        <main className="min-h-screen relative bg-bg-primary overflow-x-hidden flex flex-col justify-between">
          {/* Global Skip Intro overlay button */}
          <SkipIntroButton />

          <div className="flex-grow flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {effectivePhase === 'quiz' && (
                <m.div
                  key="quiz"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <QuizContainer />
                </m.div>
              )}

              {effectivePhase === 'generating' && (
                <m.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <LoadingState />
                </m.div>
              )}

              {effectivePhase === 'aura-reveal' && (
                <m.div
                  key="aura-reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <AuraReveal />
                </m.div>
              )}

              {effectivePhase === 'life-replay' && (
                <m.div
                  key="life-replay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <LifeReplay />
                </m.div>
              )}

              {effectivePhase === 'results' && <DashboardView />}
            </AnimatePresence>
          </div>
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}

function DashboardView() {
  const reset = useCarbonStore((state) => state.reset);
  const setPhase = useCarbonStore((state) => state.setPhase);
  const [activeTab, setActiveTab] = useState<'overview' | 'sandbox' | 'coach' | 'impacts' | 'share' | 'profile'>('overview');

  const handleRestart = () => {
    reset();
    setPhase('quiz');
  };

  return (
    <m.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen flex flex-col md:flex-row text-white bg-bg-primary"
    >
      {/* Left Sidebar Navigation */}
      <aside className="w-64 h-screen fixed left-0 top-0 bg-neutral-950 border-r border-white/5 p-6 flex flex-col justify-between shrink-0 hidden md:flex overflow-y-auto z-30">
        <div className="space-y-8">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-indigo-400 bg-clip-text text-transparent flex items-baseline">
              Carbon Twin AI<sup className="text-[10px] font-bold ml-0.5 select-none text-indigo-400 align-super">TM</sup>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'sandbox', label: 'Habit Sandbox', icon: Sliders },
              { id: 'coach', label: 'AI Coach', icon: MessageSquare },
              { id: 'impacts', label: 'Earth Impact', icon: Globe },
              { id: 'share', label: 'Print ID Card', icon: Share2 },
              { id: 'profile', label: 'Twin Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'sandbox' | 'coach' | 'impacts' | 'share' | 'profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer border relative group ${
                    isActive
                      ? 'bg-white/10 text-white border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  {/* Left indicator line */}
                  {isActive && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r bg-emerald-400" />
                  )}
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/5 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold transition-all cursor-pointer hover:border-white/20"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            View Info & Science
          </Link>
          <button
            type="button"
            onClick={handleRestart}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restart Journey
          </button>
        </div>
      </aside>

      {/* Mobile Header and Floating Mobile Menu */}
      <div className="flex-grow flex flex-col min-w-0 md:pl-64 relative">
        {/* Mobile top bar */}
        <header className="md:hidden w-full bg-neutral-950 border-b border-white/5 py-4 px-6 flex items-center justify-between z-30">
          <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-indigo-400 bg-clip-text text-transparent flex items-baseline">
            Carbon Twin AI<sup className="text-[9px] font-bold ml-0.5 select-none text-indigo-400 align-super">TM</sup>
          </span>
          <div className="flex gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              Info
            </Link>
            <button
              type="button"
              onClick={handleRestart}
              className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-[10px] font-bold transition-all cursor-pointer"
            >
              Restart
            </button>
          </div>
        </header>

        {/* Floating Bottom Navigation Bar for Mobile */}
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-neutral-950/80 backdrop-blur-lg border border-white/10 rounded-2xl p-2 flex justify-around items-center shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'sandbox', label: 'Sandbox', icon: Sliders },
            { id: 'coach', label: 'Coach', icon: MessageSquare },
            { id: 'impacts', label: 'Impacts', icon: Globe },
            { id: 'share', label: 'Print ID', icon: Share2 },
            { id: 'profile', label: 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'sandbox' | 'coach' | 'impacts' | 'share' | 'profile')}
                className={`flex flex-col items-center gap-1 py-1.5 px-2.5 rounded-xl text-[9px] font-extrabold transition-all cursor-pointer ${
                  isActive ? 'text-emerald-400 bg-white/5' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="flex-grow p-4 md:p-8 pb-28 md:pb-8 max-w-6xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <HeroSummaryZone />
              <div className="space-y-6">
                <TwinProfile />
                <TimelineEngine />
              </div>
            </m.div>
          )}

          {activeTab === 'sandbox' && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto w-full"
            >
              <ActionCenter />
            </m.div>
          )}

          {activeTab === 'coach' && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto w-full"
            >
              <AICoach />
            </m.div>
          )}

          {activeTab === 'impacts' && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto w-full"
            >
              <EarthConsequence />
            </m.div>
          )}

          {activeTab === 'share' && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto w-full"
            >
              <ShareCard />
            </m.div>
          )}

          {activeTab === 'profile' && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto w-full"
            >
              <ProfileSettings />
            </m.div>
          )}
        </div>
      </div>
    </m.div>
  );
}
