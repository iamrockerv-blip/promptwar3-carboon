import { QuizAnswer, CarbonBreakdown } from '@/types';
import { 
  calculateScore, 
  assignAura, 
  calculateBreakdown, 
  calculateProjections, 
  calculateConsequences, 
  calculateGreenFuture,
  calculateWithShifts 
} from '@/lib/carbon-engine';
import { getAvailableShifts } from '@/lib/simulator-options';

/**
 * Calculates all baseline twin metrics derived directly from quiz answers.
 */
export function calculateTwinBaseline(answers: QuizAnswer[]) {
  const score = calculateScore(answers);
  const aura = assignAura(score);
  const breakdown = calculateBreakdown(answers);
  const projections = calculateProjections(score);
  const consequences = calculateConsequences(score);
  const greenFuture = calculateGreenFuture(score, breakdown, answers);

  return { score, aura, breakdown, projections, consequences, greenFuture };
}

/**
 * Calculates all simulator metrics based on active habit shifts and quest offsets.
 */
export function calculateSimulatorMetrics(
  breakdown: CarbonBreakdown,
  activeShifts: string[],
  quizAnswers: QuizAnswer[],
  baselineScore: number,
  carbonSavedTonnes: number = 0
) {
  const availableShifts = getAvailableShifts(quizAnswers, breakdown);
  const enabledShiftsList = availableShifts.map((shift) => ({
    ...shift,
    enabled: activeShifts.includes(shift.id)
  }));

  const { score: rawSimulatedScore } = calculateWithShifts(
    breakdown,
    enabledShiftsList
  );

  const simulatedScore = Math.max(0.1, Math.round((rawSimulatedScore - carbonSavedTonnes) * 1000) / 1000);
  const simulatedAura = assignAura(simulatedScore);
  const totalReduction = Math.round((baselineScore - simulatedScore) * 10) / 10;

  return {
    activeShifts,
    simulatedScore,
    simulatedAura,
    baselineScore,
    totalReduction
  };
}
