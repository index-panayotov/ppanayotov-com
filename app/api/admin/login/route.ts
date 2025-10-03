import { NextRequest } from 'next/server';
import {
  AdminLoginApiRequestSchema,
  AdminLoginApiResponse,
  API_ERROR_CODES,
  createTypedSuccessResponse,
  createTypedErrorResponse,
  validateRequestBody
} from '@/types/api';

/**
 * Type-safe admin login handler with Zod validation
 */
export async function POST(request: NextRequest) {
  // Validate request body against schema
  const validation = await validateRequestBody(request, AdminLoginApiRequestSchema);

  if (!validation.success) {
    return createTypedErrorResponse(
      validation.error.code,
      validation.error.message,
      validation.error.details?.zodErrors?.map(err => ({
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
      return createTypedErrorResponse(
        API_ERROR_CODES.INTERNAL_ERROR,
        'Admin password not configured'
      );
    }

    if (password === adminPassword) {
      const response: AdminLoginApiResponse = {
        success: true,
        token: 'authenticated', // Simple token for client-side auth state
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };

      return createTypedSuccessResponse(response, 'Login successful');
    } else {
      return createTypedErrorResponse(
        API_ERROR_CODES.UNAUTHORIZED,
        'Invalid password'
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
