// src/components/quiz/ProgressBar.tsx
'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

/**
 * A horizontal quiz progress indicator that renders dot milestones.
 * Fully responsive and accessible, reporting screen reader status updates.
 */
export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <progress 
        className="sr-only" 
        value={current + 1} 
        max={total} 
        aria-label="Quiz progress"
      />
      <span className="text-xs font-mono text-text-secondary tracking-widest uppercase">
        Question {current + 1} of {total}
      </span>
      <div className="flex items-center gap-2" aria-hidden="true">
        {Array.from({ length: total }).map((_, index) => {
          const isActive = index === current;
          const isCompleted = index < current;

          return (
            <div
              key={index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-6 bg-accent-sapphire'
                  : isCompleted
                  ? 'w-2.5 bg-accent-sapphire/50'
                  : 'w-2.5 bg-white/10'
              }`}
            />
          );
        })}
      </div>
      {/* Off-screen screen reader announcement */}
      <span className="sr-only" aria-live="polite">
        Question {current + 1} of {total} loaded.
      </span>
    </div>
  );
}
