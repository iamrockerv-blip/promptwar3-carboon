import { describe, expect, it } from 'vitest';
import { CoachInputSchema, GenerateTwinInputSchema } from '@/lib/validators';

const validTwinInput = {
  score: 7.3,
  aura: 'sapphire',
  breakdown: {
    transport: 0.1,
    diet: 2.5,
    energy: 2.5,
    travel: 1,
    consumption: 1.2
  },
  answers: [
    { questionId: 'q1', category: 'transport', value: 'bike_walk' },
    { questionId: 'q2', category: 'diet', value: 'meat_regular' },
    { questionId: 'q3', category: 'energy', value: 'grid_gas' },
    { questionId: 'q4', category: 'travel', value: 'flights_1_2' },
    { questionId: 'q5', category: 'consumption', value: 'average' }
  ]
};

describe('request validation schemas', () => {
  it('accepts a complete, bounded twin payload', () => {
    expect(GenerateTwinInputSchema.parse(validTwinInput)).toEqual(validTwinInput);
  });

  it('rejects negative values, unknown fields, and duplicate categories', () => {
    expect(() => GenerateTwinInputSchema.parse({
      ...validTwinInput,
      score: -1
    })).toThrow();

    expect(() => GenerateTwinInputSchema.parse({
      ...validTwinInput,
      unexpected: true
    })).toThrow();

    expect(() => GenerateTwinInputSchema.parse({
      ...validTwinInput,
      answers: validTwinInput.answers.map((answer) => ({
        ...answer,
        category: 'transport'
      }))
    })).toThrow();

    expect(() => GenerateTwinInputSchema.parse({
      ...validTwinInput,
      answers: validTwinInput.answers.map((answer) => ({
        ...answer,
        questionId: 'duplicate'
      }))
    })).toThrow();
  });

  it('trims coach messages and bounds conversation history', () => {
    const parsed = CoachInputSchema.parse({
      message: '  Help me reduce travel emissions.  ',
      history: []
    });

    expect(parsed.message).toBe('Help me reduce travel emissions.');
    expect(() => CoachInputSchema.parse({
      message: 'Hello',
      history: Array.from({ length: 21 }, (_, index) => ({
        id: String(index),
        sender: 'user',
        text: 'Message',
        timestamp: new Date().toISOString()
      }))
    })).toThrow();
  });
});
