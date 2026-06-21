// src/lib/simulator-options.ts
import { QuizAnswer, CarbonBreakdown, HabitShift } from '@/types';
import { EMISSION_FACTORS } from './constants';

/**
 * Generates a list of habit shifts customized for the user's specific answers and carbon breakdown.
 * Filters out shifts that are irrelevant (e.g., suggesting a car commuter switch to public transit when they already bike).
 */
export function getAvailableShifts(
  answers: QuizAnswer[],
  breakdown: CarbonBreakdown
): HabitShift[] {
  const shifts: HabitShift[] = [];

  const transportAnswer = answers.find(a => a.category === 'transport')?.value as string;
  const dietAnswer = answers.find(a => a.category === 'diet')?.value as string;
  const energyAnswer = answers.find(a => a.category === 'energy')?.value as string;
  const travelAnswer = answers.find(a => a.category === 'travel')?.value as string;
  const consumptionAnswer = answers.find(a => a.category === 'consumption')?.value as string;

  // 1. Transport Shifts
  if (transportAnswer === 'car_petrol') {
    // Petrol car owner can switch to EV, public transit, or bike/walk
    shifts.push({
      id: 'switch-to-ev',
      category: 'transport',
      label: 'Switch to electric vehicle',
      description: 'Replace your petrol/diesel car with an electric vehicle.',
      co2Reduction: Math.max(0, breakdown.transport - EMISSION_FACTORS.transport.car_electric), // 4.6 - 1.5 = 3.1
      enabled: false,
      icon: '🔌',
      difficulty: 'hard'
    });

    shifts.push({
      id: 'switch-to-transit',
      category: 'transport',
      label: 'Switch to public transit',
      description: 'Commute using trains, buses, or subways instead of driving.',
      co2Reduction: Math.max(0, breakdown.transport - EMISSION_FACTORS.transport.public_transit), // 4.6 - 1.0 = 3.6
      enabled: false,
      icon: '🚌',
      difficulty: 'moderate'
    });

    shifts.push({
      id: 'bike-walk-commute',
      category: 'transport',
      label: 'Bike or walk to work',
      description: 'Ditch the car completely for active, human-powered transport.',
      co2Reduction: Math.max(0, breakdown.transport - EMISSION_FACTORS.transport.bike_walk), // 4.6 - 0.1 = 4.5
      enabled: false,
      icon: '🚲',
      difficulty: 'hard'
    });
  } else if (transportAnswer === 'car_electric') {
    // Electric car owner can still shift to public transit or bike/walk
    shifts.push({
      id: 'switch-to-transit',
      category: 'transport',
      label: 'Switch to public transit',
      description: 'Commute using trains, buses, or subways.',
      co2Reduction: Math.max(0, breakdown.transport - EMISSION_FACTORS.transport.public_transit), // 1.5 - 1.0 = 0.5
      enabled: false,
      icon: '🚌',
      difficulty: 'moderate'
    });

    shifts.push({
      id: 'bike-walk-commute',
      category: 'transport',
      label: 'Bike or walk to work',
      description: 'Ditch the electric car for active transport.',
      co2Reduction: Math.max(0, breakdown.transport - EMISSION_FACTORS.transport.bike_walk), // 1.5 - 0.1 = 1.4
      enabled: false,
      icon: '🚲',
      difficulty: 'hard'
    });
  }

  // 2. Diet Shifts
  if (['meat_lover', 'meat_regular'].includes(dietAnswer)) {
    shifts.push({
      id: 'go-flexitarian',
      category: 'diet',
      label: 'Reduce meat to flexitarian',
      description: 'Eat meat occasionally, substituting most meals with plant options.',
      co2Reduction: Math.max(0, breakdown.diet - EMISSION_FACTORS.diet.flexitarian),
      enabled: false,
      icon: '🥬',
      difficulty: 'easy'
    });

    shifts.push({
      id: 'go-vegetarian',
      category: 'diet',
      label: 'Go vegetarian',
      description: 'Eliminate meat completely, retaining dairy and eggs.',
      co2Reduction: Math.max(0, breakdown.diet - EMISSION_FACTORS.diet.vegetarian),
      enabled: false,
      icon: '🥗',
      difficulty: 'moderate'
    });

    shifts.push({
      id: 'go-vegan',
      category: 'diet',
      label: 'Go vegan',
      description: 'Adopt a fully plant-based, planet-friendly diet.',
      co2Reduction: Math.max(0, breakdown.diet - EMISSION_FACTORS.diet.vegan),
      enabled: false,
      icon: '🌱',
      difficulty: 'hard'
    });
  } else if (['flexitarian', 'pescatarian', 'vegetarian'].includes(dietAnswer)) {
    // Moderate diets can transition to full vegan
    shifts.push({
      id: 'go-vegan',
      category: 'diet',
      label: 'Go vegan',
      description: 'Adopt a fully plant-based, planet-friendly diet.',
      co2Reduction: Math.max(0, breakdown.diet - EMISSION_FACTORS.diet.vegan),
      enabled: false,
      icon: '🌱',
      difficulty: 'hard'
    });
  }

  // 3. Energy Shifts
  if (['grid_gas', 'oil_wood'].includes(energyAnswer)) {
    shifts.push({
      id: 'renewable-energy',
      category: 'energy',
      label: 'Switch to renewable energy',
      description: 'Source your electricity and heating from 100% renewable suppliers.',
      co2Reduction: Math.max(0, breakdown.energy - EMISSION_FACTORS.energy.solar_mix),
      enabled: false,
      icon: '☀️',
      difficulty: 'hard'
    });
  }

  // 4. Travel Shifts
  if (['flights_3_5', 'flights_6_plus'].includes(travelAnswer)) {
    shifts.push({
      id: 'cut-flights-half',
      category: 'travel',
      label: 'Cut flights by half',
      description: 'Reduce your flying frequency by 50% through local staycations or video calls.',
      co2Reduction: breakdown.travel * 0.5,
      enabled: false,
      icon: '🛫',
      difficulty: 'moderate'
    });
  }

  if (travelAnswer !== 'never') {
    shifts.push({
      id: 'eliminate-flights',
      category: 'travel',
      label: 'Eliminate flights',
      description: 'Avoid commercial aviation entirely, using rail or electric vehicles for travel.',
      co2Reduction: breakdown.travel,
      enabled: false,
      icon: '🌍',
      difficulty: 'hard'
    });
  }

  // 5. Consumption Shifts
  if (['average', 'frequent', 'luxury'].includes(consumptionAnswer)) {
    shifts.push({
      id: 'go-minimalist',
      category: 'consumption',
      label: 'Adopt minimalist shopping',
      description: 'Reduce purchases, buy second-hand, and repair before buying new.',
      co2Reduction: Math.max(0, breakdown.consumption - EMISSION_FACTORS.consumption.minimalist),
      enabled: false,
      icon: '🛍️',
      difficulty: 'easy'
    });
  }

  return shifts;
}
