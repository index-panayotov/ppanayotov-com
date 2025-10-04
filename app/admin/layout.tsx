'use client';

import { Toaster } from "@/components/ui/toaster";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ErrorBoundary } from "@/components/error-boundary";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Security: Block admin panel in production unless explicitly enabled
  // This prevents accidental exposure of admin interface
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_ADMIN !== 'true') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Panel Disabled</h1>
          <p className="text-slate-300 mb-6">
            The admin panel is not available in production for security reasons.
            Please use the admin panel in development mode to manage content.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }
  
  // Don't show sidebar on login page
  const isLoginPage = pathname === '/admin/login';
  
  const handleLogout = () => {
    // Clear the authentication cookie
    document.cookie = 'admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Redirect to login page
    router.push('/admin/login');
  };
  
  if (isLoginPage) {
    return (
      <ErrorBoundary>
        {children}
        <Toaster />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-slate-50">
        <AdminSidebar onLogout={handleLogout} />

        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto bg-slate-50">
            {children}
          </div>
        </main>

        <Toaster />
      </div>
    </ErrorBoundary>
  );
}
