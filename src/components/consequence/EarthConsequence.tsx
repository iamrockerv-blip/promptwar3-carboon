// src/components/consequence/EarthConsequence.tsx
'use client';

import { useState } from 'react';
import { useShiftSimulator } from '@/hooks/useShiftSimulator';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Flame, 
  Car, 
  Plane, 
  Trees, 
  Home,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function EarthConsequence() {
  const { simulatedConsequences } = useShiftSimulator();
  const [isOpen, setIsOpen] = useState(false);

  const c = simulatedConsequences;

  // Let's compute some comparison metrics for vivid visual storytelling
  const footballFieldsIce = Math.round(c.iceMelt_sqm / 5351); // 1 football field = ~5351 sqm
  const homesPowered = Math.round(c.energyConsumption_kwh / 10600); // 1 US home average = 10600 kWh/yr

  const cards = [
    {
      id: 'ice-melt',
      title: 'Glacier Collapse',
      value: `${c.iceMelt_sqm.toLocaleString()} m²`,
      detail: `Equivalent to melting ${footballFieldsIce > 0 ? footballFieldsIce : '< 1'} football fields of Arctic ice every year.`,
      icon: Flame,
      color: 'text-orange-400',
      bgGlow: 'rgba(251, 146, 60, 0.05)'
    },
    {
      id: 'cars',
      title: 'Vehicular Force',
      value: c.carsEquivalent.toLocaleString(),
      detail: 'Passenger cars driven continuously for a full year.',
      icon: Car,
      color: 'text-red-400',
      bgGlow: 'rgba(248, 113, 113, 0.05)'
    },
    {
      id: 'flights',
      title: 'Aviation Burden',
      value: c.flightsEquivalent.toLocaleString(),
      detail: 'One-way flights from London to New York.',
      icon: Plane,
      color: 'text-sky-400',
      bgGlow: 'rgba(56, 189, 248, 0.05)'
    },
    {
      id: 'homes',
      title: 'Grid Load',
      value: `${homesPowered.toLocaleString()} homes`,
      detail: 'Average households powered completely for an entire year.',
      icon: Home,
      color: 'text-yellow-400',
      bgGlow: 'rgba(250, 204, 21, 0.05)'
    },
    {
      id: 'trees',
      title: 'Offset Forest',
      value: c.treesRequired.toLocaleString(),
      detail: 'Mature trees needed to completely clean this footprint from the air.',
      icon: Trees,
      color: 'text-emerald-400',
      bgGlow: 'rgba(52, 211, 153, 0.05)'
    }
  ];

  return (
    <div 
      id="earth-consequence"
      className="w-full"
    >
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 mb-4">
            <Globe className="w-3.5 h-3.5" />
            Visceral Scale: 10,000x Amplification
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            If 10,000 People Lived Like You
          </h3>
          <p className="text-sm text-neutral-400 mt-2">
            Your single footprint multiplied by a small town. When actions scale, the footprint becomes a force of nature.
          </p>

          {!isOpen && (
            <m.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs font-semibold text-orange-400 mt-4 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 inline-block"
            >
              🔥 Annually: Melts <strong>{c.iceMelt_sqm.toLocaleString()} m²</strong> of Arctic ice and requires <strong>{c.treesRequired.toLocaleString()}</strong> offset trees.
            </m.div>
          )}
        </div>

        {/* Collapsible Action Trigger */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            {isOpen ? 'Hide Visual Details' : 'Show 10,000x Earth Impact Details'}
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Content Panel */}
        <AnimatePresence>
          {isOpen && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-2">
                {cards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <m.div
                      layout
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      style={{ backgroundColor: 'rgba(23, 23, 23, 0.4)', boxShadow: `0 4px 20px ${card.bgGlow}` }}
                      className="p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                            {card.title}
                          </h4>
                          <Icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        
                        <p className="text-2xl font-black text-white tracking-tight">
                          {card.value}
                        </p>
                      </div>

                      <p className="text-[11px] text-neutral-500 mt-4 leading-relaxed">
                        {card.detail}
                      </p>
                    </m.div>
                  );
                })}
              </div>

              <div className="mt-4 text-center border-t border-white/5 pt-4 text-xs text-neutral-500">
                Total annual footprint for this population: <span className="font-bold text-white">{(c.totalAnnualTonnes / 1000).toFixed(1)}k tonnes CO₂e</span>.
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
