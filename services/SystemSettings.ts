import systemSettings from '@/data/system_settings';

/**
 * System Settings Service
 *
 * Provides a centralized way to access system-wide settings
 * with type safety and default fallbacks.
 */
class SystemSettingsService {
  private settings = systemSettings;

  /**
   * Get a setting value by key
   * @param key - The setting key
   * @returns The setting value
   */
  get<T = any>(key: string): T {
    return (this.settings as any)[key];
  }

  /**
   * Get all settings
   * @returns All system settings
   */
  getAll() {
    return this.settings;
  }

  /**
   * Check if a boolean setting is enabled
   * @param key - The setting key
   * @returns True if the setting is enabled
   */
  isEnabled(key: string): boolean {
    return Boolean(this.get(key));
  }
}

// Export a singleton instance
export const SystemSettings = new SystemSettingsService();