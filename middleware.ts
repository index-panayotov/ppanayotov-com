import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for admin route protection
 *
 * SECURITY: Validates admin authentication cookie on server-side
 * This prevents client-side cookie manipulation and provides
 * secure authentication for all admin routes.
 *
 * Protected routes:
 * - /admin/* (except /admin/login)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page without authentication
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for admin authentication cookie
  const adminCookie = request.cookies.get('admin_authenticated');

  // If no cookie or cookie value is not 'true', redirect to login
  if (!adminCookie || adminCookie.value !== 'true') {
    // Store the intended destination to redirect back after login
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Authentication successful - allow request to proceed
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/admin/:path*', // All admin routes
  ],
};
