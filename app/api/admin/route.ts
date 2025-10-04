import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { experiences } from "@/data/cv-data";
import { topSkills } from "@/data/topSkills";
import { userProfile } from "@/data/user-profile";
import {
  GetProfileApiResponse,
  GenerateTopSkillsApiResponse,
  AdminDataUpdateApiRequestSchema,
  API_ERROR_CODES,
  createTypedSuccessResponse,
  createTypedErrorResponse,
  validateSearchParams,
  validateRequestBody
} from "@/types/api";
import { z } from "zod";
import { createOptimizedResponse } from "@/lib/api-compression";

// Only allow in development mode
const isDev = process.env.NODE_ENV === "development";

// Schema for GET request search parameters
const GetAdminApiParamsSchema = z.object({
  action: z.enum(['generateTopSkills']).optional()
});

/**
 * Type-safe GET handler for admin data operations
 */
export async function GET(request: NextRequest) {
  if (!isDev) {
    return createTypedErrorResponse(
      API_ERROR_CODES.FORBIDDEN,
      "Admin API only available in development mode"
    );
  }

  // Validate search parameters
  const paramValidation = validateSearchParams(request, GetAdminApiParamsSchema);

  if (!paramValidation.success) {
    return createTypedErrorResponse(
      paramValidation.error.code,
      paramValidation.error.message
    );
  }

  const { action } = paramValidation.data;

  try {
    if (action === "generateTopSkills") {
      // Generate top skills based on frequency in experiences
      const allTags: string[] = [];
      experiences.forEach((exp) => {
        if (exp.tags && Array.isArray(exp.tags)) {
          exp.tags.forEach((tag) => {
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
      profileData: userProfile, // Normalized field name for consistency
      experiences,
      topSkills,
      systemSettings: {
        blogEnable: false,
        useWysiwyg: true,
        showContacts: true,
        showPrint: false,
        gtagCode: "G-NR6KNX7RM6",
        gtagEnabled: true
      }
    };

    console.log('[Admin API] Returning data:', {
      profileData: !!response.profileData,
      experiences: response.experiences.length,
      topSkills: response.topSkills.length
    });

    return createOptimizedResponse(response, { maxAge: 60 });
  } catch (error) {
    console.error('Error in admin GET handler:', error);
    return createTypedErrorResponse(
      API_ERROR_CODES.INTERNAL_ERROR,
      'Failed to retrieve admin data'
    );
  }
}

/**
 * Type-safe POST handler for updating data files
 */
export async function POST(request: NextRequest) {
  if (!isDev) {
    return createTypedErrorResponse(
      API_ERROR_CODES.FORBIDDEN,
      "Admin API only available in development mode"
    );
  }

  // Validate request body
  const validation = await validateRequestBody(request, AdminDataUpdateApiRequestSchema);

  if (!validation.success) {
    return createTypedErrorResponse(
      validation.error.code,
      validation.error.message,
      validation.error.details?.zodErrors?.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
        value: err.input
      }))
    );
  }

  const { file, data } = validation.data;

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
    }

    // Write the file
    fs.writeFileSync(filePath, fileContent);

    return createOptimizedResponse(
      { success: true, file, timestamp: Date.now() },
      { maxAge: 0 }
    );
  } catch (error) {
    console.error("Error saving data:", error);
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
