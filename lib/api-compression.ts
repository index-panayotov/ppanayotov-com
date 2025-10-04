/**
 * API Compression Utilities
 *
 * Provides compression helpers for API responses to reduce payload size.
 * Supports both server-side and client-side compression detection.
 */

import { NextResponse } from 'next/server';

/**
 * Check if client accepts compression
 */
export function supportsCompression(headers: Headers): boolean {
  const acceptEncoding = headers.get('accept-encoding') || '';
  return acceptEncoding.includes('gzip') || acceptEncoding.includes('br') || acceptEncoding.includes('deflate');
}

/**
 * Create a compressed JSON response
 * Note: Next.js handles actual compression, we just set appropriate headers
 */
export function createCompressedResponse<T>(
  data: T,
  status: number = 200,
  additionalHeaders?: Record<string, string>
): NextResponse {
  const response = NextResponse.json(data, { status });

  // Set cache headers for better performance
  response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');

  // Add compression hint (actual compression handled by Next.js/Vercel)
  response.headers.set('Content-Type', 'application/json; charset=utf-8');

  // Add additional headers if provided
  if (additionalHeaders) {
    Object.entries(additionalHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

/**
 * Estimate response size
 */
export function estimateResponseSize(data: any): number {
  try {
    return JSON.stringify(data).length;
  } catch {
    return 0;
  }
}

/**
 * Log large responses for optimization
 */
export function checkResponseSize(data: any, threshold: number = 100000): void {
  if (process.env.NODE_ENV === 'development') {
    const size = estimateResponseSize(data);
    if (size > threshold) {
      console.warn(`⚠️  Large API response detected: ${(size / 1024).toFixed(2)}KB`);
      console.warn('Consider pagination or field selection to reduce payload');
    }
  }
}

/**
 * Create optimized API response with compression and caching
 */
export function createOptimizedResponse<T>(
  data: T,
  options: {
    maxAge?: number;
    staleWhileRevalidate?: number;
    status?: number;
    headers?: Record<string, string>;
  } = {}
): NextResponse {
  const {
    maxAge = 300,
    staleWhileRevalidate = 60,
    status = 200,
    headers = {},
  } = options;

  // Check size in development
  checkResponseSize(data);

  const response = NextResponse.json(data, { status });

  // Set optimal cache headers
  response.headers.set(
    'Cache-Control',
    `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  );

  // Set content type
  response.headers.set('Content-Type', 'application/json; charset=utf-8');

  // Add ETag for cache validation
  const etag = generateETag(data);
  if (etag) {
    response.headers.set('ETag', etag);
  }

  // Add custom headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Generate ETag for response data
 */
function generateETag(data: any): string | null {
  try {
    const content = JSON.stringify(data);
    // Simple hash function for ETag
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `"${Math.abs(hash).toString(16)}"`;
  } catch {
    return null;
  }
}

export default createOptimizedResponse;
