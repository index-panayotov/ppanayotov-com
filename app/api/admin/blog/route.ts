import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BlogPostSchema } from '@/lib/schemas';
import { loadBlogPosts, loadUserProfile } from '@/lib/data-loader';
import { calculateReadingTime } from '@/lib/markdown-utils';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';
import { createTypedSuccessResponse, createTypedErrorResponse, API_ERROR_CODES } from "@/lib/api-response";

const isDev = env.NODE_ENV === 'development';

/**
 * GET - List all blog posts
 */
export async function GET() {
  try {
    const blogPosts = loadBlogPosts();
    return createTypedSuccessResponse(blogPosts);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return createTypedErrorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, 'Failed to load blog posts');
  }
}

/**
 * POST - Create new blog post
 */
export async function POST(request: NextRequest) {
  if (!isDev) {
    return createTypedErrorResponse(API_ERROR_CODES.FORBIDDEN, 'Blog API only available in development mode');
  }

  try {
    const body = await request.json();
    const { metadata, content } = body;

    // Auto-populate author from user profile if not provided
    if (!metadata.author || metadata.author.trim() === '') {
      try {
        const userProfile = loadUserProfile();
        metadata.author = userProfile.name || 'Anonymous';
        logger.info('Auto-populated blog author from user profile', {
          author: metadata.author,
        });
      } catch (error) {
        logger.warn('Failed to load user profile for author, using Anonymous', {}, error as Error);
        metadata.author = 'Anonymous';
      }
    }

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
    const fileContent = `import { BlogPost } from "@/lib/schemas";

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

    fs.writeFileSync(blogPostsPath, fileContent, 'utf-8');

    // Write markdown content file
    const mdPath = path.join(process.cwd(), 'data', 'blog', `${validatedMetadata.slug}.md`);
    fs.writeFileSync(mdPath, content, 'utf-8');

    return createTypedSuccessResponse({ message: 'Blog post created successfully', data: validatedMetadata });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return createTypedErrorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Failed to create blog post');
  }
}

/**
 * PUT - Update existing blog post
 */
export async function PUT(request: NextRequest) {
  if (!isDev) {
    return createTypedErrorResponse(API_ERROR_CODES.FORBIDDEN, 'Blog API only available in development mode');
  }

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
    const fileContent = `import { BlogPost } from "@/lib/schemas";

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

    fs.writeFileSync(blogPostsPath, fileContent, 'utf-8');

    // Write markdown content file
    const mdPath = path.join(process.cwd(), 'data', 'blog', `${validatedMetadata.slug}.md`);
    fs.writeFileSync(mdPath, content, 'utf-8');

    return createTypedSuccessResponse({ message: 'Blog post updated successfully', data: validatedMetadata });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return createTypedErrorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Failed to update blog post');
  }
}

/**
 * DELETE - Delete blog post
 */
export async function DELETE(request: NextRequest) {
  if (!isDev) {
    return createTypedErrorResponse(API_ERROR_CODES.FORBIDDEN, 'Blog API only available in development mode');
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return createTypedErrorResponse(API_ERROR_CODES.BAD_REQUEST, 'Slug parameter is required');
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
    const fileContent = `import { BlogPost } from "@/lib/schemas";

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
    console.error('Error deleting blog post:', error);
    return createTypedErrorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, 'Failed to delete blog post');
  }
}
