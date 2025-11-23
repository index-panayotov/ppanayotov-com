/**
 * SEO Services - Comprehensive SEO meta generation system
 * 
 * This module provides a complete SEO solution including:
 * - Dynamic meta tag generation
 * - Open Graph and Twitter Card optimization
 * - Structured data (JSON-LD) generation
 * - Canonical URL management
 * - Next.js metadata integration
 */

// Core services
export { MetaGenerator, defaultSEOConfig, metaGenerator } from './meta-generator';
export { StructuredDataGenerator, structuredDataGenerator } from './structured-data-generator';
export { SEOService, seoService, injectStructuredData, generateMetaTagsHTML } from './seo-service';

// Types
export type { 
  GeneratedSEOMetadata,
  PageSEOData,
  SEOConfig 
} from './meta-generator';

export type {
  OrganizationStructuredData,
  JobPostingStructuredData,
  BreadcrumbListStructuredData
} from './structured-data-generator';

export type {
  PersonStructuredData,
  WebSiteStructuredData
} from '@/types/schemas';

export type {
  SEOOptions,
  SEOPackage
} from './seo-service';

/**
 * Quick start utility functions
 */

import { seoService } from './seo-service';
import type { UserProfile, ExperienceEntry } from '@/types/schemas';

/**
 * Generate complete SEO package for portfolio - convenience function
 */
export function generatePortfolioSEO(
  userProfile: UserProfile,
  experiences: readonly ExperienceEntry[]
) {
  return seoService.generatePortfolioSEO(userProfile, experiences);
}

/**
 * Generate SEO for specific section - convenience function
 */
export function generateSectionSEO(
  section: 'experience' | 'skills' | 'education' | 'contact',
  userProfile: UserProfile,
  experiences: readonly ExperienceEntry[]
) {
  return seoService.generateSectionSEO(section, userProfile, experiences);
}

/**
 * Validate SEO content - convenience function
 */
export function validateSEOContent(
  userProfile: UserProfile,
  experiences: readonly ExperienceEntry[]
) {
  return seoService.validateSEOContent(userProfile, experiences);
}