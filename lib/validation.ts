import { z } from 'zod';
import {
  ValidationResult,
  ApiError,
  EditorJSData,
  EditorJSDataSchema,
  API_ERROR_CODES
} from '@/types/core';

/**
 * Centralized validation utilities using Zod schemas
 *
 * This file provides:
 * - Common validation schemas
 * - Validation helper functions
 * - Error formatting utilities
 * - Type-safe validation results
 */

// === COMMON VALIDATION SCHEMAS ===

/**
 * Schema for validating strings that should not be empty
 */
export const NonEmptyStringSchema = z.string().trim().min(1, 'This field is required');

/**
 * Schema for validating optional strings that can be empty
 */
export const OptionalStringSchema = z.string().trim().optional();

/**
 * Schema for validating email addresses
 */
export const EmailSchema = z.string().email('Please enter a valid email address');

/**
 * Schema for validating URLs
 */
export const URLSchema = z.string().url('Please enter a valid URL');

/**
 * Schema for validating phone numbers (flexible format)
 */
export const PhoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(/^[\+\-\s\(\)\d]+$/, 'Please enter a valid phone number');

/**
 * Schema for validating date strings (YYYY-MM-DD or flexible date format)
 */
export const DateStringSchema = z.string()
  .min(1, 'Date is required')
  .refine((date) => {
    // Accept various date formats: "Jan 2023", "January 2023 - Present", etc.
    const dateRegex = /^[\w\s\-,]+$/;
    return dateRegex.test(date);
  }, 'Please enter a valid date');

/**
 * Schema for validating arrays of non-empty strings (like tags, skills)
 */
export const StringArraySchema = z.array(NonEmptyStringSchema)
  .min(1, 'At least one item is required');

/**
 * Schema for validating optional arrays of strings
 */
export const OptionalStringArraySchema = z.array(z.string()).optional().default([]);

/**
 * Schema for validating experience descriptions (string or EditorJS)
 */
export const ExperienceDescriptionSchema = z.union([
  NonEmptyStringSchema,
  EditorJSDataSchema
], {
  errorMap: () => ({ message: 'Description is required' })
});

/**
 * Schema for validating image URLs or file paths
 */
export const ImageURLSchema = z.string()
  .optional()
  .refine((url) => {
    if (!url) return true; // Optional field
    return url.startsWith('/') || url.startsWith('http') || url.startsWith('data:');
  }, 'Invalid image URL or path');

// === SOCIAL PLATFORM VALIDATION ===

/**
 * Social platform validation schemas
 */
export const SocialPlatformSchema = z.enum([
  'LinkedIn', 'GitHub', 'Twitter', 'Instagram', 'YouTube', 'Facebook',
  'TikTok', 'Medium', 'DevTo', 'StackOverflow', 'Discord', 'Telegram',
  'WhatsApp', 'Mastodon', 'Threads', 'Custom'
] as const);

export const LanguageProficiencySchema = z.enum([
  'Native', 'Fluent', 'Professional', 'Limited', 'Basic'
] as const);

/**
 * Social platform URL validation schemas
 */
