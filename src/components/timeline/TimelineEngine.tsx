// src/components/timeline/TimelineEngine.tsx
'use client';

import { useEffect, useState } from 'react';
import { useCarbonStore } from '@/store/carbon-store';
import { useShiftSimulator } from '@/hooks/useShiftSimulator';
import dynamic from 'next/dynamic';

const TimelineChart = dynamic(() => import('./TimelineChart'), { ssr: false });
import { Calendar, AlertTriangle, Trees, Leaf } from 'lucide-react';

export default function TimelineEngine() {
  const { 
    baselineProjections, 
    simulatedProjections, 
    simulatedScore, 
    baselineScore 
  } = useShiftSimulator();
  const twin = useCarbonStore((state) => state.twin);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Check if simulated has actually changed from baseline
  const isSimulatedActive = Math.abs(simulatedScore - baselineScore) > 0.05;

  // Combine projections for charting
  const chartData = baselineProjections.map((proj, idx) => {
    const simProj = simulatedProjections[idx];
    return {
      yearLabel: `Year ${proj.year}`,
      'Baseline Path': proj.cumulativeTonnes,
      'Simulated Path': isSimulatedActive ? simProj.cumulativeTonnes : undefined
    };
  });

  const currentProjection = isSimulatedActive ? simulatedProjections : baselineProjections;
  // Let's grab the 10-year node
  const node10Yr = currentProjection[3];

  return (
    <div 
      id="timeline-engine" 
      className="w-full"
    >
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Decade Projection Engine
            </h3>
            <p className="text-sm text-neutral-400 mt-1">
              Visualizing the cumulative footprint of your lifestyle over the next 10 years.
            </p>
          </div>
          
          {isSimulatedActive && (
            <div className="px-4 py-2 rounded-2xl bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
              ⚡ Live Sim Sync Active
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 relative h-80 w-full" style={{ minWidth: 0 }}>
            {mounted ? (
              <TimelineChart data={chartData} isSimulatedActive={isSimulatedActive} />
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500">
                Loading projections...
              </div>
            )}
          </div>

          {/* 10 Year Cumulative Highlights */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
              <h4 className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                10-Year Cumulative Impact
              </h4>
              <p className="text-4xl font-black text-white mt-2">
                {node10Yr.cumulativeTonnes.toFixed(1)}
                <span className="text-base font-normal text-neutral-400 ml-1">tonnes CO₂e</span>
              </p>
              <p className="text-xs text-neutral-400 mt-2">
                This represents the weight of {Math.round(node10Yr.cumulativeTonnes / 6)} average passenger cars.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-start gap-3">
                <Trees className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Trees Required</p>
                  <p className="text-lg font-black text-white mt-0.5">
                    {node10Yr.treesRequired.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Saplings growing for 10 years to offset this emission.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-white/5 pt-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Sea Level Contribution</p>
                  <p className="text-lg font-black text-white mt-0.5">
                    {node10Yr.seaLevelContribution_mm.toFixed(3)}
                    <span className="text-xs font-normal text-neutral-400 ml-1">mm</span>
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Added to global sea levels due to melting ice caps.
                  </p>
                </div>
              </div>
            </div>

            {twin?.greenFuture && (
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                <h4 className="text-xs text-emerald-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5" /> Target Optimized Path
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2 rounded-xl bg-white/5 text-center">
                    <p className="text-[9px] text-neutral-500 uppercase tracking-wider">5-Yr Savings</p>
                    <p className="text-sm font-extrabold text-white">
                      ${twin.greenFuture.moneySaved.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 text-center">
                    <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Health Rating</p>
                    <p className="text-sm font-extrabold text-white">
                      {twin.greenFuture.improvedFuture.healthScore}/100
                    </p>
                  </div>
                </div>
                <p className="text-[9px] text-neutral-500 text-center leading-tight">
                  Adopting green choices helps reduce expenses and boost vitality.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
