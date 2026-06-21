import { describe, expect, it } from 'vitest';
import {
  getAuraColorWithAlpha,
  getAuraDefinition
} from '@/lib/aura-definitions';

describe('aura definitions', () => {
  it.each([
    ['green', 'Green Aura'],
    ['emerald', 'Emerald Aura'],
    ['sapphire', 'Sapphire Aura'],
    ['amber', 'Amber Aura'],
    ['crimson', 'Crimson Aura']
  ])('returns the %s definition', (key, expectedName) => {
    expect(getAuraDefinition(key).name).toBe(expectedName);
  });

  it('falls back safely and replaces color alpha values', () => {
    expect(getAuraDefinition('unknown').id).toBe('sapphire');
    expect(getAuraColorWithAlpha('hsla(140, 70%, 45%, 0.4)', 0.75))
      .toBe('hsla(140, 70%, 45%, 0.75)');
  });
});
