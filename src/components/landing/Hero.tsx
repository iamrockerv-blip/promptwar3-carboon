// src/components/landing/Hero.tsx
'use client';
import { m } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCarbonStore } from '@/store/carbon-store';
import DemoModeToggle from './DemoModeToggle';
import Header from './Header';
import Footer from './Footer';
import MiniSandbox from './MiniSandbox';
import HeroParticles from './HeroParticles';
import { 
  Cpu, 
  BookOpen, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

const STEPS = [
  { num: '01', title: 'Baseline Quiz', desc: '5 high-impact questions covering diet, travel, and energy.' },
  { num: '02', title: 'Aura Identity', desc: 'Your Carbon Aura rating (Green to Crimson) based on climate targets.' },
  { num: '03', title: 'Habit Sandbox', desc: 'Toggle commuting, diet, and flights. See simulated impacts instantly.' },
  { num: '04', title: 'AI Carbon Coach', desc: 'Chat to get custom action plans and localized suggestions.' }
];

export default function Hero() {
  const router = useRouter();
  const reset = useCarbonStore((state) => state.reset);
  const twin = useCarbonStore((state) => state.twin);

  return (
    <div className="w-full flex flex-col items-center bg-mesh">
      {/* Top Floating Header */}
      <Header />

      {/* Main Hero Fold */}
      <div className="w-full max-w-5xl px-6 pt-16 pb-12 flex flex-col items-center text-center relative">
        <HeroParticles />
        <div className="max-w-3xl flex flex-col gap-6 items-center z-10">
          
          {/* Tagline Badge */}
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-emerald-400 mb-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Climate Digital Twin Engine</span>
          </m.div>

          {/* Main Title */}
          <m.h1
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-4xl md:text-7xl font-display font-black tracking-tight text-white leading-none"
          >
            Simulate Your{' '}
            <span className="bg-gradient-to-r from-accent-green via-accent-sapphire to-accent-emerald bg-clip-text text-transparent">
              Carbon Twin
            </span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05, ease: 'easeOut' }}
            className="text-base md:text-lg text-text-secondary max-w-xl leading-relaxed"
          >
            Discover your environmental identity, simulate habit shifts in a real-time sandbox, and optimize your path to a greener future.
          </m.p>

          {/* Action Button & Demo Link */}
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col gap-4 items-center mt-2 w-full"
          >
            {twin ? (
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
                <Link
                  href="/app"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent-green to-accent-sapphire hover:brightness-110 text-white font-semibold text-base cursor-pointer outline-none focus:ring-2 focus:ring-accent-sapphire active:scale-98 transition-all shadow-[0_0_20px_rgba(34,197,94,0.25)] border border-white/10 flex items-center justify-center"
                >
                  Return to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    router.push('/app');
                  }}
                  className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-base cursor-pointer outline-none border border-white/10 active:scale-98 transition-all"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <Link
                href="/app"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent-green to-accent-sapphire hover:brightness-110 text-white font-semibold text-base cursor-pointer outline-none focus:ring-2 focus:ring-accent-sapphire active:scale-98 transition-all shadow-[0_0_20px_rgba(34,197,94,0.25)] border border-white/10 flex items-center justify-center"
              >
                Begin Your Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}

            {/* Demo Link for Judges */}
            <DemoModeToggle />
          </m.div>
        </div>
      </div>

      {/* Interactive Sandbox Showcase */}
      <div className="w-full max-w-5xl px-6 pb-20">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MiniSandbox />
        </m.div>
      </div>

      {/* Bento Grid Showcase */}
      <section className="w-full max-w-5xl px-6 pb-24 space-y-8">
        <div className="text-left max-w-xl">
          <span className="text-[10px] text-accent-sapphire uppercase tracking-widest font-black">Engineering Transparency</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1 font-display">
            Under the Hood of Your Twin
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Carbon Twin AI combines local-first security with reproducible environmental science.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Why Digital Twins */}
          <m.div 
            whileHover={{ y: -4 }}
            className="md:col-span-2 p-6 rounded-3xl bg-neutral-900/35 border border-white/5 backdrop-blur-xl flex flex-col justify-between space-y-6 text-left"
          >
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">What is a Climate Digital Twin?</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Just as aeronautical engineers use digital twins to run virtual diagnostics on physical turbines, Carbon Twin AI maps your real-life actions into an active simulation clone. You can run mock habit adjustments, commute toggles, and diet changes to forecast environmental offsets safely in a virtual environment.
              </p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Digital Cloning</span>
              <Link href="/about" className="text-xs font-bold text-white hover:text-emerald-400 flex items-center gap-1 transition-colors">
                Learn About Twin Physics <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </m.div>

          {/* Card 2: Deterministic Science */}
          <m.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-neutral-900/35 border border-white/5 backdrop-blur-xl flex flex-col justify-between space-y-6 text-left"
          >
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Legit Science Core</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Our twin engine uses unit-tested, deterministic calculations backed by UK Defra (2024) transport constants, Poore & Nemecek (2018 Science) food lifecycle LCAs, and the IEA grid indices. 
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex justify-between items-center">
              <code className="text-[10px] text-emerald-400 font-mono">E = Activity * Factor</code>
              <Link href="/science" className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
                Read Science <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </m.div>

          {/* Card 3: Privacy by Design */}
          <m.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-neutral-900/35 border border-white/5 backdrop-blur-xl flex flex-col justify-between space-y-4 text-left"
          >
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Zero Server Footprint</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your lifestyle inputs and simulation phases are stored entirely locally using your browser&apos;s persistent storage. No remote database, no user accounts, and absolutely zero web analytics or tracking.
              </p>
            </div>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full w-fit">100% Client-Side</span>
          </m.div>

          {/* Card 4: Scientific Boundaries */}
          <m.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-neutral-900/35 border border-white/5 backdrop-blur-xl flex flex-col justify-between space-y-4 text-left"
          >
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Paris Alignment Targets</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Carbon Twin&apos;s theme is anchored directly to the 1.5°C Paris Agreement emissions boundary. To help visualize limits, users must work to transition their twin below the 2.3 tonne annual cap.
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full w-fit">Paris Threshold: 2.3t</span>
          </m.div>

          {/* Card 5: AI Narration Core */}
          <m.div 
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-neutral-900/35 border border-white/5 backdrop-blur-xl flex flex-col justify-between space-y-4 text-left"
          >
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Narration over Invention</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                AI can hallucinate figures. To prevent this, Carbon Twin uses a hybrid pipeline: a deterministic science module calculates exact numbers, and the AI coach is limited to narrating and suggesting improvements.
              </p>
            </div>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full w-fit">Hybrid AI Guardrails</span>
          </m.div>
        </div>

        {/* The 4-Step Journey Sub-Section */}
        <div className="pt-12 border-t border-white/5 space-y-6">
          <h3 className="text-xl font-bold text-white font-display text-left">Your Journey In 4 Steps</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <div 
                key={step.num}
                className="p-5 rounded-2xl bg-neutral-900/25 border border-white/5 text-left space-y-2"
              >
                <span className="text-3xl font-black bg-gradient-to-r from-accent-green to-accent-sapphire bg-clip-text text-transparent font-mono">
                  {step.num}
                </span>
                <h4 className="text-xs font-bold text-white leading-tight">{step.title}</h4>
                <p className="text-[11px] text-text-secondary leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
