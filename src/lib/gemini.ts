// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiTwinOutputSchema } from './validators';
import { TWIN_GENERATION_SYSTEM_INSTRUCTION, COACH_SYSTEM_INSTRUCTION } from './prompts';
import { logger } from './logger';

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Use gemini-2.5-flash as the primary fast model
const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Generates the personalized Carbon Twin narrative, explanation, and recommendations
 * by making a single structured call to Google Gemini.
 */
export async function generateTwinNarrative(params: {
  score: number;
  aura: string;
  breakdown: Record<string, number>;
  answers: Array<{ questionId: string; category: string; value: string | number }>;
}) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: TWIN_GENERATION_SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: 'application/json'
    }
  });

  const prompt = `
INPUTS:
- Annual CO2e score: ${params.score} tonnes/year
- Assigned Aura: ${params.aura}
- Category breakdown: ${JSON.stringify(params.breakdown)}
- Quiz answers: ${JSON.stringify(params.answers)}
`;

  try {
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    if (!textResponse) {
      throw new Error('Empty response received from Gemini API');
    }

    const jsonParsed = JSON.parse(textResponse);

    // Validate using Zod schema to ensure shape correctness
    const validatedData = GeminiTwinOutputSchema.parse(jsonParsed);
    return validatedData;
  } catch (error) {
    logger.error('Error in generateTwinNarrative:', error);
    throw error;
  }
}

/**
 * Handles AI Carbon Coach chat messages, returning a streaming-capable or normal text response.
 */
export async function generateCoachResponse(params: {
  message: string;
  history: Array<{ sender: 'user' | 'coach'; text: string }>;
  score?: number;
  aura?: string;
  narrative?: string;
}) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  const systemInstructionText = `
${COACH_SYSTEM_INSTRUCTION}

User context:
- Assigned Carbon Aura: ${params.aura || 'sapphire'}
- Score: ${params.score || '7.2'} tonnes/year
- Life Replay Story: "${params.narrative || 'A moderate environmental trace.'}"
`;

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: systemInstructionText
  });

  // Convert conversation history to Gemini content parts
  const contents = params.history.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  // Append current user message
  contents.push({
    role: 'user',
    parts: [{ text: params.message }]
  });

  try {
    const result = await model.generateContent({ contents });
    const textResponse = result.response.text();
    return textResponse || "I'm here to help you reduce your carbon footprint. What area of your lifestyle would you like to discuss?";
  } catch (error) {
    logger.error('Error in generateCoachResponse:', error);
    throw error;
  }
}
