/**
 * Rate Limiting Utility
 *
 * Provides in-memory rate limiting for API routes to prevent brute force attacks.
 * Uses LRU cache with automatic expiration for efficient memory management.
 *
 * SECURITY NOTE: This is an in-memory solution suitable for single-instance deployments.
 * For production with multiple instances, consider:
 * - Redis-based rate limiting
 * - Upstash Rate Limit (https://github.com/upstash/ratelimit)
 * - Vercel KV Store
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

// In-memory store for rate limit tracking
// Key format: `${identifier}:${endpoint}`
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check and enforce rate limit for a given identifier
 *
 * @param identifier - Unique identifier (usually IP address or user ID)
 * @param maxAttempts - Maximum number of attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result with success status and metadata
 *
 * @example
 * ```typescript
 * const ip = request.ip || 'unknown';
 * const result = checkRateLimit(ip, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
 *
 * if (!result.success) {
 *   return NextResponse.json(
 *     { error: 'Too many attempts. Please try again later.' },
 *     {
 *       status: 429,
 *       headers: {
 *         'Retry-After': String(Math.ceil(result.retryAfter! / 1000)),
 *         'X-RateLimit-Limit': String(maxAttempts),
 *         'X-RateLimit-Remaining': '0',
 *         'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000))
 *       }
 *     }
 *   );
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes default
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No existing entry or window expired - create new entry
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt
    });

    return {
      success: true,
      remaining: maxAttempts - 1,
      resetAt
    };
  }

  // Entry exists and window is still active
  if (entry.count >= maxAttempts) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter: entry.resetAt - now
    };
  }

  // Increment counter
  entry.count += 1;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    remaining: maxAttempts - entry.count,
    resetAt: entry.resetAt
  };
}

/**
 * Reset rate limit for a given identifier
 * Useful for clearing limits after successful authentication
 *
 * @param identifier - Unique identifier to reset
 *
 * @example
 * ```typescript
 * // After successful login, reset failed attempt counter
 * resetRateLimit(ip);
 * ```
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Get current rate limit status without incrementing counter
 * Useful for checking status before performing an action
 *
 * @param identifier - Unique identifier to check
 * @param maxAttempts - Maximum number of attempts allowed
 * @returns Current rate limit status
 */
export function getRateLimitStatus(
  identifier: string,
  maxAttempts: number = 5
): Omit<RateLimitResult, 'success'> {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    return {
      remaining: maxAttempts,
      resetAt: now + (15 * 60 * 1000)
    };
  }

  return {
    remaining: Math.max(0, maxAttempts - entry.count),
    resetAt: entry.resetAt,
    retryAfter: entry.count >= maxAttempts ? entry.resetAt - now : undefined
  };
}

/**
 * Configuration presets for common rate limiting scenarios
 */
export const RateLimitPresets = {
  /** Strict login protection: 5 attempts per 15 minutes */
  LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },

  /** API rate limit: 100 requests per minute */
  API: { maxAttempts: 100, windowMs: 60 * 1000 },

  /** File upload limit: 10 uploads per hour */
  UPLOAD: { maxAttempts: 10, windowMs: 60 * 60 * 1000 },

  /** Password reset: 3 attempts per hour */
  PASSWORD_RESET: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
} as const;

/**
 * Extract client IP address from Next.js request
 * Handles various proxy configurations
 *
 * @param request - Next.js request object
 * @returns Client IP address or 'unknown' if not determinable
 */
export function getClientIP(request: Request): string {
  // Try various headers in order of reliability
  const headers = request.headers;

  // Cloudflare
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  // Standard forwarded header
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // Take the first IP in the list
    return xForwardedFor.split(',')[0].trim();
  }

  // Real IP (used by some proxies)
  const xRealIP = headers.get('x-real-ip');
  if (xRealIP) return xRealIP;

  // Vercel-specific header
  const xVercelForwardedFor = headers.get('x-vercel-forwarded-for');
  if (xVercelForwardedFor) return xVercelForwardedFor.split(',')[0].trim();

  return 'unknown';
}
