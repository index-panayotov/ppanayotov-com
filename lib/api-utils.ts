import { NextRequest, NextResponse } from 'next/server';
import { env } from './env';
import { createTypedErrorResponse, createTypedSuccessResponse, API_ERROR_CODES } from './api-response';
import { logger } from './logger';
import { BlogPost, UserProfile, SystemSettings } from './schemas';

/**
 * API Utility Functions
 *
 * This file provides utility functions to reduce boilerplate in API routes:
 * - Dev-only route protection
 * - Error handling wrappers
 * - File template generators
 */

// === DEV-ONLY ROUTE PROTECTION ===

/**
 * Higher-order function to protect API routes in development-only mode
 * Eliminates repeated isDev checks across routes
 *
 * @param handler - The API route handler function
 * @returns Protected handler that checks dev mode first
 *
 * @example
 * export const POST = withDevOnly(async (request) => {
 *   // Your handler code here
 * });
 */
export function withDevOnly<T = any>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    const isDev = env.NODE_ENV === 'development';

    if (!isDev) {
      return createTypedErrorResponse(
        API_ERROR_CODES.FORBIDDEN,
        'This API is only available in development mode'
      ) as NextResponse<T>;
    }

    return handler(request);
  };
}

// === ERROR HANDLING WRAPPER ===

/**
 * Higher-order function to wrap API handlers with consistent error handling
 * Eliminates repeated try/catch blocks
 *
 * @param handler - The API route handler function
 * @param context - Optional context for logging (e.g., 'Blog API', 'Upload API')
 * @returns Wrapped handler with error handling
 *
 * @example
 * export const POST = withErrorHandler(async (request) => {
 *   // Your handler code - errors automatically caught and logged
 *   return createTypedSuccessResponse({ message: 'Success' });
 * }, 'Blog Creation');
 */
export function withErrorHandler<T = any>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>,
  context?: string
) {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    try {
      return await handler(request);
    } catch (error) {
      const errorContext = context ? `${context} error` : 'API error';
      logger.error(errorContext, error as Error, {
        url: request.url,
        method: request.method,
      });

      return createTypedErrorResponse(
        API_ERROR_CODES.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'An unexpected error occurred'
      ) as NextResponse<T>;
    }
  };
}

/**
 * Combine dev-only protection with error handling
 *
 * @example
 * export const POST = withDevOnlyAndErrorHandler(async (request) => {
 *   // Handler code
 * }, 'Admin API');
 */
export function withDevOnlyAndErrorHandler<T = any>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>,
  context?: string
) {
  return withDevOnly(withErrorHandler(handler, context));
}

// === FILE TEMPLATE GENERATORS ===

/**
 * Generate TypeScript file content for blog-posts.ts
 * Eliminates 3 duplicate template strings in blog route
 *
 * SECURITY: Always validate blogPosts with BlogPostSchema before calling this function
 * JSON.stringify() provides some protection, but schema validation ensures:
 * - No unexpected properties
 * - Correct data types
 * - Required fields present
 *
 * @param blogPosts - Array of blog post metadata (MUST be pre-validated with BlogPostSchema)
 * @returns Formatted TypeScript file content
 */
export function generateBlogPostsFileContent(blogPosts: BlogPost[]): string {
  return `import { BlogPost } from "@/lib/schemas";

/**
 * Blog Posts Metadata
 *
 * This file contains metadata for all blog posts.
 * The actual content is stored in markdown files in /data/blog/
 *
 * Each blog post requires:
 * - A unique slug (used in URL and filename)
 * - A corresponding .md file at /data/blog/{slug}.md
 * - Metadata including title, description, dates, author, tags
 */

export const blogPosts: BlogPost[] = ${JSON.stringify(blogPosts, null, 2)};
`;
}

/**
 * Generate TypeScript file content for data files
 * Eliminates repetitive if/else chains in admin route
 *
 * SECURITY: Always validate data with appropriate Zod schema before calling this function
 * - cv-data.ts: Validate with ExperienceEntrySchema
 * - user-profile.ts: Validate with UserProfileSchema
 * - system_settings.ts: Validate with SystemSettingsSchema
 * - topSkills.ts: Validate as string array
 *
 * JSON.stringify() escapes special characters, but validation prevents:
 * - Prototype pollution attacks
 * - Unexpected object properties
 * - Type confusion attacks
 *
 * @param fileName - Name of the data file (e.g., 'cv-data.ts', 'user-profile.ts')
 * @param data - Data to serialize (MUST be pre-validated with appropriate schema)
 * @returns Formatted TypeScript file content
 */
export function generateDataFileContent(fileName: string, data: any): string {
  switch (fileName) {
    case 'cv-data.ts':
      return `import { ExperienceEntry } from "@/types";

export const experiences: ExperienceEntry[] = ${JSON.stringify(data, null, 2)};
`;

    case 'topSkills.ts':
      return `export const topSkills = ${JSON.stringify(data, null, 2)};
`;

    case 'user-profile.ts':
      const serialized = JSON.stringify(data, null, 2);
      return `import { LanguageProficiency, UserProfile } from "@/lib/schemas";

export const userProfile: UserProfile = ${serialized};
`;

    case 'system_settings.ts':
      // Ensure complete settings object with defaults
      const settings = data as SystemSettings;
      const completeSettings: SystemSettings = {
        blogEnable: settings.blogEnable ?? false,
        useWysiwyg: settings.useWysiwyg ?? true,
        showContacts: settings.showContacts ?? true,
        gtagCode: settings.gtagCode ?? '',
        gtagEnabled: settings.gtagEnabled ?? false,
        selectedTemplate: settings.selectedTemplate ?? 'classic',
        pwa: {
          siteName: settings.pwa?.siteName ?? 'CV Website',
          shortName: settings.pwa?.shortName ?? 'CV',
          description: settings.pwa?.description ?? '',
          startUrl: settings.pwa?.startUrl ?? '/',
          display: settings.pwa?.display ?? 'standalone',
          backgroundColor: settings.pwa?.backgroundColor ?? '#ffffff',
          themeColor: settings.pwa?.themeColor ?? '#0f172a',
          orientation: settings.pwa?.orientation ?? 'portrait-primary',
          categories: settings.pwa?.categories ?? [],
          icons: settings.pwa?.icons ?? [],
        },
      };

      return `// system_settings.ts
// Exports system-wide settings as a JSON object

const systemSettings = ${JSON.stringify(completeSettings, null, 2)};

export default systemSettings;
`;

    default:
      throw new Error(`Unknown file type: ${fileName}`);
  }
}

/**
 * Auto-populate blog author from user profile
 * Consistent fallback strategy across blog operations
 *
 * @param userProfile - User profile data
 * @returns Author name or 'Anonymous' fallback
 */
export function getBlogAuthor(userProfile: UserProfile): string {
  return userProfile.name || 'Anonymous';
}
