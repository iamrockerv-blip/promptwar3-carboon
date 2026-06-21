// src/types/index.ts

// ──────────────────────────────────────────────
// Carbon Aura System (Deterministic)
// ──────────────────────────────────────────────

export type CarbonAura = 'green' | 'emerald' | 'sapphire' | 'amber' | 'crimson';

export interface AuraDefinition {
  id: CarbonAura;
  name: string;                     // "Green Aura", "Crimson Aura", etc.
  tagline: string;                  // Short emotional descriptor
  description: string;              // 1-2 sentence personality description
  gradient: [string, string];       // Two HSL colors for gradient
  glowColor: string;                // Glow effect color
  thresholdMax: number;             // Upper bound of CO₂e range (tonnes/year)
  emoji: string;                    // Visual shorthand
}

// ──────────────────────────────────────────────
// Carbon Life Replay
// ──────────────────────────────────────────────

export interface ReplayChapter {
  title: string;                    // e.g., "Your Morning Commute"
  body: string;                     // 1-2 sentence chapter text
  icon: string;                     // Emoji or icon identifier
  co2Contribution: number;          // tonnes/year from this activity
}

export interface CarbonLifeReplay {
  narrative: string;                // AI-generated 3-5 sentence personal story
  chapters: ReplayChapter[];        // 3 story beats for animated reveal
}

// ──────────────────────────────────────────────
// Carbon Shift Simulator
// ──────────────────────────────────────────────

export interface HabitShift {
  id: string;                       // e.g., "switch-to-ev"
  category: 'transport' | 'diet' | 'energy' | 'travel' | 'consumption';
  label: string;                    // "Switch to electric vehicle"
  description: string;              // "Replacing your petrol car with an EV"
  co2Reduction: number;             // tonnes/year saved (calculated from user's baseline)
  enabled: boolean;                 // Toggle state
  icon: string;                     // Emoji
  difficulty: 'easy' | 'moderate' | 'hard';
}

export interface SimulatorState {
  activeShifts: string[];           // IDs of enabled habit shifts
  simulatedScore: number;           // Recalculated score with shifts applied
  simulatedAura: CarbonAura;        // Recalculated Aura with shifts applied
  baselineScore: number;            // Original score (before any shifts)
  baselineAura: CarbonAura;         // Original Aura
  totalReduction: number;           // Sum of all enabled shift reductions
}

// ──────────────────────────────────────────────
// Quiz
// ──────────────────────────────────────────────

export interface QuizAnswer {
  questionId: string;
  value: string | number;
  category: 'transport' | 'diet' | 'energy' | 'travel' | 'consumption';
}

// ──────────────────────────────────────────────
// Carbon Twin (Core Model)
// ──────────────────────────────────────────────

export interface CarbonBreakdown {
  transport: number;                   // tonnes CO₂e
  diet: number;
  energy: number;
  travel: number;
  consumption: number;
}

export interface TimelineProjection {
  year: number;                        // e.g., 1, 3, 5, 10
  cumulativeTonnes: number;
  treesRequired: number;
  equivalentFlights: number;
  seaLevelContribution_mm: number;
}

export interface EarthConsequence {
  populationMultiplier: number;        // default 10,000
  totalAnnualTonnes: number;
  treesRequired: number;
  flightsEquivalent: number;
  carsEquivalent: number;
  iceMelt_sqm: number;
  energyConsumption_kwh: number;
}

export interface GreenFutureComparison {
  currentFuture: {
    co2_5yr: number;
    cost_5yr: number;
    healthScore: number;
  };
  improvedFuture: {
    co2_5yr: number;
    cost_5yr: number;
    healthScore: number;
  };
  reductionPercentage: number;
  moneySaved: number;
}

export interface Recommendation {
  id: string;
  category: string;
  action: string;
  impact: 'high' | 'medium' | 'low';
  co2Saved: number;                    // tonnes/year
  difficulty: 'easy' | 'moderate' | 'hard';
  timeframe: 'immediate' | 'short-term' | 'long-term';
}

export interface CarbonTwin {
  id: string;                          // nanoid or random ID for sharing
  aura: CarbonAura;                    // DETERMINISTIC: assigned by carbon-engine.ts
  score: number;                       // Annual CO₂e in tonnes
  impactLevel: 'low' | 'moderate' | 'high' | 'critical';
  sustainabilityRating: number;        // 0-100
  breakdown: CarbonBreakdown;
  lifeReplay: CarbonLifeReplay;        // AI-generated story (from Gemini)
  auraExplanation: string;             // AI-generated explanation of WHY this Aura
  projections: TimelineProjection[];
  consequences: EarthConsequence;
  greenFuture: GreenFutureComparison;
  recommendations: Recommendation[];
  createdAt: string;                   // ISO timestamp
}

// ──────────────────────────────────────────────
// AI Carbon Coach
// ──────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

// ──────────────────────────────────────────────
// Aura Purification Quests
// ──────────────────────────────────────────────

export interface PurificationQuest {
  id: string;
  category: 'transport' | 'diet' | 'energy' | 'travel' | 'consumption';
  label: string;
  description: string;
  co2SavedKg: number;
  completed: boolean;
  icon: string;
}

// ──────────────────────────────────────────────
// Zustand Store
// ──────────────────────────────────────────────

export interface CarbonStore {
  // State
  phase: 'landing' | 'quiz' | 'generating' | 'aura-reveal' | 'life-replay' | 'results';
  isDemoMode: boolean;
  quizAnswers: QuizAnswer[];
  currentQuestion: number;
  twin: CarbonTwin | null;
  coachMessages: ChatMessage[];
  isGenerating: boolean;
  error: string | null;

  // Simulator State
  simulator: SimulatorState;

  // Quests State
  quests: PurificationQuest[];
  totalCarbonSavedKg: number;

  // Actions
  setPhase: (phase: CarbonStore['phase']) => void;
  activateDemoMode: () => void;
  answerQuestion: (answer: QuizAnswer) => void;
  goToQuestion: (index: number) => void;
  generateTwin: () => Promise<void>;
  skipIntro: () => void;               // Jump from any intro phase → 'results'
  advanceToLifeReplay: () => void;
  advanceToResults: () => void;
  sendCoachMessage: (message: string) => Promise<void>;
  reset: () => void;

  // Simulator Actions
  toggleShift: (shiftId: string) => void;   // Toggle a habit, instant recalc
  resetSimulator: () => void;               // Clear all shifts

  // Quest Actions
  completeQuest: (questId: string) => void; // Log quest completion (confetti/particle trigger)
  resetQuests: () => void;
  updateTwinAnswers: (category: 'transport' | 'diet' | 'energy' | 'travel' | 'consumption', value: string) => void;
}
