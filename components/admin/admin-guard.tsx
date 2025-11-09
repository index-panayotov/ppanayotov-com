'use client';

import React from 'react';
import { environmentService } from '@/lib/environment';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showInProduction?: boolean;
}

/**
 * AdminGuard Component
 * Conditionally renders admin features based on NODE_ENV
 * In production, admin features are completely hidden unless explicitly overridden
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({ 
  children, 
  fallback = null,
  showInProduction = false 
}) => {
  // Check if admin features should be shown
  const shouldShowAdmin = environmentService.isAdminEnabled() || showInProduction;

  if (!shouldShowAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Hook for checking admin access in components
 */
export const useAdminAccess = () => {
  const isAdminEnabled = environmentService.isAdminEnabled();
  const featureFlags = environmentService.getFeatureFlags();

  return {
    isAdminEnabled,
    featureFlags,
    environment: environmentService.getEnvironment(),
  };
};

/**
 * Higher-order component for admin-only components
 */
export function withAdminGuard<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  const AdminGuardedComponent = (props: P) => (
    <AdminGuard fallback={fallback}>
      <Component {...props} />
    </AdminGuard>
  );

  AdminGuardedComponent.displayName = `withAdminGuard(${Component.displayName || Component.name})`;
  
  return AdminGuardedComponent;
}

export default AdminGuard;