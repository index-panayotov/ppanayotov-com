import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Make sure to add ADMIN_PASSWORD to your .env file
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is for the admin area
  if (path.startsWith('/admin')) {
    // Check if the user is authenticated
    const isAuthenticated = request.cookies.has('admin_authenticated');
    
    // If not authenticated and not already on the login page, redirect to login
    if (!isAuthenticated && path !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // If authenticated and trying to access login page, redirect to admin dashboard
    if (isAuthenticated && path === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
