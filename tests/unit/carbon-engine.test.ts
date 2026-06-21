// tests/unit/carbon-engine.test.ts
import { describe, it, expect } from 'vitest';
import { 
  calculateBreakdown, 
  calculateScore, 
  calculateProjections, 
  calculateConsequences,
  calculateGreenFuture
} from '@/lib/carbon-engine';
import { QuizAnswer } from '@/types';
import { EMISSION_FACTORS } from '@/lib/constants';

describe('Carbon Engine Calculations', () => {
  const sampleAnswers: QuizAnswer[] = [
    { questionId: 'q1', category: 'transport', value: 'car_petrol' },
    { questionId: 'q2', category: 'diet', value: 'meat_regular' },
    { questionId: 'q3', category: 'energy', value: 'grid_gas' },
    { questionId: 'q4', category: 'travel', value: 'flights_1_2' },
    { questionId: 'q5', category: 'consumption', value: 'average' }
  ];

  it('should calculate the breakdown accurately based on EMISSION_FACTORS', () => {
    const breakdown = calculateBreakdown(sampleAnswers);
    expect(breakdown.transport).toBe(EMISSION_FACTORS.transport.car_petrol);
    expect(breakdown.diet).toBe(EMISSION_FACTORS.diet.meat_regular);
    expect(breakdown.energy).toBe(EMISSION_FACTORS.energy.grid_gas);
    expect(breakdown.travel).toBe(EMISSION_FACTORS.travel.flights_1_2);
    expect(breakdown.consumption).toBe(EMISSION_FACTORS.consumption.average);
  });

  it('should fall back to default values when some answers are missing', () => {
    const partialAnswers: QuizAnswer[] = [
      { questionId: 'q1', category: 'transport', value: 'bike_walk' }
    ];
    const breakdown = calculateBreakdown(partialAnswers);
    expect(breakdown.transport).toBe(EMISSION_FACTORS.transport.bike_walk);
    // Defaults:
    expect(breakdown.diet).toBe(EMISSION_FACTORS.diet.meat_regular);
    expect(breakdown.energy).toBe(EMISSION_FACTORS.energy.grid_gas);
    expect(breakdown.travel).toBe(EMISSION_FACTORS.travel.flights_1_2);
    expect(breakdown.consumption).toBe(EMISSION_FACTORS.consumption.average);
  });

  it('should calculate the total score as the sum of all breakdown components rounded to 1 decimal place', () => {
    const breakdown = calculateBreakdown(sampleAnswers);
    const sum = Object.values(breakdown).reduce((a, b) => a + b, 0);
    const expectedScore = Math.round(sum * 10) / 10;
    
    const score = calculateScore(sampleAnswers);
    expect(score).toBe(expectedScore);
  });

  it('should compute projections over 1, 3, 5, and 10 years correctly', () => {
    const score = 12.0;
    const projections = calculateProjections(score);

    expect(projections).toHaveLength(4);
    
    // Year 1
    expect(projections[0].year).toBe(1);
    expect(projections[0].cumulativeTonnes).toBe(12.0);
    expect(projections[0].treesRequired).toBe(Math.round(12.0 / 0.022));

    // Year 5
    expect(projections[2].year).toBe(5);
    expect(projections[2].cumulativeTonnes).toBe(60.0);
    expect(projections[2].treesRequired).toBe(Math.round(60.0 / 0.022));
  });

  it('should compute visceral consequences for 10,000 people correctly', () => {
    const score = 8.5;
    const consequences = calculateConsequences(score);

    expect(consequences.populationMultiplier).toBe(10000);
    expect(consequences.totalAnnualTonnes).toBe(85000);
    expect(consequences.iceMelt_sqm).toBe(85000 * 3.0);
    expect(consequences.treesRequired).toBe(Math.round(85000 / 0.022));
    expect(consequences.carsEquivalent).toBe(Math.round(85000 / 4.6));
    expect(consequences.flightsEquivalent).toBe(Math.round(85000 / 1.0));
  });

  it('should compute side-by-side green futures comparisons', () => {
    const score = calculateScore(sampleAnswers);
    const breakdown = calculateBreakdown(sampleAnswers);
    const comparison = calculateGreenFuture(score, breakdown, sampleAnswers);

    expect(comparison.currentFuture.co2_5yr).toBe(Math.round(score * 5 * 10) / 10);
    expect(comparison.improvedFuture.co2_5yr).toBeLessThan(comparison.currentFuture.co2_5yr);
    expect(comparison.reductionPercentage).toBeGreaterThan(0);
    expect(comparison.moneySaved).toBeGreaterThan(0);
  });

  it('should return valid values for all 1920 possible quiz combinations', () => {
    const transports = Object.keys(EMISSION_FACTORS.transport);
    const diets = Object.keys(EMISSION_FACTORS.diet);
    const energies = Object.keys(EMISSION_FACTORS.energy);
    const travels = Object.keys(EMISSION_FACTORS.travel);
    const consumptions = Object.keys(EMISSION_FACTORS.consumption);

    let count = 0;
    for (const transport of transports) {
      for (const diet of diets) {
        for (const energy of energies) {
          for (const travel of travels) {
            for (const consumption of consumptions) {
              const answers: QuizAnswer[] = [
                { questionId: 'q1', category: 'transport', value: transport },
                { questionId: 'q2', category: 'diet', value: diet },
                { questionId: 'q3', category: 'energy', value: energy },
                { questionId: 'q4', category: 'travel', value: travel },
                { questionId: 'q5', category: 'consumption', value: consumption }
              ];

              const score = calculateScore(answers);
              const breakdown = calculateBreakdown(answers);

              expect(score).toBeGreaterThanOrEqual(0.1);
              expect(typeof score).toBe('number');
              expect(isNaN(score)).toBe(false);
              expect(breakdown.transport).toBeDefined();
              expect(breakdown.diet).toBeDefined();
              expect(breakdown.energy).toBeDefined();
              expect(breakdown.travel).toBeDefined();
              expect(breakdown.consumption).toBeDefined();

              count++;
            }
          }
        }
      }
    }
    expect(count).toBe(1920);
  });
});
