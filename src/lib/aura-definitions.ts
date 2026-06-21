// src/lib/aura-definitions.ts
import { AuraDefinition } from '@/types';

const AURA_DEFINITIONS: Record<string, AuraDefinition> = {
  green: {
    id: 'green',
    name: 'Green Aura',
    tagline: "Earth's Guardian",
    description: 'Your low carbon footprint is a testament to sustainable choices. You live in harmony with the planet\'s resource bounds.',
    gradient: ['hsl(140, 70%, 45%)', 'hsl(160, 80%, 55%)'],
    glowColor: 'hsla(140, 70%, 45%, 0.4)',
    thresholdMax: 2.3,
    emoji: '🟢'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Aura',
    tagline: "Nature's Ally",
    description: 'You walk a mindful path, keeping your footprint below the global average. A few small changes can make you a true guardian.',
    gradient: ['hsl(155, 65%, 40%)', 'hsl(175, 70%, 50%)'],
    glowColor: 'hsla(155, 65%, 40%, 0.4)',
    thresholdMax: 4.7,
    emoji: '🟩'
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire Aura',
    tagline: 'The Awakening Mind',
    description: 'Your emissions sit around the global average. You are aware of your impact, and you possess the capability to change the narrative.',
    gradient: ['hsl(210, 80%, 50%)', 'hsl(230, 70%, 60%)'],
    glowColor: 'hsla(210, 80%, 50%, 0.4)',
    thresholdMax: 8.0,
    emoji: '🔵'
  },
  amber: {
    id: 'amber',
    name: 'Amber Aura',
    tagline: 'The Crossroads Walker',
    description: 'Your lifestyle exceeds sustainable limits, placing you at a crossroads. The choices you make now will define your twin\'s future.',
    gradient: ['hsl(35, 90%, 55%)', 'hsl(20, 85%, 50%)'],
    glowColor: 'hsla(35, 90%, 55%, 0.4)',
    thresholdMax: 14.0,
    emoji: '🟠'
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Aura',
    tagline: 'The Wake-Up Call',
    description: 'Your carbon footprint is significantly high, stressing the Earth\'s ecosystems. This is an urgent call to reshape your daily habits.',
    gradient: ['hsl(0, 75%, 55%)', 'hsl(350, 80%, 45%)'],
    glowColor: 'hsla(0, 75%, 55%, 0.4)',
    thresholdMax: Infinity,
    emoji: '🔴'
  }
};

/**
 * Returns the corresponding AuraDefinition based on the assigned CarbonAura key.
 */
export function getAuraDefinition(aura: string): AuraDefinition {
  return AURA_DEFINITIONS[aura] || AURA_DEFINITIONS.sapphire;
}

/**
 * Safely replaces the alpha channel of an hsla color string.
 * This avoids invalid syntax like hsla(140, 70%, 45%, 0.4)40 which crashes Canvas color parsing.
 */
export function getAuraColorWithAlpha(glowColor: string, alpha: number): string {
  return glowColor.replace(/[\d.]+\)$/, `${alpha})`);
}

