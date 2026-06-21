import { CarbonTwin, QuizAnswer, CarbonBreakdown, TimelineProjection, EarthConsequence, GreenFutureComparison, ChatMessage, CarbonAura } from '@/types';
import { getAvailableShifts } from '@/lib/simulator-options';
import { COACH_MESSAGES } from '@/lib/constants';

export function createFallbackTwin(
  score: number,
  aura: CarbonAura,
  breakdown: CarbonBreakdown,
  projections: TimelineProjection[],
  consequences: EarthConsequence,
  greenFuture: GreenFutureComparison,
  quizAnswers: QuizAnswer[]
): CarbonTwin {
  const allShifts = getAvailableShifts(quizAnswers, breakdown);
  const recommendations = allShifts.slice(0, 3).map((shift, i) => ({
    id: `fallback-rec-${i}`,
    category: shift.category,
    action: shift.label,
    impact: (shift.difficulty === 'hard' ? 'high' : shift.difficulty === 'moderate' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    co2Saved: shift.co2Reduction,
    difficulty: shift.difficulty,
    timeframe: 'short-term' as const
  }));

  return {
    id: `twin-fallback-${crypto.randomUUID()}`,
    score,
    aura,
    impactLevel: score <= 2.3 ? 'low' : score <= 4.7 ? 'moderate' : score <= 14.0 ? 'high' : 'critical',
    sustainabilityRating: Math.max(0, Math.min(100, Math.round((20 - score) * 5))),
    breakdown,
    projections,
    consequences,
    greenFuture,
    auraExplanation: `Based on your quiz answers, you have been assigned the ${aura.toUpperCase()} Aura. This indicates an annual footprint of ${score} tonnes of CO2e.`,
    lifeReplay: {
      narrative: `You emit ${score} tonnes of CO2e per year. Commuting, home energy, and shopping shape your digital twin. Transitioning your primary habits could decrease your carbon footprint drastically.`,
      chapters: allShifts.slice(0, 3).map(shift => ({
        title: shift.label,
        body: shift.description,
        icon: shift.icon,
        co2Contribution: shift.co2Reduction
      }))
    },
    recommendations,
    createdAt: new Date().toISOString()
  };
}

export function createFallbackCoachMessage(): ChatMessage {
  return {
    id: `msg-${Date.now()}-error`,
    sender: 'coach',
    text: COACH_MESSAGES.FALLBACK_ERROR,
    timestamp: new Date().toISOString()
  };
}
