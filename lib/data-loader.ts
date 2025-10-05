/**
 * Data Loader Utility
 *
 * Provides cache-free loading of data files by reading directly from filesystem.
 * This completely bypasses Node.js module cache to ensure fresh content
 * on every request. Critical for the admin panel where data changes must be
 * immediately reflected.
 */

import fs from 'fs';
import path from 'path';

/**
 * Loads a data file directly from filesystem, bypassing all Node.js caching.
 * Parses the JSON-like content from TypeScript data files.
 *
 * @param fileName - The data file name (e.g., 'system_settings.ts')
 * @returns The exported data object
 */
export function loadDataFile<T = any>(fileName: string): T {
  try {
    const filePath = path.join(process.cwd(), 'data', fileName);

    // Read file content directly
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Handle different export patterns by extracting JSON content
    if (fileName === 'system_settings.ts') {
      // Extract JSON object after "const systemSettings = "
      const startMarker = 'const systemSettings = ';
      const startIndex = fileContent.indexOf(startMarker);
      if (startIndex !== -1) {
        const jsonStart = startIndex + startMarker.length;
        const jsonEnd = fileContent.lastIndexOf('};');
        if (jsonEnd > jsonStart) {
          const jsonContent = fileContent.substring(jsonStart, jsonEnd + 1);
          return JSON.parse(jsonContent);
        }
      }
    } else if (fileName === 'cv-data.ts') {
      // Extract JSON array after "export const experiences: ExperienceEntry[] = "
      const startMarker = 'export const experiences: ExperienceEntry[] = ';
      const startIndex = fileContent.indexOf(startMarker);
      if (startIndex !== -1) {
        const jsonStart = startIndex + startMarker.length;
        const jsonEnd = fileContent.lastIndexOf('];');
        if (jsonEnd > jsonStart) {
          const jsonContent = fileContent.substring(jsonStart, jsonEnd + 1);
          return JSON.parse(jsonContent);
        }
      }
    } else if (fileName === 'topSkills.ts') {
      // Extract JSON array after "export const topSkills = "
      const startMarker = 'export const topSkills = ';
      const startIndex = fileContent.indexOf(startMarker);
      if (startIndex !== -1) {
        const jsonStart = startIndex + startMarker.length;
        const jsonEnd = fileContent.lastIndexOf('];');
        if (jsonEnd > jsonStart) {
          const jsonContent = fileContent.substring(jsonStart, jsonEnd + 1);
          return JSON.parse(jsonContent);
        }
      }
    } else if (fileName === 'user-profile.ts') {
      // Extract JSON object after "export const userProfile: UserProfile = "
      const startMarker = 'export const userProfile: UserProfile = ';
      const startIndex = fileContent.indexOf(startMarker);
      if (startIndex !== -1) {
        const jsonStart = startIndex + startMarker.length;
        // Find the closing }; for the object
        let braceCount = 0;
        let jsonEnd = -1;
        for (let i = jsonStart; i < fileContent.length; i++) {
          if (fileContent[i] === '{') braceCount++;
          else if (fileContent[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              jsonEnd = i;
              break;
            }
          }
        }
        if (jsonEnd > jsonStart) {
          const jsonContent = fileContent.substring(jsonStart, jsonEnd + 1);
          try {
            return JSON.parse(jsonContent);
          } catch (parseError) {
            console.error(`[DataLoader] JSON parse error for ${fileName}:`, parseError);
            console.error('JSON content:', jsonContent.substring(0, 200));
            throw parseError;
          }
        }
      }
    }

    // Fallback: try to evaluate as JavaScript (for backward compatibility)
    try {
      const module: any = { exports: {} };
      const exports = module.exports;
      const func = new Function('module', 'exports', 'require', fileContent + '\n;return module.exports.default || exports.default;');
      const result = func(module, exports, require);
      return result;
    } catch (evalError) {
      console.error(`[DataLoader] Failed to evaluate ${fileName} as JavaScript:`, evalError);
      throw new Error(`Unable to parse data file ${fileName}`);
    }
  } catch (error) {
    console.error(`[DataLoader] Error loading file ${fileName}:`, error);
    throw error;
  }
}

/**
 * Helper to load system settings
 */
export function loadSystemSettings() {
  return loadDataFile('system_settings.ts');
}

/**
 * Helper to load CV data
 */
export function loadCVData() {
  return loadDataFile('cv-data.ts');
}

/**
 * Helper to load top skills
 */
export function loadTopSkills() {
  return loadDataFile('topSkills.ts');
}

/**
 * Helper to load user profile
 */
export function loadUserProfile() {
  return loadDataFile('user-profile.ts');
}
