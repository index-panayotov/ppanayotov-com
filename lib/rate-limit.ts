/**
 * API Rate Limiting
 *
 * Simple in-memory rate limiting to prevent API abuse and excessive costs.
 * Tracks requests by IP address and enforces configurable limits.
 *
 * Features:
 * - Per-IP rate limiting
 * - Configurable time windows
 * - Automatic cleanup of expired records
 * - TypeScript type safety
 *
 * Usage:
 *   import { checkRateLimit } from '@/lib/rate-limit';
 *
 *   export async function POST(request: NextRequest) {
 *     const { limited, remaining } = checkRateLimit(request, 5, 60000); // 5 req/min
 *
 *     if (limited) {
 *       return NextResponse.json(
 *         { error: 'Rate limit exceeded' },
 *         { status: 429 }
 *       );
 *     }
 *
 *     // ... handle request
 *   }
 *
 * Note: In-memory storage means limits reset on server restart.
 * For production with multiple servers, consider Redis or similar.
 */

import { NextRequest } from 'next/server';
import { logger } from './logger';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

/**
 * In-memory storage for rate limit tracking
 * Key: IP address, Value: { count, resetAt }
 */
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Cleanup interval - remove expired records every 5 minutes
 */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

/**
 * Extracts client IP address from request
 * Handles proxies and load balancers
 */
function getClientIP(req: NextRequest): string {
  // Check common proxy headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for may contain multiple IPs, use the first one
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback
  return req.ip || 'unknown';
}

/**
 * Cleans up expired rate limit records
 */
function cleanupExpiredRecords(): void {
  const now = Date.now();

  // Only cleanup if enough time has passed
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }

  let removedCount = 0;
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(ip);
      removedCount++;
    }
  }

  if (removedCount > 0) {
    logger.debug(`Cleaned up ${removedCount} expired rate limit records`);
  }

  lastCleanup = now;
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  /** Whether the request should be rate limited */
  limited: boolean;
  /** Number of requests remaining in current window */
  remaining: number;
  /** Timestamp when the rate limit resets (Unix timestamp in ms) */
  resetAt: number;
}

/**
 * Checks if a request should be rate limited
 *
 * @param req - Next.js request object
 * @param limit - Maximum number of requests allowed in the time window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns Rate limit result with limited status and remaining count
 */
export function checkRateLimit(
  req: NextRequest,
  limit: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  cleanupExpiredRecords();

  const ip = getClientIP(req);
  const now = Date.now();

  const record = rateLimitStore.get(ip);

  // No existing record - create new one
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(ip, { count: 1, resetAt });

    return {
      limited: false,
      remaining: limit - 1,
      resetAt,
    };
  }

  // Existing record - check if limit exceeded
  if (record.count >= limit) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`, {
      ip,
      count: record.count,
      limit,
    });

    return {
      limited: true,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  // Increment count
  record.count++;

  return {
    limited: false,
    remaining: limit - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Resets rate limit for a specific IP (useful for testing)
 *
 * @param ip - IP address to reset
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
  logger.debug(`Reset rate limit for IP: ${ip}`);
}

/**
 * Gets current rate limit stats (useful for monitoring)
 */
export function getRateLimitStats(): { totalIPs: number; records: Array<{ ip: string; count: number; resetAt: number }> } {
  const records: Array<{ ip: string; count: number; resetAt: number }> = [];

  for (const [ip, record] of rateLimitStore.entries()) {
    records.push({ ip, count: record.count, resetAt: record.resetAt });
  }

  return {
    totalIPs: rateLimitStore.size,
    records,
  };
}
