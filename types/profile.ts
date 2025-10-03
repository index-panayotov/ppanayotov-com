import { z } from 'zod';
import {
  NonEmptyStringSchema,
  EmailStringSchema,
  URLStringSchema,
  OptionalStringArraySchema,
  DateStringSchema,
  ImageURLSchema
} from '@/lib/validation';

/**
 * Language proficiency levels with Zod schema for validation
 */
export enum LanguageProficiency {
  Native = "Native",
  Fluent = "Fluent",
  Professional = "Professional",
  Intermediate = "Intermediate",
  Elementary = "Elementary",
  Beginner = "Beginner"
}

export const LanguageProficiencySchema = z.enum([
  'Native',
  'Fluent',
  'Professional',
  'Intermediate',
  'Elementary',
  'Beginner'
]);

/**
 * Supported social media platforms with Zod schema
 */
export const SocialPlatformSchema = z.enum([
  'Facebook',
  'GitHub',
  'Twitter',
  'LinkedIn',
  'Instagram',
  'YouTube',
  'TikTok',
  'Medium',
  'DevTo',
  'StackOverflow',
  'Discord',
  'Telegram',
  'WhatsApp',
  'Mastodon',
  'Threads',
  'Custom'
]);

export type SocialPlatform = z.infer<typeof SocialPlatformSchema>;

/**
 * Social media link schema with comprehensive validation
 */