export const SocialPlatformURLSchemas = {
  linkedin: z.string().regex(
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
    'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)'
  ),
  github: z.string().regex(
    /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
    'Please enter a valid GitHub profile URL (e.g., https://github.com/username)'
  ),
  twitter: z.string().regex(
    /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w_]+\/?$/,
    'Please enter a valid Twitter/X profile URL (e.g., https://twitter.com/username)'
  ),
  instagram: z.string().regex(
    /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+\/?$/,
    'Please enter a valid Instagram profile URL (e.g., https://instagram.com/username)'
  ),
  youtube: z.string().regex(
    /^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|user\/|@)[\w.-]+\/?$/,
    'Please enter a valid YouTube channel URL (e.g., https://youtube.com/@username)'
  ),
  facebook: z.string().regex(
    /^https?:\/\/(www\.)?facebook\.com\/[\w.-]+\/?$/,
    'Please enter a valid Facebook profile URL (e.g., https://facebook.com/username)'
  ),
  tiktok: z.string().regex(
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/?$/,
    'Please enter a valid TikTok profile URL (e.g., https://tiktok.com/@username)'
  ),
  medium: z.string().regex(
    /^https?:\/\/(www\.)?medium\.com\/@?[\w.-]+\/?$/,
    'Please enter a valid Medium profile URL (e.g., https://medium.com/@username)'
  ),
  devto: z.string().regex(
    /^https?:\/\/(www\.)?dev\.to\/[\w.-]+\/?$/,
    'Please enter a valid Dev.to profile URL (e.g., https://dev.to/username)'
  ),
  stackoverflow: z.string().regex(
    /^https?:\/\/(www\.)?stackoverflow\.com\/users\/\d+\/[\w.-]+\/?$/,
    'Please enter a valid Stack Overflow profile URL'
  ),
  discord: z.string().regex(
    /^https?:\/\/(www\.)?discord\.(gg|com)\/(invite\/)?[\w.-]+\/?$/,
    'Please enter a valid Discord server invite URL'
  ),
  telegram: z.string().regex(
    /^https?:\/\/(www\.)?t\.me\/[\w.-]+\/?$/,
    'Please enter a valid Telegram profile URL (e.g., https://t.me/username)'
  ),
  whatsapp: z.string().regex(
    /^https?:\/\/(www\.)?wa\.me\/\d+\/?$/,
    'Please enter a valid WhatsApp business URL (e.g., https://wa.me/1234567890)'
  ),
  mastodon: z.string().regex(
    /^https?:\/\/[\w.-]+\/@[\w.-]+\/?$/,
    'Please enter a valid Mastodon profile URL (e.g., https://mastodon.social/@username)'
  ),
  threads: z.string().regex(
    /^https?:\/\/(www\.)?threads\.net\/@[\w.-]+\/?$/,
    'Please enter a valid Threads profile URL (e.g., https://threads.net/@username)'
  ),
  custom: URLSchema
};

/**
 * Validate a social platform URL based on the platform type
 */
