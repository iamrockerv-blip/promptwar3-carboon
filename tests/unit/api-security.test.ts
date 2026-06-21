import { describe, expect, it } from 'vitest';
import {
  ApiRequestError,
  createApiErrorResponse,
  readJsonBody
} from '@/lib/api-security';
import { z } from 'zod';

describe('API request security helpers', () => {
  it('accepts valid JSON requests', async () => {
    const request = new Request('http://localhost/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ safe: true })
    });

    await expect(readJsonBody(request)).resolves.toEqual({ safe: true });
  });

  it('rejects non-JSON content types', async () => {
    const request = new Request('http://localhost/api', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: '{}'
    });

    await expect(readJsonBody(request)).rejects.toMatchObject({
      status: 415,
      code: 'UNSUPPORTED_MEDIA_TYPE'
    });
  });

  it('rejects malformed and oversized payloads', async () => {
    const malformed = new Request('http://localhost/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"broken":'
    });
    const oversized = new Request('http://localhost/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': '50000'
      },
      body: '{}'
    });
    const oversizedWithoutHeader = new Request('http://localhost/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: 'x'.repeat(200) })
    });

    await expect(readJsonBody(malformed)).rejects.toMatchObject({
      status: 400,
      code: 'INVALID_JSON'
    });
    await expect(readJsonBody(oversized)).rejects.toMatchObject({
      status: 413,
      code: 'PAYLOAD_TOO_LARGE'
    });
    await expect(readJsonBody(oversizedWithoutHeader, 64)).rejects.toMatchObject({
      status: 413,
      code: 'PAYLOAD_TOO_LARGE'
    });
  });

  it('sanitizes validation and unexpected errors', async () => {
    let validationError: unknown;
    try {
      z.object({ score: z.number() }).parse({ score: 'bad' });
    } catch (error) {
      validationError = error;
    }

    const validationResponse = createApiErrorResponse(validationError, 'Fallback');
    expect(validationResponse.status).toBe(400);
    await expect(validationResponse.json()).resolves.toEqual({
      error: 'Invalid request payload.',
      code: 'VALIDATION_ERROR',
      fields: ['score']
    });

    const unexpectedResponse = createApiErrorResponse(
      new Error('Database connection details'),
      'Safe fallback'
    );
    expect(unexpectedResponse.status).toBe(500);
    await expect(unexpectedResponse.json()).resolves.toEqual({
      error: 'Safe fallback',
      code: 'INTERNAL_ERROR'
    });
  });

  it('returns structured request errors without caching', async () => {
    const response = createApiErrorResponse(
      new ApiRequestError('Bad payload.', 400, 'BAD_PAYLOAD'),
      'Fallback'
    );

    expect(response.status).toBe(400);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    await expect(response.json()).resolves.toEqual({
      error: 'Bad payload.',
      code: 'BAD_PAYLOAD'
    });
  });
});
