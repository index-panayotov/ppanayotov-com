'use client';

import React from 'react';
import { AdminGuard, useAdminAccess } from './admin-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Info } from 'lucide-react';

/**
 * EnvironmentTest Component
 * Test component to verify environment-aware admin panel system
 */
export const EnvironmentTest: React.FC = () => {
  const { isAdminEnabled, environment, featureFlags } = useAdminAccess();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Environment Test Results
          </CardTitle>
          <CardDescription>
            Testing the environment-aware admin panel system implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Current Environment</h3>
              <Badge variant={environment === 'development' ? 'default' : 'secondary'}>
                {environment.toUpperCase()}
              </Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Admin Access</h3>
              <div className="flex items-center gap-2">
                {isAdminEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>{isAdminEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Current Time</h3>
              <span className="text-sm text-gray-600">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Feature Flags */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Feature Flags</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(featureFlags).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  {value ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Guard Test */}
          <div className="space-y-3">
            <h3 className="font-semibold">AdminGuard Test</h3>
            
            <Alert>
              <AlertDescription>
                The content below should only be visible in development mode:
              </AlertDescription>
            </Alert>
            
            <AdminGuard
              fallback={
                <div className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
                  <p className="text-red-700 font-medium">
                    ❌ Admin content is hidden (production mode)
                  </p>
                </div>
              }
            >
              <div className="p-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50">
                <p className="text-green-700 font-medium">
                  ✅ Admin content is visible (development mode)
                </p>
                <p className="text-sm text-green-600 mt-1">
                  This content will be completely excluded from production builds.
                </p>
              </div>
            </AdminGuard>
          </div>

          {/* Environment Variables */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Environment Variables</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>NODE_ENV:</span>
                <Badge variant="outline">{process.env.NODE_ENV}</Badge>
              </div>
              <div className="flex justify-between">
                <span>ADMIN_ENABLED:</span>
                <Badge variant="outline">{process.env.ADMIN_ENABLED || 'undefined'}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentTest;