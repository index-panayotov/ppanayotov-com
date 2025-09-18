export enum LanguageProficiency {
  Native = "Native",
  Fluent = "Fluent",
  Professional = "Professional",
  Intermediate = "Intermediate",
  Elementary = "Elementary",
  Beginner = "Beginner"
}

/**
 * Supported social media platforms
 */
export type SocialPlatform = 'Facebook' | 'GitHub' | 'Twitter' | 'LinkedIn' | 'Instagram' | 'YouTube' | 'Custom';

/**
 * Interface for social media links with position ordering and dual visibility control
 */
export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label?: string; // For custom platform names or display text
  visible: boolean; // Visibility in contact section
  visibleInHero: boolean; // Visibility in hero section
  position: number; // 0 = first, 1 = second, etc.
  icon?: string;
}

/**
 * Interface for user profile based on current CV layout
 */
export interface UserProfile {
  phone: string;
  email: string;
  name: string;
  title: string;
  location: string;
  profileImageUrl: string;
  profileImageWebUrl?: string; // Optimized for web display
  profileImagePdfUrl?: string; // Optimized for PDF generation
  summary: string;
  socialLinks?: SocialLink[]; // New social links array
  languages: Array<{
    name: string;
    proficiency: LanguageProficiency;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    dateRange: string;
  }>;
  certifications: Array<{
    name: string;
    issuer?: string;
    date?: string;
  }>;
}
