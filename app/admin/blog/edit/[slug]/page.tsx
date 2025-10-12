'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogPostForm from '@/components/admin/blog-post-form';
import { AdminNavigation } from '@/components/admin/admin-navigation';
import { BlogPost } from '@/lib/schemas';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const result = await apiClient.get(`/api/admin/blog/${slug}`);

        if (result.error) {
          toast.error('Failed to load post', {
            description: result.error.message || 'Could not fetch the blog post'
          });
          router.push('/admin/blog');
          return;
        }

        if (result.success && result.data) {
          setPost(result.data);
        } else {
          toast.error('Post not found', {
            description: `Blog post "${slug}" does not exist`
          });
          router.push('/admin/blog');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        toast.error('Failed to load post', {
          description: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
        router.push('/admin/blog');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, router]);

  if (loading) {
    return (
      <div className="h-full">
        <AdminNavigation

          saving={false}
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-slate-600">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <AdminNavigation

        saving={false}
      />

      <BlogPostForm mode="edit" initialPost={post} />
    </div>
  );
}
