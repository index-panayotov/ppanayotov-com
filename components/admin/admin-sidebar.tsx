"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Briefcase,
  Award,
  User,
  Menu,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Brain,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useAdminTheme } from "./theme-provider";
import { adminColorsDark } from './design-system';

interface AdminSidebarProps {
  onLogout: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview and quick actions"
  },
  {
    title: "Experiences",
    href: "/admin?tab=experiences",
    icon: Briefcase,
    description: "Manage work experience"
  },
  {
    title: "Top Skills",
    href: "/admin?tab=topSkills",
    icon: Target,
    description: "Featured skills management"
  },
  {
    title: "Profile Data",
    href: "/admin?tab=profileData",
    icon: User,
    description: "Personal information"
  }
];

function SidebarContent({ 
  collapsed, 
  onToggle, 
  onLogout, 
  className 
}: {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { actualTheme } = useAdminTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div 
      className={cn(
        "flex h-full flex-col transition-colors", 
        className
      )}
      style={{
        backgroundColor: actualTheme === "dark" ? adminColorsDark.background.primary : "rgb(51 65 85)",
        color: actualTheme === "dark" ? adminColorsDark.text.primary : "rgb(248 250 252)"
      }}
    >
      {/* Header */}
      <div 
        className="flex h-14 items-center border-b px-4"
        style={{
          borderBottomColor: actualTheme === "dark" ? adminColorsDark.background.focus : "rgb(71 85 105)"
        }}
      >
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">Admin Panel</span>
          </div>
        )}
        <div className="ml-auto flex items-center space-x-1">
          {!collapsed && <ThemeToggle />}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 transition-colors"
            style={{
              color: actualTheme === "dark" ? adminColorsDark.text.muted : "rgb(148 163 184)",
              ...(actualTheme === "dark" ? {
                '--hover-bg': adminColorsDark.background.elevated,
                '--hover-text': adminColorsDark.text.primary
              } : {})
            }}
            onMouseEnter={(e) => {
              if (actualTheme === "dark") {
                e.currentTarget.style.backgroundColor = adminColorsDark.background.elevated;
                e.currentTarget.style.color = adminColorsDark.text.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (actualTheme === "dark") {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = adminColorsDark.text.muted;
              }
            }}
            onClick={onToggle}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            
            // Safe client-side active state detection
            let isActive = false;
            if (isClient) {
              const currentTab = searchParams?.get('tab');
              if (item.href === "/admin") {
                isActive = pathname === "/admin" && !currentTab;
              } else {
                const itemTab = item.href.split("?tab=")[1];
                isActive = currentTab === itemTab;
              }
            }
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-auto p-3 transition-colors",
                    collapsed && "px-2"
                  )}
                  style={{
                    color: actualTheme === "dark" ? 
                      (isActive ? adminColorsDark.text.primary : adminColorsDark.text.secondary) : 
                      (isActive ? "rgb(248 250 252)" : "rgb(203 213 225)"),
                    backgroundColor: actualTheme === "dark" ? 
                      (isActive ? adminColorsDark.background.elevated : 'transparent') : 
                      (isActive ? "rgb(71 85 105)" : 'transparent')
                  }}
                  onMouseEnter={(e) => {
                    if (actualTheme === "dark" && !isActive) {
                      e.currentTarget.style.backgroundColor = adminColorsDark.background.elevated;
                      e.currentTarget.style.color = adminColorsDark.text.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (actualTheme === "dark" && !isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = adminColorsDark.text.secondary;
                    }
                  }}
                >
                  <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span 
                        className="text-xs"
                        style={{
                          color: actualTheme === "dark" ? adminColorsDark.text.muted : "rgb(148 163 184)"
                        }}
                      >
                        {item.description}
                      </span>
                    </div>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div 
        className="border-t p-2"
        style={{
          borderTopColor: actualTheme === "dark" ? adminColorsDark.background.focus : "rgb(30 41 59)"
        }}
      >
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-auto p-3 transition-colors",
            collapsed && "px-2"
          )}
          style={{
            color: actualTheme === "dark" ? adminColorsDark.text.secondary : "rgb(203 213 225)"
          }}
          onMouseEnter={(e) => {
            if (actualTheme === "dark") {
              e.currentTarget.style.backgroundColor = adminColorsDark.background.elevated;
              e.currentTarget.style.color = adminColorsDark.semantic.error;
            }
          }}
          onMouseLeave={(e) => {
            if (actualTheme === "dark") {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = adminColorsDark.text.secondary;
            }
          }}
          onClick={onLogout}
        >
          <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
          {!collapsed && (
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">Logout</span>
              <span 
                className="text-xs"
                style={{
                  color: actualTheme === "dark" ? adminColorsDark.text.muted : "rgb(148 163 184)"
                }}
              >
                Exit admin panel
              </span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex h-screen transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="fixed top-4 left-4 z-50 bg-background shadow-md"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              onLogout={() => {
                setMobileOpen(false);
                onLogout();
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}