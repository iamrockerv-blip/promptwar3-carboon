import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

const DEFAULT_MAX_BODY_BYTES = 32_768;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export async function readJsonBody(
  request: Request,
  maxBytes = DEFAULT_MAX_BODY_BYTES
): Promise<unknown> {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.startsWith('application/json')) {
    throw new ApiRequestError(
      'Content-Type must be application/json.',
      415,
      'UNSUPPORTED_MEDIA_TYPE'
    );
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new ApiRequestError('Request body is too large.', 413, 'PAYLOAD_TOO_LARGE');
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > maxBytes) {
    throw new ApiRequestError('Request body is too large.', 413, 'PAYLOAD_TOO_LARGE');
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new ApiRequestError('Request body must contain valid JSON.', 400, 'INVALID_JSON');
  }
}

export function createApiErrorResponse(
  error: unknown,
  fallbackMessage: string,
  headers?: HeadersInit
) {
  const responseHeaders = {
    'Cache-Control': 'no-store',
    ...headers
  };

  if (error instanceof ApiRequestError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status, headers: responseHeaders }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Invalid request payload.',
        code: 'VALIDATION_ERROR',
        fields: error.issues.map((issue) => issue.path.join('.')).filter(Boolean)
      },
      { status: 400, headers: responseHeaders }
    );
  }

  return NextResponse.json(
    { error: fallbackMessage, code: 'INTERNAL_ERROR' },
    { status: 500, headers: responseHeaders }
  );
}
