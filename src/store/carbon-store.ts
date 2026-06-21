// src/store/carbon-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CarbonStore, QuizAnswer, ChatMessage, CarbonTwin, PurificationQuest } from '@/types';
import { DEMO_TWIN } from '@/lib/demo-data';
import { calculateScore, assignAura, calculateProjections, calculateConsequences } from '@/lib/carbon-engine';
import { getAvailableQuests } from '@/lib/quest-options';
import { COACH_MESSAGES } from '@/lib/constants';
import { generateTwinApi } from '@/services/twin-service';
import { sendCoachMessageApi } from '@/services/coach-service';
import { debouncedLocalStorage } from '@/lib/persistence';
import { logger } from '@/lib/logger';
import { createFallbackTwin, createFallbackCoachMessage } from '@/lib/fallback-data';
import { calculateTwinBaseline, calculateSimulatorMetrics } from '@/lib/twin-derivation';

const INITIAL_STATE = {
  phase: 'landing' as const,
  isDemoMode: false,
  quizAnswers: [] as QuizAnswer[],
  currentQuestion: 0,
  twin: null as CarbonTwin | null,
  coachMessages: [] as ChatMessage[],
  isGenerating: false,
  error: null as string | null,
  simulator: {
    activeShifts: [] as string[],
    simulatedScore: 0,
    simulatedAura: 'sapphire' as const,
    baselineScore: 0,
    baselineAura: 'sapphire' as const,
    totalReduction: 0
  },
  quests: [] as PurificationQuest[],
  totalCarbonSavedKg: 0
};

