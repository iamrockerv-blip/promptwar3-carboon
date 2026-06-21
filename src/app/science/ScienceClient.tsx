// src/app/science/ScienceClient.tsx
'use client';
import { LazyMotion, domMax, MotionConfig, m } from 'framer-motion';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { BookOpen, Scale, AlertTriangle, HelpCircle, ArrowRight, Car, Salad, Zap, Plane } from 'lucide-react';
import { useState } from 'react';

const FACTORS = {
  transport: {
    icon: Car,
    title: 'Transport Coefficients',
    items: [
      { label: 'Petrol Car', value: 0.17, unit: 'kg CO₂e / km', source: 'UK Defra 2024 (Passenger Vehicles average)', color: 'bg-red-500' },
      { label: 'Electric Car', value: 0.05, unit: 'kg CO₂e / km', source: 'UK Defra 2024 (Battery Electric Vehicle)', color: 'bg-emerald-500' },
      { label: 'Public Transit', value: 0.07, unit: 'kg CO₂e / km', source: 'UK Defra 2024 (National Rail & bus average)', color: 'bg-indigo-500' },
      { label: 'Bike / Walk', value: 0.00, unit: 'kg CO₂e / km', source: 'Zero direct combustion emissions', color: 'bg-slate-500' }
    ]
  },
  diet: {
    icon: Salad,
    title: 'Dietary Footprint Lifecycle (LCA)',
    items: [
      { label: 'Beef / Lamb Meal', value: 6.60, unit: 'kg CO₂e / serving', source: 'Poore & Nemecek (2018, Science, ruminant LCA)', color: 'bg-red-500' },
      { label: 'Poultry / Pork Meal', value: 1.80, unit: 'kg CO₂e / serving', source: 'Poore & Nemecek (2018, poultry serving LCA)', color: 'bg-orange-500' },
      { label: 'Vegetarian Meal', value: 0.90, unit: 'kg CO₂e / serving', source: 'Poore & Nemecek (2018, vegetarian serving LCA)', color: 'bg-teal-500' },
      { label: 'Vegan Meal', value: 0.70, unit: 'kg CO₂e / serving', source: 'Poore & Nemecek (2018, vegan serving LCA)', color: 'bg-emerald-500' }
    ]
  },
  energy: {
    icon: Zap,
    title: 'Residential Utility Constants',
    items: [
      { label: 'Grid Electricity & Gas Heating', value: 1.0, unit: 'intensity factor index', source: 'IEA / EPA regional grid averages', color: 'bg-amber-500' },
      { label: 'Green Electricity & Heat Pump', value: 0.1, unit: 'intensity factor index', source: 'Zero-carbon local generation baseline', color: 'bg-emerald-500' }
    ]
  },
  travel: {
    icon: Plane,
    title: 'Aviation Flight Constants',
    items: [
      { label: 'Short Flight (< 3h)', value: 150, unit: 'kg CO₂e / flight', source: 'Defra flight emissions averages', color: 'bg-yellow-500' },
      { label: 'Long Flight (> 3h)', value: 800, unit: 'kg CO₂e / flight', source: 'Defra long-haul economy factors', color: 'bg-red-500' }
    ]
  }
};

