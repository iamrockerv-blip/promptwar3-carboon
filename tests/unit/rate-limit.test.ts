import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearRateLimitStore, getClientIp, isRateLimited } from '@/lib/rate-limit';

describe('rate limiting', () => {
  beforeEach(() => {
    clearRateLimitStore();
    vi.useRealTimers();
  });

  it('counts requests and resets after the configured window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    expect(isRateLimited('bucket', { limit: 2, windowMs: 1_000 })).toMatchObject({
      limited: false,
      remaining: 1
    });
    expect(isRateLimited('bucket', { limit: 2, windowMs: 1_000 })).toMatchObject({
      limited: false,
      remaining: 0
    });
    expect(isRateLimited('bucket', { limit: 2, windowMs: 1_000 }).limited).toBe(true);

    vi.advanceTimersByTime(1_000);
    expect(isRateLimited('bucket', { limit: 2, windowMs: 1_000 }).limited).toBe(false);
  });

  it('validates configuration and normalizes trusted client headers', () => {
    expect(() => isRateLimited('bucket', { limit: 0, windowMs: 1_000 })).toThrow();

    const request = new Request('http://localhost', {
      headers: {
        'x-vercel-forwarded-for': '203.0.113.8, 10.0.0.1',
        'x-forwarded-for': '198.51.100.2'
      }
    });
    expect(getClientIp(request)).toBe('203.0.113.8');

    const invalid = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '<script>' }
    });
    expect(getClientIp(invalid)).toBe('unknown-client');
  });

  it('cleans expired keys and evicts the oldest key when capacity is reached', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    for (let index = 0; index < 10_000; index += 1) {
      isRateLimited(`client-${index}`, { limit: 1, windowMs: 1_000 });
    }

    vi.advanceTimersByTime(1_000);
    expect(isRateLimited('fresh-client', { limit: 1, windowMs: 1_000 }).limited).toBe(false);

    clearRateLimitStore();
    for (let index = 0; index < 10_000; index += 1) {
      isRateLimited(`active-${index}`, { limit: 1, windowMs: 60_000 });
    }
    expect(isRateLimited('capacity-client', { limit: 1, windowMs: 60_000 }).limited).toBe(false);
  });
});
