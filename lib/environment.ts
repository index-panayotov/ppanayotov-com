/**
 * Environment Service
 * Provides centralized environment detection and feature flag management
 */

export type Environment = 'development' | 'production' | 'test';

export class EnvironmentService {
  private static instance: EnvironmentService;
  private readonly environment: Environment;

  private constructor() {
    this.environment = (process.env.NODE_ENV as Environment) || 'development';
  }

  public static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }

  /**
   * Get current environment
   */
  public getEnvironment(): Environment {
    return this.environment;
  }

  /**
   * Check if running in development mode
   */
  public isDevelopment(): boolean {
    return this.environment === 'development';
  }

  /**
   * Check if running in production mode
   */
  public isProduction(): boolean {
    return this.environment === 'production';
  }

  /**
   * Check if running in test mode
   */
  public isTest(): boolean {
    return this.environment === 'test';
  }

  /**
   * Check if admin features should be enabled
   * Admin features are only available in development mode
   */
  public isAdminEnabled(): boolean {
    return this.isDevelopment();
  }

  /**
   * Get feature flags based on environment
   */
  public getFeatureFlags() {
    return {
      adminPanel: this.isAdminEnabled(),
      debugMode: this.isDevelopment(),
      performanceMonitoring: this.isProduction(),
      hotReload: this.isDevelopment(),
    };
  }

  /**
   * Get build-time environment info
   * This helps with build-time optimizations
   */
  public getBuildInfo() {
    return {
      environment: this.environment,
      buildTime: new Date().toISOString(),
      adminEnabled: this.isAdminEnabled(),
    };
  }
}

// Export singleton instance
export const environmentService = EnvironmentService.getInstance();

// Export utility functions for convenience
export const isDevelopment = () => environmentService.isDevelopment();
export const isProduction = () => environmentService.isProduction();
export const isAdminEnabled = () => environmentService.isAdminEnabled();
export const getFeatureFlags = () => environmentService.getFeatureFlags();