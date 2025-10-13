import { NextRequest } from 'next/server';
import { loadBlogPost } from '@/lib/data-loader';
import { logger } from '@/lib/logger';
import { createTypedSuccessResponse, createTypedErrorResponse, API_ERROR_CODES } from "@/lib/api-response";
import { withDevOnly } from '@/lib/api-utils';

/**
 * GET - Fetch single blog post with content
 * Next.js 15: params is now async and must be awaited
 */
export const GET = withDevOnly(async (
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return createTypedErrorResponse(API_ERROR_CODES.BAD_REQUEST, 'Slug parameter is required');
    }

    const result = loadBlogPost(slug);
    return createTypedSuccessResponse(result);
  } catch (error) {
    logger.error('Error loading blog post', error as Error);
    return createTypedErrorResponse(
      API_ERROR_CODES.NOT_FOUND,
      error instanceof Error ? error.message : 'Failed to load blog post'
    );
  }
});
