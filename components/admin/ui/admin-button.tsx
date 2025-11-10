"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// AdminButton - extends Button with loading state and admin-specific variants
interface AdminButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  loading?: boolean;
}

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ children, variant = 'primary', loading, disabled, className, ...props }, ref) => {
    // Map admin variants to button variants
    const buttonVariant: ButtonProps['variant'] =
      variant === 'primary' ? 'default' :
      variant === 'danger' ? 'destructive' :
      variant === 'success' ? 'default' :
      variant as ButtonProps['variant'];

    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        disabled={disabled || loading}
        className={cn(
          variant === 'success' && 'bg-green-600 hover:bg-green-700 text-white',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    );
  }
);
AdminButton.displayName = "AdminButton";

// AdminIconButton - icon-only button with tooltip support
interface AdminIconButtonProps extends Omit<AdminButtonProps, 'children'> {
  icon: React.ReactNode;
  tooltip?: string;
  ariaLabel?: string;
}

export const AdminIconButton = forwardRef<HTMLButtonElement, AdminIconButtonProps>(
  ({ icon, tooltip, ariaLabel, variant = 'ghost', className, loading, ...props }, ref) => {
    const buttonVariant: ButtonProps['variant'] =
      variant === 'primary' ? 'default' :
      variant === 'danger' ? 'destructive' :
      variant as ButtonProps['variant'];

    // Compute accessible label: use ariaLabel if provided, otherwise fall back to tooltip
    const resolvedAriaLabel = ariaLabel || tooltip;

    // In development, warn if both ariaLabel and tooltip are missing
    if (process.env.NODE_ENV !== 'production' && !resolvedAriaLabel) {
      console.warn(
        'AdminIconButton: Icon-only button rendered without an accessible name. ' +
        'Please provide either ariaLabel or tooltip prop for accessibility.'
      );
    }

    const button = (
      <Button
        ref={ref}
        variant={buttonVariant}
        size="icon"
        aria-label={resolvedAriaLabel}
        disabled={props.disabled || loading}
        className={cn('h-8 w-8', className)}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      </Button>
    );

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  }
);
AdminIconButton.displayName = "AdminIconButton";
