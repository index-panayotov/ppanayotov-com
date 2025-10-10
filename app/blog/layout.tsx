import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BlogLayoutProps {
  children: ReactNode;
}

/**
 * Blog Layout with Error Boundary
 *
 * Wraps all blog pages with an error boundary to prevent entire app crashes
 * if blog content loading or rendering fails.
 */
export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-800 mb-3">
              Unable to Load Blog Content
            </h2>

            <p className="text-slate-600 text-center mb-8">
              We encountered an error while loading the blog content. This might be a temporary issue.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/blog" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  Go to Homepage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
