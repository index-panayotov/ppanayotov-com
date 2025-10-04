import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, ApiError } from './core';
import { API_ERROR_CODES, type ApiErrorCode } from './core';
import {
  UserProfileSchema,
  ExperienceEntrySchema,
  SystemSettingsSchema,
  TopSkillSchema,
  SocialLinkSchema,
  EducationEntrySchema,
  CertificationSchema,
  LanguageSchema,
  type UserProfile,
  type ExperienceEntry,
  type SystemSettings,
  type TopSkill,
  type SocialLink
} from '@/lib/schemas';

/**
 * API Types and Schemas for Type-Safe Request/Response Handling
 *
 * This file defines:
 * - Request/response interfaces for all API endpoints
 * - Zod schemas for runtime validation
 * - Type-safe API handler definitions
 * - Admin API specific types
 */

// === GENERIC API HANDLER TYPES ===

/**
 * Type-safe API handler with request/response validation
 */
export interface TypedApiHandler<TRequest = unknown, TResponse = unknown> {
  (request: NextRequest): Promise<NextResponse<ApiResponse<TResponse>>>;
}

/**
 * API request with validated body and search params
 */
export interface ValidatedApiRequest<TBody = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: TBody;
  searchParams: URLSearchParams;
  headers: Headers;
}

// === ADMIN API TYPES ===

/**
 * Generic admin API request structure
 */
export interface AdminApiRequest<TBody = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: TBody;
  searchParams?: URLSearchParams;
}

/**
 * Generic admin API response structure
 */
export interface AdminApiResponse<T = unknown> extends ApiResponse<T> {
  // Extends base ApiResponse with admin-specific fields if needed
}

// === PROFILE API TYPES ===

/**
 * Get profile API response - returns all profile-related data
 */
export interface GetProfileApiResponse {
  userProfile: UserProfile;
  experiences: ExperienceEntry[];
  topSkills: TopSkill[];
  systemSettings: SystemSettings;
}

export const GetProfileApiResponseSchema = z.object({
  userProfile: UserProfileSchema,
  experiences: z.array(ExperienceEntrySchema),
  topSkills: z.array(TopSkillSchema),
  systemSettings: SystemSettingsSchema
});

/**
 * Update profile API request
 */
export interface UpdateProfileApiRequest {
  file: string; // File to update (e.g., "user-profile.ts")
  data: Partial<UserProfile>;
}

export const UpdateProfileApiRequestSchema = z.object({
  file: z.string().min(1, 'File name is required'),
  data: UserProfileSchema.partial()
});

// === EXPERIENCE API TYPES ===

/**
 * Create experience API request
 */
export interface CreateExperienceApiRequest {
  experience: Omit<ExperienceEntry, 'id'>;
}

export const CreateExperienceApiRequestSchema = z.object({
  experience: ExperienceEntrySchema.omit({ id: true })
});

/**
 * Update experience API request
 */
export interface UpdateExperienceApiRequest {
  id: string;
  experience: Partial<ExperienceEntry>;
}

export const UpdateExperienceApiRequestSchema = z.object({
  id: z.string().min(1, 'Experience ID is required'),
  experience: ExperienceEntrySchema.partial()
});

/**
 * Delete experience API request
 */
export interface DeleteExperienceApiRequest {
  id: string;
}

export const DeleteExperienceApiRequestSchema = z.object({
  id: z.string().min(1, 'Experience ID is required')
});

// === SKILLS API TYPES ===

/**
 * Update skills API request
 */
export interface UpdateSkillsApiRequest {
  topSkills: string[];
}

export const UpdateSkillsApiRequestSchema = z.object({
  topSkills: z.array(z.string().min(1, 'Skill name cannot be empty'))
});

/**
 * Generate skills API request
 */
export interface GenerateSkillsApiRequest {
  experienceTexts: string[];
  maxSkills?: number;
}

export const GenerateSkillsApiRequestSchema = z.object({
  experienceTexts: z.array(z.string()),
  maxSkills: z.number().int().min(1).max(50).optional().default(20)
});

/**
 * Generate skills API response
 */
export interface GenerateSkillsApiResponse {
  skills: Array<{
    name: string;
    frequency: number;
    confidence: number;
  }>;
  totalExperiences: number;
}

export const GenerateSkillsApiResponseSchema = z.object({
  skills: z.array(z.object({
    name: z.string(),
    frequency: z.number().int().min(0),
    confidence: z.number().min(0).max(1)
  })),
  totalExperiences: z.number().int().min(0)
});

// === FILE UPLOAD API TYPES ===

/**
 * File upload API request
 */
export interface FileUploadApiRequest {
  file: File;
  filename?: string;
  optimize?: boolean;
}

/**
 * File upload API response
 */
export interface FileUploadApiResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
  webUrl?: string; // Optimized for web
  pdfUrl?: string; // Optimized for PDF
}

export const FileUploadApiResponseSchema = z.object({
  url: z.string().url(),
  filename: z.string(),
  size: z.number().int().min(0),
  type: z.string(),
  webUrl: z.string().url().optional(),
  pdfUrl: z.string().url().optional()
});

// === AI ENHANCEMENT API TYPES ===

/**
 * AI enhancement API request for text improvement
 */
export interface AIEnhanceApiRequest {
  text: string;
  context?: string;
  type: 'job_title' | 'description' | 'skills' | 'summary' | 'general';
  maxLength?: number;
}

export const AIEnhanceApiRequestSchema = z.object({
  text: z.string().min(1, 'Text to enhance is required'),
  context: z.string().optional(),
  type: z.enum(['job_title', 'description', 'skills', 'summary', 'general']),
  maxLength: z.number().int().min(10).max(2000).optional()
});

