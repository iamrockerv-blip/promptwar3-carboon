// src/lib/carbon-engine.ts
import { 
  QuizAnswer, 
  CarbonBreakdown, 
  CarbonAura, 
  HabitShift, 
  TimelineProjection, 
  EarthConsequence, 
  GreenFutureComparison 
} from '@/types';
import { EMISSION_FACTORS, AURA_THRESHOLDS, CONSEQUENCE_CONSTANTS, SEA_LEVEL_COEFFICIENT, HEALTH_SCORE_CONSTANTS } from './constants';

/**
 * Financial proxy estimates (annual cost in USD) based on lifestyle habits.
 * Helps ground the "Green Future Comparison" in tangible financial metrics.
 */
const FINANCIAL_ESTIMATES = {
  transport: {
    car_petrol: 3200,      // Petrol, maintenance, insurance
    car_electric: 1600,    // Charging, lower maintenance
    public_transit: 900,   // Annual passes
    bike_walk: 100,        // Gear maintenance
    remote: 150            // Minor electricity, no travel
  },
  diet: {
    meat_lover: 2600,      // Heavy fresh meat costs
    meat_regular: 2000,    // Average groceries
    flexitarian: 1800,     // Reduced meat costs
    pescatarian: 1900,     // Seafood premiums
    vegetarian: 1500,      // Plant/dairy mix
    vegan: 1300            // Plant-only, bulk purchasing
  },
  energy: {
    grid_gas: 2200,        // High grid utility rates + heating fuel
    solar_mix: 800,        // Solar offset, minimal grid draw
    oil_wood: 2600,        // Heating oil/pellet bills
    shared_low: 1100       // Low individual consumption
  },
  travel: {
    never: 0,
    flights_1_2: 1200,     // Occasional flights
    flights_3_5: 4200,     // High flight costs
    flights_6_plus: 8500   // Luxury flight overhead
  },
  consumption: {
    minimalist: 500,       // Second-hand, repair focus
    average: 1600,         // Normal retail spending
    frequent: 3200,        // Shopping hobbyist
    luxury: 6500           // High-end electronics & premium fashion
  }
} as const;

/**
 * Calculates the categorical carbon breakdown based on user quiz answers.
 */
export function calculateBreakdown(answers: QuizAnswer[]): CarbonBreakdown {
  const findVal = (cat: keyof CarbonBreakdown, def: string): number => {
    const ans = answers.find(a => a.category === cat);
    const factors = EMISSION_FACTORS[cat];
    if (!ans) return factors[def as keyof typeof factors];
    const key = ans.value as keyof typeof factors;
    return factors[key] ?? factors[def as keyof typeof factors];
  };

  return {
    transport: findVal('transport', 'public_transit'),
    diet: findVal('diet', 'meat_regular'),
    energy: findVal('energy', 'grid_gas'),
    travel: findVal('travel', 'flights_1_2'),
    consumption: findVal('consumption', 'average')
  };
}

/**
 * Computes the total annual carbon footprint in tonnes of CO2e.
 */
export function calculateScore(answers: QuizAnswer[]): number {
  const breakdown = calculateBreakdown(answers);
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  return Math.round(total * 10) / 10;
}

/**
 * Assigns a Carbon Aura deterministically based on thresholds.
 */
export function assignAura(annualCO2eTonnes: number): CarbonAura {
  if (annualCO2eTonnes <= AURA_THRESHOLDS.green) return 'green';
  if (annualCO2eTonnes <= AURA_THRESHOLDS.emerald) return 'emerald';
  if (annualCO2eTonnes <= AURA_THRESHOLDS.sapphire) return 'sapphire';
  if (annualCO2eTonnes <= AURA_THRESHOLDS.amber) return 'amber';
  return 'crimson';
}

/**
 * Recalculates score and Aura with habit shifts applied.
 */
