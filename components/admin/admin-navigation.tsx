'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Briefcase,
  Target,
  User,
  Settings,
  LogOut,
  Loader2,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminNavigationProps {
  saving?: boolean;
}

export function AdminNavigation({
  saving = false
}: AdminNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navigationItems: NavigationItem[] = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Profile Data",
      href: "/admin/profile-data",
      icon: User
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings
    },
    {
      title: "Experiences",
      href: "/admin/experiences",
      icon: Briefcase
    },
    {
      title: "Top Skills",
      href: "/admin/top-skills",
      icon: Target
    },
    {
      title: "Blog",
      href: "/admin/blog",
      icon: FileText
    }
  ];

  const handleLogout = async () => {
    // SECURITY: Call logout API to clear HttpOnly cookie server-side
    // Client-side JavaScript cannot delete HttpOnly cookies
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Redirect to login page regardless of API response
      // (middleware will enforce authentication on next visit)
      router.push('/admin/login');
    }
  };

  if (!isClient) {
    return (
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CV Admin Panel</h1>
            <p className="text-sm text-slate-600 mt-1">Loading navigation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CV Admin Panel</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your professional CV content</p>
        </div>
        {saving && (
          <Badge variant="secondary" className="gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </Badge>
        )}
      </div>

      <nav className="flex items-center space-x-1 pb-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          // Highlight tab if we're on the exact route OR on a nested route under it
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "h-auto px-4 py-3 gap-2 transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.title}</span>

              </Button>
            </Link>
          );
        })}

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-auto px-4 py-3 gap-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}