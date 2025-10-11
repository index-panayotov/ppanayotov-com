'use client';

import React from 'react';
import { AuthCheck } from "./auth-check";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AdminPageWrapperProps {
  children: React.ReactNode;
  loading: boolean;
  error: string | null;
  loadingMessage?: string;
}

/**
 * Shared wrapper component for all admin pages
 * Handles auth check, loading states, and error states
 */
export function AdminPageWrapper({
  children,
  loading,
  error,
  loadingMessage = 'Loading...'
}: AdminPageWrapperProps) {
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

  if (error) {
    return (
      <AuthCheck>
        <div className="p-8">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </AuthCheck>
    );
  }

  return <AuthCheck>{children}</AuthCheck>;
}
