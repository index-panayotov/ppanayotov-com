import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { adminClassNames } from "../design-system";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AdminAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
  icon?: LucideIcon;
  action?: AdminAction;
}

/**
 * Standardized page header component for admin pages
 * Provides consistent layout for title, description, and action buttons
 */
export function AdminPageHeader({
  title,
  description,
  actions,
  className,
  children,
  icon: Icon,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className={cn(adminClassNames.pageHeader.container, className)}>
      <div className={adminClassNames.pageHeader.layout}>
        <div className={adminClassNames.pageHeader.titleSection}>
          <div className="flex items-center gap-3 mb-1">
            {Icon && <Icon className="h-8 w-8 text-blue-600" />}
            <h2 className={cn(adminClassNames.text.heading, "text-2xl")}>
              {title}
            </h2>
          </div>
          {description && (
            <p className={adminClassNames.text.muted}>
              {description}
            </p>
          )}
        </div>
        
        {(actions || action) && (
          <div className={adminClassNames.pageHeader.actionsSection}>
            {action && (
              <Button
                variant={action.variant || "default"}
                onClick={action.onClick}
                className="gap-2"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            )}
            {actions}
          </div>
        )}
      </div>
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}