export function calculateWithShifts(
  baseline: CarbonBreakdown,
  activeShifts: HabitShift[]
): { score: number; aura: CarbonAura; breakdown: CarbonBreakdown } {
  const adjusted = { ...baseline };

  for (const shift of activeShifts) {
    if (shift.enabled) {
      adjusted[shift.category] = Math.max(0, adjusted[shift.category] - shift.co2Reduction);
    }
  }

  const rawScore = Object.values(adjusted).reduce((a, b) => a + b, 0);
  const score = Math.max(0.1, Math.round(rawScore * 10) / 10);
  const aura = assignAura(score);

  const roundedBreakdown = {
    transport: Math.round(adjusted.transport * 100) / 100,
    diet: Math.round(adjusted.diet * 100) / 100,
    energy: Math.round(adjusted.energy * 100) / 100,
    travel: Math.round(adjusted.travel * 100) / 100,
    consumption: Math.round(adjusted.consumption * 100) / 100
  };

  return { score, aura, breakdown: roundedBreakdown };
}

/**
 * Generates carbon and environmental impact projections over 1, 3, 5, and 10 years.
 */
export function calculateProjections(score: number): TimelineProjection[] {
  const years = [1, 3, 5, 10];
  return years.map(year => {
    const cumulativeTonnes = Math.round(score * year * 10) / 10;
    return {
      year,
      cumulativeTonnes,
      treesRequired: Math.round(cumulativeTonnes / CONSEQUENCE_CONSTANTS.treeAbsorbtionPerYearTonnes),
      equivalentFlights: Math.round(cumulativeTonnes / CONSEQUENCE_CONSTANTS.flightEmissionTonnes),
      seaLevelContribution_mm: Math.round((cumulativeTonnes * SEA_LEVEL_COEFFICIENT) * 10000) / 10000
    };
  });
}

/**
 * Computes visceral environmental consequences scaled to 10,000 people living similarly.
 */
export function calculateConsequences(score: number): EarthConsequence {
  const mult = CONSEQUENCE_CONSTANTS.populationMultiplier;
  const totalAnnualTonnes = Math.round(score * mult);
  return {
    populationMultiplier: mult,
    totalAnnualTonnes,
    treesRequired: Math.round(totalAnnualTonnes / CONSEQUENCE_CONSTANTS.treeAbsorbtionPerYearTonnes),
    flightsEquivalent: Math.round(totalAnnualTonnes / CONSEQUENCE_CONSTANTS.flightEmissionTonnes),
    carsEquivalent: Math.round(totalAnnualTonnes / CONSEQUENCE_CONSTANTS.carEmissionPerYearTonnes),
    iceMelt_sqm: Math.round(totalAnnualTonnes * CONSEQUENCE_CONSTANTS.iceMeltPerTonneSqm),
    energyConsumption_kwh: Math.round(totalAnnualTonnes * CONSEQUENCE_CONSTANTS.kwhPerTonneCo2)
  };
}

/**
 * Generates side-by-side current vs improved projections for the Green Future Comparison.
 */
