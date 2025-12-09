'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogPostForm from '@/components/admin/blog-post-form';
import { AdminNavigation } from '@/components/admin/admin-navigation';
import { AdminPageWrapper } from '@/components/admin/admin-page-wrapper';
import { BlogPost } from '@/lib/schemas';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiClient.get(`/api/admin/blog/${slug}`) as any;

        if (result.error) {
          const errorMsg = result.error.message || 'Could not fetch the blog post';
          setError(errorMsg);
          toast.error('Failed to load post', {
            description: errorMsg
          });
          return;
        }

        if (result.success && result.data) {
          setPost(result.data);
        } else {
          const errorMsg = `Blog post "${slug}" does not exist`;
          setError(errorMsg);
          toast.error('Post not found', {
            description: errorMsg
          });
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMsg);
        console.error('Error loading post:', err);
        toast.error('Failed to load post', {
          description: errorMsg
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return (
    <AdminPageWrapper
      loading={loading}
      error={error}
      loadingMessage="Loading blog post..."
    >
      <div className="h-full">
        <AdminNavigation saving={false} />

        <BlogPostForm mode="edit" initialPost={post} />
      </div>
    </AdminPageWrapper>
  );
}
