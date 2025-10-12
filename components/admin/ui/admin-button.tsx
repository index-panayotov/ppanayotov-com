import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { adminClassNames } from "../design-system";
import { Loader2 } from "lucide-react";

type AdminButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type AdminIconButtonVariant = 'base' | 'ghost' | 'primary' | 'danger';
type AdminButtonSize = 'sm' | 'md' | 'lg';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  loading?: boolean;
  children: ReactNode;
}

interface AdminIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminIconButtonVariant;
  icon: ReactNode;
  tooltip?: string;
  ariaLabel: string; // New required prop
  loading?: boolean;
}

const sizeClasses = {
  sm: 'px-3 py-2 text-sm h-8',
  md: 'px-4 py-2 text-sm h-10',
  lg: 'px-6 py-3 text-base h-12',
} as const;

const iconButtonSizeClasses = {
  sm: 'h-7 w-7 p-0',
  md: 'h-8 w-8 p-0', 
  lg: 'h-10 w-10 p-0',
} as const;

/**
 * Enhanced admin button with consistent styling and variants
 */
export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ 
    variant = 'secondary', 
    size = 'md', 
    loading = false, 
    disabled = false,
        children,
        className,
        type, // Destructure type from props
        ...props
      }, ref) => {
        const isDisabled = disabled || loading;
        const buttonType = type ?? 'button'; // Set default type to 'button'
        
        return (
          <button
            ref={ref}
            disabled={isDisabled}
            type={buttonType} // Pass the determined type
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          // Variant styles
          adminClassNames.button[variant],
          // Size styles
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

AdminButton.displayName = "AdminButton";

/**
 * Icon-only button with consistent styling and accessibility
 */
export const AdminIconButton = forwardRef<HTMLButtonElement, AdminIconButtonProps>(
  ({ 
    variant = 'ghost', 
        icon,
        tooltip,
        ariaLabel, // Destructure new prop
        loading = false,
        disabled = false,
        className,
        ...props
      }, ref) => {
        const isDisabled = disabled || loading;
    
        return (
          <button
            ref={ref}
                    disabled={isDisabled}
                    {...props}
                    title={tooltip}
                    aria-label={ariaLabel}
                    className={cn(
          // Base styles
          'inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          // Variant styles from design system
          adminClassNames.iconButton[variant],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon
        )}
      </button>
    );
  }
);

AdminIconButton.displayName = "AdminIconButton";

/**
 * Button group for consistent spacing between multiple buttons
 */
export function AdminButtonGroup({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn("flex gap-2", className)}>
      {children}
    </div>
  );
}