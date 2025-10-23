'use client';

import BlogPostForm from '@/components/admin/blog-post-form';
import { AdminNavigation } from '@/components/admin/admin-navigation';

export default function NewBlogPostPage() {
  return (
    <div className="h-full">
      <AdminNavigation saving={false} />

      <BlogPostForm mode="create" initialPost={null} />
    </div>
  );
}
