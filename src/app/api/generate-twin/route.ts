import { NextResponse } from 'next/server';
import { generateTwinNarrative } from '@/lib/gemini';
import { GenerateTwinInputSchema } from '@/lib/validators';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const RATE_LIMIT_CONFIG = {
  limit: 10,
  windowMs: 60 * 1000 // 1 minute
};

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { limited, remaining, reset } = isRateLimited(ip, RATE_LIMIT_CONFIG);

    const headers = {
      'X-RateLimit-Limit': String(RATE_LIMIT_CONFIG.limit),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(reset)
    };

    if (limited) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before generating another twin.' },
        { 
          status: 429, 
          headers: {
            ...headers,
            'Retry-After': String(reset)
          } 
        }
      );
    }
    const body = await request.json();
    
    // Validate request payload
    const parsedInput = GenerateTwinInputSchema.parse(body);

    // Call Gemini API to generate twin narrative and recommendations
    const data = await generateTwinNarrative({
      score: parsedInput.score,
      aura: parsedInput.aura,
      breakdown: parsedInput.breakdown,
      answers: parsedInput.answers
    });

    return NextResponse.json(data, { headers });
  } catch (error) {
    logger.error('API Error in /api/generate-twin:', error);
    
    const err = error as { message?: string; name?: string };
    // Return structured error response
    return NextResponse.json(
      { error: err?.message || 'Failed to generate twin narrative' },
      { status: err?.name === 'ZodError' ? 400 : 500 }
    );
  }
}
