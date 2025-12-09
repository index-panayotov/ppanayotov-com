/**
 * Data Loader Utility
 *
 * Provides cache-free loading of data files by reading directly from filesystem.
 * This completely bypasses Node.js module cache to ensure fresh content
 * on every request. Critical for the admin panel where data changes must be
 * immediately reflected.
 *
 * ARCHITECTURE: JSON-first approach
 * - Runtime data is stored in JSON files (e.g., user-profile.json)
 * - TypeScript files serve as build-time defaults/fallbacks
 * - This allows immediate updates without rebuilding the application
 */

import fs from 'fs';
import path from 'path';
import { getErrorMessage } from './utils';
import { validateSlug } from './security/slug-validator';

/**
 * Mapping from TS file names to their JSON equivalents
 */
const TS_TO_JSON_MAP: Record<string, string> = {
  'system_settings.ts': 'system_settings.json',
  'cv-data.ts': 'cv-data.json',
  'topSkills.ts': 'topSkills.json',
  'user-profile.ts': 'user-profile.json',
  'blog-posts.ts': 'blog-posts.json',
};

/**
 * Configuration for extracting data from different TypeScript file types
 * Used as fallback when JSON files don't exist
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
  },
  'blog-posts.ts': {
    startMarker: 'export const blogPosts: BlogPost[] = ',
    endMarker: '];',
    isObject: false
  }
};

/**
 * Extracts content from TypeScript data files
 * Returns the raw JavaScript/TypeScript content that can be evaluated
 */
function extractJSONContent(fileContent: string, config: typeof FILE_PARSERS[string]): string | null {
  const startIndex = fileContent.indexOf(config.startMarker);
  if (startIndex === -1) return null;

  const jsonStart = startIndex + config.startMarker.length;
  let extractedContent = '';

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
      extractedContent = fileContent.substring(jsonStart, jsonEnd + 1);
    }
  } else {
    // Handle array parsing
    const jsonEnd = fileContent.lastIndexOf(config.endMarker);
    if (jsonEnd > jsonStart) {
      extractedContent = fileContent.substring(jsonStart, jsonEnd + 1);
    }
  }

  if (!extractedContent) return null;

  // Clean up TypeScript-specific syntax
  extractedContent = extractedContent
    .replace(/as const/g, ''); // Remove 'as const' type assertions

  return extractedContent;
}

/**
 * Loads a data file directly from filesystem, bypassing all Node.js caching.
 *
 * Strategy:
 * 1. First, try to load from JSON file (runtime data)
 * 2. Fall back to TypeScript file (build-time defaults)
 *
 * This allows the application to reflect changes immediately in production
 * without requiring a rebuild.
 *
 * @param fileName - The data file name (e.g., 'system_settings.ts' or 'system_settings.json')
 * @returns The exported data object
 */
export function loadDataFile<T = unknown>(fileName: string): T {
  const dataDir = path.join(process.cwd(), 'data');

  // Normalize to .ts extension for lookup
  const tsFileName = fileName.endsWith('.json')
    ? fileName.replace('.json', '.ts')
    : fileName;

  // Get corresponding JSON file name
  const jsonFileName = TS_TO_JSON_MAP[tsFileName];

  // Try JSON file first (runtime data)
  if (jsonFileName) {
    const jsonPath = path.join(dataDir, jsonFileName);
    if (fs.existsSync(jsonPath)) {
      try {
        const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
        return JSON.parse(jsonContent) as T;
      } catch (parseError) {
        // JSON parsing failed, fall through to TS file
        console.warn(`Failed to parse ${jsonFileName}, falling back to ${tsFileName}`);
      }
    }
  }

  // Fall back to TypeScript file (build-time defaults)
  const tsPath = path.join(dataDir, tsFileName);
  try {
    const fileContent = fs.readFileSync(tsPath, 'utf-8');

    // Use unified parser if configuration exists
    const config = FILE_PARSERS[tsFileName];
    if (config) {
      const extractedContent = extractJSONContent(fileContent, config);
      if (extractedContent) {
        try {
          // Trim any trailing semicolons which may break the Function constructor
          const safeContent = extractedContent.trim().replace(/;\s*$/, '');

          // Use Function constructor to safely evaluate the extracted content
          // This is safe because we control the input files (they're in /data/)
          const evalFunc = new Function(`return ${safeContent}`);
          return evalFunc();
        } catch (parseError) {
          throw new Error(`Parse error for ${tsFileName}: ${getErrorMessage(parseError)}`);
        }
      }

      // If we reached here the parser config existed but we couldn't extract content
      throw new Error(`Failed to extract content from ${tsFileName} using configured markers`);
    }

    // No parser configured for this file
    throw new Error(`No parser configured for ${tsFileName}`);
  } catch (error) {
    throw new Error(`Error loading file ${tsFileName}: ${getErrorMessage(error)}`);
  }
}

/**
 * Mapping from TS file names to JSON file names for saving
 */
const JSON_FILE_MAP: Record<string, string> = {
  'cv-data.ts': 'cv-data.json',
  'topSkills.ts': 'topSkills.json',
  'user-profile.ts': 'user-profile.json',
  'system_settings.ts': 'system_settings.json',
  'blog-posts.ts': 'blog-posts.json',
};

/**
 * Saves data to a JSON file for runtime persistence.
 *
 * This replaces writing to TypeScript files which doesn't work in production
 * because the compiled bundle doesn't reflect source file changes.
 *
 * @param fileName - The TypeScript file name (e.g., 'user-profile.ts')
 * @param data - The data to save
 */
export function saveDataFile(fileName: string, data: unknown): void {
  const jsonFileName = JSON_FILE_MAP[fileName];
  if (!jsonFileName) {
    throw new Error(`No JSON mapping configured for ${fileName}`);
  }

  const jsonPath = path.join(process.cwd(), 'data', jsonFileName);
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
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

/**
 * Helper to load blog posts metadata
 */
export function loadBlogPosts() {
  return loadDataFile('blog-posts.ts');
}

/**
 * Helper to load a single blog post content
 *
 * @param slug - Blog post slug (filename without .md extension)
 * @returns Object with metadata and markdown content
 */
export function loadBlogPost(slug: string): { metadata: any, content: string } {
  // SECURITY: Validate slug to prevent path traversal attacks
  const validatedSlug = validateSlug(slug);

  const blogPosts = loadBlogPosts();
  const metadata = blogPosts.find((post: any) => post.slug === validatedSlug);

  if (!metadata) {
    throw new Error(`Blog post not found: ${validatedSlug}`);
  }

  const mdPath = path.join(process.cwd(), 'data', 'blog', `${validatedSlug}.md`);

  if (!fs.existsSync(mdPath)) {
    throw new Error(`Blog post markdown file not found: ${validatedSlug}.md`);
  }

  const content = fs.readFileSync(mdPath, 'utf-8');

  return { metadata, content };
}
