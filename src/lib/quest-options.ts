// src/lib/quest-options.ts
import { QuizAnswer, PurificationQuest } from '@/types';

/**
 * Generates three customized purification quests based on the user's quiz selections.
 */
export function getAvailableQuests(answers: QuizAnswer[]): PurificationQuest[] {
  const quests: PurificationQuest[] = [];

  const transport = answers.find(a => a.category === 'transport')?.value as string;
  const diet = answers.find(a => a.category === 'diet')?.value as string;
  const energy = answers.find(a => a.category === 'energy')?.value as string;

  // 1. Transport Quest
  if (transport === 'car_petrol') {
    quests.push({
      id: 'quest-transport',
      category: 'transport',
      label: 'Transit Guardian',
      description: 'Swap one petrol car trip for public transit today.',
      co2SavedKg: 9.8,
      completed: false,
      icon: '🚌'
    });
  } else if (transport === 'car_electric') {
    quests.push({
      id: 'quest-transport',
      category: 'transport',
      label: 'Active Pedestrian',
      description: 'Cycle or walk to complete all errands today.',
      co2SavedKg: 3.8,
      completed: false,
      icon: '🚲'
    });
  } else {
    quests.push({
      id: 'quest-transport',
      category: 'transport',
      label: 'Commute Champion',
      description: 'Help an acquaintance organize a carpool or transit route.',
      co2SavedKg: 2.0,
      completed: false,
      icon: '👥'
    });
  }

  // 2. Diet Quest
  if (['meat_lover', 'meat_regular'].includes(diet)) {
    quests.push({
      id: 'quest-diet',
      category: 'diet',
      label: 'Plant-Based Pioneer',
      description: 'Commit to a fully meat-free green diet today.',
      co2SavedKg: 4.1,
      completed: false,
      icon: '🥗'
    });
  } else {
    quests.push({
      id: 'quest-diet',
      category: 'diet',
      label: 'Vegan Explorer',
      description: 'Log a fully vegan day, substituting all dairy items.',
      co2SavedKg: 1.5,
      completed: false,
      icon: '🌱'
    });
  }

  // 3. Energy Quest
  if (['grid_gas', 'oil_wood'].includes(energy)) {
    quests.push({
      id: 'quest-energy',
      category: 'energy',
      label: 'Watt Whisperer',
      description: 'Turn down heating or AC by 2°C and wear standard layers.',
      co2SavedKg: 4.6,
      completed: false,
      icon: '🌡️'
    });
  } else {
    quests.push({
      id: 'quest-energy',
      category: 'energy',
      label: 'Unplug Advocate',
      description: 'Power down and unplug all standby electronics overnight.',
      co2SavedKg: 1.2,
      completed: false,
      icon: '🔌'
    });
  }

  return quests;
}