export function validateSocialPlatformURL(platform: string, url: string): ValidationResult {
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

// === COMPLEX OBJECT SCHEMAS ===

export const SocialLinkSchema = z.object({
  platform: SocialPlatformSchema,
  url: NonEmptyStringSchema,
  label: OptionalStringSchema,
  visible: z.boolean().default(false),
  visibleInHero: z.boolean().default(false),
  position: z.number().int().min(0).default(0)
});

export const EducationEntrySchema = z.object({
  institution: NonEmptyStringSchema,
  degree: NonEmptyStringSchema,
  field: NonEmptyStringSchema,
  dateRange: DateStringSchema,
  description: OptionalStringSchema
});

export const CertificationSchema = z.object({
  name: NonEmptyStringSchema,
  issuer: OptionalStringSchema,
  dateIssued: OptionalStringSchema,
  expirationDate: OptionalStringSchema,
  credentialId: OptionalStringSchema,
  url: URLSchema.optional()
});

export const LanguageSchema = z.object({
  name: NonEmptyStringSchema,
  proficiency: LanguageProficiencySchema
});

export const ExperienceEntrySchema = z.object({
  id: OptionalStringSchema,
  title: NonEmptyStringSchema,
  company: NonEmptyStringSchema,
  dateRange: DateStringSchema,
  location: OptionalStringSchema,
  description: ExperienceDescriptionSchema,
  tags: OptionalStringArraySchema,
  isCurrentRole: z.boolean().optional().default(false),
  achievements: OptionalStringArraySchema,
  technologies: OptionalStringArraySchema
});

export const TopSkillSchema = z.object({
  name: NonEmptyStringSchema,
  category: OptionalStringSchema,
  yearsOfExperience: z.number().optional(),
  proficiencyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional()
});

export const UserProfileSchema = z.object({
  name: NonEmptyStringSchema,
  title: NonEmptyStringSchema,
  phone: PhoneSchema,
  location: NonEmptyStringSchema,
  profileImageUrl: ImageURLSchema,
  profileImageWebUrl: ImageURLSchema,
  profileImagePdfUrl: ImageURLSchema,
  summary: ExperienceDescriptionSchema,
  email: EmailSchema,
  socialLinks: z.array(SocialLinkSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  education: z.array(EducationEntrySchema).default([]),
  certifications: z.array(CertificationSchema).default([])
});

export const SystemSettingsSchema = z.object({
  blogEnable: z.boolean().default(false),
  useWysiwyg: z.boolean().default(true),
  showContacts: z.boolean().default(true),
  showPrint: z.boolean().default(false),
  gtagCode: OptionalStringSchema,
  gtagEnabled: z.boolean().default(false),
  pwa: z.object({
    siteName: NonEmptyStringSchema,
    shortName: NonEmptyStringSchema,
    description: NonEmptyStringSchema,
    startUrl: z.string().default('/'),
    display: z.enum(['standalone', 'fullscreen', 'minimal-ui', 'browser']).default('standalone'),
    backgroundColor: z.string().default('#ffffff'),
    themeColor: z.string().default('#0f172a'),
    orientation: z.enum(['portrait-primary', 'landscape-primary', 'any']).default('portrait-primary'),
    categories: z.array(z.string()).default([]),
    icons: z.array(z.object({
      src: NonEmptyStringSchema,
      sizes: NonEmptyStringSchema,
      type: NonEmptyStringSchema,
      purpose: OptionalStringSchema
    })).default([])
  }).optional()
});

// === TYPE EXPORTS ===

export type SocialPlatform = z.infer<typeof SocialPlatformSchema>;
export type LanguageProficiency = z.infer<typeof LanguageProficiencySchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;
export type TopSkill = z.infer<typeof TopSkillSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type SystemSettings = z.infer<typeof SystemSettingsSchema>;

// === TYPE GUARDS ===

export const isSocialPlatform = (value: unknown): value is SocialPlatform => {
  return SocialPlatformSchema.safeParse(value).success;
};

export const isValidUserProfile = (value: unknown): value is UserProfile => {
  return UserProfileSchema.safeParse(value).success;
};

export const isValidExperienceEntry = (value: unknown): value is ExperienceEntry => {
  return ExperienceEntrySchema.safeParse(value).success;
};

export const isValidSystemSettings = (value: unknown): value is SystemSettings => {
  return SystemSettingsSchema.safeParse(value).success;
};

// === VALIDATION HELPERS ===

export const validateUserProfile = (data: unknown) => {
  const result = UserProfileSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid user profile: ${result.error.message}`);
  }
  return result.data;
};

export const validateExperienceEntry = (data: unknown) => {
  const result = ExperienceEntrySchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid experience entry: ${result.error.message}`);
  }
  return result.data;
};

export const validateSystemSettings = (data: unknown) => {
  const result = SystemSettingsSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid system settings: ${result.error.message}`);
  }
  return result.data;
};

export const validatePartialUserProfile = (data: unknown) => {
  const result = UserProfileSchema.partial().safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid partial user profile: ${result.error.message}`);
  }
  return result.data;
};

export const validatePartialExperienceEntry = (data: unknown) => {
  const result = ExperienceEntrySchema.partial().safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid partial experience entry: ${result.error.message}`);
  }
  return result.data;
};

// Export commonly used schemas for easy import
export {
  NonEmptyStringSchema,
  OptionalStringSchema,
  EmailSchema as EmailStringSchema,
  URLSchema as URLStringSchema,
  PhoneSchema,
  DateStringSchema,
  StringArraySchema,
  OptionalStringArraySchema,
  ImageURLSchema
};