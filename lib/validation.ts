import { z } from 'zod';
import { ValidationResult, ApiError } from '@/types/core';
import { API_ERROR_CODES } from '@/lib/api-response';
import { EditorJSData, EditorJSDataSchema } from '@/lib/schemas';

// Re-export all schemas from lib/schemas.ts for backward compatibility
export * from '@/lib/schemas';

/**
 * Centralized validation utilities
 *
 * This file provides:
 * - Re-exports of all schemas from lib/schemas.ts
 * - Validation helper functions
 * - Error formatting utilities
 * - Type-safe validation results
 */

// === SOCIAL PLATFORM URL VALIDATION ===

/**
 * Validate a social platform URL based on the platform type
 */
export function validateSocialPlatformURL(platform: string, url: string): ValidationResult {
  // Import SocialPlatformURLSchemas dynamically to avoid circular dependency
  const { SocialPlatformURLSchemas } = require('@/lib/schemas');
  const schema = SocialPlatformURLSchemas[platform as keyof typeof SocialPlatformURLSchemas];

  if (!schema) {
    return {
      isValid: false,
      errors: { url: 'Unsupported social platform' }
    };
  }

  const result = schema.safeParse(url);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  return {
    isValid: false,
    errors: { url: result.error.errors[0]?.message || 'Invalid URL format' }
  };
}

// === FORM VALIDATION HELPERS ===

/**
 * Validate form data against a Zod schema and return formatted errors
 */
export function validateFormData<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};

  result.error.errors.forEach((error) => {
    const field = error.path.join('.');
    errors[field] = error.message;
  });

  return { success: false, errors };
}

/**
 * Validate a single field against a schema
 */
export function validateField<T extends z.ZodSchema>(
  schema: T,
  value: unknown
): { isValid: true; value: z.infer<T> } | { isValid: false; error: string } {
  const result = schema.safeParse(value);

  if (result.success) {
    return { isValid: true, value: result.data };
  }

  return {
    isValid: false,
    error: result.error.errors[0]?.message || 'Invalid value'
  };
}

/**
 * Create a validation schema for partial updates (all fields optional)
 */
export function createPartialSchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): z.ZodObject<{ [K in keyof T]: z.ZodOptional<T[K]> }> {
  return schema.partial();
}

// === FILE VALIDATION ===

/**
 * Schema for validating image files
 */
export const ImageFileSchema = z.object({
  name: NonEmptyStringSchema,
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
  type: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/, 'Only image files are allowed')
});

/**
 * Validate uploaded file data
 */
export function validateImageFile(file: File): ValidationResult {
  const result = ImageFileSchema.safeParse({
    name: file.name,
    size: file.size,
    type: file.type
  });

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    errors[error.path[0] as string] = error.message;
  });

  return { isValid: false, errors };
}

// === DATA SANITIZATION ===

/**
 * Sanitize and validate text input
 */
export function sanitizeTextInput(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .slice(0, 1000); // Limit length
}

/**
 * Sanitize and validate array input
 */
export function sanitizeArrayInput(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map(item => sanitizeTextInput(item))
    .filter(item => item.length > 0)
    .slice(0, 50); // Limit array size
}

// === ERROR FORMATTING ===

/**
 * Convert Zod errors to API error format
 */
export function formatZodError(zodError: z.ZodError): ApiError {
  const details: Record<string, string> = {};

  zodError.errors.forEach((error) => {
    const field = error.path.join('.');
    details[field] = error.message;
  });

  return {
    code: API_ERROR_CODES.VALIDATION_ERROR,
    message: 'Validation failed',
    details: { fields: details }
  };
}

/**
 * Create a validation error for a specific field
 */
export function createFieldError(field: string, message: string): ApiError {
  return {
    code: API_ERROR_CODES.VALIDATION_ERROR,
    message: `Validation failed for field: ${field}`,
    field,
    details: { [field]: message }
  };
}

// === UTILITY VALIDATION FUNCTIONS ===

/**
 * Check if a string is a valid EditorJS JSON structure
 */
export function isValidEditorJSData(value: string): boolean {
  try {
    const parsed = JSON.parse(value);
    return EditorJSDataSchema.safeParse(parsed).success;
  } catch {
    return false;
  }
}

/**
 * Validate and parse EditorJS data
 */
export function parseEditorJSData(value: string): EditorJSData | null {
  try {
    const parsed = JSON.parse(value);
    const result = EditorJSDataSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Extract plain text from various input formats
 */
export function extractPlainTextSafe(input: unknown): string {
  if (typeof input === 'string') {
    return sanitizeTextInput(input);
  }

  // Try to parse as EditorJS data
  if (typeof input === 'object' && input !== null) {
    const editorData = EditorJSDataSchema.safeParse(input);
    if (editorData.success) {
      return editorData.data.blocks
        .filter(block => block.type === 'paragraph' && block.data.text)
        .map(block => block.data.text)
        .join(' ')
        .trim();
    }
  }

  return '';
}

/**
 * Validate email with custom domain rules
 */
export function validateProfessionalEmail(email: string): ValidationResult {
  const emailResult = EmailSchema.safeParse(email);

  if (!emailResult.success) {
    return {
      isValid: false,
      errors: { email: 'Please enter a valid email address' }
    };
  }

  // Additional professional email validation
  const domain = email.split('@')[1]?.toLowerCase();
  const suspiciousDomains = ['test.com', 'example.com', 'temp-mail.org'];

  if (suspiciousDomains.includes(domain)) {
    return {
      isValid: false,
      errors: { email: 'Please use a professional email address' }
    };
  }

  return { isValid: true, errors: {} };
}

/**
 * Validate that required fields are present in an object
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): ValidationResult {
  const errors: Record<string, string> = {};

  requiredFields.forEach((field) => {
    const value = data[field];
    if (value === null || value === undefined || value === '') {
      errors[field as string] = `${String(field)} is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Schemas are now exported from lib/schemas.ts via the wildcard export above
// This section intentionally left empty - all schemas moved to lib/schemas.ts