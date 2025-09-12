'use client';

import { Toaster } from "@/components/ui/toaster";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminThemeProvider } from "@/components/admin/theme-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
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
      <>
        {children}
        <Toaster />
      </>
    );
  }
  
  return (
    <AdminThemeProvider defaultTheme="system">
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        <AdminSidebar onLogout={handleLogout} />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900">
            {children}
          </div>
        </main>
        
        <Toaster />
      </div>
    </AdminThemeProvider>
  );
}
