// tests/unit/aura-assignment.test.ts
import { describe, it, expect } from 'vitest';
import { assignAura } from '@/lib/carbon-engine';

describe('Deterministic Carbon Aura Assignment', () => {
  it('should assign Green Aura for scores <= 2.3', () => {
    expect(assignAura(0.0)).toBe('green');
    expect(assignAura(1.5)).toBe('green');
    expect(assignAura(2.3)).toBe('green');
  });

  it('should assign Emerald Aura for scores > 2.3 and <= 4.7', () => {
    expect(assignAura(2.31)).toBe('emerald');
    expect(assignAura(3.5)).toBe('emerald');
    expect(assignAura(4.7)).toBe('emerald');
  });

  it('should assign Sapphire Aura for scores > 4.7 and <= 8.0', () => {
    expect(assignAura(4.71)).toBe('sapphire');
    expect(assignAura(6.0)).toBe('sapphire');
    expect(assignAura(8.0)).toBe('sapphire');
  });

  it('should assign Amber Aura for scores > 8.0 and <= 14.0', () => {
    expect(assignAura(8.01)).toBe('amber');
    expect(assignAura(11.2)).toBe('amber');
    expect(assignAura(14.0)).toBe('amber');
  });

  it('should assign Crimson Aura for scores > 14.0', () => {
    expect(assignAura(14.01)).toBe('crimson');
    expect(assignAura(20.0)).toBe('crimson');
    expect(assignAura(99.9)).toBe('crimson');
  });

  it('should be idempotent and return the same aura for identical scores across multiple runs', () => {
    const score = 7.5;
    const initialAura = assignAura(score);
    
    for (let i = 0; i < 100; i++) {
      expect(assignAura(score)).toBe(initialAura);
    }
  });
});
