// src/lib/validators.ts
import { z } from 'zod';

const boundedNumber = z.number().finite().min(0).max(100);
const boundedText = (max: number) => z.string().trim().min(1).max(max);

const QuizAnswerSchema = z.object({
  questionId: boundedText(32),
  value: z.union([boundedText(64), z.number().finite().min(0).max(10_000)]),
  category: z.enum(['transport', 'diet', 'energy', 'travel', 'consumption'])
}).strict();

export const GenerateTwinInputSchema = z.object({
  score: boundedNumber,
  aura: z.enum(['green', 'emerald', 'sapphire', 'amber', 'crimson']),
  breakdown: z.object({
    transport: boundedNumber,
    diet: boundedNumber,
    energy: boundedNumber,
    travel: boundedNumber,
    consumption: boundedNumber
  }).strict(),
  answers: z.array(QuizAnswerSchema).length(5)
}).strict().superRefine((input, context) => {
  const categories = new Set(input.answers.map((answer) => answer.category));
  const questionIds = new Set(input.answers.map((answer) => answer.questionId));

  if (categories.size !== 5) {
    context.addIssue({
      code: 'custom',
      path: ['answers'],
      message: 'Exactly one answer is required for each lifestyle category.'
    });
  }

  if (questionIds.size !== input.answers.length) {
    context.addIssue({
      code: 'custom',
      path: ['answers'],
      message: 'Question IDs must be unique.'
    });
  }
});

export const GeminiTwinOutputSchema = z.object({
  auraExplanation: boundedText(2_000),
  lifeReplay: z.object({
    narrative: boundedText(5_000),
    chapters: z.array(
      z.object({
        title: boundedText(120),
        body: boundedText(1_000),
        icon: boundedText(16),
        co2Contribution: boundedNumber
      }).strict()
    ).length(3)
  }).strict(),
  recommendations: z.array(
    z.object({
      id: boundedText(64),
      category: boundedText(64),
      action: boundedText(500),
      impact: z.enum(['high', 'medium', 'low']),
      co2Saved: boundedNumber,
      difficulty: z.enum(['easy', 'moderate', 'hard']),
      timeframe: z.enum(['immediate', 'short-term', 'long-term'])
    }).strict()
  ).min(3).max(12)
}).strict();

export const CoachInputSchema = z.object({
  message: boundedText(500),
  history: z.array(
    z.object({
      id: boundedText(64),
      sender: z.enum(['user', 'coach']),
      text: boundedText(2_000),
      timestamp: z.string().datetime()
    }).strict()
  ).max(20),
  score: boundedNumber.optional(),
  aura: z.enum(['green', 'emerald', 'sapphire', 'amber', 'crimson']).optional(),
  narrative: boundedText(5_000).optional()
}).strict();
