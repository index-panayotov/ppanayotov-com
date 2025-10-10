"use client";

import { ReactNode } from "react";
import { AdminNavigation } from "./admin-navigation";
import { AuthCheck } from "./auth-check";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface AdminPageLayoutProps {
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
  loadingMessage?: string;
  title?: string;
  experiencesCount?: number;
  topSkillsCount?: number;
  blogPostsCount?: number;
  saving?: boolean;
}

/**
 * Reusable layout component for admin pages
 * Handles common patterns: AuthCheck, AdminNavigation, loading states, and error display
 */
export function AdminPageLayout({
  children,
  loading = false,
  error = null,
  loadingMessage = "Loading...",
  title,
  experiencesCount = 0,
  topSkillsCount = 0,
  blogPostsCount = 0,
  saving = false
}: AdminPageLayoutProps) {
  if (loading) {
    return (
      <AuthCheck>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">{loadingMessage}</p>
          </div>
        </div>
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-slate-50">
        <AdminNavigation
          experiencesCount={experiencesCount}
          topSkillsCount={topSkillsCount}
          blogPostsCount={blogPostsCount}
          saving={saving}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            </div>
          )}

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {children}
        </main>
      </div>
    </AuthCheck>
  );
}

/**
 * Loading spinner component for consistent loading states
 */
export function AdminLoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  );
}