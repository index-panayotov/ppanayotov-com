'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCheck } from '@/components/admin/auth-check';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <AuthCheck>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting to dashboard...</p>
        </div>
      </div>
    </AuthCheck>
  );
}
