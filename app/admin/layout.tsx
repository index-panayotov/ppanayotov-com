'use client';

import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

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
      <div className="h-screen bg-slate-50">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
      <Toaster />
    </ErrorBoundary>
  );
}
