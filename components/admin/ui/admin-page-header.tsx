import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { adminClassNames } from "../design-system";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
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
}: AdminPageHeaderProps) {
  return (
    <div className={cn(adminClassNames.pageHeader.container, className)}>
      <div className={adminClassNames.pageHeader.layout}>
        <div className={adminClassNames.pageHeader.titleSection}>
          <h2 className={cn(adminClassNames.text.heading, "text-2xl")}>
            {title}
          </h2>
          {description && (
            <p className={adminClassNames.text.muted}>
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className={adminClassNames.pageHeader.actionsSection}>
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