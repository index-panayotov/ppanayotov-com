import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  GenerateTopSkillsApiResponse,
  AdminDataUpdateApiRequestSchema,
  validateSearchParams,
  validateRequestBody
} from "@/types/api";
import { ApiErrorCode } from "@/types/core";
import { z } from "zod";
import { createTypedSuccessResponse, createTypedErrorResponse, API_ERROR_CODES } from "@/lib/api-response";
import { loadSystemSettings, loadCVData, loadTopSkills, loadUserProfile, saveDataFile } from "@/lib/data-loader";
import { logger } from "@/lib/logger";
import { withDevOnly } from "@/lib/api-utils";
import { ExperienceEntry } from "@/lib/schemas";

/**
 * Interface for Zod validation error details
 */
interface ZodErrorDetail {
  path: (string | number)[];
  message: string;
  code: string;
  input?: unknown;
}

interface ValidationErrorDetails {
  zodErrors?: ZodErrorDetail[];
}

// Schema for GET request search parameters
const GetAdminApiParamsSchema = z.object({
  action: z.enum(['generateTopSkills']).optional()
});

/**
 * Type-safe GET handler for admin data operations
 */
export const GET = withDevOnly(async (request: NextRequest) => {
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
      experiences.forEach((exp: ExperienceEntry) => {
        if (exp.tags && Array.isArray(exp.tags)) {
          exp.tags.forEach((tag: string) => {
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

      return createTypedSuccessResponse(response, { maxAge: 60 });
    }

    // Default: return all data (using consistent field names)
    const response = {
      profileData, // Normalized field name for consistency
      experiences,
      topSkills,
      systemSettings
    };



  return createTypedSuccessResponse(response, { maxAge: 0, headers: { 'Cache-Control': 'no-store' } }); // No cache for fresh data
  } catch (error) {
    logger.error('Admin GET handler failed', error as Error, { action });
    return createTypedErrorResponse(
            API_ERROR_CODES.INTERNAL_SERVER_ERROR,
            error instanceof Error ? error.message : 'Failed to update data'
          );  }
});

/**
 * Paths to revalidate based on which file was updated
 */
const REVALIDATION_PATHS: Record<string, string[]> = {
  'cv-data.ts': ['/', '/blog'],
  'topSkills.ts': ['/'],
  'user-profile.ts': ['/'],
  'system_settings.ts': ['/', '/blog'],
};

/**
 * Type-safe POST handler for updating data files
 *
 * ARCHITECTURE: Writes to JSON files for runtime persistence
 * - TypeScript files are build-time defaults only
 * - JSON files are the source of truth at runtime
 * - Cache revalidation ensures immediate updates on frontend
 */
export const POST = withDevOnly(async (request: NextRequest) => {
  // Validate request body
  const validation = await validateRequestBody(request, AdminDataUpdateApiRequestSchema);

  if (!validation.success) {
    const details = validation.error.details as ValidationErrorDetails | undefined;
    return createTypedErrorResponse(
      validation.error.code as ApiErrorCode,
      validation.error.message,
      details?.zodErrors?.map((err: ZodErrorDetail) => ({
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
    // Save to JSON file (runtime data storage)
    saveDataFile(file, data);
    logger.info('Data file updated successfully', { file, timestamp: Date.now() });

    // Revalidate affected paths to bust the cache
    const pathsToRevalidate = REVALIDATION_PATHS[file] || ['/'];
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
    }
    logger.info('Cache revalidated', { paths: pathsToRevalidate });

    return createTypedSuccessResponse(
      { success: true, file, timestamp: Date.now() },
      { maxAge: 0, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    logger.error('Failed to save data', error as Error, { file });
    return createTypedErrorResponse(
      API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Failed to save data'
    );
  }
});
