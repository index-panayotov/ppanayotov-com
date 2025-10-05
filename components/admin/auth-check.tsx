'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface AuthCheckProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthCheck({ children, requireAuth = true }: AuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isDev, setIsDev] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if in development mode (for production restrictions)
        const isDevMode = process.env.NODE_ENV !== 'production' ||
                         process.env.NEXT_PUBLIC_ENABLE_ADMIN === 'true';
        setIsDev(isDevMode);

        if (!isDevMode) {
          setError("Admin panel is only available in development mode");
          return;
        }

        if (!requireAuth) {
          setIsAuthenticated(true);
          return;
        }

        // Check authentication cookie
        const hasAuthCookie = document.cookie.includes('admin_authenticated=true');

        if (!hasAuthCookie) {
          router.push('/admin/login');
          return;
        }

        setIsAuthenticated(true);
      } catch (err) {

        setError('Authentication check failed');
      }
    };

    checkAuth();
  }, [router, requireAuth]);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !isDev) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>{!isDev ? 'Development Mode Only' : 'Error'}</AlertTitle>
          <AlertDescription>
            {error || 'The admin panel is only available in development mode. Please run the application in development mode to access this feature.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Not authenticated
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}