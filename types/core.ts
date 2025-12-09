import { z } from 'zod';

/**
 * Core utility types and Zod schemas for type-safe application
 *
 * This file provides the foundation for type safety throughout the application:
 * - Basic primitive type definitions
 * - Utility types for common patterns
 * - API response/error schemas
 * - Loading and validation state types
 */

// === PRIMITIVE TYPES ===

export type ID = string;
export type Timestamp = number;
export type DateString = string; // ISO date string
export type URLString = string;
export type EmailString = string;
export type PhoneString = string;

// Zod schemas for primitive validations
export const IdSchema = z.string().min(1);
export const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Invalid date format');
export const URLStringSchema = z.string().url('Invalid URL format');
export const EmailStringSchema = z.string().email('Invalid email format');
export const PhoneStringSchema = z.string().min(1, 'Phone number is required');

// === UTILITY TYPES ===

/**
 * Make specific fields optional while keeping others required
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific fields required while keeping others as-is
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Exclude null and undefined from a type
 */
export type NonNullable<T> = Exclude<T, null | undefined>;

/**
 * Extract the array element type
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

// === STATE MANAGEMENT TYPES ===

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ValidationState = 'valid' | 'invalid' | 'pending';

export const LoadingStateSchema = z.enum(['idle', 'loading', 'success', 'error']);
export const ValidationStateSchema = z.enum(['valid', 'invalid', 'pending']);

// === API RESPONSE TYPES ===

/**
 * Standard API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown> | undefined;
  field?: string | undefined; // For field-specific validation errors
}

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  field: z.string().optional()
});

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T | undefined;
  error?: ApiError | undefined;
  message?: string | undefined;
  timestamp?: Timestamp | undefined;
}

export const createApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ApiErrorSchema.optional(),
    message: z.string().optional(),
    timestamp: z.number().optional()
  });

// === FORM TYPES ===

/**
 * Generic form state for consistent form handling
 */
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.record(z.string())
});

// === FILE UPLOAD TYPES ===

export interface FileUploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  size?: number;
  error?: string;
}

export const FileUploadResultSchema = z.object({
  success: z.boolean(),
  url: URLStringSchema.optional(),
  filename: z.string().optional(),
  size: z.number().optional(),
  error: z.string().optional()
});

// === PAGINATION TYPES ===

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0)
});

export const createPaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean()
    })
  });

// === SEARCH TYPES ===

export interface SearchParams {
  query: string;
  filters?: Record<string, string | string[]>;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export const SearchParamsSchema = z.object({
  query: z.string(),
  filters: z.record(z.union([z.string(), z.array(z.string())])).optional(),
  sort: z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc'])
  }).optional()
});

// === TYPE GUARDS ===

/**
 * Check if a value is a valid API response
 */
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  const schema = createApiResponseSchema(z.unknown());
  return schema.safeParse(value).success;
}

/**
 * Check if a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if a value is a valid email
 */
export function isValidEmail(value: unknown): value is EmailString {
  return EmailStringSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid URL
 */
export function isValidURL(value: unknown): value is URLString {
  return URLStringSchema.safeParse(value).success;
}

// === UTILITY FUNCTIONS ===

/**
 * Create a typed error object
 */
export function createApiError(
  code: string,
  message: string,
  details?: Record<string, unknown> | undefined,
  field?: string | undefined
): ApiError {
  return {
    code,
    message,
    ...(details !== undefined && { details }),
    ...(field !== undefined && { field })
  };
}

/**
 * Create a success API response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string | undefined
): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(message !== undefined && { message }),
    timestamp: Date.now()
  };
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  error: ApiError,
  message?: string | undefined
): ApiResponse<never> {
  return {
    success: false,
    error,
    ...(message !== undefined && { message }),
    timestamp: Date.now()
  };
}

/**
 * Safe JSON parsing with fallback
 */
export function safeJsonParse<T>(
  value: string,
  fallback: T
): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Ensure a value is an array
 */
export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

// === API ERROR CODES ===

/**
 * Re-export API_ERROR_CODES from lib/api-response for backward compatibility
 */
export { API_ERROR_CODES } from '@/lib/api-response';
export type { ApiErrorCode } from '@/lib/api-response';

// Re-export commonly used Zod types
export { z } from 'zod';
export type { ZodSchema, ZodType } from 'zod';