export const SocialLinkSchema = z.object({
  platform: SocialPlatformSchema,
  url: URLStringSchema,
  label: z.string().optional(),
  visible: z.boolean().default(true),
  visibleInHero: z.boolean().default(false),
  position: z.number().int().min(0).default(0),
  icon: z.string().optional()
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;

/**
 * Language entry schema with validation
 */
export const LanguageEntrySchema = z.object({
  name: NonEmptyStringSchema,
  proficiency: LanguageProficiencySchema
});

export type LanguageEntry = z.infer<typeof LanguageEntrySchema>;

/**
 * Education entry schema with validation
 */
export const EducationEntrySchema = z.object({
  institution: NonEmptyStringSchema,
  degree: NonEmptyStringSchema,
  field: NonEmptyStringSchema,
  dateRange: DateStringSchema,
  description: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.array(z.string()).optional().default([])
});

export type EducationEntry = z.infer<typeof EducationEntrySchema>;

/**
 * Certification entry schema with validation
 */
export const CertificationSchema = z.object({
  name: NonEmptyStringSchema,
  issuer: z.string().optional(),
  date: z.string().optional(),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: URLStringSchema.optional(),
  description: z.string().optional()
});

export type Certification = z.infer<typeof CertificationSchema>;

/**
 * Complete user profile schema with comprehensive validation
 */
export const UserProfileSchema = z.object({
  // Required personal information
  name: NonEmptyStringSchema,
  title: NonEmptyStringSchema,
  email: EmailStringSchema,
  phone: NonEmptyStringSchema,
  location: NonEmptyStringSchema,

  // Profile images (optional with validation)
  profileImageUrl: ImageURLSchema,
  profileImageWebUrl: ImageURLSchema.optional(),
  profileImagePdfUrl: ImageURLSchema.optional(),

  // Summary (can be string or EditorJS format)
  summary: NonEmptyStringSchema,

  // Optional arrays with default empty values
  socialLinks: z.array(SocialLinkSchema).optional().default([]),
  languages: z.array(LanguageEntrySchema).optional().default([]),
  education: z.array(EducationEntrySchema).optional().default([]),
  certifications: z.array(CertificationSchema).optional().default([]),

  // Additional optional fields
  website: URLStringSchema.optional(),
  linkedinUrl: URLStringSchema.optional(), // Legacy field, prefer socialLinks
  githubUrl: URLStringSchema.optional(), // Legacy field, prefer socialLinks

  // Professional details
  yearsOfExperience: z.number().int().min(0).optional(),
  currentPosition: z.string().optional(),
  availability: z.enum(['available', 'open_to_opportunities', 'not_available']).optional(),
  preferredWorkType: z.enum(['full_time', 'part_time', 'contract', 'freelance', 'remote']).optional(),

  // Metadata
  lastUpdated: z.string().optional(),
  version: z.string().optional().default('1.0')
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * Partial user profile schema for updates
 */
export const PartialUserProfileSchema = UserProfileSchema.partial();

export type PartialUserProfile = z.infer<typeof PartialUserProfileSchema>;

// === VALIDATION UTILITIES ===

/**
 * Type guards for runtime type checking
 */
export function isSocialPlatform(value: string): value is SocialPlatform {
  return SocialPlatformSchema.safeParse(value).success;
}

export function isLanguageProficiency(value: string): value is LanguageProficiency {
  return LanguageProficiencySchema.safeParse(value).success;
}

export function isValidSocialLink(value: unknown): value is SocialLink {
  return SocialLinkSchema.safeParse(value).success;
}

export function isValidUserProfile(value: unknown): value is UserProfile {
  return UserProfileSchema.safeParse(value).success;
}

/**
 * Validation functions with detailed error reporting
 */
export function validateSocialLink(data: unknown): {
  success: true;
  data: SocialLink;
} | {
  success: false;
  errors: Record<string, string>;
} {
  const result = SocialLinkSchema.safeParse(data);

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

export function validateUserProfile(data: unknown): {
  success: true;
  data: UserProfile;
} | {
  success: false;
  errors: Record<string, string>;
} {
  const result = UserProfileSchema.safeParse(data);

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
 * Helper functions for working with profile data
 */
export function createEmptyUserProfile(): Partial<UserProfile> {
  return {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    socialLinks: [],
    languages: [],
    education: [],
    certifications: [],
    version: '1.0'
  };
}

export function sanitizeUserProfile(profile: Partial<UserProfile>): Partial<UserProfile> {
  // Remove any undefined values and ensure arrays are not undefined
  return {
    ...profile,
    socialLinks: profile.socialLinks || [],
    languages: profile.languages || [],
    education: profile.education || [],
    certifications: profile.certifications || []
  };
}

/**
 * Social link utility functions
 */
export function sortSocialLinksByPosition(links: SocialLink[]): SocialLink[] {
  return [...links].sort((a, b) => (a.position || 0) - (b.position || 0));
}

export function getVisibleSocialLinks(links: SocialLink[]): SocialLink[] {
  return links.filter(link => link.visible);
}

export function getHeroSocialLinks(links: SocialLink[]): SocialLink[] {
  return links.filter(link => link.visibleInHero);
}

export function findSocialLinkByPlatform(
  links: SocialLink[],
  platform: SocialPlatform
): SocialLink | undefined {
  return links.find(link => link.platform === platform);
}

/**
 * Profile completeness calculation
 */
export function calculateProfileCompleteness(profile: Partial<UserProfile>): {
  percentage: number;
  missingFields: string[];
  completedSections: string[];
} {
  const requiredFields = ['name', 'title', 'email', 'phone', 'location', 'summary'];
  const optionalSections = ['socialLinks', 'languages', 'education', 'certifications'];

  const missingFields: string[] = [];
  const completedSections: string[] = [];

  // Check required fields
  requiredFields.forEach(field => {
    const value = profile[field as keyof UserProfile];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingFields.push(field);
    }
  });

  // Check optional sections
  optionalSections.forEach(section => {
    const value = profile[section as keyof UserProfile];
    if (Array.isArray(value) && value.length > 0) {
      completedSections.push(section);
    }
  });

  const totalFields = requiredFields.length + optionalSections.length;
  const completedFields = requiredFields.length - missingFields.length + completedSections.length;
  const percentage = Math.round((completedFields / totalFields) * 100);

  return {
    percentage,
    missingFields,
    completedSections
  };
}

// Schemas are already exported above - no need to re-export
