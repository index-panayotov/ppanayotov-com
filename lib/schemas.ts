import { z } from 'zod';

/**
 * Pure Zod Schema Definitions
 *
 * This file contains ONLY Zod schema definitions with NO local imports.
 * This prevents circular dependencies during webpack module initialization.
 *
 * All validation helper functions are in lib/validation.ts
 */

// === BASIC STRING SCHEMAS ===

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
 * Schema for validating image URLs or file paths
 */
export const ImageURLSchema = z.string()
  .optional()
  .refine((url) => {
    if (!url) return true; // Optional field
    return url.startsWith('/') || url.startsWith('http') || url.startsWith('data:');
  }, 'Invalid image URL or path');

// === EXPERIENCE DESCRIPTION SCHEMA ===

/**
 * Schema for validating experience descriptions (markdown string)
 */
export const ExperienceDescriptionSchema = NonEmptyStringSchema;

// === SOCIAL PLATFORM SCHEMAS ===

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
 * TypeScript enum for LanguageProficiency (for convenience)
 */
export enum LanguageProficiency {
  Native = "Native",
  Fluent = "Fluent",
  Professional = "Professional",
  Limited = "Limited",
  Basic = "Basic"
}

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

// TopSkill is just a string (simplified from complex object)
export const TopSkillSchema = z.string().min(1, 'Skill name is required');

// === BLOG POST SCHEMAS ===

/**
 * Blog post metadata schema
 */
export const BlogPostSchema = z.object({
  slug: NonEmptyStringSchema.regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase with hyphens only (e.g., my-first-post)'
  ),
  title: NonEmptyStringSchema.max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .max(160, 'Description should be less than 160 characters for SEO')
    .default(''),
  publishedDate: z.string().min(1, 'Published date is required'),
  updatedDate: OptionalStringSchema,
  author: NonEmptyStringSchema,
  tags: z.array(z.string()).default([]),
  featuredImage: OptionalStringSchema,
  published: z.boolean().default(false),
  readingTime: z.number().int().min(1).optional()
});

export const UserProfileSchema = z.object({
  // Required personal information (only name and title are truly required)
  name: NonEmptyStringSchema,
  title: NonEmptyStringSchema,

  // Optional contact information
  email: z.string().optional(),
  phone: z.string().optional(),
  location: OptionalStringSchema,

  // Profile images (all optional)
  profileImageUrl: z.string().optional(),
  profileImageWebUrl: z.string().optional(),
  profileImagePdfUrl: z.string().optional(),

  // Summary (optional markdown string)
  summary: z.string().optional(),

  // Optional arrays with default empty values
  socialLinks: z.array(SocialLinkSchema).optional().default([]),
  languages: z.array(LanguageSchema).optional().default([]),
  education: z.array(EducationEntrySchema).optional().default([]),
  certifications: z.array(CertificationSchema).optional().default([]),

  // Additional optional fields
  website: URLSchema.optional(),
  linkedinUrl: URLSchema.optional(), // Legacy field, prefer socialLinks
  githubUrl: URLSchema.optional(), // Legacy field, prefer socialLinks

  // Professional details
  yearsOfExperience: z.number().int().min(0).optional(),
  currentPosition: OptionalStringSchema,
  availability: z.enum(['available', 'open_to_opportunities', 'not_available']).optional(),
  preferredWorkType: z.enum(['full_time', 'part_time', 'contract', 'freelance', 'remote']).optional(),

  // Metadata
  lastUpdated: OptionalStringSchema,
  version: OptionalStringSchema.default('1.0')
});

export const SystemSettingsSchema = z.object({
  siteUrl: z.string().url('Please enter a valid site URL').default('https://ppanayotov.com'),
  blogEnable: z.boolean().default(false),
  useWysiwyg: z.boolean().default(true),
  showContacts: z.boolean().default(true),
  gtagCode: OptionalStringSchema,
  gtagEnabled: z.boolean().default(false),
  selectedTemplate: z.enum(['classic', 'professional', 'modern']).default('classic'),
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

// === PARTIAL SCHEMAS ===

/**
 * Partial user profile schema for updates
 */
export const PartialUserProfileSchema = UserProfileSchema.partial();

// === TYPE EXPORTS ===

export type SocialPlatform = z.infer<typeof SocialPlatformSchema>;
// LanguageProficiency is both an enum and a type (defined above)
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;
export type TopSkill = string; // Simplified: just a string, not an object
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type SystemSettings = z.infer<typeof SystemSettingsSchema>;
export type PartialUserProfile = z.infer<typeof PartialUserProfileSchema>;

// === BACKWARD COMPATIBILITY ALIASES ===

export { EmailSchema as EmailStringSchema, URLSchema as URLStringSchema };
