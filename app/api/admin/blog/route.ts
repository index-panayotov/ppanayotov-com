import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BlogPostSchema } from '@/lib/schemas';
import { loadBlogPosts, loadUserProfile } from '@/lib/data-loader';
import { calculateReadingTime } from '@/lib/markdown-utils';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';

const isDev = env.NODE_ENV === 'development';

/**
 * GET - List all blog posts
 */
export async function GET() {
  try {
    const blogPosts = loadBlogPosts();
    return NextResponse.json({ success: true, data: blogPosts });
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to load blog posts' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create new blog post
 */
export async function POST(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json(
      { error: 'Blog API only available in development mode' },
      { status: 403 }
    );
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
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: validatedMetadata
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update existing blog post
 */
export async function PUT(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json(
      { error: 'Blog API only available in development mode' },
      { status: 403 }
    );
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
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
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

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: validatedMetadata
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete blog post
 */
export async function DELETE(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json(
      { error: 'Blog API only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    // Load existing blog posts
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.ts');
    const blogPosts = loadBlogPosts();

    // Find blog post
    const index = blogPosts.findIndex((p: any) => p.slug === slug);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
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

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
