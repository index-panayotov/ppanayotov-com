import { Metadata } from 'next';
import Link from 'next/link';
import { loadBlogPosts, loadUserProfile, loadSystemSettings } from '@/lib/data-loader';
import { BlogPost } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBlogHeaderClasses } from '@/lib/utils';

/**
 * Blog listing page with pagination
 *
 * Caching Strategy:
 * - Uses Next.js Incremental Static Regeneration (ISR) with on-demand rendering
 * - Pagination handled via query string (?page=2) - pages generated on first request
 * - Pages automatically revalidate every hour (3600 seconds)
 * - All data loaded from static files (no database queries)
 * - Provides fast page loads with automatic content updates
 */

// Enable ISR with 1-hour revalidation
export const revalidate = 3600;

// Generate metadata dynamically from user profile
export async function generateMetadata(): Promise<Metadata> {
  const userProfile = loadUserProfile();

  return {
    title: `Blog | ${userProfile.name}`,
    description: 'Explore articles on software development, technology insights, and professional experiences.',
    openGraph: {
      title: `Blog | ${userProfile.name}`,
      description: 'Explore articles on software development, technology insights, and professional experiences.',
      type: 'website',
    },
  };
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const POSTS_PER_PAGE = 10;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);

  const allPosts = loadBlogPosts() as BlogPost[];
  const systemSettings = loadSystemSettings();
  const headerClasses = getBlogHeaderClasses(systemSettings.selectedTemplate);

  // Filter only published posts and sort by date (newest first)
  const publishedPosts = allPosts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  // Calculate pagination
  const totalPosts = publishedPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = publishedPosts.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
        {publishedPosts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg mb-4">No blog posts published yet</p>
                <p className="text-slate-400">Check back soon for new content!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Post count and pagination info */}
            <div className="mb-6 text-sm text-slate-600">
              Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of {totalPosts} {totalPosts === 1 ? 'post' : 'posts'}
            </div>

            <div className="grid gap-6">
              {paginatedPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base line-clamp-2">
                          {post.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.publishedDate}>
                          {new Date(post.publishedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-slate-400" />
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {/* Previous Button */}
              <Link
                href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : '/blog'}
                className={currentPage === 1 ? 'pointer-events-none' : ''}
              >
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              </Link>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages adjacent to current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  // Show ellipsis
                  const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                  if (!showPage && !showEllipsisBefore && !showEllipsisAfter) {
                    return null;
                  }

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <span key={page} className="px-2 text-slate-400">
                        ...
                      </span>
                    );
                  }

                  return (
                    <Link key={page} href={`/blog?page=${page}`}>
                      <Button
                        variant={page === currentPage ? 'default' : 'outline'}
                        size="sm"
                        className="min-w-[2.5rem]"
                      >
                        {page}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* Next Button */}
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className={currentPage === totalPages ? 'pointer-events-none' : ''}
              >
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </>
        )}
    </div>
  );
}
