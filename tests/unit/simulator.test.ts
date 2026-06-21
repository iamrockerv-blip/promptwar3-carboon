// tests/unit/simulator.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { calculateWithShifts } from '@/lib/carbon-engine';
import { getAvailableShifts } from '@/lib/simulator-options';
import { CarbonBreakdown, HabitShift, QuizAnswer } from '@/types';
import { useCarbonStore } from '@/store/carbon-store';

describe('Carbon Shift Simulator Recalculations', () => {
  let baselineBreakdown: CarbonBreakdown;

  beforeEach(() => {
    baselineBreakdown = {
      transport: 4.6,  // car_petrol
      diet: 2.5,       // meat_regular
      energy: 2.5,     // grid_gas
      travel: 1.0,     // flights_1_2
      consumption: 1.2 // average
    };
  });

  it('should decrease the score and recalculate Aura when a single shift is enabled', () => {
    // 4.6 + 2.5 + 2.5 + 1.0 + 1.2 = 11.8 (Amber)
    const activeShifts: HabitShift[] = [
      {
        id: 'switch-to-transit',
        category: 'transport',
        label: 'Switch to transit',
        description: '...',
        co2Reduction: 3.6, // 4.6 - 1.0
        enabled: true,
        icon: '🚌',
        difficulty: 'moderate'
      }
    ];

    const result = calculateWithShifts(baselineBreakdown, activeShifts);
    // New transport = 4.6 - 3.6 = 1.0
    // Total = 1.0 + 2.5 + 2.5 + 1.0 + 1.2 = 8.2 (Amber)
    expect(result.score).toBe(8.2);
    expect(result.aura).toBe('amber');
    expect(result.breakdown.transport).toBe(1.0);
  });

  it('should accumulate reductions when multiple shifts are enabled', () => {
    const activeShifts: HabitShift[] = [
      {
        id: 'switch-to-transit',
        category: 'transport',
        label: 'Switch to transit',
        description: '...',
        co2Reduction: 3.6,
        enabled: true,
        icon: '🚌',
        difficulty: 'moderate'
      },
      {
        id: 'go-vegetarian',
        category: 'diet',
        label: 'Go vegetarian',
        description: '...',
        co2Reduction: 1.5,
        enabled: true,
        icon: '🥗',
        difficulty: 'moderate'
      }
    ];

    const result = calculateWithShifts(baselineBreakdown, activeShifts);
    // New transport = 1.0, New diet = 2.5 - 1.5 = 1.0
    // Total = 1.0 + 1.0 + 2.5 + 1.0 + 1.2 = 6.7 (Sapphire)
    expect(result.score).toBe(6.7);
    expect(result.aura).toBe('sapphire'); // Transitions from Amber -> Sapphire!
  });

  it('should clamp the minimum score to 0.1 to avoid negative emissions', () => {
    const activeShifts: HabitShift[] = [
      {
        id: 'massive-shift-1',
        category: 'transport',
        label: '...',
        description: '...',
        co2Reduction: 10.0,
        enabled: true,
        icon: '',
        difficulty: 'hard'
      },
      {
        id: 'massive-shift-2',
        category: 'diet',
        label: '...',
        description: '...',
        co2Reduction: 10.0,
        enabled: true,
        icon: '',
        difficulty: 'hard'
      },
      {
        id: 'massive-shift-3',
        category: 'energy',
        label: '...',
        description: '...',
        co2Reduction: 10.0,
        enabled: true,
        icon: '',
        difficulty: 'hard'
      },
      {
        id: 'massive-shift-4',
        category: 'travel',
        label: '...',
        description: '...',
        co2Reduction: 10.0,
        enabled: true,
        icon: '',
        difficulty: 'hard'
      },
      {
        id: 'massive-shift-5',
        category: 'consumption',
        label: '...',
        description: '...',
        co2Reduction: 10.0,
        enabled: true,
        icon: '',
        difficulty: 'hard'
      }
    ];

    const result = calculateWithShifts(baselineBreakdown, activeShifts);
    expect(result.score).toBe(0.1);
    expect(result.aura).toBe('green');
  });

  it('should generate available shifts conditionally matching user answers', () => {
    const answers: QuizAnswer[] = [
      { questionId: 'q1', category: 'transport', value: 'bike_walk' }, // user already walks/bikes
      { questionId: 'q2', category: 'diet', value: 'meat_regular' },
      { questionId: 'q3', category: 'energy', value: 'solar_mix' }, // user already has solar
      { questionId: 'q4', category: 'travel', value: 'never' },      // user never flies
      { questionId: 'q5', category: 'consumption', value: 'minimalist' } // user is minimalist
    ];

    const shifts = getAvailableShifts(answers, baselineBreakdown);

    // Verify EV, Public transit and bike/walk shifts are NOT present because transport commute is already 'bike_walk'
    const transportShifts = shifts.filter(s => s.category === 'transport');
    expect(transportShifts).toHaveLength(0);

    // Renewable energy shift is NOT present because user already selected 'solar_mix'
    const energyShifts = shifts.filter(s => s.category === 'energy');
    expect(energyShifts).toHaveLength(0);

    // Flight elimination shift is NOT present because travel is 'never'
    const travelShifts = shifts.filter(s => s.category === 'travel');
    expect(travelShifts).toHaveLength(0);

    // Vegan diet shift SHOULD still be present because they are currently regular meat eater
    const veganShift = shifts.find(s => s.id === 'go-vegan');
    expect(veganShift).toBeDefined();
  });
});

describe('Zustand Store Integration with Simulator Toggles', () => {
  beforeEach(() => {
    useCarbonStore.getState().reset();
  });

  it('should update state in store when demo mode is activated and shifts are toggled', () => {
    const store = useCarbonStore.getState();
    store.activateDemoMode();

    const freshStore = useCarbonStore.getState();
    expect(freshStore.isDemoMode).toBe(true);
    expect(freshStore.simulator.baselineScore).toBe(7.2);
    expect(freshStore.simulator.baselineAura).toBe('sapphire');
    expect(freshStore.simulator.simulatedScore).toBe(7.2);

    // Get available shifts for the demo answers:
    const breakdown = freshStore.twin!.breakdown;
    const availableShifts = getAvailableShifts(freshStore.quizAnswers, breakdown);
    
    // Toggle the first shift (e.g. switch-to-transit or switch-to-ev)
    const targetShift = availableShifts[0];
    useCarbonStore.getState().toggleShift(targetShift.id);

    const toggledStore = useCarbonStore.getState();
    expect(toggledStore.simulator.activeShifts).toContain(targetShift.id);
    expect(toggledStore.simulator.simulatedScore).toBeLessThan(7.2);
    expect(toggledStore.simulator.totalReduction).toBeGreaterThan(0);

    // Resetting simulator should restore baseline values
    useCarbonStore.getState().resetSimulator();
    const resetStore = useCarbonStore.getState();
    expect(resetStore.simulator.activeShifts).toHaveLength(0);
    expect(resetStore.simulator.simulatedScore).toBe(7.2);
    expect(resetStore.simulator.totalReduction).toBe(0);
  });
});
