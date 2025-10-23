import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Make sure to add ADMIN_PASSWORD to your .env file
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is for the admin area (pages or API routes)
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    // Check if the user is authenticated
    const isAuthenticated = request.cookies.has('admin_authenticated');

    // Allow login page and login API without authentication
    if (path === '/admin/login' || path === '/api/admin/login') {
      // If already authenticated, redirect to dashboard
      if (isAuthenticated && path === '/admin/login') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // All other admin routes require authentication
    if (!isAuthenticated) {
      // For API routes, return 401 instead of redirect
      if (path.startsWith('/api/admin')) {
        return NextResponse.json(
          { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
          { status: 401 }
        );
      }
      // For page routes, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
