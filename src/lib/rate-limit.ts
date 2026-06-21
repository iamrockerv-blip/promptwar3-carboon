// src/lib/rate-limit.ts

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_RATE_LIMIT_KEYS = 10_000;

export interface RateLimitConfig {
  limit: number; // Maximum requests in the window
  windowMs: number; // Window size in milliseconds
}

/**
 * Checks if a given IP address has exceeded its rate limit.
 * Key-based implementation that scales in-memory.
 */
export function isRateLimited(
  ip: string,
  config: RateLimitConfig
): {
  limited: boolean;
  remaining: number;
  reset: number;
} {
  if (!Number.isInteger(config.limit) || config.limit < 1 || config.windowMs < 1) {
    throw new Error('Invalid rate-limit configuration.');
  }

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Periodic cleanup to prevent memory growth
  if (rateLimitMap.size >= MAX_RATE_LIMIT_KEYS) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now >= val.resetTime) {
        rateLimitMap.delete(key);
      }
    }

    if (rateLimitMap.size >= MAX_RATE_LIMIT_KEYS) {
      const oldestKey = rateLimitMap.keys().next().value;
      if (oldestKey) rateLimitMap.delete(oldestKey);
    }
  }

  if (!record || now >= record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + config.windowMs
    };
    rateLimitMap.set(ip, newRecord);
    return {
      limited: false,
      remaining: config.limit - 1,
      reset: Math.ceil(config.windowMs / 1000)
    };
  }

  if (record.count >= config.limit) {
    return {
      limited: true,
      remaining: 0,
      reset: Math.ceil((record.resetTime - now) / 1000)
    };
  }

  record.count += 1;
  return {
    limited: false,
    remaining: config.limit - record.count,
    reset: Math.ceil((record.resetTime - now) / 1000)
  };
}

/**
 * Helper to retrieve client IP from request headers
 */
export function getClientIp(request: Request): string {
  const trustedHeaders = [
    'x-vercel-forwarded-for',
    'cf-connecting-ip',
    'x-real-ip',
    'x-forwarded-for'
  ];

  for (const header of trustedHeaders) {
    const rawValue = request.headers.get(header);
    const candidate = rawValue?.split(',')[0]?.trim();
    if (candidate && /^[0-9a-f:.]{3,45}$/i.test(candidate)) {
      return candidate;
    }
  }

  return 'unknown-client';
}

export function clearRateLimitStore() {
  rateLimitMap.clear();
}
