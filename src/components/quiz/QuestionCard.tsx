// src/components/quiz/QuestionCard.tsx
'use client';
import { useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { QuizQuestion, QuizOption } from './questions';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedOptionValue?: string | number;
  onSelect: (option: QuizOption) => void;
}

/**
 * QuestionCard displays the active query alongside a list of large cards for selection.
 * Listens for key events (1-6) to support accessibility shortcuts.
 */
export default function QuestionCard({
  question,
  selectedOptionValue,
  onSelect
}: QuestionCardProps) {
  const onSelectRef = useRef(onSelect);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Listen for keyboard number shortcuts (1-6) to make selections
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const num = parseInt(event.key, 10);
      if (!isNaN(num) && num >= 1 && num <= question.options.length) {
        const option = question.options[num - 1];
        if (option) {
          onSelectRef.current(option);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question]);

  // Restore focus to the question title on question change
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [question.id]);

  const titleId = `quiz-question-title-${question.id}`;

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Question Title */}
      <h3 
        ref={titleRef}
        id={titleId}
        tabIndex={-1}
        className="text-xl md:text-2xl font-heading font-bold text-center text-text-primary leading-snug outline-none focus:outline-none"
      >
        {question.text}
      </h3>

      {/* Options Stack */}
      <m.div
        variants={{
          animate: { transition: { staggerChildren: 0.06 } }
        }}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3"
        role="radiogroup"
        aria-labelledby={titleId}
      >
        {question.options.map((option, index) => {
          const isSelected = option.value === selectedOptionValue;

          return (
            <m.button
              key={option.value}
              variants={{
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option)}
              className={`w-full text-left p-5 rounded-2xl flex items-center gap-5 border text-base outline-none cursor-pointer focus:ring-2 focus:ring-accent-sapphire transition-all duration-300 relative group overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-r from-accent-sapphire/20 to-accent-emerald/10 border-accent-emerald shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-neutral-900/40 border-white/5 hover:bg-neutral-900/70 hover:border-white/15'
              }`}
              aria-checked={isSelected}
              role="radio"
            >
              {/* Animated selection glow indicator inside the card */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-accent-emerald/5 to-transparent pointer-events-none" />
              )}

              {/* Keyboard Index Badge */}
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold tracking-wider text-text-secondary/40 group-hover:text-text-secondary/80 transition-colors hidden md:block uppercase">
                [Key {index + 1}]
              </span>

              {/* Option Icon */}
              <div 
                className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-tr from-accent-emerald/20 to-accent-sapphire/20 border-accent-emerald/30 scale-105' 
                    : 'bg-white/5 border-white/5 group-hover:bg-white/10 group-hover:border-white/10'
                }`}
                aria-hidden="true"
              >
                {option.icon}
              </div>

              {/* Label & Description */}
              <div className="flex flex-col gap-1 pr-16">
                <span className="font-extrabold text-white text-base md:text-lg leading-tight font-display group-hover:text-white transition-colors">
                  {option.label}
                </span>
                <span className="text-xs md:text-sm text-text-secondary leading-relaxed group-hover:text-neutral-300 transition-colors">
                  {option.description}
                </span>
              </div>
            </m.button>
          );
        })}
      </m.div>
    </div>
  );
}
