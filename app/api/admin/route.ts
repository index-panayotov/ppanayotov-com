import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import {
  GenerateTopSkillsApiResponse,
  AdminDataUpdateApiRequestSchema,
  API_ERROR_CODES,
  createTypedErrorResponse,
  validateSearchParams,
  validateRequestBody
} from "@/types/api";
import { ApiErrorCode } from "@/types/core";
import { z } from "zod";
import { createOptimizedResponse } from "@/lib/api-compression";
import { loadSystemSettings, loadCVData, loadTopSkills, loadUserProfile } from "@/lib/data-loader";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";

// Only allow in development mode
const isDev = env.NODE_ENV === "development";

// Schema for GET request search parameters
const GetAdminApiParamsSchema = z.object({
  action: z.enum(['generateTopSkills']).optional()
});

/**
 * Type-safe GET handler for admin data operations
 * Rate limit: 30 requests per minute
 */
export async function GET(request: NextRequest) {
  if (!isDev) {
    return createTypedErrorResponse(
      API_ERROR_CODES.FORBIDDEN,
      "Admin API only available in development mode"
    );
  }

  // Apply rate limiting (30 requests per minute for admin GET)
  const { limited, remaining, resetAt } = checkRateLimit(request, 30, 60000);

  if (limited) {
    const resetInSeconds = Math.ceil((resetAt - Date.now()) / 1000);
    logger.warn("Admin GET API rate limit exceeded", {
      endpoint: "/api/admin",
      remaining,
      resetInSeconds,
    });

    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Please try again later.",
        retryAfter: resetInSeconds
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': resetInSeconds.toString(),
          'X-RateLimit-Limit': '30',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetAt.toString(),
        },
      }
    );
  }

  // Validate search parameters
  const paramValidation = validateSearchParams(request, GetAdminApiParamsSchema);

  if (!paramValidation.success) {
    return createTypedErrorResponse(
      paramValidation.error.code as ApiErrorCode,
      paramValidation.error.message
    );
  }

  const { action } = paramValidation.data;

  try {
    // Load all data directly from files to bypass module cache completely
    const experiences = loadCVData();
    const topSkills = loadTopSkills();
    const profileData = loadUserProfile();
    const systemSettings = loadSystemSettings();

    if (action === "generateTopSkills") {
      // Generate top skills based on frequency in experiences
      const allTags: string[] = [];
      experiences.forEach((exp: any) => {
        if (exp.tags && Array.isArray(exp.tags)) {
          exp.tags.forEach((tag: any) => {
            allTags.push(tag);
          });
        }
      });

      // Count occurrences of each tag
      const tagCounts: Record<string, number> = {};
      allTags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });

      // Sort tags by frequency (most frequent first)
      const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0])
        .slice(0, 10); // Get top 10 skills

      const response: GenerateTopSkillsApiResponse = {
        topSkills: sortedTags
      };

      return createOptimizedResponse(response, { maxAge: 60 });
    }

    // Default: return all data (using consistent field names)
    const response = {
      profileData, // Normalized field name for consistency
      experiences,
      topSkills,
      systemSettings
    };



    return createOptimizedResponse(response, { maxAge: 0 }); // No cache for fresh data
  } catch (error) {
    logger.error('Admin GET handler failed', error as Error, { action });
    return createTypedErrorResponse(
      API_ERROR_CODES.INTERNAL_ERROR,
      'Failed to retrieve admin data'
    );
  }
}

/**
 * Type-safe POST handler for updating data files
 * Rate limit: 20 requests per minute
 */
