/**
 * Slug Validation Utility
 *
 * Provides secure slug validation to prevent path traversal attacks.
 * All blog-related file operations MUST use this validator before
 * constructing file paths.
 */

/**
 * Validates a blog post slug to prevent path traversal attacks
 *
 * @param slug - The slug to validate
 * @returns The validated slug
 * @throws Error if slug is invalid or contains malicious patterns
 *
 * Security Requirements:
 * - Must match format: lowercase alphanumeric with hyphens only
 * - Cannot contain path traversal sequences (.., /, \)
 * - Cannot be empty or null
 * - Must match BlogPostSchema regex pattern
 */
export function validateSlug(slug: string | null | undefined): string {
  // Check for null/undefined/empty
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    throw new Error('Slug is required and must be a non-empty string');
  }

  const trimmedSlug = slug.trim();

  // Check for path traversal patterns - CRITICAL SECURITY CHECK
  if (trimmedSlug.includes('..') || trimmedSlug.includes('/') || trimmedSlug.includes('\\')) {
    throw new Error('Slug contains invalid characters that could lead to path traversal');
  }

  // Validate against BlogPostSchema regex: lowercase alphanumeric with hyphens
  // Pattern: ^[a-z0-9]+(?:-[a-z0-9]+)*$
  // Examples: "my-blog-post", "test123", "hello-world-2024"
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!slugRegex.test(trimmedSlug)) {
    throw new Error(
      'Slug must contain only lowercase letters, numbers, and hyphens. ' +
      'Format: lowercase-with-hyphens (e.g., "my-blog-post")'
    );
  }

  // Additional length validation (reasonable limits)
  if (trimmedSlug.length < 1) {
    throw new Error('Slug must be at least 1 character long');
  }

  if (trimmedSlug.length > 200) {
    throw new Error('Slug must be no more than 200 characters long');
  }

  return trimmedSlug;
}

/**
 * Checks if a slug is valid without throwing an error
 *
 * @param slug - The slug to check
 * @returns true if slug is valid, false otherwise
 */
export function isValidSlug(slug: string | null | undefined): boolean {
  try {
    validateSlug(slug);
    return true;
  } catch {
    return false;
  }
}
