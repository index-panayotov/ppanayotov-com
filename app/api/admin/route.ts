import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import {
  GenerateTopSkillsApiResponse,
  AdminDataUpdateApiRequestSchema,
  validateSearchParams,
  validateRequestBody
} from "@/types/api";
import { ApiErrorCode } from "@/types/core";
import { z } from "zod";
import { createTypedSuccessResponse, createTypedErrorResponse, API_ERROR_CODES } from "@/lib/api-response";
import { loadSystemSettings, loadCVData, loadTopSkills, loadUserProfile } from "@/lib/data-loader";
import { logger } from "@/lib/logger";
import { withDevOnly, generateDataFileContent } from "@/lib/api-utils";

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
      API_ERROR_CODES.INTERNAL_ERROR,
      'Failed to retrieve admin data'
    );
  }
});

/**
 * Type-safe POST handler for updating data files
 */
export const POST = withDevOnly(async (request: NextRequest) => {
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

    // Generate file content using utility function
    const fileContent = generateDataFileContent(file, data);

    // Write the file
    fs.writeFileSync(filePath, fileContent);
    logger.info('Data file updated successfully', { file, timestamp: Date.now() });

    return createTypedSuccessResponse(
      { success: true, file, timestamp: Date.now() },
      { maxAge: 0, headers: { 'Cache-Control': 'no-store' } }
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
});