export function calculateGreenFuture(
  baselineScore: number,
  breakdown: CarbonBreakdown,
  answers: QuizAnswer[]
): GreenFutureComparison {
  const getVal = (cat: string): string => {
    return answers.find(a => a.category === cat)?.value as string || 'average';
  };

  const getCost = (cat: string, val: string): number => {
    if (cat in FINANCIAL_ESTIMATES) {
      const categoryEstimates = FINANCIAL_ESTIMATES[cat as keyof typeof FINANCIAL_ESTIMATES];
      if (val in categoryEstimates) {
        return categoryEstimates[val as keyof typeof categoryEstimates];
      }
    }
    return 1000;
  };

  const transVal = getVal('transport');
  const dietVal = getVal('diet');
  const energyVal = getVal('energy');
  const travelVal = getVal('travel');
  const consVal = getVal('consumption');

  // 1. Current Future Calculations
  const currentAnnualCost = 
    getCost('transport', transVal) +
    getCost('diet', dietVal) +
    getCost('energy', energyVal) +
    getCost('travel', travelVal) +
    getCost('consumption', consVal);

  const currentCo2_5yr = Math.round(baselineScore * 5 * 10) / 10;
  const currentCost_5yr = currentAnnualCost * 5;

  let currentHealth: number = HEALTH_SCORE_CONSTANTS.baseScore;
  if (transVal === 'bike_walk') currentHealth += HEALTH_SCORE_CONSTANTS.bikeWalkBonus;
  if (transVal === 'car_petrol') currentHealth -= HEALTH_SCORE_CONSTANTS.carPetrolPenalty;
  if (dietVal === 'vegan' || dietVal === 'vegetarian') currentHealth += HEALTH_SCORE_CONSTANTS.veganVegetarianBonus;
  if (dietVal === 'meat_lover') currentHealth -= HEALTH_SCORE_CONSTANTS.meatLoverPenalty;
  currentHealth = Math.min(100, Math.max(HEALTH_SCORE_CONSTANTS.minScore, currentHealth));

  // 2. Improved Future Calculations (Optimistic shifts)
  const transShiftMap: Record<string, string> = { car_petrol: 'car_electric' };
  const dietShiftMap: Record<string, string> = { meat_lover: 'flexitarian', meat_regular: 'flexitarian' };
  const energyShiftMap: Record<string, string> = { grid_gas: 'solar_mix', oil_wood: 'solar_mix' };
  const travelShiftMap: Record<string, string> = { flights_6_plus: 'flights_3_5', flights_3_5: 'flights_1_2' };
  const consShiftMap: Record<string, string> = { luxury: 'average', frequent: 'average' };

  const improvedTrans = transShiftMap[transVal] ?? transVal;
  const improvedDiet = dietShiftMap[dietVal] ?? dietVal;
  const improvedEnergy = energyShiftMap[energyVal] ?? energyVal;
  const improvedTravel = travelShiftMap[travelVal] ?? travelVal;
  const improvedCons = consShiftMap[consVal] ?? consVal;

  const improvedAnnualCost = 
    getCost('transport', improvedTrans) +
    getCost('diet', improvedDiet) +
    getCost('energy', improvedEnergy) +
    getCost('travel', improvedTravel) +
    getCost('consumption', improvedCons);

  const improvedBreakdown: CarbonBreakdown = {
    transport: EMISSION_FACTORS.transport[improvedTrans as keyof typeof EMISSION_FACTORS.transport] ?? breakdown.transport,
    diet: EMISSION_FACTORS.diet[improvedDiet as keyof typeof EMISSION_FACTORS.diet] ?? breakdown.diet,
    energy: EMISSION_FACTORS.energy[improvedEnergy as keyof typeof EMISSION_FACTORS.energy] ?? breakdown.energy,
    travel: EMISSION_FACTORS.travel[improvedTravel as keyof typeof EMISSION_FACTORS.travel] ?? breakdown.travel,
    consumption: EMISSION_FACTORS.consumption[improvedCons as keyof typeof EMISSION_FACTORS.consumption] ?? breakdown.consumption
  };

  const improvedScore = Object.values(improvedBreakdown).reduce((a, b) => a + b, 0);
  const improvedCo2_5yr = Math.round(improvedScore * 5 * 10) / 10;
  const improvedCost_5yr = improvedAnnualCost * 5;

  let improvedHealth = currentHealth + HEALTH_SCORE_CONSTANTS.improvedBonus;
  if (improvedTrans === 'bike_walk') improvedHealth += HEALTH_SCORE_CONSTANTS.improvedBikeWalkBonus;
  improvedHealth = Math.min(HEALTH_SCORE_CONSTANTS.maxScore, improvedHealth);

  const reductionPercentage = Math.round(((currentCo2_5yr - improvedCo2_5yr) / Math.max(0.1, currentCo2_5yr)) * 100);
  const moneySaved = currentCost_5yr - improvedCost_5yr;

  return {
    currentFuture: {
      co2_5yr: currentCo2_5yr,
      cost_5yr: currentCost_5yr,
      healthScore: currentHealth
    },
    improvedFuture: {
      co2_5yr: improvedCo2_5yr,
      cost_5yr: improvedCost_5yr,
      healthScore: improvedHealth
    },
    reductionPercentage,
    moneySaved
  };
}
