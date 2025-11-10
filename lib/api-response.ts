import { NextResponse } from 'next/server';
import { generateETag, checkResponseSize } from './api-compression';
import { logger } from './logger';

export enum API_ERROR_CODES {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
}

// Type alias for API error code values
export type ApiErrorCode = API_ERROR_CODES;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: API_ERROR_CODES;
    message: string;
    details?: Record<string, any>;
  };
}

interface ApiResponseOptions {
  maxAge?: number;
  staleWhileRevalidate?: number;
  status?: number;
  headers?: Record<string, string>;
}

// Function overloads to support both string message and options object
export function createTypedSuccessResponse<T>(data: T, message?: string): NextResponse;
export function createTypedSuccessResponse<T>(data: T, options?: ApiResponseOptions): NextResponse;
export function createTypedSuccessResponse<T>(data: T, optionsOrMessage?: ApiResponseOptions | string): NextResponse {
  // Determine if second param is a string (message) or options object
  const isMessage = typeof optionsOrMessage === 'string';
  const options: ApiResponseOptions = isMessage ? {} : (optionsOrMessage || {});

  const {
    maxAge = 300,
    staleWhileRevalidate = 60,
    status = 200,
    headers = {},
  } = options;

  checkResponseSize(data);

  const responsePayload: ApiResponse<T> = {
    success: true,
    data,
  };

  const response = NextResponse.json(responsePayload, { status });

  response.headers.set(
    'Cache-Control',
    `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  );
  response.headers.set('Content-Type', 'application/json; charset=utf-8');

  const etag = generateETag(responsePayload);
  if (etag) {
    response.headers.set('ETag', etag);
  }

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export function createTypedErrorResponse(
  code: API_ERROR_CODES,
  message: string,
  details?: Record<string, any>,
  options: ApiResponseOptions = {}
): NextResponse {
  let { status = 500, headers = {} } = options;

  const responsePayload: ApiResponse<any> = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };

  switch (code) {
    case API_ERROR_CODES.BAD_REQUEST:
    case API_ERROR_CODES.VALIDATION_ERROR:
    case API_ERROR_CODES.PAYLOAD_TOO_LARGE:
      status = 400;
      break;
    case API_ERROR_CODES.UNAUTHORIZED:
      status = 401;
      break;
    case API_ERROR_CODES.FORBIDDEN:
      status = 403;
      break;
    case API_ERROR_CODES.NOT_FOUND:
      status = 404;
      break;
    case API_ERROR_CODES.METHOD_NOT_ALLOWED:
      status = 405;
      break;
    case API_ERROR_CODES.UNPROCESSABLE_ENTITY:
      status = 422;
      break;
    case API_ERROR_CODES.RATE_LIMIT_EXCEEDED:
      status = 429;
      break;
    case API_ERROR_CODES.SERVICE_UNAVAILABLE:
      status = 503;
      break;
    case API_ERROR_CODES.GATEWAY_TIMEOUT:
      status = 504;
      break;
    case API_ERROR_CODES.INTERNAL_SERVER_ERROR:
    default:
      status = 500;
      break;
  }

  const response = NextResponse.json(responsePayload, { status });

  response.headers.set('Content-Type', 'application/json; charset=utf-8');

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}