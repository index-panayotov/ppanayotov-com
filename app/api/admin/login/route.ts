import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  AdminLoginApiRequestSchema,
  AdminLoginApiResponse,
  validateRequestBody
} from '@/types/api';
import { API_ERROR_CODES } from '@/lib/api-response';
import { createTypedSuccessResponse, createTypedErrorResponse } from '@/lib/api-response';
import { ApiErrorCode } from '@/types/core';
import { logger } from '@/lib/logger';

/**
 * Type-safe admin login handler with Zod validation
 */
export async function POST(request: NextRequest) {
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
        API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Admin password not configured'
      );
    }

    // SECURITY: Use constant-time comparison to prevent timing attacks
    // Hash both passwords before comparing to ensure equal-length comparison
    const adminPasswordHash = crypto.createHash('sha256').update(adminPassword).digest();
    const providedPasswordHash = crypto.createHash('sha256').update(password).digest();

    // crypto.timingSafeEqual prevents timing-based password guessing
    const passwordsMatch = crypto.timingSafeEqual(adminPasswordHash, providedPasswordHash);


    console.log('Passwords match:', passwordsMatch);
    console.log('Admin Password Hash:', adminPasswordHash.toString('hex'));
    console.log('Provided Password Hash:', providedPasswordHash.toString('hex'));

    if (passwordsMatch) {
      logger.info('Successful admin login', {
        timestamp: new Date().toISOString()
      });

      const response: AdminLoginApiResponse = {
        success: true,
        token: 'authenticated', // Simple token for client-side auth state
        expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
      };

      // SECURITY: Set HttpOnly, Secure, SameSite cookie to prevent:
      // - XSS attacks (HttpOnly prevents JavaScript access)
      // - MITM attacks (Secure requires HTTPS in production)
      // - CSRF attacks (SameSite strict mode)
      const nextResponse = createTypedSuccessResponse(response, 'Login successful');

      nextResponse.cookies.set('admin_authenticated', 'true', {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
        maxAge: 60 * 60, // 1 hour (in seconds)
        path: '/'
      });

      return nextResponse;
    } else {
      logger.warn('Failed admin login attempt', {
        timestamp: new Date().toISOString()
      });

      return createTypedErrorResponse(
        API_ERROR_CODES.UNAUTHORIZED,
        'Invalid password'
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return createTypedErrorResponse(
      API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      'An error occurred during login'
    );
  }
}
