import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { loadBlogPosts, loadBlogPost } from '@/lib/data-loader';
import { BlogPost } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowLeft, Tag } from 'lucide-react';
import MarkdownRenderer from '@/components/blog/markdown-renderer';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const blogPosts = loadBlogPosts() as BlogPost[];
  const publishedPosts = blogPosts.filter(post => post.published);

  return publishedPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { metadata } = loadBlogPost(slug);

    if (!metadata.published) {
      return {
        title: 'Post Not Found',
      };
    }

    const url = `https://ppanayotov.com/blog/${slug}`;
    const imageUrl = metadata.featuredImage
      ? `https://ppanayotov.com${metadata.featuredImage}`
      : 'https://ppanayotov.com/og-image.png';

    return {
      title: `${metadata.title} | Preslav Panayotov`,
      description: metadata.description,
      authors: [{ name: metadata.author }],
      openGraph: {
        title: metadata.title,
        description: metadata.description,
        type: 'article',
        publishedTime: metadata.publishedDate,
        modifiedTime: metadata.updatedDate || metadata.publishedDate,
        authors: [metadata.author],
        url,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: metadata.title,
          },
        ],
        tags: metadata.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description: metadata.description,
        images: [imageUrl],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let metadata: BlogPost;
  let content: string;

  try {
    const result = loadBlogPost(slug);
    metadata = result.metadata;
    content = result.content;

    // Redirect if not published
    if (!metadata.published) {
      notFound();
    }
  } catch (error) {
    notFound();
  }

  // JSON-LD structured data for SEO
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: metadata.title,
    description: metadata.description,
    author: {
      '@type': 'Person',
      name: metadata.author,
    },
    datePublished: metadata.publishedDate,
    dateModified: metadata.updatedDate || metadata.publishedDate,
    image: metadata.featuredImage
      ? `https://ppanayotov.com${metadata.featuredImage}`
      : undefined,
    keywords: metadata.tags?.join(', '),
    articleBody: content,
  };

  return (
    <>
      {/* JSON-LD for Google - using Next.js Script component */}
      <Script
        id={`blog-post-${slug}-jsonld`}
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(jsonLdData)}
      </Script>

      <article className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/blog">
              <Button variant="ghost" className="mb-6 text-white hover:text-white hover:bg-slate-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">{metadata.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={metadata.publishedDate}>
                  {new Date(metadata.publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {metadata.updatedDate && metadata.updatedDate !== metadata.publishedDate && (
                  <span className="text-slate-300">
                    (updated {new Date(metadata.updatedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{metadata.author}</span>
              </div>
              {metadata.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{metadata.readingTime} min read</span>
                </div>
              )}
            </div>

            {metadata.tags && metadata.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-6">
                <Tag className="h-4 w-4" />
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm bg-slate-600 hover:bg-slate-500">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <MarkdownRenderer content={content} />
          </div>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to All Posts
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
