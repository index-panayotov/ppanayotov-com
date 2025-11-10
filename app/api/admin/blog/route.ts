import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BlogPostSchema } from '@/lib/schemas';
import { loadBlogPosts, loadUserProfile } from '@/lib/data-loader';
import { calculateReadingTime } from '@/lib/markdown-utils';
import { logger } from '@/lib/logger';
import { createTypedSuccessResponse, createTypedErrorResponse, API_ERROR_CODES } from "@/lib/api-response";
import { withDevOnly, generateBlogPostsFileContent, getBlogAuthor } from '@/lib/api-utils';
import { validateSlug } from '@/lib/security/slug-validator';

/**
 * GET - List all blog posts
 */
export async function GET() {
  try {
    const blogPosts = loadBlogPosts();
    return createTypedSuccessResponse(blogPosts);
  } catch (error) {
    logger.error('Error loading blog posts', error as Error);
    return createTypedErrorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, 'Failed to load blog posts');
  }
}

/**
 * POST - Create new blog post
 */
export const POST = withDevOnly(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { metadata, content } = body;

    // Auto-populate author from user profile
    const userProfile = loadUserProfile();
    metadata.author = getBlogAuthor(userProfile);

    // Validate metadata
    const validatedMetadata = BlogPostSchema.parse(metadata);

    // Calculate reading time from content
    const readingTime = calculateReadingTime(content);
    validatedMetadata.readingTime = readingTime;

    // Load existing blog posts
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.ts');
    const blogPosts = loadBlogPosts();

    // Check if slug already exists
    if (blogPosts.find((p: any) => p.slug === validatedMetadata.slug)) {
      return createTypedErrorResponse(API_ERROR_CODES.BAD_REQUEST, 'A blog post with this slug already exists');
    }

    // Add new blog post to array
    blogPosts.push(validatedMetadata);

    // Write updated blog-posts.ts file
    const fileContent = generateBlogPostsFileContent(blogPosts);
    fs.writeFileSync(blogPostsPath, fileContent, 'utf-8');

    // Write markdown content file
    const mdPath = path.join(process.cwd(), 'data', 'blog', `${validatedMetadata.slug}.md`);
    fs.writeFileSync(mdPath, content, 'utf-8');

    return createTypedSuccessResponse({ message: 'Blog post created successfully', data: validatedMetadata });
  } catch (error) {
    logger.error('Error creating blog post', error as Error);
    return createTypedErrorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Failed to create blog post');
  }
});

/**
 * PUT - Update existing blog post
 */
export const PUT = withDevOnly(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { metadata, content } = body;

    // Validate metadata
    const validatedMetadata = BlogPostSchema.parse(metadata);

    // Calculate reading time from content
    const readingTime = calculateReadingTime(content);
    validatedMetadata.readingTime = readingTime;
    validatedMetadata.updatedDate = new Date().toISOString().split('T')[0];

    // Load existing blog posts
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.ts');
    const blogPosts = loadBlogPosts();

    // Find and update the blog post
    const index = blogPosts.findIndex((p: any) => p.slug === validatedMetadata.slug);
    if (index === -1) {
      return createTypedErrorResponse(API_ERROR_CODES.NOT_FOUND, 'Blog post not found');
    }

    blogPosts[index] = validatedMetadata;

    // Write updated blog-posts.ts file
    const fileContent = generateBlogPostsFileContent(blogPosts);
    fs.writeFileSync(blogPostsPath, fileContent, 'utf-8');

    // Write markdown content file
    const mdPath = path.join(process.cwd(), 'data', 'blog', `${validatedMetadata.slug}.md`);
    fs.writeFileSync(mdPath, content, 'utf-8');

    return createTypedSuccessResponse({ message: 'Blog post updated successfully', data: validatedMetadata });
  } catch (error) {
    logger.error('Error updating blog post', error as Error);
    return createTypedErrorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Failed to update blog post');
  }
});

/**
 * DELETE - Delete blog post
 */
export const DELETE = withDevOnly(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const slugParam = searchParams.get('slug');

    if (!slugParam) {
      return createTypedErrorResponse(API_ERROR_CODES.BAD_REQUEST, 'Slug parameter is required');
    }

    // SECURITY: Validate slug to prevent path traversal attacks
    let slug: string;
    try {
      slug = validateSlug(slugParam);
    } catch (error) {
      return createTypedErrorResponse(
        API_ERROR_CODES.BAD_REQUEST,
        error instanceof Error ? error.message : 'Invalid slug format'
      );
    }

    // Load existing blog posts
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.ts');
    const blogPosts = loadBlogPosts();

    // Find blog post
    const index = blogPosts.findIndex((p: any) => p.slug === slug);
    if (index === -1) {
      return createTypedErrorResponse(API_ERROR_CODES.NOT_FOUND, 'Blog post not found');
    }

    // Remove from array
    blogPosts.splice(index, 1);

    // Write updated blog-posts.ts file
    const fileContent = generateBlogPostsFileContent(blogPosts);
    fs.writeFileSync(blogPostsPath, fileContent, 'utf-8');

    // Delete markdown file
    const mdPath = path.join(process.cwd(), 'data', 'blog', `${slug}.md`);
    if (fs.existsSync(mdPath)) {
      fs.unlinkSync(mdPath);
    }

    // Delete blog uploads folder if exists
    const uploadsPath = path.join(process.cwd(), 'public', 'uploads', 'blog', slug);
    if (fs.existsSync(uploadsPath)) {
      fs.rmSync(uploadsPath, { recursive: true, force: true });
    }

    return createTypedSuccessResponse({ message: 'Blog post deleted successfully' });
  } catch (error) {
    logger.error('Error deleting blog post', error as Error);
    return createTypedErrorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, 'Failed to delete blog post');
  }
});
