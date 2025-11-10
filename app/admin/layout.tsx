'use client';

import dynamic from 'next/dynamic';

const SonnerToaster = dynamic(() => import('@/components/ui/sonner').then(mod => mod.Toaster), { ssr: false });
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
        <SonnerToaster position="top-right" richColors expand={true} />
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
      <SonnerToaster position="top-right" richColors expand={true} />
    </ErrorBoundary>
  );
}