const AURAS = [
  { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', name: 'Green (Optimal)', range: '< 2.3 t CO₂e / year', target: 'Conforms to global sustainability benchmarks for limiting warming' },
  { color: 'text-green-400 bg-green-400/10 border-green-400/20', name: 'Emerald (Sustainable Average)', range: '2.3 - 4.7 t CO₂e / year', target: 'Fits below median targets, on track for transition' },
  { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', name: 'Sapphire (Transition Zone)', range: '4.7 - 8.0 t CO₂e / year', target: 'Typical regional emission rates, optimization recommended' },
  { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', name: 'Amber (High Intensity)', range: '8.0 - 14.0 t CO₂e / year', target: 'Exceeds standard limits, key reduction areas flagged' },
  { color: 'text-red-400 bg-red-400/10 border-red-400/20', name: 'Crimson (Extreme Footprint)', range: '> 14.0 t CO₂e / year', target: 'Highly resource-intensive profile, immediate shifts required' }
];

export default function ScienceClient() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof FACTORS>('transport');

  const selectedCategoryData = FACTORS[activeCategory];
  const CategoryIcon = selectedCategoryData.icon;

  // Max value in active category for relative width calculations
  const maxVal = Math.max(...selectedCategoryData.items.map(i => i.value), 0.1);

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
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              <span>Verifiable Scientific Sources</span>
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight"
            >
              Our Calculation{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                Science
              </span>
            </m.h1>
            
            <m.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
            >
              We prioritize scientific clarity. Review the math formulas, emission coefficients, and reference databases that power our simulation models.
            </m.p>
          </div>

          {/* Core Calculation Container */}
          <div className="w-full max-w-5xl px-6 pb-28 space-y-8 z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Equation Bento Card */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-12 p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl space-y-6 hover:border-indigo-500/25 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display">Reproducible Math Formulas</h2>
                </div>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-sans max-w-3xl">
                  Our computation core is built using static algorithms in TypeScript. There are no AI estimates, guesses, or generative models editing your metrics—language models are restricted to explaining the calculated breakdown.
                </p>
                
                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs md:text-sm text-indigo-400 text-center flex flex-col md:flex-row gap-4 items-center justify-center">
                  <span className="font-extrabold text-neutral-300">Total Output (tonnes CO₂e / year)</span>
                  <ArrowRight className="w-4 h-4 text-neutral-500 hidden md:block" />
                  <span className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-emerald-400 font-extrabold">
                    Σ (Activity Metrics × Carbon Coefficient)
                  </span>
                </div>
              </m.div>

              {/* Factors Explorer (Interactive Bento) */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-7 p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl hover:border-emerald-500/25 transition-all duration-300 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold font-display">Carbon Coefficient Registry</h2>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Select an environmental sector to examine the intensity factors and data origins:
                  </p>

                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Object.entries(FACTORS).map(([key, data]) => {
                      const Icon = data.icon;
                      const isActive = activeCategory === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveCategory(key as keyof typeof FACTORS)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                              : 'bg-white/5 border border-white/5 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="capitalize">{key}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Factors List inside Bento */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono flex items-center gap-2">
                    <CategoryIcon className="w-4 h-4 text-emerald-400" />
                    {selectedCategoryData.title}
                  </h3>

                  <div className="space-y-3">
                    {selectedCategoryData.items.map((item) => {
                      // Calc percentage for relative width
                      const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
                      return (
                        <div key={item.label} className="space-y-1">
                          <div className="flex justify-between text-xs items-baseline gap-2">
                            <span className="text-white font-medium">{item.label}</span>
                            <div className="text-right">
                              <span className="text-emerald-400 font-extrabold font-mono">{item.value}</span>
                              <span className="text-[10px] text-neutral-400 ml-1">{item.unit}</span>
                            </div>
                          </div>
                          <div className="h-1.5 w-full bg-neutral-950/60 rounded-full overflow-hidden flex items-center">
                            <m.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                              className={`h-full rounded-full ${item.color}`}
                            />
                          </div>
                          <p className="text-[9px] text-neutral-500 font-sans italic">{item.source}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </m.div>

              {/* Aura Boundaries Bento Card */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="md:col-span-5 p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl hover:border-indigo-500/25 transition-all duration-300 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold font-display">Aura Classifications</h2>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Deterministic score ranges mapped to sustainability feedback levels:
                  </p>
                </div>

                <div className="divide-y divide-white/5 border border-white/5 rounded-2xl overflow-hidden bg-black/25 text-xs">
                  {AURAS.map((a) => (
                    <div key={a.name} className="p-3.5 flex flex-col gap-1.5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${a.color}`}>
                          {a.name}
                        </span>
                        <span className="text-white font-extrabold font-mono text-xs">{a.range}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-sans leading-normal">{a.target}</span>
                    </div>
                  ))}
                </div>
              </m.div>

            </div>

            {/* Disclaimer & Limitations */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl border border-yellow-500/10 bg-yellow-500/5 text-yellow-300/90 flex gap-4 items-start text-xs sm:text-sm leading-relaxed"
            >
              <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-400 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-bold font-display">Scope & Computation Boundaries</h4>
                <p className="font-sans text-neutral-300 leading-relaxed text-xs">
                  This platform functions strictly as an educational simulator. The calculated values represent estimates of Scope 1 (direct travel emissions) and Scope 2 (residential utility usage) footprints based on public datasets. This model is not an official environmental audit and does not track the complex supply chains of physical consumer products, food waste, or micro-waste streams.
                </p>
              </div>
            </m.div>

          </div>

          <Footer />
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
