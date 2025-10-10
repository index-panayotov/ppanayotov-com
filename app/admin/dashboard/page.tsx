'use client';

import React, { Suspense } from 'react';
import { lazy } from 'react';
import { AuthCheck } from "@/components/admin/auth-check";
import { useAdminData } from "@/hooks/use-admin-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

  if (loading) {
    return (
      <AuthCheck>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </AuthCheck>
    );
  }

  if (error || !data) {
    return (
      <AuthCheck>
        <div className="p-8">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Failed to load dashboard data'}</AlertDescription>
          </Alert>
        </div>
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="h-full">
        <Suspense fallback={<div className="h-16 bg-slate-100 animate-pulse" />}>
          <AdminNavigation
            experiencesCount={data.experiences.length}
            topSkillsCount={data.topSkills.length}
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
              experiences={data.experiences}
              topSkills={data.topSkills}
              profileData={data.profileData}
            />
          </Suspense>
        </div>
      </div>
    </AuthCheck>
  );
}