// src/hooks/useShiftSimulator.ts
import { useCarbonStore } from '@/store/carbon-store';
import { calculateProjections, calculateConsequences } from '@/lib/carbon-engine';

export function useShiftSimulator() {
  const simulatedScore = useCarbonStore((state) => state.simulator.simulatedScore);
  const baselineScore = useCarbonStore((state) => state.simulator.baselineScore);

  const simulatedProjections = calculateProjections(simulatedScore);
  const baselineProjections = calculateProjections(baselineScore);

  const simulatedConsequences = calculateConsequences(simulatedScore);
  const baselineConsequences = calculateConsequences(baselineScore);

  return {
    simulatedScore,
    baselineScore,
    simulatedProjections,
    baselineProjections,
    simulatedConsequences,
    baselineConsequences
  };
}
