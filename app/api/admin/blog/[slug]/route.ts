import { NextRequest } from 'next/server';
import { loadBlogPost } from '@/lib/data-loader';
import { logger } from '@/lib/logger';
import { createTypedSuccessResponse, createTypedErrorResponse, API_ERROR_CODES } from "@/lib/api-response";
import { withDevOnly } from '@/lib/api-utils';

/**
 * GET - Fetch single blog post with content
 * Next.js 15: params is now async and must be awaited
 */
export const GET = withDevOnly((async (
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await context.params;
  try {
    const post = loadBlogPost(slug);
    return createTypedSuccessResponse(post);
  } catch (error) {
    logger.error('Error loading blog post', error as Error);
    return createTypedErrorResponse(API_ERROR_CODES.NOT_FOUND, 'Blog post not found');
  }
}) as any);
