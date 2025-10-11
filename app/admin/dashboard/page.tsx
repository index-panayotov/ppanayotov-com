'use client';

import React, { Suspense } from 'react';
import { lazy } from 'react';
import { AdminPageWrapper } from "@/components/admin/admin-page-wrapper";
import { useAdminData } from "@/hooks/use-admin-data";
import { logger } from "@/lib/logger";

// Lazy load admin components for better performance
const AdminDashboard = lazy(() => import("@/components/admin/admin-dashboard").then(m => ({ default: m.AdminDashboard })));
const AdminNavigation = lazy(() => import("@/components/admin/admin-navigation").then(m => ({ default: m.AdminNavigation })));

export default function DashboardPage() {
  const { data, loading, error, saving } = useAdminData();
  const [blogPostsCount, setBlogPostsCount] = React.useState(0);

  // Load blog posts count
  React.useEffect(() => {
    const loadBlogCount = async () => {
      try {
        const res = await fetch('/api/admin/blog');
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setBlogPostsCount(result.data.length);
        }
      } catch (error) {
        logger.error('Failed to load blog posts count', error as Error, {
          component: 'DashboardPage',
          action: 'loadBlogCount'
        });
      }
    };
    loadBlogCount();
  }, []);

  return (
    <AdminPageWrapper
      loading={loading}
      error={error || (!data ? 'Failed to load dashboard data' : null)}
      loadingMessage="Loading dashboard..."
    >
      <div className="h-full">
        <Suspense fallback={<div className="h-16 bg-slate-100 animate-pulse" />}>
          <AdminNavigation
            experiencesCount={data?.experiences.length ?? 0}
            topSkillsCount={data?.topSkills.length ?? 0}
            blogPostsCount={blogPostsCount}
            saving={saving}
          />
        </Suspense>

        <div className="p-6">
          <Suspense fallback={<div className="space-y-4">
            <div className="h-8 bg-slate-100 animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-100 animate-pulse rounded" />
              ))}
            </div>
          </div>}>
            <AdminDashboard
              experiences={data?.experiences ?? []}
              topSkills={data?.topSkills ?? []}
              profileData={data?.profileData ?? {} as any}
            />
          </Suspense>
        </div>
      </div>
    </AdminPageWrapper>
  );
}