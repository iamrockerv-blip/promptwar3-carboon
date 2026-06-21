// src/lib/validators.ts
import { z } from 'zod';

const QuizAnswerSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.number()]),
  category: z.enum(['transport', 'diet', 'energy', 'travel', 'consumption'])
});

export const GenerateTwinInputSchema = z.object({
  score: z.number(),
  aura: z.enum(['green', 'emerald', 'sapphire', 'amber', 'crimson']),
  breakdown: z.object({
    transport: z.number(),
    diet: z.number(),
    energy: z.number(),
    travel: z.number(),
    consumption: z.number()
  }),
  answers: z.array(QuizAnswerSchema)
});

export const GeminiTwinOutputSchema = z.object({
  auraExplanation: z.string(),
  lifeReplay: z.object({
    narrative: z.string(),
    chapters: z.array(
      z.object({
        title: z.string(),
        body: z.string(),
        icon: z.string(),
        co2Contribution: z.number()
      })
    ).length(3)
  }),
  recommendations: z.array(
    z.object({
      id: z.string(),
      category: z.string(),
      action: z.string(),
      impact: z.enum(['high', 'medium', 'low']),
      co2Saved: z.number(),
      difficulty: z.enum(['easy', 'moderate', 'hard']),
      timeframe: z.enum(['immediate', 'short-term', 'long-term'])
    })
  ).min(3)
});

export const CoachInputSchema = z.object({
  message: z.string().max(500),
  history: z.array(
    z.object({
      id: z.string(),
      sender: z.enum(['user', 'coach']),
      text: z.string(),
      timestamp: z.string()
    })
  ),
  score: z.number().optional(),
  aura: z.enum(['green', 'emerald', 'sapphire', 'amber', 'crimson']).optional(),
  narrative: z.string().optional()
});
