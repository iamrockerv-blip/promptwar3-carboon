import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCarbonStore } from '@/store/carbon-store';
import { QuizAnswer } from '@/types';

// Mock window fetch since Next.js fetch doesn't run in Node environment tests directly
global.fetch = vi.fn();

describe('Zustand Store Actions Refactoring Baseline Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCarbonStore.getState().reset();
  });

  const sampleAnswers: QuizAnswer[] = [
    { questionId: 'q1', category: 'transport', value: 'car_petrol' },
    { questionId: 'q2', category: 'diet', value: 'meat_regular' },
    { questionId: 'q3', category: 'energy', value: 'grid_gas' },
    { questionId: 'q4', category: 'travel', value: 'flights_1_2' },
    { questionId: 'q5', category: 'consumption', value: 'average' }
  ];

  it('should generate twin with correct fallback when API fails', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network Error'));

    const store = useCarbonStore.getState();
    
    // Set answers manually
    for (const ans of sampleAnswers) {
      store.answerQuestion(ans);
    }
    
    expect(useCarbonStore.getState().quizAnswers).toHaveLength(5);

    // Call generateTwin
    await useCarbonStore.getState().generateTwin();

    const twin = useCarbonStore.getState().twin;
    expect(twin).toBeDefined();
    expect(twin!.score).toBe(11.8); // 4.6 + 2.5 + 2.5 + 1.0 + 1.2 = 11.8
    expect(twin!.aura).toBe('amber');
    expect(useCarbonStore.getState().simulator.baselineScore).toBe(11.8);
    expect(useCarbonStore.getState().simulator.simulatedScore).toBe(11.8);
  });

  it('should generate twin with AI narratives when API succeeds', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        auraExplanation: 'Mocked explanation',
        lifeReplay: { narrative: 'Mocked narrative', chapters: [] },
        recommendations: []
      })
    } as unknown as Response);

    const store = useCarbonStore.getState();
    for (const ans of sampleAnswers) {
      store.answerQuestion(ans);
    }

    await useCarbonStore.getState().generateTwin();

    const twin = useCarbonStore.getState().twin;
    expect(twin).toBeDefined();
    expect(twin!.score).toBe(11.8);
    expect(twin!.aura).toBe('amber');
    expect(twin!.auraExplanation).toBe('Mocked explanation');
    expect(useCarbonStore.getState().simulator.baselineScore).toBe(11.8);
  });

  it('should recalculate twin score and simulator details during quests', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network Error'));

    const store = useCarbonStore.getState();
    for (const ans of sampleAnswers) {
      store.answerQuestion(ans);
    }
    await useCarbonStore.getState().generateTwin();

    const activeQuests = useCarbonStore.getState().quests;
    expect(activeQuests.length).toBeGreaterThan(0);

    // Complete first quest
    const firstQuest = activeQuests[0];
    useCarbonStore.getState().completeQuest(firstQuest.id);

    const updatedStore = useCarbonStore.getState();
    const expectedScore = Math.max(0.1, Math.round((11.8 - firstQuest.co2SavedKg / 1000) * 1000) / 1000);
    expect(updatedStore.twin!.score).toBe(expectedScore);
    expect(updatedStore.quests.find(q => q.id === firstQuest.id)!.completed).toBe(true);

    // Reset quests should restore everything to baseline
    useCarbonStore.getState().resetQuests();
    const resetStore = useCarbonStore.getState();
    expect(resetStore.twin!.score).toBe(11.8);
    expect(resetStore.quests.find(q => q.id === firstQuest.id)!.completed).toBe(false);
  });

  it('should recalculate all twin and simulator parameters when updateTwinAnswers is called', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network Error'));

    const store = useCarbonStore.getState();
    for (const ans of sampleAnswers) {
      store.answerQuestion(ans);
    }
    await useCarbonStore.getState().generateTwin();

    // Now update transport answer from car_petrol to bike_walk
    useCarbonStore.getState().updateTwinAnswers('transport', 'bike_walk');

    const updatedStore = useCarbonStore.getState();
    // New score = 0.1 (bike_walk) + 2.5 + 2.5 + 1.0 + 1.2 = 7.3
    expect(updatedStore.twin!.score).toBe(7.3);
    expect(updatedStore.twin!.aura).toBe('sapphire');
    expect(updatedStore.simulator.baselineScore).toBe(7.3);
    expect(updatedStore.simulator.simulatedScore).toBe(7.3);
  });
});
