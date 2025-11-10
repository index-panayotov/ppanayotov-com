import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * POST - Logout admin user
 *
 * SECURITY: Clears the HttpOnly authentication cookie
 * This ensures proper logout even though the cookie can't be
 * deleted from client-side JavaScript
 */
export async function POST() {
  try {
    logger.info('Admin logout');

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the authentication cookie by setting it with expired date
    response.cookies.set('admin_authenticated', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    return response;
  } catch (error) {
    logger.error('Logout error', error as Error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
