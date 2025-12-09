import { NextRequest } from "next/server";
import { experiences } from "@/data/cv-data";
import {
  GenerateSkillsApiRequestSchema,
  GenerateSkillsApiResponse,
  validateRequestBody
} from "@/types/api";
import { ApiErrorCode } from "@/types/core";
import { logger } from "@/lib/logger";
import { createTypedSuccessResponse, createTypedErrorResponse, API_ERROR_CODES } from "@/lib/api-response";
import { withDevOnly } from "@/lib/api-utils";
import { getOpenRouterAnswer } from "@/services/openrouter";

/**
 * Type-safe POST handler to analyze experience data and return the top skills.
 *
 * Accepts a validated JSON payload containing experience texts and optional maxSkills parameter.
 * If no experiences provided, uses default imported data. Only available in development mode.
 *
 * @returns A typed JSON response with skills array including frequency and confidence metrics.
 */
export const POST = withDevOnly(async (request: NextRequest) => {
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

    const { experienceTexts, jobDescriptions, maxSkills = 20 } = validation.data;

    // Collect all tags/skills to analyze
    let allTags: string[] = [];

    if (experienceTexts && experienceTexts.length > 0) {
      // Use provided texts (splitting by comma in case they are combined strings)
      experienceTexts.forEach(text => {
        text.split(',').forEach(tag => {
          const trimmed = tag.trim();
          if (trimmed) allTags.push(trimmed);
        });
      });
    } else {
      // Fallback: Collect tags and technologies from default experience entries
      experiences.forEach((exp) => {
        if (exp.tags && Array.isArray(exp.tags)) {
          allTags.push(...exp.tags);
        }
        if (exp.technologies && Array.isArray(exp.technologies)) {
          allTags.push(...exp.technologies);
        }
      });
    }

    // Count occurrences of each tag
    const tagCounts: Record<string, number> = {};
    allTags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const totalTags = allTags.length;

    let sortedTags: Array<{ name: string; frequency: number; confidence: number }> = [];
    let method = 'frequency';

    try {
      // Prepare data for AI
      const skillsWithCounts = Object.entries(tagCounts)
        .map(([name, count]) => `${name} (${count})`)
        .join(', ');

      const systemPrompt = `You are an expert technical recruiter and engineering manager. Your task is to analyze a list of skills and frequencies from a CV and identify the most impactful technical skills for a Senior Software Engineer / Manager profile.`;
      
      let userPrompt = `Here is the list of skills with their occurrence counts:
${skillsWithCounts}

`;

      if (jobDescriptions && jobDescriptions.length > 0) {
        userPrompt += `Context from Job Descriptions:
${jobDescriptions.join('\n\n')}

`;
      }

      userPrompt += `Please select the top ${maxSkills} most relevant and important skills.
- Prioritize core technologies, architectural concepts, and leadership skills.
- You may group similar skills or synonyms (e.g., 'React' and 'React.js' -> 'React').
- Ignore generic or low-value tags.
- Order them by importance/relevance based on the provided descriptions and skill frequency.

Return ONLY a valid JSON array of strings. Do not include any markdown formatting or explanation.`;

      // Call AI
      const aiResponse = await getOpenRouterAnswer({
        systemInput: systemPrompt,
        data: userPrompt,
        creativity: 0.2
      });

      // Parse AI response
      // Handle potential markdown code blocks in response
      const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiSkills = JSON.parse(cleanJson);

      if (Array.isArray(aiSkills)) {
        sortedTags = aiSkills.map((name: string) => {
          // Try to find original frequency, fuzzy match if needed (simplified here)
          const originalCount = tagCounts[name] || tagCounts[name + '.js'] || 1; 
          return {
            name,
            frequency: originalCount,
            confidence: 0.95 // High confidence for AI selection
          };
        });
        method = 'ai';
      } else {
        throw new Error('AI response was not an array');
      }

    } catch (aiError) {
      logger.warn('AI skill generation failed, falling back to frequency', { component: 'autoskills' }, aiError as Error);
      
      // Fallback: Sort tags by frequency
      sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
        .slice(0, maxSkills)
        .map(([name, frequency]) => ({
          name,
          frequency,
          confidence: totalTags === 0 ? 0 : Math.min(frequency / totalTags, 1) // Normalize to 0-1
        }));
    }

    const response: GenerateSkillsApiResponse = {
      skills: sortedTags,
      totalExperiences: experiences.length
    };

    logger.info('Top skills generated successfully', {
      skillCount: sortedTags.length,
      experienceCount: experiences.length,
      method
    });

    return createTypedSuccessResponse(
      { ...response, message: `Generated ${sortedTags.length} skills from ${experiences.length} experiences using ${method}` }
    );
  } catch (error) {
    logger.error('Failed to generate top skills', error as Error, {
      experienceCount: experiences.length
    });
    return createTypedErrorResponse(
      API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
});
