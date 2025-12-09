'use client';

import BlogPostForm from '@/components/admin/blog-post-form';
import { AdminNavigation } from '@/components/admin/admin-navigation';
import { AdminPageWrapper } from '@/components/admin/admin-page-wrapper';

export default function NewBlogPostPage() {
  return (
    <AdminPageWrapper
      loading={false}
      error={null}
      loadingMessage="Loading editor..."
    >
      <div className="h-full">
        <AdminNavigation saving={false} />

        <BlogPostForm mode="create" initialPost={null} />
      </div>
    </AdminPageWrapper>
  );
}
