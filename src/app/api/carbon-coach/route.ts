import { NextResponse } from 'next/server';
import { generateCoachResponse } from '@/lib/gemini';
import { CoachInputSchema } from '@/lib/validators';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const RATE_LIMIT_CONFIG = {
  limit: 30,
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
        { error: 'Too many requests. Please wait before messaging the coach again.' },
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

    // Validate chat request payload
    const parsedInput = CoachInputSchema.parse(body);

    // Call Gemini API to get coach chat reply
    const text = await generateCoachResponse({
      message: parsedInput.message,
      history: parsedInput.history,
      score: parsedInput.score,
      aura: parsedInput.aura,
      narrative: parsedInput.narrative
    });

    return NextResponse.json({ text }, { headers });
  } catch (error) {
    logger.error('API Error in /api/carbon-coach:', error);
    const err = error as { message?: string; name?: string };
    return NextResponse.json(
      { error: err?.message || 'Failed to generate coach response' },
      { status: err?.name === 'ZodError' ? 400 : 500 }
    );
  }
}
