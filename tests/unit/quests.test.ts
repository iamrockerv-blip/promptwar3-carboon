// tests/unit/quests.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useCarbonStore } from '@/store/carbon-store';
import { getAvailableQuests } from '@/lib/quest-options';
import { QuizAnswer } from '@/types';

describe('Aura Purification Quests Integration', () => {
  beforeEach(() => {
    useCarbonStore.getState().reset();
  });

  const sampleAnswers: QuizAnswer[] = [
    { questionId: 'q1', category: 'transport', value: 'car_petrol' },
    { questionId: 'q2', category: 'diet', value: 'meat_regular' },
    { questionId: 'q3', category: 'energy', value: 'grid_gas' },
    { questionId: 'q4', category: 'travel', value: 'flights_1_2' },
    { questionId: 'q5', category: 'consumption', value: 'average' }
  ];

  it('should generate appropriate purification quests based on answers', () => {
    const quests = getAvailableQuests(sampleAnswers);
    expect(quests).toHaveLength(3);
    
    // Transport quest for car_petrol should be Transit Guardian
    const transportQuest = quests.find(q => q.category === 'transport');
    expect(transportQuest?.label).toBe('Transit Guardian');
    expect(transportQuest?.co2SavedKg).toBe(9.8);

    // Diet quest for meat_regular should be Plant-Based Pioneer
    const dietQuest = quests.find(q => q.category === 'diet');
    expect(dietQuest?.label).toBe('Plant-Based Pioneer');
    expect(dietQuest?.co2SavedKg).toBe(4.1);

    // Energy quest for grid_gas should be Watt Whisperer
    const energyQuest = quests.find(q => q.category === 'energy');
    expect(energyQuest?.label).toBe('Watt Whisperer');
    expect(energyQuest?.co2SavedKg).toBe(4.6);
  });

  it('should toggle quest completion, update totalCarbonSavedKg and reduce twin score in the store', async () => {
    const store = useCarbonStore.getState();
    store.activateDemoMode(); // Loads DEMO_TWIN (score 7.2)

    const freshStore = useCarbonStore.getState();
    expect(freshStore.quests).toHaveLength(3);
    expect(freshStore.totalCarbonSavedKg).toBe(0);
    expect(freshStore.twin?.score).toBe(7.2);

    const targetQuestId = freshStore.quests[0].id;
    const targetQuestCo2 = freshStore.quests[0].co2SavedKg;

    // Complete the first quest
    useCarbonStore.getState().completeQuest(targetQuestId);

    const updatedStore = useCarbonStore.getState();
    expect(updatedStore.quests[0].completed).toBe(true);
    expect(updatedStore.totalCarbonSavedKg).toBe(targetQuestCo2);

    // Score should be reduced by targetQuestCo2 / 1000 tonnes
    const expectedScore = Math.max(0.1, Math.round((7.2 - (targetQuestCo2 / 1000)) * 1000) / 1000);
    expect(updatedStore.twin?.score).toBe(expectedScore);

    // Uncomplete the quest
    useCarbonStore.getState().completeQuest(targetQuestId);
    const uncompletedStore = useCarbonStore.getState();
    expect(uncompletedStore.quests[0].completed).toBe(false);
    expect(uncompletedStore.totalCarbonSavedKg).toBe(0);
    expect(uncompletedStore.twin?.score).toBe(7.2);
  });

  it('should reset all completed quests and restore original scores when resetQuests is called', () => {
    const store = useCarbonStore.getState();
    store.activateDemoMode();

    const initialQuest = useCarbonStore.getState().quests[0];
    useCarbonStore.getState().completeQuest(initialQuest.id);

    expect(useCarbonStore.getState().quests[0].completed).toBe(true);
    expect(useCarbonStore.getState().twin?.score).toBeLessThan(7.2);

    // Reset quests
    useCarbonStore.getState().resetQuests();

    const resetStore = useCarbonStore.getState();
    expect(resetStore.quests[0].completed).toBe(false);
    expect(resetStore.totalCarbonSavedKg).toBe(0);
    expect(resetStore.twin?.score).toBe(7.2);
  });
});
