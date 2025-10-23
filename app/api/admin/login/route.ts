import { NextRequest, NextResponse } from 'next/server';
import {
  AdminLoginApiRequestSchema,
  AdminLoginApiResponse,
  validateRequestBody
} from '@/types/api';
import { API_ERROR_CODES } from '@/lib/api-response';
import { createTypedSuccessResponse, createTypedErrorResponse } from '@/lib/api-response';
import { ApiErrorCode } from '@/types/core';
import { checkRateLimit, resetRateLimit, getClientIP, RateLimitPresets } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

/**
 * Type-safe admin login handler with Zod validation and rate limiting
 */
export async function POST(request: NextRequest) {
  // Extract client IP for rate limiting
  const clientIP = getClientIP(request);

  // Check rate limit (5 attempts per 15 minutes)
  const rateLimitResult = checkRateLimit(
    `login:${clientIP}`,
    RateLimitPresets.LOGIN.maxAttempts,
    RateLimitPresets.LOGIN.windowMs
  );

  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded for login attempt', {
      ip: clientIP,
      resetAt: new Date(rateLimitResult.resetAt).toISOString(),
      retryAfter: rateLimitResult.retryAfter
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many login attempts. Please try again in ${Math.ceil(rateLimitResult.retryAfter! / 1000 / 60)} minutes.`
        }
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimitResult.retryAfter! / 1000)),
          'X-RateLimit-Limit': String(RateLimitPresets.LOGIN.maxAttempts),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetAt / 1000))
        }
      }
    );
  }

  // Validate request body against schema
  const validation = await validateRequestBody(request, AdminLoginApiRequestSchema);

  if (!validation.success) {
    return createTypedErrorResponse(
      validation.error.code as ApiErrorCode,
      validation.error.message,
      (validation.error.details as any)?.zodErrors?.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
        value: err.input
      }))
    );
  }

  const { password } = validation.data;

  try {
    // Get the password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;



    if (!adminPassword) {
      console.error('[Admin Login] ADMIN_PASSWORD not configured in environment');
      return createTypedErrorResponse(
        API_ERROR_CODES.INTERNAL_ERROR,
        'Admin password not configured'
      );
    }

    if (password === adminPassword) {
      // Successful login - reset rate limit counter
      resetRateLimit(`login:${clientIP}`);

      logger.info('Successful admin login', {
        ip: clientIP,
        timestamp: new Date().toISOString()
      });

      const response: AdminLoginApiResponse = {
        success: true,
        token: 'authenticated', // Simple token for client-side auth state
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };

      return createTypedSuccessResponse(response, 'Login successful');
    } else {
      // Failed login - rate limit counter already incremented
      logger.warn('Failed admin login attempt', {
        ip: clientIP,
        remainingAttempts: rateLimitResult.remaining,
        timestamp: new Date().toISOString()
      });

      return createTypedErrorResponse(
        API_ERROR_CODES.UNAUTHORIZED,
        `Invalid password. ${rateLimitResult.remaining} attempts remaining.`
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return createTypedErrorResponse(
      API_ERROR_CODES.INTERNAL_ERROR,
      'An error occurred during login'
    );
  }
}
