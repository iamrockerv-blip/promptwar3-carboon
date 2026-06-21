// src/lib/rate-limit.ts

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  limit: number;      // Maximum requests in the window
  windowMs: number;   // Window size in milliseconds
}

/**
 * Checks if a given IP address has exceeded its rate limit.
 * Key-based implementation that scales in-memory.
 */
export function isRateLimited(ip: string, config: RateLimitConfig): {
  limited: boolean;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Periodic cleanup to prevent memory growth
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitMap.set(ip, newRecord);
    return {
      limited: false,
      remaining: config.limit - 1,
      reset: Math.ceil(config.windowMs / 1000),
    };
  }

  if (record.count >= config.limit) {
    return {
      limited: true,
      remaining: 0,
      reset: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count += 1;
  return {
    limited: false,
    remaining: config.limit - record.count,
    reset: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Helper to retrieve client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