export async function POST(request: NextRequest) {
  if (!isDev) {
    return createTypedErrorResponse(
      API_ERROR_CODES.FORBIDDEN,
      "Admin API only available in development mode"
    );
  }

  // Apply rate limiting (20 requests per minute for admin POST)
  const { limited, remaining, resetAt } = checkRateLimit(request, 20, 60000);

  if (limited) {
    const resetInSeconds = Math.ceil((resetAt - Date.now()) / 1000);
    logger.warn("Admin POST API rate limit exceeded", {
      endpoint: "/api/admin",
      remaining,
      resetInSeconds,
    });

    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Please try again later.",
        retryAfter: resetInSeconds
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': resetInSeconds.toString(),
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetAt.toString(),
        },
      }
    );
  }

  // Validate request body
  const validation = await validateRequestBody(request, AdminDataUpdateApiRequestSchema);

  if (!validation.success) {
    return createTypedErrorResponse(
      validation.error.code as ApiErrorCode,
      validation.error.message,
      (validation.error.details as any)?.zodErrors?.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
        value: err.input
      }))
    );
  }

  const { file, data } = validation.data;



  // Security: Whitelist allowed files to prevent path traversal
  const ALLOWED_FILES = ['cv-data.ts', 'topSkills.ts', 'user-profile.ts', 'system_settings.ts'];
  if (!ALLOWED_FILES.includes(file)) {
    logger.warn('Admin API POST - File not in whitelist', { file, allowedFiles: ALLOWED_FILES });
    return createTypedErrorResponse(
      API_ERROR_CODES.VALIDATION_ERROR,
      `Invalid file: ${file}. Must be one of: ${ALLOWED_FILES.join(', ')}`,
      [{ field: 'file', message: 'File not in whitelist', code: 'INVALID_FILE', value: file }]
    );
  }

  try {
    const filePath = path.join(process.cwd(), "data", file);


    // Format the data as a TypeScript export
    let fileContent = "";

    if (file === "cv-data.ts") {
      fileContent = `import { ExperienceEntry } from "@/types";\n\nexport const experiences: ExperienceEntry[] = ${JSON.stringify(
        data,
        null,
        2
      )};\n`;
    } else if (file === "topSkills.ts") {
      fileContent = `export const topSkills = ${JSON.stringify(
        data,
        null,
        2
      )};\n`;
    } else if (file === "user-profile.ts") {
      fileContent = `import { LanguageProficiency, UserProfile } from "@/lib/schemas";

export const userProfile: UserProfile = ${JSON.stringify(data, null, 2)};\n`;
    } else if (file === "system_settings.ts") {
      // Format system settings as a proper TypeScript module
      // Use JSON.stringify to safely serialize the data
      const settings = data as any;

      // Ensure we have a complete settings object with defaults
      const completeSettings = {
        blogEnable: settings.blogEnable ?? false,
        useWysiwyg: settings.useWysiwyg ?? true,
        showContacts: settings.showContacts ?? true,
        showPrint: settings.showPrint ?? false,
        gtagCode: settings.gtagCode ?? "",
        gtagEnabled: settings.gtagEnabled ?? false,
        selectedTemplate: settings.selectedTemplate ?? "classic",
        pwa: {
          siteName: settings.pwa?.siteName ?? "CV Website",
          shortName: settings.pwa?.shortName ?? "CV",
          description: settings.pwa?.description ?? "",
          startUrl: settings.pwa?.startUrl ?? "/",
          display: settings.pwa?.display ?? "standalone",
          backgroundColor: settings.pwa?.backgroundColor ?? "#ffffff",
          themeColor: settings.pwa?.themeColor ?? "#0f172a",
          orientation: settings.pwa?.orientation ?? "portrait-primary",
          categories: settings.pwa?.categories ?? [],
          icons: settings.pwa?.icons ?? []
        }
      };

      fileContent = `// system_settings.ts
// Exports system-wide settings as a JSON object

const systemSettings = ${JSON.stringify(completeSettings, null, 2)};

export default systemSettings;
`;
    }

    // Verify fileContent was generated
    if (!fileContent) {
      logger.error('No file content generated', new Error('File content generation failed'), { file });
      return createTypedErrorResponse(
        API_ERROR_CODES.INTERNAL_ERROR,
        `Failed to generate content for ${file}`,
        [{ field: 'file', message: 'No content generated', code: 'NO_CONTENT', value: file }]
      );
    }

    // Write the file
    fs.writeFileSync(filePath, fileContent);
    logger.info('Data file updated successfully', { file, timestamp: Date.now() });

    return createOptimizedResponse(
      { success: true, file, timestamp: Date.now() },
      { maxAge: 0 }
    );
  } catch (error) {
    logger.error('Failed to save data', error as Error, { file });
    return createTypedErrorResponse(
      API_ERROR_CODES.INTERNAL_ERROR,
      `Failed to save data to ${file}`,
      [{
        field: 'file',
        message: `Error writing to ${file}`,
        code: 'FILE_WRITE_ERROR',
        value: file
      }]
    );
  }
}
