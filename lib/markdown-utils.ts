/**
 * Markdown Utilities
 *
 * Utilities for markdown processing and metadata generation
 */

/**
 * Calculate reading time in minutes
 *
 * @param markdown - Markdown content
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadingTime(markdown: string): number {
  const wordsPerMinute = 200;
  const words = markdown
    .replace(/[#*`>\-\[\]()]/g, '') // Remove markdown syntax
    .split(/\s+/)
    .filter(word => word.length > 0);

  const minutes = words.length / wordsPerMinute;
  return Math.max(1, Math.ceil(minutes));
}

/**
 * Generate slug from title
 *
 * @param title - Blog post title
 * @returns URL-safe slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Truncate text to a specific length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Extract plain text from markdown
 *
 * @param markdown - Markdown string
 * @returns Plain text without markdown syntax
 */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/[#*`>\-\[\]()]/g, '') // Remove markdown syntax
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\n{2,}/g, '\n') // Collapse multiple newlines
    .trim();
}
