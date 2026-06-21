// src/components/landing/Header.tsx
'use client';
import Link from 'next/link';
import { useCarbonStore } from '@/store/carbon-store';

export default function Header() {
  const twin = useCarbonStore((state) => state.twin);

  return (
    <header className="w-full max-w-5xl px-6 py-6 flex items-center justify-between z-20">
      <div className="flex items-center">
        <Link href="/" className="text-xl md:text-2xl font-black bg-gradient-to-r from-accent-green via-accent-sapphire to-accent-emerald bg-clip-text text-transparent uppercase tracking-wider cursor-pointer select-none flex items-center gap-1.5">
          <span>Carbon Twin AI</span>
          <span className="text-[10px] font-black text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 px-1.5 py-0.5 rounded-md relative top-0.5 tracking-normal">TM</span>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-semibold text-neutral-300 shadow-sm">
        <Link href="/about" className="hover:text-accent-emerald transition-colors duration-200 cursor-pointer relative py-0.5 group">
          About
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-emerald transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <div className="w-[1px] h-3.5 bg-white/10"></div>
        <Link href="/science" className="hover:text-accent-emerald transition-colors duration-200 cursor-pointer relative py-0.5 group">
          Science
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-emerald transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </nav>

      <div className="flex items-center">
        <Link
          href="/app"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-green to-accent-emerald text-neutral-950 font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.35)] cursor-pointer duration-200"
        >
          {twin ? 'Go to Dashboard' : 'Launch Twin'}
        </Link>
      </div>
    </header>
  );
}
