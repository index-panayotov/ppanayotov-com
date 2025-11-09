import { z } from 'zod';

/**
 * Language proficiency levels enum
 */
export enum LanguageProficiency {
  Native = "Native",
  Fluent = "Fluent",
  Professional = "Professional",
  Intermediate = "Intermediate",
  Elementary = "Elementary",
  Beginner = "Beginner"
}

/**
 * Zod schema for language proficiency validation
 */
export const LanguageProficiencySchema = z.nativeEnum(LanguageProficiency);

/**
 * Zod schema for language entry
 */
export const LanguageSchema = z.object({
  name: z.string().min(1, "Language name is required").max(50, "Language name too long"),
  proficiency: LanguageProficiencySchema,
}).readonly();

/**
 * Zod schema for education entry
 */
export const EducationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(200, "Institution name too long"),
  degree: z.string().min(1, "Degree is required").max(100, "Degree name too long"),
  field: z.string().min(1, "Field is required").max(100, "Field name too long"),
  dateRange: z.string().regex(/^\d{4} - \d{4}$/, "Date range must be in format 'YYYY - YYYY'"),
}).readonly();

/**
 * Zod schema for certification entry
 */
export const CertificationSchema = z.object({
  name: z.string().min(1, "Certification name is required").max(200, "Certification name too long"),
  issuer: z.string().max(100, "Issuer name too long").optional(),
  date: z.string().max(50, "Date too long").optional(),
}).readonly();

/**
 * Zod schema for user profile validation
 */
export const UserProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone format"),
  location: z.string().min(1, "Location is required").max(200, "Location too long"),
  summary: z.string().min(50, "Summary too short").max(2000, "Summary too long"),
  profileImageUrl: z.string().url("Invalid profile image URL"),
  profileImageWebUrl: z.string().url("Invalid web image URL").optional(),
  profileImagePdfUrl: z.string().url("Invalid PDF image URL").optional(),
  linkedin: z.string().min(1, "LinkedIn is required").max(200, "LinkedIn URL too long"),
  languages: z.array(LanguageSchema).readonly(),
  education: z.array(EducationSchema).readonly(),
  certifications: z.array(CertificationSchema).readonly(),
}).readonly();

/**
 * Zod schema for experience entry validation
 */
export const ExperienceEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  company: z.string().min(1, "Company is required").max(100, "Company name too long"),
  dateRange: z.string().regex(
    /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4} - ((January|February|March|April|May|June|July|August|September|October|November|December) \d{4}|Present)$/,
    "Date range must be in format 'Month YYYY - Month YYYY' or 'Month YYYY - Present'"
  ),
  location: z.string().max(200, "Location too long").optional(),
  description: z.string().min(10, "Description too short").max(5000, "Description too long"),
  tags: z.array(z.string().min(1, "Tag cannot be empty").max(50, "Tag too long")).readonly(),
}).readonly();

/**
 * Zod schema for skills array
 */
export const SkillsSchema = z.array(z.string().min(1, "Skill cannot be empty").max(50, "Skill name too long")).readonly();

/**
 * TypeScript types inferred from Zod schemas
 */
export type Language = z.infer<typeof LanguageSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;
export type Skills = z.infer<typeof SkillsSchema>;

/**
 * SEO-related types and schemas
 */
export const OpenGraphDataSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  image: z.string().url(),
  url: z.string().url(),
  type: z.enum(['website', 'profile', 'article']),
  siteName: z.string().min(1).max(100),
}).readonly();

export const SEOMetadataSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  keywords: z.array(z.string().min(1).max(50)).readonly(),
  canonical: z.string().url(),
  openGraph: OpenGraphDataSchema,
}).readonly();

export type OpenGraphData = z.infer<typeof OpenGraphDataSchema>;
export type SEOMetadata = z.infer<typeof SEOMetadataSchema>;

/**
 * Structured data types for JSON-LD
 */
export interface PersonStructuredData {
  readonly "@context": "https://schema.org";
  readonly "@type": "Person";
  readonly name: string;
  readonly jobTitle: string;
  readonly email: string;
  readonly telephone: string;
  readonly address: {
    readonly "@type": "PostalAddress";
    readonly addressLocality: string;
    readonly addressCountry: string;
  };
  readonly sameAs: readonly string[];
  readonly worksFor?: {
    readonly "@type": "Organization";
    readonly name: string;
  };
}

export interface WebSiteStructuredData {
  readonly "@context": "https://schema.org";
  readonly "@type": "WebSite";
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly author: {
    readonly "@type": "Person";
    readonly name: string;
  };
}

/**
 * Environment and configuration types
 */
export interface EnvironmentConfig {
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly showAdminPanel: boolean;
  readonly enableDebugMode: boolean;
}

/**
 * Error handling types
 */
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
}

export interface DataLoadingError {
  readonly type: 'validation' | 'file_not_found' | 'parse_error' | 'network_error';
  readonly message: string;
  readonly details?: unknown;
}

/**
 * API response types
 */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly validationErrors?: readonly ValidationError[];
}