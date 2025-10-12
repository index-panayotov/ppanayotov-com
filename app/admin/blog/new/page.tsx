'use client';

import BlogPostForm from '@/components/admin/blog-post-form';
import { AdminNavigation } from '@/components/admin/admin-navigation';

export default function NewBlogPostPage() {
  return (
    <div className="h-full">
      <AdminNavigation
        experiencesCount={0}
        topSkillsCount={0}
        blogPostsCount={0}
        saving={false}
      />

      <BlogPostForm mode="create" initialPost={null} />
    </div>
  );
}
