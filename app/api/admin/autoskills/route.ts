import { NextRequest } from "next/server";
import { experiences } from "@/data/cv-data";
import {
  GenerateSkillsApiRequestSchema,
  GenerateSkillsApiResponse,
  API_ERROR_CODES,
  createTypedSuccessResponse,
  createTypedErrorResponse,
  validateRequestBody
} from "@/types/api";
import { ApiErrorCode } from "@/types/core";

// Only allow in development mode
const isDev = process.env.NODE_ENV === "development";

/**
 * Type-safe POST handler to analyze experience data and return the top skills.
 *
 * Accepts a validated JSON payload containing experience texts and optional maxSkills parameter.
 * If no experiences provided, uses default imported data. Only available in development mode.
 *
 * @returns A typed JSON response with skills array including frequency and confidence metrics.
 */
export async function POST(request: NextRequest) {
  if (!isDev) {
    return createTypedErrorResponse(
      API_ERROR_CODES.FORBIDDEN,
      "Admin API only available in development mode"
    );
  }

  try {
    // Validate request body
    const validation = await validateRequestBody(request, GenerateSkillsApiRequestSchema);

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

    const { experienceTexts, maxSkills = 20 } = validation.data;

    // If no experience texts provided, extract from default experiences
    let textsToAnalyze = experienceTexts;
    if (!textsToAnalyze || textsToAnalyze.length === 0) {
      textsToAnalyze = experiences.map(exp =>
        Array.isArray(exp.tags) ? exp.tags.join(', ') : ''
      ).filter(text => text.length > 0);
    }

    // Collect all tags from experience entries
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

    const totalTags = allTags.length;

    // Sort tags by frequency and calculate confidence
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
      .slice(0, maxSkills)
      .map(([name, frequency]) => ({
        name,
        frequency,
        confidence: Math.min(frequency / totalTags, 1) // Normalize to 0-1
      }));

    const response: GenerateSkillsApiResponse = {
      skills: sortedTags,
      totalExperiences: experiences.length
    };

    return createTypedSuccessResponse(
      response,
      `Generated ${sortedTags.length} skills from ${experiences.length} experiences`
    );
  } catch (error) {
    console.error("Error generating top skills:", error);
    return createTypedErrorResponse(
      API_ERROR_CODES.INTERNAL_ERROR,
      "Failed to generate top skills"
    );
  }
}