/**
 * AI enhancement API response
 */
export interface AIEnhanceApiResponse {
  originalText: string;
  enhancedText: string;
  improvements: string[];
  confidence: number;
}

export const AIEnhanceApiResponseSchema = z.object({
  originalText: z.string(),
  enhancedText: z.string(),
  improvements: z.array(z.string()),
  confidence: z.number().min(0).max(1)
});

// === TEXT-TO-IMAGE API TYPES ===

/**
 * Text to image API request for contact protection
 */
export interface TextToImageApiRequest {
  fieldType: 'email' | 'phone';
  size?: number;
  color?: string;
  bg?: string;
}

export const TextToImageApiRequestSchema = z.object({
  fieldType: z.enum(['email', 'phone']),
  size: z.number().int().min(8).max(48).optional().default(16),
  color: z.string().optional().default('#059669'),
  bg: z.string().optional().default('transparent')
});

// === ADMIN DATA UPDATE API TYPES ===

/**
 * Admin data update API request (for updating data files)
 */
export interface AdminDataUpdateApiRequest {
  file: string;
  data: unknown;
}

export const AdminDataUpdateApiRequestSchema = z.object({
  file: z.enum(['cv-data.ts', 'topSkills.ts', 'user-profile.ts'], {
    errorMap: () => ({ message: 'Invalid file name. Must be one of: cv-data.ts, topSkills.ts, user-profile.ts' })
  }),
  data: z.unknown()
});

/**
 * Generate top skills API response
 */
export interface GenerateTopSkillsApiResponse {
  topSkills: string[];
}

export const GenerateTopSkillsApiResponseSchema = z.object({
  topSkills: z.array(z.string())
});

// === SYSTEM SETTINGS API TYPES ===

/**
 * Update system settings API request
 */
export interface UpdateSystemSettingsApiRequest {
  settings: {
    blogEnable?: boolean;
    useWysiwyg?: boolean;
    showContacts?: boolean;
    showPrint?: boolean;
    gtagEnabled?: boolean;
    gtagCode?: string;
  };
}

export const UpdateSystemSettingsApiRequestSchema = z.object({
  settings: z.object({
    blogEnable: z.boolean().optional(),
    useWysiwyg: z.boolean().optional(),
    showContacts: z.boolean().optional(),
    showPrint: z.boolean().optional(),
    gtagEnabled: z.boolean().optional(),
    gtagCode: z.string().optional()
  })
});

// === AUTHENTICATION API TYPES ===

/**
 * Admin login API request
 */
export interface AdminLoginApiRequest {
  password: string;
}

export const AdminLoginApiRequestSchema = z.object({
  password: z.string().min(1, 'Password is required')
});

/**
 * Admin login API response
 */
export interface AdminLoginApiResponse {
  success: boolean;
  token?: string;
  expiresAt?: number;
}

export const AdminLoginApiResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  expiresAt: z.number().optional()
});

// === ERROR RESPONSE TYPES ===

/**
 * Validation error details for form fields
 */
export interface ValidationErrorDetails {
  field: string;
  message: string;
  code: string;
  value?: unknown | undefined;
}

export const ValidationErrorDetailsSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
  value: z.unknown().optional()
});

// Re-export API_ERROR_CODES from core for backward compatibility
export { API_ERROR_CODES, type ApiErrorCode } from './core';

// === UTILITY TYPES ===

/**
 * Extract request type from an API handler
 */
export type ExtractApiRequest<T> = T extends TypedApiHandler<infer R, any> ? R : never;

/**
 * Extract response type from an API handler
 */
export type ExtractApiResponse<T> = T extends TypedApiHandler<any, infer R> ? R : never;

/**
 * Create a typed API handler with automatic validation
 */
export type ValidatedApiHandler<
  TRequestSchema extends z.ZodSchema,
  TResponseSchema extends z.ZodSchema
> = (
  request: NextRequest,
  validatedBody: z.infer<TRequestSchema>
) => Promise<NextResponse<ApiResponse<z.infer<TResponseSchema>>>>;

// === HELPER FUNCTIONS ===

/**
 * Create a typed error response
 */
export function createTypedErrorResponse(
  code: ApiErrorCode,
  message: string,
  details?: ValidationErrorDetails[] | undefined
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && { details: { validationErrors: details } })
    },
    timestamp: Date.now()
  });
}

/**
 * Create a typed success response
 */
export function createTypedSuccessResponse<T>(
  data: T,
  message?: string | undefined
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    ...(message !== undefined && { message }),
    timestamp: Date.now()
  });
}

/**
 * Validate request body against a Zod schema
 */
export async function validateRequestBody<T extends z.ZodSchema>(
  request: NextRequest,
  schema: T
): Promise<{ success: true; data: z.infer<T> } | { success: false; error: ApiError }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
        error: {
          code: API_ERROR_CODES.VALIDATION_ERROR,
          message: 'Invalid request body',
          details: { zodErrors: result.error.errors }
        }
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: {
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid JSON in request body'
      }
    };
  }
}

/**
 * Validate search parameters against a Zod schema
 */
export function validateSearchParams<T extends z.ZodSchema>(
  request: NextRequest,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; error: ApiError } {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const result = schema.safeParse(params);

    if (!result.success) {
      return {
        success: false,
        error: {
          code: API_ERROR_CODES.VALIDATION_ERROR,
          message: 'Invalid search parameters',
          details: { zodErrors: result.error.errors }
        }
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: {
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: 'Failed to parse search parameters'
      }
    };
  }
}