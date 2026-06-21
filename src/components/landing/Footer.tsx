// src/components/landing/Footer.tsx
'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full max-w-5xl py-12 px-6 border-t border-white/5 text-center space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <span>© 2026 Carbon Twin AI<sup className="text-[8px] ml-0.5 select-none font-bold">TM</sup>. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-white transition-colors cursor-pointer">About</Link>
          <Link href="/science" className="hover:text-white transition-colors cursor-pointer">Science</Link>
        </div>
      </div>
      <p className="text-[10px] text-neutral-600 max-w-xl mx-auto leading-relaxed">
        Disclaimer: Carbon Twin AI model provides educational estimates based on regional and global emission averages. It does not constitute a certified environmental audit. All user data remains locally inside the browser.
      </p>
    </footer>
  );
}
