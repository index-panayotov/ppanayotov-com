import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { adminClassNames } from "../design-system";

type AdminCardVariant = 'base' | 'elevated' | 'interactive';

interface AdminCardProps {
  children: ReactNode;
  variant?: AdminCardVariant;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface AdminCardHeaderProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

interface AdminCardContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * Base admin card component with consistent styling
 */
export const AdminCard = forwardRef<HTMLDivElement, AdminCardProps>(
  ({ children, variant = 'base', className, onClick, disabled = false, ...props }, ref) => {
    const isInteractive = variant === 'interactive' || onClick;
    
    return (
      <div
        ref={ref}
        className={cn(
          adminClassNames.card[variant],
          isInteractive && !disabled && 'cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AdminCard.displayName = "AdminCard";

/**
 * Card header with consistent title/description/actions layout
 */
export function AdminCardHeader({
  title,
  description,
  actions,
  children,
  className,
}: AdminCardHeaderProps) {
  if (children) {
    return (
      <div className={cn("p-6 pb-4", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("p-6 pb-4", className)}>
      <div className={adminClassNames.layout.flexBetween}>
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex gap-1 ml-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Card content area with consistent padding
 */
export function AdminCardContent({ children, className }: AdminCardContentProps) {
  return (
    <div className={cn("px-6 pb-6", className)}>
      {children}
    </div>
  );
}