export const useCarbonStore = create<CarbonStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setPhase: (phase) => set({ phase }),

      activateDemoMode: () => {
        const demoAnswers: QuizAnswer[] = [
          { questionId: 'q1', category: 'transport', value: 'car_petrol' },
          { questionId: 'q2', category: 'diet', value: 'meat_regular' },
          { questionId: 'q3', category: 'energy', value: 'grid_gas' },
          { questionId: 'q4', category: 'travel', value: 'flights_1_2' },
          { questionId: 'q5', category: 'consumption', value: 'average' }
        ];

        set({
          isDemoMode: true,
          phase: 'aura-reveal',
          twin: DEMO_TWIN,
          quizAnswers: demoAnswers,
          quests: getAvailableQuests(demoAnswers),
          totalCarbonSavedKg: 0,
          coachMessages: [
            {
              id: 'welcome-demo',
              sender: 'coach',
              text: COACH_MESSAGES.WELCOME_DEMO,
              timestamp: new Date().toISOString()
            }
          ],
          simulator: {
            activeShifts: [],
            simulatedScore: DEMO_TWIN.score,
            simulatedAura: DEMO_TWIN.aura,
            baselineScore: DEMO_TWIN.score,
            baselineAura: DEMO_TWIN.aura,
            totalReduction: 0
          }
        });
      },

      answerQuestion: (answer) => {
        set((state) => {
          const filteredAnswers = state.quizAnswers.filter(
            (a) => a.questionId !== answer.questionId
          );
          return {
            quizAnswers: [...filteredAnswers, answer]
          };
        });
      },

      goToQuestion: (index) => set({ currentQuestion: index }),

      generateTwin: async () => {
        const { quizAnswers } = get();
        if (quizAnswers.length < 5) {
          set({ error: 'Please answer all questions before generating.' });
          return;
        }

        set({ phase: 'generating', isGenerating: true, error: null });

        try {
          // 1. Calculate deterministic baseline values locally
          const baseline = calculateTwinBaseline(quizAnswers);
          const { score, aura, breakdown, projections, consequences, greenFuture } = baseline;

          // 2. Initialize simulator state using the baseline
          const initialSimulator = {
            activeShifts: [],
            simulatedScore: score,
            simulatedAura: aura,
            baselineScore: score,
            baselineAura: aura,
            totalReduction: 0
          };

          // 3. Request narrative and personalized recommendations from API Service
          const aiResponse = await generateTwinApi(score, aura, breakdown, quizAnswers);

          const calculatedTwin: CarbonTwin = {
            id: `twin-${crypto.randomUUID()}`,
            score,
            aura,
            impactLevel: score <= 2.3 ? 'low' : score <= 4.7 ? 'moderate' : score <= 14.0 ? 'high' : 'critical',
            sustainabilityRating: Math.max(0, Math.min(100, Math.round((20 - score) * 5))), // Rating out of 100
            breakdown,
            projections,
            consequences,
            greenFuture,
            auraExplanation: aiResponse.auraExplanation,
            lifeReplay: aiResponse.lifeReplay,
            recommendations: aiResponse.recommendations,
            createdAt: new Date().toISOString()
          };

          set({
            twin: calculatedTwin,
            simulator: initialSimulator,
            quests: getAvailableQuests(quizAnswers),
            totalCarbonSavedKg: 0,
            phase: 'aura-reveal',
            isGenerating: false,
            coachMessages: [
              {
                id: 'welcome-coach',
                sender: 'coach',
                text: COACH_MESSAGES.WELCOME_COACH(calculatedTwin.aura),
                timestamp: new Date().toISOString()
              }
            ]
          });
        } catch (err) {
          logger.error('Failed to generate Carbon Twin via AI, using fallback:', err);
          
          // Fallback implementation
          const baseline = calculateTwinBaseline(quizAnswers);
          
          const fallbackTwin = createFallbackTwin(
            baseline.score,
            baseline.aura,
            baseline.breakdown,
            baseline.projections,
            baseline.consequences,
            baseline.greenFuture,
            quizAnswers
          );

          set({
            twin: fallbackTwin,
            quests: getAvailableQuests(quizAnswers),
            totalCarbonSavedKg: 0,
            simulator: {
              activeShifts: [],
              simulatedScore: baseline.score,
              simulatedAura: baseline.aura,
              baselineScore: baseline.score,
              baselineAura: baseline.aura,
              totalReduction: 0
            },
            phase: 'aura-reveal',
            isGenerating: false,
            coachMessages: [
              {
                id: 'welcome-coach-fallback',
                sender: 'coach',
                text: COACH_MESSAGES.WELCOME_COACH(fallbackTwin.aura),
                timestamp: new Date().toISOString()
              }
            ]
          });
        }
      },

      skipIntro: () => set({ phase: 'results' }),

      advanceToLifeReplay: () => set({ phase: 'life-replay' }),

      advanceToResults: () => set({ phase: 'results' }),

      sendCoachMessage: async (text) => {
        const userMsg: ChatMessage = {
          id: `msg-${Date.now()}-user`,
          sender: 'user',
          text,
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          coachMessages: [...state.coachMessages, userMsg]
        }));

        try {
          const { twin, coachMessages } = get();
          
          const data = await sendCoachMessageApi(
            text,
            coachMessages,
            twin?.score,
            twin?.aura,
            twin?.lifeReplay.narrative
          );

          const coachMsg: ChatMessage = {
            id: `msg-${Date.now()}-coach`,
            sender: 'coach',
            text: data.text,
            timestamp: new Date().toISOString()
          };

          set((state) => ({
            coachMessages: [...state.coachMessages, coachMsg]
          }));
        } catch (err) {
          logger.error('Failed to get coach response:', err);
          set((state) => ({
            coachMessages: [...state.coachMessages, createFallbackCoachMessage()]
          }));
        }
      },

      reset: () => set(INITIAL_STATE),

      // ──────────────────────────────────────────────
      // Simulator Actions
      // ──────────────────────────────────────────────
      toggleShift: (shiftId) => {
        set((state) => {
          if (!state.twin) return {};

          const activeShifts = state.simulator.activeShifts.includes(shiftId)
            ? state.simulator.activeShifts.filter((id) => id !== shiftId)
            : [...state.simulator.activeShifts, shiftId];

          const simulator = calculateSimulatorMetrics(
            state.twin.breakdown,
            activeShifts,
            state.quizAnswers,
            state.simulator.baselineScore,
            0
          );

          return {
            simulator: {
              ...state.simulator,
              ...simulator
            }
          };
        });
      },

      resetSimulator: () => {
        set((state) => {
          if (!state.twin) return {};
          return {
            simulator: {
              ...state.simulator,
              activeShifts: [],
              simulatedScore: state.simulator.baselineScore,
              simulatedAura: state.simulator.baselineAura,
              totalReduction: 0
            }
          };
        });
      },

      completeQuest: (questId) => {
        set((state) => {
          if (!state.twin) return {};

          const updatedQuests = state.quests.map((q) =>
            q.id === questId ? { ...q, completed: !q.completed } : q
          );

          const totalCarbonSavedKg = updatedQuests
            .filter((q) => q.completed)
            .reduce((sum, q) => sum + q.co2SavedKg, 0);

          // Convert kg to tonnes (1 tonne = 1000 kg)
          const carbonSavedTonnes = totalCarbonSavedKg / 1000;

          // Adjust the twin's score by subtracting the carbon saved
          const originalScore = state.isDemoMode ? 7.2 : calculateScore(state.quizAnswers);
          const newScore = Math.max(0.1, Math.round((originalScore - carbonSavedTonnes) * 1000) / 1000);
          const newAura = assignAura(newScore);

          // Re-calculate other components that depend on the twin score
          const newProjections = calculateProjections(newScore);
          const newConsequences = calculateConsequences(newScore);

          const updatedTwin = {
            ...state.twin,
            score: newScore,
            aura: newAura,
            projections: newProjections,
            consequences: newConsequences
          };

          // Recalculate simulator based on updatedTwin breakdown
          const simulator = calculateSimulatorMetrics(
            updatedTwin.breakdown,
            state.simulator.activeShifts,
            state.quizAnswers,
            newScore,
            carbonSavedTonnes
          );

          return {
            quests: updatedQuests,
            totalCarbonSavedKg,
            twin: updatedTwin,
            simulator: {
              ...state.simulator,
              ...simulator
            }
          };
        });
      },

      resetQuests: () => {
        set((state) => {
          if (!state.twin) return {};
          const updatedQuests = state.quests.map((q) => ({ ...q, completed: false }));
          
          const originalScore = state.isDemoMode ? 7.2 : calculateScore(state.quizAnswers);
          const newAura = assignAura(originalScore);
          const newProjections = calculateProjections(originalScore);
          const newConsequences = calculateConsequences(originalScore);

          const updatedTwin = {
            ...state.twin,
            score: originalScore,
            aura: newAura,
            projections: newProjections,
            consequences: newConsequences
          };

          const simulator = calculateSimulatorMetrics(
            updatedTwin.breakdown,
            state.simulator.activeShifts,
            state.quizAnswers,
            originalScore,
            0
          );

          return {
            quests: updatedQuests,
            totalCarbonSavedKg: 0,
            twin: updatedTwin,
            simulator: {
              ...state.simulator,
              ...simulator
            }
          };
        });
      },

      updateTwinAnswers: (category, value) => {
        set((state) => {
          if (!state.twin) return {};

          // 1. Update quizAnswers state
          const updatedAnswers = state.quizAnswers.map((a) =>
            a.category === category ? { ...a, value } : a
          );

          // 2. Recalculate baseline values locally
          const baseline = calculateTwinBaseline(updatedAnswers);
          const { score, aura, breakdown, projections, consequences, greenFuture } = baseline;

          // 3. Recalculate quests (re-evaluate available quests based on updated answers)
          const quests = getAvailableQuests(updatedAnswers);
          
          // 4. Reset total carbon saved since quests are reset
          const totalCarbonSavedKg = 0;

          // 5. Recalculate simulator with the active shifts
          const simulator = calculateSimulatorMetrics(
            breakdown,
            state.simulator.activeShifts,
            updatedAnswers,
            score,
            0
          );

          const updatedTwin = {
            ...state.twin,
            score,
            aura,
            breakdown,
            projections,
            consequences,
            greenFuture,
            impactLevel: (score <= 2.3 ? 'low' : score <= 4.7 ? 'moderate' : score <= 14.0 ? 'high' : 'critical') as 'low' | 'moderate' | 'high' | 'critical',
            sustainabilityRating: Math.max(0, Math.min(100, Math.round((20 - score) * 5))),
            auraExplanation: `Adjusted profile: assigned the ${aura.toUpperCase()} Aura with an annual footprint of ${score} tonnes of CO2e.`,
            lifeReplay: {
              ...state.twin.lifeReplay,
              narrative: `Based on your updated profile details, you emit ${score} tonnes of CO2e per year.`
            }
          };

          return {
            quizAnswers: updatedAnswers,
            quests,
            totalCarbonSavedKg,
            twin: updatedTwin,
            simulator: {
              ...state.simulator,
              ...simulator
            }
          };
        });
      }
    }),
    {
      name: 'carbon-store-v2',
      storage: createJSONStorage(() => debouncedLocalStorage)
    }
  )
);
