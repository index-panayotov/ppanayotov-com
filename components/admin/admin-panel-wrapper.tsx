'use client';

import React from 'react';
import { AdminGuard, useAdminAccess } from './admin-guard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface AdminPanelWrapperProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * AdminPanelWrapper Component
 * Wraps admin panels with environment-aware rendering and development indicators
 */
export const AdminPanelWrapper: React.FC<AdminPanelWrapperProps> = ({ 
  children, 
  title = "Admin Panel" 
}) => {
  const { isAdminEnabled, environment, featureFlags } = useAdminAccess();

  return (
    <AdminGuard
      fallback={
        <div className="p-4 text-center text-gray-500">
          <p>Admin features are not available in production mode.</p>
        </div>
      }
    >
      <div className="admin-panel-wrapper">
        {/* Development Environment Indicator */}
        {isAdminEnabled && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-100">
                  {environment.toUpperCase()}
                </Badge>
                <span className="text-sm font-medium text-yellow-800">
                  {title}
                </span>
              </div>
              <div className="flex gap-1">
                {featureFlags.debugMode && (
                  <Badge variant="secondary" className="text-xs">
                    DEBUG
                  </Badge>
                )}
                {featureFlags.hotReload && (
                  <Badge variant="secondary" className="text-xs">
                    HOT RELOAD
                  </Badge>
                )}
              </div>
            </div>
            <Alert className="mt-2 bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-700 text-xs">
                This admin panel is only visible in development mode and will be completely 
                hidden in production builds.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Admin Panel Content */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminPanelWrapper;