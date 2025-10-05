import DOMPurify from 'isomorphic-dompurify';

/**
 * Input sanitization utilities for admin forms
 * Provides XSS protection and input cleaning
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeInput(input: string | undefined | null, allowHtml = false, maxLength = 1000): string {
  if (!input) return '';

  let sanitized = input.trim();

  // Limit length
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Sanitize HTML if not allowed
  if (!allowHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  } else {
    // Use DOMPurify for allowed HTML with safe defaults
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: []
    });
  }

  // Remove null bytes and other dangerous characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  return sanitized;
}

/**
 * Basic input sanitization for common use cases
 */
export function sanitizeText(input: string | undefined | null, maxLength = 1000): string {
  return sanitizeInput(input, false, maxLength);
}

export function sanitizeHtml(input: string | undefined | null, maxLength = 2000): string {
  return sanitizeInput(input, true, maxLength);
}

export function sanitizeUrl(input: string | undefined | null): string {
  return sanitizeInput(input, false, 2000);
}

export function sanitizeEmail(input: string | undefined | null): string {
  return sanitizeInput(input, false, 254);
}

/**
 * Check if input contains potentially dangerous patterns
 */
export function containsDangerousPatterns(input: string): boolean {
  if (!input) return false;

  // Check for script tags
  if (/<script/i.test(input)) return true;

  // Check for javascript: URLs
  if (/javascript:/i.test(input)) return true;

  // Check for data: URLs with script content
  if (/data:text\/html/i.test(input)) return true;

  // Check for event handlers
  if (/on\w+\s*=/i.test(input)) return true;

  return false;
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T = any>(jsonString: string, fallback: T): T {
  try {
    const parsed = JSON.parse(jsonString);
    // Additional check for dangerous content in parsed data
    const stringified = JSON.stringify(parsed);
    if (containsDangerousPatterns(stringified)) {
      console.warn('Potentially dangerous content detected in JSON, using fallback');
      return fallback;
    }
    return parsed;
  } catch (error) {
    console.warn('Failed to parse JSON, using fallback:', error);
    return fallback;
  }
}