import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { adminClassNames } from "../design-system";
import { AdminButton } from "./admin-button";

interface AdminEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  className?: string;
}

/**
 * Standardized empty state component for admin panels
 * Provides consistent layout for icon, title, description, and action button
 */
export function AdminEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div className={cn(adminClassNames.emptyState.container, className)}>
      {icon && (
        <div className={adminClassNames.emptyState.icon}>
          {icon}
        </div>
      )}
      
      <h3 className={adminClassNames.emptyState.title}>
        {title}
      </h3>
      
      {description && (
        <p className={adminClassNames.emptyState.description}>
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-6">
          <AdminButton 
            variant="primary" 
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </AdminButton>
        </div>
      )}
    </div>
  );
}