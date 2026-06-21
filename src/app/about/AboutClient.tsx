// src/app/about/AboutClient.tsx
'use client';
import { LazyMotion, domMax, MotionConfig, m } from 'framer-motion';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Cpu, ShieldCheck, Scale, BookOpen, Heart, Globe, Users, Lock, Database } from 'lucide-react';
import { useState } from 'react';

const PRINCIPLES = [
  {
    title: 'Algorithmic Grounding',
    desc: 'All carbon footprints and simulator adjustments are driven by pure, unit-tested TypeScript functions. Language models are strictly limited to narrative context.',
    icon: Cpu,
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/25 text-blue-400'
  },
  {
    title: 'Local Privacy Model',
    desc: 'Quiz responses, simulator preferences, and avatar states are stored directly in local browser storage. We do not host user databases or track usage behavior.',
    icon: ShieldCheck,
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/25 text-emerald-400'
  },
  {
    title: 'Planetary Thresholds',
    desc: 'Emissions classifications map to visual color tiers derived from climate bounds, with the green target anchored to the Paris 1.5°C threshold.',
    icon: Scale,
    color: 'from-amber-500/10 to-orange-500/10 border-amber-500/25 text-amber-400'
  },
  {
    title: 'Informative Context',
    desc: 'Calculations provide educational estimates using global and regional datasets, highlighting high-impact categories rather than providing a formal audit.',
    icon: BookOpen,
    color: 'from-purple-500/10 to-pink-500/10 border-purple-500/25 text-purple-400'
  }
];

export default function AboutClient() {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'flow' | 'stats'>('flow');

  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">
        <main className="min-h-screen relative bg-bg-primary overflow-x-hidden flex flex-col items-center bg-mesh text-white">
          <Header />

          {/* Hero Header */}
          <div className="w-full max-w-5xl px-6 py-20 text-center space-y-6 relative z-10">
            <m.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-400 mb-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Version 2.0 Digital Twin Platform</span>
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-none"
            >
              The Science of Your{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                Digital Clone
              </span>
            </m.h1>
            
            <m.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
            >
              Our platform maps personal routines to established planetary boundaries. Learn how our codebase computes your ecological footprint and encourages sustainable transitions.
            </m.p>
          </div>

          {/* Bento Grid Layout */}
          <div className="w-full max-w-5xl px-6 pb-28 space-y-8 z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Concept Bento Block */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-8 p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/25 transition-all duration-300 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Cpu className="w-5 h-5 animate-pulse" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display">The Concept Behind Your Environmental Twin</h2>
                  </div>
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-sans">
                    Industrial systems utilize virtual simulation models—known as digital clones—to forecast structural performance and test operational adjustments safely in a sandbox environment before making alterations to physical hardware.
                  </p>
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-sans">
                    We apply this concept to personal environmental impact. By analyzing transport profiles, dietary habits, home power sources, and shopping parameters, our engine maps out a virtual reflection of your emissions to predict how lifestyle changes will impact your footprint.
                  </p>
                </div>

                {/* Micro-interactive switcher inside bento */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between mt-2">
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveInteractiveTab('flow')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                        activeInteractiveTab === 'flow' 
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Sync Flow
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInteractiveTab('stats')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                        activeInteractiveTab === 'stats' 
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Feedback Loop
                    </button>
                  </div>

                  <div className="text-xs font-mono text-neutral-400 text-center sm:text-right">
                    {activeInteractiveTab === 'flow' ? (
                      <span>Physical Actions <span className="text-emerald-400">→</span> Digital Model <span className="text-emerald-400">→</span> Aura Output</span>
                    ) : (
                      <span>Simulation Sandbox <span className="text-indigo-400">→</span> Dynamic Carbon Delta <span className="text-indigo-400">→</span> Habit Shift</span>
                    )}
                  </div>
                </div>
              </m.div>

              {/* Paris Limit Bento Block */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-4 p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl flex flex-col justify-between group hover:border-indigo-500/25 transition-all duration-300 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold font-display">Target 1.5°C</h2>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    To prevent irreversible warming, the Paris Agreement targets a limit of 1.5°C. This translates directly to an individual baseline goal.
                  </p>
                </div>

                <div className="space-y-3 mt-6">
                  {/* Progress comparisons */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-neutral-400">
                      <span>GLOBAL AVERAGE BASELINE</span>
                      <span>4.7t / yr</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-emerald-400">
                      <span>PARIS 1.5°C ALIGNED LIMIT</span>
                      <span>2.3t / yr</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '39%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-center text-neutral-400 font-mono">
                  Goal: Reduce footprint gap by <span className="text-emerald-400 font-bold">51%</span>
                </div>
              </m.div>

            </div>

            {/* Operating Principles Bento Block Header */}
            <div className="space-y-2 text-center pt-4">
              <h2 className="text-2xl font-extrabold font-display">Engine Architecture & Values</h2>
              <p className="text-sm text-text-secondary font-sans max-w-xl mx-auto">Four core standards designed directly into our software footprint engine.</p>
            </div>

            {/* Principles Cards in Bento layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {PRINCIPLES.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <m.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="p-6 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl hover:border-white/10 transition-all duration-300 flex flex-col justify-between gap-4 group hover:scale-[1.02]"
                  >
                    <div className={`p-3 rounded-2xl bg-gradient-to-br border w-fit shrink-0 ${p.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-white font-display group-hover:text-emerald-400 transition-colors">{p.title}</h3>
                      <p className="text-[11px] text-text-secondary leading-relaxed font-sans">{p.desc}</p>
                    </div>
                  </m.div>
                );
              })}
            </div>

            {/* Mission Bento Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
              
              {/* Mission Card */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-7 p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl flex flex-col justify-between gap-6 group hover:border-pink-500/25 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display">Core Objective</h2>
                  </div>
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-sans">
                    Large-scale ecological math can often feel abstract and difficult to translate into daily life. This codebase was built to turn global carbon statistics into direct personal agency.
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed font-sans">
                    By rendering your footprint as an interactive virtual model with a responsive visual aura, we help identify high-leverage changes where routine shifts make a real difference.
                  </p>
                </div>
              </m.div>

              {/* Security and Openness Card */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="md:col-span-5 p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl flex flex-col justify-between gap-6 group hover:border-teal-500/25 transition-all duration-300 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold font-display">Data Architecture</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="p-1.5 rounded-lg bg-neutral-800 border border-white/5 text-neutral-300 mt-0.5">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono">Secure Client Storage</h4>
                        <p className="text-[10px] text-text-secondary leading-relaxed mt-0.5">All quiz parameters and simulation configurations are stored strictly within local browser memory.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="p-1.5 rounded-lg bg-neutral-800 border border-white/5 text-neutral-300 mt-0.5">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono">Zero Telemetry Harvesting</h4>
                        <p className="text-[10px] text-text-secondary leading-relaxed mt-0.5">This platform operates without advertising trackers, performance cookies, or external analytics integrations.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>

            </div>

          </div>

          <Footer />
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
