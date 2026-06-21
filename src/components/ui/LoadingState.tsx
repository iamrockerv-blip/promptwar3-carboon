// src/components/ui/LoadingState.tsx
'use client';
import { useState, useEffect } from 'react';
import { m } from 'framer-motion';

const DIAGNOSTIC_LOGS = [
  ">> [SYS] INITIALIZING DIGITAL TWIN ENGINE MATRIX...",
  ">> [SYS] MOUNTING LIFESTYLE DATA STRUCTURES...",
  ">> [SYS] RUNNING COMPARATIVE LIFE CYCLE ASSESSMENTS...",
  ">> [SYS] LOADING UK DEFRA 2024 TRANSPORT INDICES...",
  ">> [SYS] PARSING POORE & NEMECEK (2018 SCIENCE) LCA DATA...",
  ">> [SYS] RESOLVING IEA NATIONAL GRID CARBON COEFFICIENTS...",
  ">> [SYS] SIMULATING DECADE EMISSIONS ACCUMULATION...",
  ">> [SYS] COMPILING ATMOSPHERE MELT PROJECTIONS...",
  ">> [SYS] CALCULATING CARBON AURA Paris-1.5°C COMPLIANCE...",
  ">> [SYS] INJECTING AI CARBON COACH STRATEGY NODE...",
  ">> [SYS] SYNCHRONIZING CLIENT-SIDE LOCAL STORAGE STATE...",
  ">> [SYS] DIGITAL TWIN GENERATION COMPLETE. READY TO CHOOSE CORE."
];

export default function LoadingState() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  useEffect(() => {
    if (activeLogIndex < DIAGNOSTIC_LOGS.length) {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, DIAGNOSTIC_LOGS[activeLogIndex]]);
        setActiveLogIndex((prev) => prev + 1);
      }, 450 + Math.random() * 250); // Slightly varied typing speed
      return () => clearTimeout(timer);
    }
  }, [activeLogIndex]);

  return (
    <div className="w-full min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Mesh Background Overlay */}
      <div className="absolute inset-0 bg-mesh opacity-45 pointer-events-none" />

      {/* Cybernetic Terminal Console */}
      <div className="w-full max-w-xl p-6 rounded-3xl bg-black/80 border border-emerald-500/25 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.08)] flex flex-col gap-5 relative z-10 font-mono text-left">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            Twin Compiling Console v2.0
          </span>
        </div>

        {/* Loading Ring overlaying the diagnostic output */}
        <div className="flex items-center gap-4 py-2 px-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="relative w-8 h-8 shrink-0">
            <m.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full rounded-full border-2 border-white/5 border-t-emerald-400"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {activeLogIndex < DIAGNOSTIC_LOGS.length ? 'Compiling Lifestyle Clone...' : 'Completing Setup...'}
            </h4>
            <p className="text-[10px] text-neutral-400 truncate mt-0.5">
              Please wait while the simulation model builds.
            </p>
          </div>
        </div>

        {/* Terminal Logs Output Stream */}
        <div className="h-64 overflow-y-auto bg-black/60 p-4 rounded-xl border border-white/5 flex flex-col gap-2 font-mono text-[11px] text-emerald-400 select-none scrollbar-none">
          {logs.map((log) => (
            <div key={log} className="leading-relaxed">
              <span className="text-emerald-500 font-bold">{log}</span>
            </div>
          ))}
          {/* Typing caret animation for the active line */}
          {activeLogIndex < DIAGNOSTIC_LOGS.length && (
            <div className="flex items-center gap-1">
              <span className="text-emerald-500/60 font-bold">&gt;&gt; [SYS] Processing node...</span>
              <span className="w-1.5 h-3 bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
