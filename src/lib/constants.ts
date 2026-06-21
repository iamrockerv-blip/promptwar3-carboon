// src/lib/constants.ts

/**
 * Annual CO2e emission factors (in tonnes/year) per quiz option.
 * References:
 * - Transport: UK DEFRA 2024 Conversion Factors
 * - Diet: Poore & Nemecek (2018), Science (Food Life Cycle Assessment)
 * - Energy: IEA Country Grid Factors 2024
 * - Flights: ICAO Carbon Emissions Calculator
 * - Consumption: EPA Household Carbon Footprint Calculator
 */
export const EMISSION_FACTORS = {
  transport: {
    car_petrol: 4.6,       // Standard petrol/diesel vehicle commuter
    car_electric: 1.5,     // Electric vehicle (accounting for battery & grid mix)
    public_transit: 1.0,   // Bus, train, subway commuter
    bike_walk: 0.1,        // Human-powered transport
    remote: 0.2            // Work from home, very low commute
  },
  diet: {
    meat_lover: 3.3,       // High meat consumption daily
    meat_regular: 2.5,     // Average meat consumption
    flexitarian: 1.7,      // Meat-reduced, plant-heavy
    pescatarian: 1.4,      // Fish and vegetarian
    vegetarian: 1.0,       // No meat, dairy/eggs included
    vegan: 0.7             // Strictly plant-based
  },
  energy: {
    grid_gas: 2.5,         // Fossil fuel heavy grid + gas heating
    solar_mix: 0.8,        // Solar panels or renewable contract
    oil_wood: 3.2,         // Oil burner or wood pellets (high carbon density)
    shared_low: 1.2        // Small apartment, shared building energy footprint
  },
  travel: {
    never: 0.0,            // No air travel
    flights_1_2: 1.0,      // Short-haul or 1 long-haul round-trip
    flights_3_5: 2.8,      // Frequent traveler
    flights_6_plus: 5.5    // Transcontinental frequent flyer
  },
  consumption: {
    minimalist: 0.5,       // Buy second-hand, keep products for a long time
    average: 1.2,          // Normal purchasing habits
    frequent: 2.0,         // Constant online ordering, fast fashion
    luxury: 3.5            // High-end consumer, frequent upgrading of electronics
  }
} as const;

/**
 * Deterministic boundaries for assigning the Carbon Aura (in tonnes/year of CO2e).
 */
export const AURA_THRESHOLDS = {
  green: 2.3,      // ≤ Paris Agreement target (2.3t)
  emerald: 4.7,    // ≤ Global average (4.7t)
  sapphire: 8.0,   // ≤ China average (8.0t)
  amber: 14.0      // ≤ US average (14.0t)
  // Crimson is anything above 14.0
} as const;



/**
 * Multipliers for environmental consequences (based on 10,000 population projection).
 * - Ice melt: ~3 sqm per tonne of CO2 (Notz & Stroeve, 2016, Science)
 * - Tree absorption: ~0.022 tonnes (22kg) per tree per year (EPA)
 * - Car equivalent: ~4.6 tonnes per average passenger car per year (EPA)
 * - Flight equivalent: ~1.0 tonne per passenger flight (London to New York roundtrip)
 * - Energy equivalent: ~2,500 kWh per tonne of CO2 (Global grid average)
 */
export const CONSEQUENCE_CONSTANTS = {
  populationMultiplier: 10000,
  iceMeltPerTonneSqm: 3.0,
  treeAbsorbtionPerYearTonnes: 0.022,
  carEmissionPerYearTonnes: 4.6,
  flightEmissionTonnes: 1.0,
  kwhPerTonneCo2: 2500
} as const;

/**
 * Sea-level rise contribution (in mm) per tonne of CO2e.
 */
export const SEA_LEVEL_COEFFICIENT = 0.00015;

/**
 * Baseline parameters and offsets for health score calculation.
 */
export const HEALTH_SCORE_CONSTANTS = {
  baseScore: 60,
  minScore: 10,
  maxScore: 95,
  bikeWalkBonus: 20,
  carPetrolPenalty: 10,
  veganVegetarianBonus: 15,
  meatLoverPenalty: 10,
  improvedBonus: 15,
  improvedBikeWalkBonus: 10
} as const;

export const COACH_MESSAGES = {
  FALLBACK_ERROR: "I'm having trouble connecting to my servers right now. Try focusing on reducing travel or power usage, which are high-impact areas!",
  WELCOME_COACH: (aura: string) => `Hello! I'm your Carbon Coach. Your ${aura.toUpperCase()} Aura shows where you stand today. Let's work together to shift it! What habit should we tackle first?`,
  WELCOME_DEMO: `Welcome! I'm your AI Carbon Coach. As a Sapphire Aura, you're at a key transition point. Ask me anything about how to reduce your footprint!`
} as const;
