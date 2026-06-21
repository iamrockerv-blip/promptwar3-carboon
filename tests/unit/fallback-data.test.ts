import { describe, expect, it, vi } from 'vitest';
import { createFallbackCoachMessage, createFallbackTwin } from '@/lib/fallback-data';
import {
  calculateBreakdown,
  calculateConsequences,
  calculateGreenFuture,
  calculateProjections
} from '@/lib/carbon-engine';
import { QuizAnswer } from '@/types';

const answers: QuizAnswer[] = [
  { questionId: 'q1', category: 'transport', value: 'car_petrol' },
  { questionId: 'q2', category: 'diet', value: 'meat_regular' },
  { questionId: 'q3', category: 'energy', value: 'grid_gas' },
  { questionId: 'q4', category: 'travel', value: 'flights_6_plus' },
  { questionId: 'q5', category: 'consumption', value: 'luxury' }
];

function buildFallback(score: number) {
  const breakdown = calculateBreakdown(answers);
  return createFallbackTwin(
    score,
    score <= 2.3 ? 'green' : score <= 4.7 ? 'emerald' : score <= 14 ? 'amber' : 'crimson',
    breakdown,
    calculateProjections(score),
    calculateConsequences(score),
    calculateGreenFuture(score, breakdown, answers),
    answers
  );
}

describe('deterministic fallback data', () => {
  it.each([
    [2, 'low'],
    [4, 'moderate'],
    [10, 'high'],
    [18, 'critical']
  ] as const)('maps score %s to %s impact', (score, impactLevel) => {
    const twin = buildFallback(score);
    expect(twin.impactLevel).toBe(impactLevel);
    expect(twin.recommendations).toHaveLength(3);
    expect(twin.lifeReplay.chapters).toHaveLength(3);
  });

  it('maps easy, moderate, and hard shifts to recommendation impact levels', () => {
    const twin = buildFallback(10);
    expect(new Set(twin.recommendations.map((recommendation) => recommendation.impact))).toEqual(
      new Set(['high', 'medium'])
    );
  });

  it('creates a stable fallback coach message shape', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    expect(createFallbackCoachMessage()).toMatchObject({
      id: 'msg-1767225600000-error',
      sender: 'coach'
    });
  });
});
