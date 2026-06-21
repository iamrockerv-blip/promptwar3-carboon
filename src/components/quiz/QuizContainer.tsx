// src/components/quiz/QuizContainer.tsx
'use client';
import { m, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCarbonStore } from '@/store/carbon-store';
import { QUIZ_QUESTIONS, QuizOption } from './questions';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';

/**
 * QuizContainer mounts the ProgressBar, active QuestionCard, and handles navigation.
 * Fires twin generation upon completing the 5th question.
 */
export default function QuizContainer() {
  const router = useRouter();
  const currentQuestion = useCarbonStore((state) => state.currentQuestion);
  const quizAnswers = useCarbonStore((state) => state.quizAnswers);
  const answerQuestion = useCarbonStore((state) => state.answerQuestion);
  const goToQuestion = useCarbonStore((state) => state.goToQuestion);
  const generateTwin = useCarbonStore((state) => state.generateTwin);

  const activeQuestion = QUIZ_QUESTIONS[currentQuestion];

  // Retrieve current selection if user returned to a previously answered question
  const currentAnswer = quizAnswers.find(
    (a) => a.questionId === activeQuestion?.id
  );

  const handleSelectOption = (option: QuizOption) => {
    // 1. Record answer in Zustand
    answerQuestion({
      questionId: activeQuestion.id,
      category: activeQuestion.category,
      value: option.value
    });

    // 2. Animate and advance after 200ms
    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        goToQuestion(currentQuestion + 1);
      } else {
        // Last question completed, trigger Twin calculation + narrative generation
        generateTwin();
      }
    }, 200);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      goToQuestion(currentQuestion - 1);
    } else {
      // Go back to landing page
      router.push('/');
    }
  };

  if (!activeQuestion) return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 px-4 py-8 items-center min-h-[600px] justify-center relative">
      
      {/* Back arrow navigator */}
      <button
        type="button"
        onClick={handleBack}
        className="absolute left-4 top-8 p-2 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 text-sm font-medium focus:ring-2 focus:ring-accent-sapphire border border-transparent hover:border-white/5"
        aria-label="Go back to the previous screen"
      >
        ← Back
      </button>

      {/* Progress Dots */}
      <ProgressBar current={currentQuestion} total={QUIZ_QUESTIONS.length} />

      {/* Sliding animation wrapper for active QuestionCard */}
      <div className="w-full overflow-hidden min-h-[420px] flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <m.div
            key={activeQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full"
          >
            <QuestionCard
              question={activeQuestion}
              selectedOptionValue={currentAnswer?.value}
              onSelect={handleSelectOption}
            />
          </m.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
