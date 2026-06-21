import { NextResponse } from 'next/server';
import { generateCoachResponse } from '@/lib/gemini';
import { CoachInputSchema } from '@/lib/validators';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { createApiErrorResponse, readJsonBody } from '@/lib/api-security';

const RATE_LIMIT_CONFIG = {
  limit: 30,
  windowMs: 60 * 1000 // 1 minute
};

export async function POST(request: Request) {
  let responseHeaders: HeadersInit | undefined;

  try {
    const ip = getClientIp(request);
    const { limited, remaining, reset } = isRateLimited(`carbon-coach:${ip}`, RATE_LIMIT_CONFIG);

    responseHeaders = {
      'X-RateLimit-Limit': String(RATE_LIMIT_CONFIG.limit),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(reset),
      'RateLimit-Limit': String(RATE_LIMIT_CONFIG.limit),
      'RateLimit-Remaining': String(remaining),
      'RateLimit-Reset': String(reset),
      'Cache-Control': 'no-store'
    };

    if (limited) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before messaging the coach again.' },
        {
          status: 429,
          headers: {
            ...responseHeaders,
            'Retry-After': String(reset)
          }
        }
      );
    }
    const body = await readJsonBody(request);

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

    return NextResponse.json({ text }, { headers: responseHeaders });
  } catch (error) {
    logger.error('API Error in /api/carbon-coach:', error);
    return createApiErrorResponse(
      error,
      'Unable to reach the carbon coach right now.',
      responseHeaders
    );
  }
}
