"use client";

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Lazy-loaded EditorJS Wrapper
 *
 * Dynamically imports EditorJS only when needed, reducing initial bundle size.
 * The EditorJS library is ~200KB and only used in admin panel.
 *
 * Benefits:
 * - Reduces initial page load by ~200KB
 * - Loads only when admin opens editor
 * - Shows loading state during import
 * - Better code splitting
 */

// Dynamic import with loading component
export const LazyEditorJS = dynamic(
  () => import('./editorjs-wrapper').then(mod => mod.default),
  {
    loading: () => (
      <div className="border border-slate-200 rounded-lg p-8 bg-slate-50">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading editor...</span>
        </div>
      </div>
    ),
    ssr: false, // EditorJS doesn't support SSR
  }
);

export default LazyEditorJS;
