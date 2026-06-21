// src/lib/demo-data.ts
import { CarbonTwin } from '@/types';
import { calculateProjections, calculateConsequences } from './carbon-engine';

const score = 7.2;
const breakdown = {
  transport: 2.8,
  diet: 1.6,
  energy: 1.2,
  travel: 0.9,
  consumption: 0.7
};

export const DEMO_TWIN: CarbonTwin = {
  id: 'demo-judge-twin',
  aura: 'sapphire',  // Deterministic assignment for score 7.2
  score,
  impactLevel: 'moderate',
  sustainabilityRating: 45,
  breakdown,
  lifeReplay: {
    narrative: "Your daily path leaves a moderate but tangible trace. Commuting, dining, and traveling weave together into an annual footprint of 7.2 tonnes. While you are not in the critical crimson zone, your lifestyle still commands resources that outpace our Earth's sustainable thresholds.",
    chapters: [
      {
        title: "Your Commute Journey",
        body: "Your daily travels, mostly relying on petrol transit, contribute a significant 2.8 tonnes of carbon to the sky.",
        icon: "🚗",
        co2Contribution: 2.8
      },
      {
        title: "The Diet footprint",
        body: "An average diet with mixed meat and dairy adds 1.6 tonnes of greenhouse gases annually.",
        icon: "🍖",
        co2Contribution: 1.6
      },
      {
        title: "Home Energy",
        body: "Powering and heating your residence with standard grid electricity releases 1.2 tonnes of CO2e.",
        icon: "⚡",
        co2Contribution: 1.2
      }
    ]
  },
  auraExplanation: "Your Sapphire Aura reflects a lifestyle near the global crossroads. It represents a state of awareness—you are conscious of your environmental footprint, and you possess the capability and agency to reshape this twin into a greener, lighter self.",
  projections: calculateProjections(score),
  consequences: calculateConsequences(score),
  greenFuture: {
    currentFuture: {
      co2_5yr: 36.0,
      cost_5yr: 44500, // (3200 + 2000 + 2200 + 1200 + 1600) * 5 = 10200 * 5 = 51000 proxy
      healthScore: 50
    },
    improvedFuture: {
      co2_5yr: 19.5,
      cost_5yr: 25500,
      healthScore: 75
    },
    reductionPercentage: 46,
    moneySaved: 19000
  },
  recommendations: [
    {
      id: 'rec-1',
      category: 'transport',
      action: 'Car pool or switch to public transit 3 days a week',
      impact: 'high',
      co2Saved: 1.4,
      difficulty: 'moderate',
      timeframe: 'immediate'
    },
    {
      id: 'rec-2',
      category: 'energy',
      action: 'Switch to a 100% renewable energy provider',
      impact: 'high',
      co2Saved: 1.1,
      difficulty: 'easy',
      timeframe: 'short-term'
    },
    {
      id: 'rec-3',
      category: 'diet',
      action: 'Adopt a flexitarian diet by swapping beef for plants',
      impact: 'medium',
      co2Saved: 0.8,
      difficulty: 'easy',
      timeframe: 'immediate'
    },
    {
      id: 'rec-4',
      category: 'consumption',
      action: 'Buy clothes and electronics second-hand',
      impact: 'medium',
      co2Saved: 0.5,
      difficulty: 'easy',
      timeframe: 'short-term'
    },
    {
      id: 'rec-5',
      category: 'travel',
      action: 'Offset unavoidable flights and travel by rail where possible',
      impact: 'low',
      co2Saved: 0.3,
      difficulty: 'moderate',
      timeframe: 'long-term'
    }
  ],
  createdAt: new Date().toISOString()
};
