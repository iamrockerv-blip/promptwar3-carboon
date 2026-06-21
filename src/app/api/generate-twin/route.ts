import { NextResponse } from 'next/server';
import { generateTwinNarrative } from '@/lib/gemini';
import { GenerateTwinInputSchema } from '@/lib/validators';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { createApiErrorResponse, readJsonBody } from '@/lib/api-security';

const RATE_LIMIT_CONFIG = {
  limit: 10,
  windowMs: 60 * 1000 // 1 minute
};

export async function POST(request: Request) {
  let responseHeaders: HeadersInit | undefined;

  try {
    const ip = getClientIp(request);
    const { limited, remaining, reset } = isRateLimited(
      `generate-twin:${ip}`,
      RATE_LIMIT_CONFIG
    );

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
        { error: 'Too many requests. Please wait before generating another twin.' },
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
    
    // Validate request payload
    const parsedInput = GenerateTwinInputSchema.parse(body);

    // Call Gemini API to generate twin narrative and recommendations
    const data = await generateTwinNarrative({
      score: parsedInput.score,
      aura: parsedInput.aura,
      breakdown: parsedInput.breakdown,
      answers: parsedInput.answers
    });

    return NextResponse.json(data, { headers: responseHeaders });
  } catch (error) {
    logger.error('API Error in /api/generate-twin:', error);
    return createApiErrorResponse(
      error,
      'Unable to generate the carbon twin right now.',
      responseHeaders
    );
  }
}
