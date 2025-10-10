import { NextRequest, NextResponse } from 'next/server';
import { loadBlogPost } from '@/lib/data-loader';

const isDev = process.env.NODE_ENV === 'development';

/**
 * GET - Fetch single blog post with content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDev) {
    return NextResponse.json(
      { error: 'Blog API only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const result = loadBlogPost(slug);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error loading blog post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load blog post' },
      { status: 404 }
    );
  }
}
