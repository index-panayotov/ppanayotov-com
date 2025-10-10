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
      const extractedContent = extractJSONContent(fileContent, config);
      if (extractedContent) {
        try {
          // Use Function constructor to safely evaluate the extracted content
          // This is safe because we control the input files (they're in /data/)
          const evalFunc = new Function(`return ${extractedContent}`);
          return evalFunc();
         } catch (parseError) {
           throw new Error(`Parse error for ${fileName}: ${getErrorMessage(parseError)}`);
         }
      }
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
  const blogPosts = loadBlogPosts();
  const metadata = blogPosts.find((post: any) => post.slug === slug);

  if (!metadata) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const mdPath = path.join(process.cwd(), 'data', 'blog', `${slug}.md`);

  if (!fs.existsSync(mdPath)) {
    throw new Error(`Blog post markdown file not found: ${slug}.md`);
  }

  const content = fs.readFileSync(mdPath, 'utf-8');

  return { metadata, content };
}
