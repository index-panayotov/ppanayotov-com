// SystemSettings.ts
// A class to access system settings by key, with type safety

import systemSettings from "../data/system_settings";

// Type for the keys of the settings
export type SystemSettingKey = keyof typeof systemSettings;

export class SystemSettings {
  // Get a setting value by key, with type safety
  static get<K extends SystemSettingKey>(key: K): (typeof systemSettings)[K] {
    return systemSettings[key];
  }
}

// Example usage:
// const isBlogEnabled = SystemSettings.get('blogEnable');
