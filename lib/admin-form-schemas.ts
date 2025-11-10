import { z } from 'zod';
import {
  NonEmptyStringSchema,
  OptionalStringSchema,
  StringArraySchema,
  LanguageProficiencySchema,
  SocialPlatformSchema
} from '@/lib/schemas';

/**
 * Form schemas for admin components using Zod validation
 *
 * These schemas provide runtime validation for admin forms
 * and integrate with react-hook-form via zodResolver
 */

// === EXPERIENCE FORM SCHEMA ===

export const ExperienceFormSchema = z.object({
  title: NonEmptyStringSchema.refine(
    (val) => val.length <= 100,
    'Title must be 100 characters or less'
  ),
  company: NonEmptyStringSchema.refine(
    (val) => val.length <= 100,
    'Company name must be 100 characters or less'
  ),
  dateRange: NonEmptyStringSchema.refine(
    (val) => val.length <= 50,
    'Date range must be 50 characters or less'
  ),
  location: OptionalStringSchema.refine(
    (val) => !val || val.length <= 100,
    'Location must be 100 characters or less'
  ),
  description: NonEmptyStringSchema.refine(
    (val) => val.length >= 10,
    'Description must be at least 10 characters'
  ),
  tags: z.array(z.string().trim().min(1, 'Tag cannot be empty')).default([])
});

export type ExperienceFormData = z.infer<typeof ExperienceFormSchema>;

// === LANGUAGE FORM SCHEMA ===

export const LanguageFormSchema = z.object({
  name: NonEmptyStringSchema.refine(
    (val) => val.length <= 50,
    'Language name must be 50 characters or less'
  ).refine(
    (val) => /^[a-zA-ZÀ-ÿ\s-]+$/.test(val),
    'Language name can only contain letters, spaces, and hyphens'
  ),
  proficiency: LanguageProficiencySchema
});

export type LanguageFormData = z.infer<typeof LanguageFormSchema>;

// === EDUCATION FORM SCHEMA ===

export const EducationFormSchema = z.object({
  institution: NonEmptyStringSchema.refine(
    (val) => val.length <= 100,
    'Institution name must be 100 characters or less'
  ),
  degree: NonEmptyStringSchema.refine(
    (val) => val.length <= 100,
    'Degree must be 100 characters or less'
  ),
  field: NonEmptyStringSchema.refine(
    (val) => val.length <= 100,
    'Field of study must be 100 characters or less'
  ),
  dateRange: NonEmptyStringSchema.refine(
    (val) => val.length <= 50,
    'Date range must be 50 characters or less'
  ),
  description: OptionalStringSchema.refine(
    (val) => !val || val.length <= 500,
    'Description must be 500 characters or less'
  ),
  gpa: OptionalStringSchema.refine(
    (val) => !val || /^\d+\.?\d*$/.test(val) || /^\d+\.?\d*\/\d+\.?\d*$/.test(val),
    'GPA must be a valid number or fraction (e.g., 3.8 or 3.8/4.0)'
  ),
  honors: z.array(z.string().trim()).optional().default([])
});

export type EducationFormData = z.infer<typeof EducationFormSchema>;

// === CERTIFICATION FORM SCHEMA ===

export const CertificationFormSchema = z.object({
  name: NonEmptyStringSchema.refine(
    (val) => val.length <= 100,
    'Certification name must be 100 characters or less'
  ),
  issuer: OptionalStringSchema.refine(
    (val) => !val || val.length <= 100,
    'Issuer name must be 100 characters or less'
  ),
  date: OptionalStringSchema.refine(
    (val) => !val || val.length <= 50,
    'Date must be 50 characters or less'
  ),
  expirationDate: OptionalStringSchema.refine(
    (val) => !val || val.length <= 50,
    'Expiration date must be 50 characters or less'
  ),
  credentialId: OptionalStringSchema.refine(
    (val) => !val || val.length <= 100,
    'Credential ID must be 100 characters or less'
  ),
  credentialUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: OptionalStringSchema.refine(
    (val) => !val || val.length <= 500,
    'Description must be 500 characters or less'
  )
});

export type CertificationFormData = z.infer<typeof CertificationFormSchema>;

// === SOCIAL LINK FORM SCHEMA ===

export const SocialLinkFormSchema = z.object({
  platform: SocialPlatformSchema,
  url: z.string().url('Must be a valid URL'),
  label: z.string().optional(),
  visible: z.boolean().default(true),
  visibleInHero: z.boolean().default(false),
  position: z.number().int().min(0).default(0),
  icon: OptionalStringSchema
}).refine((data) => {
  // Custom platform requires label
  if (data.platform === 'Custom' && (!data.label || data.label.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Label is required for custom platforms',
  path: ['label']
});

export type SocialLinkFormData = z.infer<typeof SocialLinkFormSchema>;

// === TOP SKILLS FORM SCHEMA ===

export const TopSkillsFormSchema = z.object({
  skills: z.array(
    NonEmptyStringSchema.refine(
      (val) => val.length <= 50,
      'Skill name must be 50 characters or less'
    )
  ).min(1, 'At least one skill is required').max(20, 'Maximum 20 skills allowed')
});

export type TopSkillsFormData = z.infer<typeof TopSkillsFormSchema>;

// === PROFILE BASIC INFO FORM SCHEMA ===

export const ProfileBasicInfoFormSchema = z.object({
  name: NonEmptyStringSchema.refine(
    (val) => val.length <= 100,
    'Name must be 100 characters or less'
  ),
  title: NonEmptyStringSchema.refine(
    (val) => val.length <= 100,
    'Title must be 100 characters or less'
  ),
  email: z.string().email('Must be a valid email address'),
  phone: NonEmptyStringSchema.refine(
    (val) => /^[\+\-\s\(\)\d]+$/.test(val),
    'Please enter a valid phone number'
  ),
  location: NonEmptyStringSchema.refine(
    (val) => val.length <= 100,
    'Location must be 100 characters or less'
  ),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  summary: NonEmptyStringSchema.refine(
    (val) => val.length >= 50,
    'Summary must be at least 50 characters'
  ).refine(
    (val) => val.length <= 1000,
    'Summary must be 1000 characters or less'
  )
});

export type ProfileBasicInfoFormData = z.infer<typeof ProfileBasicInfoFormSchema>;

// === FORM VALIDATION HELPERS ===

/**
 * Convert Zod validation errors to react-hook-form format
 */
export function formatFormErrors(error: z.ZodError): Record<string, { message: string }> {
  const formattedErrors: Record<string, { message: string }> = {};

  error.errors.forEach((err) => {
    const field = err.path.join('.');
    formattedErrors[field] = { message: err.message };
  });

  return formattedErrors;
}

/**
 * Default form values helper
 */
export const getDefaultFormValues = {
  experience: (): ExperienceFormData => ({
    title: '',
    company: '',
    dateRange: '',
    location: '',
    description: '',
    tags: []
  }),

  language: (): LanguageFormData => ({
    name: '',
    proficiency: 'Professional' as const
  }),

  education: (): EducationFormData => ({
    institution: '',
    degree: '',
    field: '',
    dateRange: '',
    description: '',
    gpa: '',
    honors: []
  }),

  certification: (): CertificationFormData => ({
    name: '',
    issuer: '',
    date: '',
    expirationDate: '',
    credentialId: '',
    credentialUrl: '',
    description: ''
  }),

  socialLink: (): SocialLinkFormData => ({
    platform: 'Custom' as const,
    url: '',
    label: '',
    visible: true,
    visibleInHero: false,
    position: 0,
    icon: ''
  })
};