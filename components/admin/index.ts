/**
 * Admin Components Index
 * Exports all admin-related components with environment-aware functionality
 */

export { AdminGuard, useAdminAccess, withAdminGuard } from './admin-guard';
export { AdminPanelWrapper } from './admin-panel-wrapper';
export { AdminButton } from './admin-button';
export { EnvironmentTest } from './environment-test';

// Re-export environment service for convenience
export { 
  environmentService, 
  isDevelopment, 
  isProduction, 
  isAdminEnabled, 
  getFeatureFlags 
} from '@/lib/environment';