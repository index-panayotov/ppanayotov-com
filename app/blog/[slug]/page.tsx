import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadBlogPost, loadBlogPosts } from '@/lib/data-loader';
import MarkdownRenderer from '@/components/blog/markdown-renderer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {BlogPostPageProps} from '@/types';


// Enable ISR with 1-hour revalidation for automatic content updates
export const revalidate = 3600;

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const blogPosts = loadBlogPosts(); // Load all blog posts
  return blogPosts.filter(post => post.published).map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata dynamically for each blog post
// Next.js 15: params is now async and must be awaited
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = loadBlogPost(slug);

  if (!metadata) {
    return {};
  }

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.tags.join(', '),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { metadata, content } = loadBlogPost(slug);

  if (!metadata || !content) {
    notFound();
  }

  return (
    <div>
      {/* Blog Content - Professional Template Styling */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-slate max-w-none">
          <MarkdownRenderer content={content} />
        </article>
        <Separator className="my-12" />
        <div className="flex justify-center">
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}