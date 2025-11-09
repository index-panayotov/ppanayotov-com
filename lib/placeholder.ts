/**
 * Placeholder Image Utilities
 *
 * Generates base64-encoded inline SVG placeholders for images.
 * Uses data URLs to avoid network requests and provide instant rendering.
 */

/**
 * Generates a professional-looking placeholder image as a data URL
 *
 * Creates an inline SVG with:
 * - Customizable dimensions
 * - Slate-themed colors matching the site design
 * - "No Image" text centered in the placeholder
 * - Base64 encoding for use in Next.js Image component
 *
 * @param width - Width of the placeholder in pixels (default: 400)
 * @param height - Height of the placeholder in pixels (default: 300)
 * @returns Base64-encoded data URL string
 *
 * @example
 * ```typescript
 * const placeholder = generatePlaceholderDataURL(400, 300);
 * <Image src={placeholder} alt="Placeholder" />
 * ```
 */
export function generatePlaceholderDataURL(
  width: number = 400,
  height: number = 300
): string {
  // Create SVG with professional slate-themed design
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#f1f5f9"/>
    <text
      x="50%"
      y="50%"
      font-family="system-ui, -apple-system, sans-serif"
      font-size="18"
      font-weight="500"
      fill="#94a3b8"
      text-anchor="middle"
      dominant-baseline="middle"
    >No Image</text>
  </svg>`;

  // Encode to base64 and return as data URL
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generates a simple blur placeholder for Next.js Image component
 *
 * Creates a minimal 10x10 gray square for blur-up effect.
 * Use with Next.js Image `placeholder="blur"` prop.
 *
 * @returns Base64-encoded blur placeholder data URL
 *
 * @example
 * ```typescript
 * <Image
 *   src="/image.jpg"
 *   placeholder="blur"
 *   blurDataURL={generateBlurPlaceholder()}
 * />
 * ```
 */
export function generateBlurPlaceholder(): string {
  const svg = `<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
    <rect width="10" height="10" fill="#cbd5e1"/>
  </svg>`;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Pre-generated common placeholder sizes for performance
 */
export const PLACEHOLDER_PRESETS = {
  /** Square avatar placeholder (200x200) */
  avatar: generatePlaceholderDataURL(200, 200),

  /** Standard profile image (400x300) */
  profile: generatePlaceholderDataURL(400, 300),

  /** Thumbnail size (150x150) */
  thumbnail: generatePlaceholderDataURL(150, 150),

  /** Banner/hero size (1200x400) */
  banner: generatePlaceholderDataURL(1200, 400),

  /** Common blur placeholder */
  blur: generateBlurPlaceholder(),
} as const;
