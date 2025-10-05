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
import { getErrorMessage } from './utils';

/**
 * Configuration for extracting data from different file types
 */
const FILE_PARSERS: Record<string, {
  startMarker: string;
  endMarker: string;
  isObject: boolean;
}> = {
  'system_settings.ts': {
    startMarker: 'const systemSettings = ',
    endMarker: '};',
    isObject: true
  },
  'cv-data.ts': {
    startMarker: 'export const experiences: ExperienceEntry[] = ',
    endMarker: '];',
    isObject: false
  },
  'topSkills.ts': {
    startMarker: 'export const topSkills = ',
    endMarker: '];',
    isObject: false
  },
  'user-profile.ts': {
    startMarker: 'export const userProfile: UserProfile = ',
    endMarker: '};',
    isObject: true
  }
};

/**
 * Extracts JSON content from TypeScript data files
 */
function extractJSONContent(fileContent: string, config: typeof FILE_PARSERS[string]): string | null {
  const startIndex = fileContent.indexOf(config.startMarker);
  if (startIndex === -1) return null;

  const jsonStart = startIndex + config.startMarker.length;

  if (config.isObject) {
    // Handle object parsing with brace counting
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
      return fileContent.substring(jsonStart, jsonEnd + 1);
    }
  } else {
    // Handle array parsing
    const jsonEnd = fileContent.lastIndexOf(config.endMarker);
    if (jsonEnd > jsonStart) {
      return fileContent.substring(jsonStart, jsonEnd + 1);
    }
  }

  return null;
}

/**
 * Loads a data file directly from filesystem, bypassing all Node.js caching.
 * Parses the JSON-like content from TypeScript data files.
 *
 * @param fileName - The data file name (e.g., 'system_settings.ts')
 * @returns The exported data object
 */
export function loadDataFile<T = any>(fileName: string): T {
  const filePath = path.join(process.cwd(), 'data', fileName);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Use unified parser if configuration exists
    const config = FILE_PARSERS[fileName];
    if (config) {
      const jsonContent = extractJSONContent(fileContent, config);
      if (jsonContent) {
        try {
          return JSON.parse(jsonContent);
         } catch (parseError) {
           throw new Error(`JSON parse error for ${fileName}: ${getErrorMessage(parseError)}`);
         }
      }
    }

    // Fallback: try to evaluate as JavaScript (for backward compatibility)
    try {
      const module: any = { exports: {} };
      const func = new Function('module', 'exports', 'require', fileContent + '\n;return module.exports.default || exports.default;');
      return func(module, exports, require);
     } catch (evalError) {
       throw new Error(`Unable to parse data file ${fileName}: ${getErrorMessage(evalError)}`);
     }
   } catch (error) {
     throw new Error(`Error loading file ${fileName}: ${getErrorMessage(error)}`);
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
