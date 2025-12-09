import type { UserProfile, ExperienceEntry } from '@/types/schemas';
import type { Metadata } from 'next';
import { MetaGenerator, defaultSEOConfig } from './meta-generator';
import { StructuredDataGenerator } from './structured-data-generator';

/**
 * SEO optimization options
 */
export interface SEOOptions {
  readonly includeStructuredData?: boolean;
  readonly includeTwitterCards?: boolean;
  readonly includeOpenGraph?: boolean;
  readonly customCanonical?: string;
  readonly customImage?: string;
  readonly section?: 'experience' | 'skills' | 'education' | 'contact';
}

/**
 * Complete SEO package including metadata and structured data
 */
export interface SEOPackage {
  readonly metadata: Metadata;
  readonly structuredDataScripts: readonly string[];
  readonly canonicalUrl: string;
  readonly metaTags: {
    readonly title: string;
    readonly description: string;
    readonly keywords: string;
    readonly robots: string;
  };
}

/**
 * Comprehensive SEO service that combines meta generation and structured data
 * 
 * Provides a unified interface for generating all SEO-related content including
 * Next.js metadata, structured data scripts, and optimized meta tags.
 */
export class SEOService {
  private readonly metaGenerator: MetaGenerator;
  private readonly structuredDataGenerator: StructuredDataGenerator;

  constructor(
    baseUrl: string = defaultSEOConfig.baseUrl,
    siteName: string = defaultSEOConfig.siteName
  ) {
    this.metaGenerator = new MetaGenerator({
      baseUrl,
      siteName,
      defaultImage: defaultSEOConfig.defaultImage,
      twitterHandle: defaultSEOConfig.twitterHandle,
    });
    
    this.structuredDataGenerator = new StructuredDataGenerator(baseUrl, siteName);
  }

  /**
   * Generate complete SEO package for the portfolio
   */
  generatePortfolioSEO(
    userProfile: UserProfile,
    experiences: readonly ExperienceEntry[],
    options: SEOOptions = {}
  ): SEOPackage {
    // Generate base SEO metadata
    const seoMetadata = options.section 
      ? this.metaGenerator.generateSectionMetadata(options.section, userProfile, experiences)
      : this.metaGenerator.generatePortfolioMetadata(userProfile, experiences, {
          image: options.customImage,
          path: options.customCanonical,
        });

    // Generate Next.js metadata
    const metadata = this.metaGenerator.generateNextJSMetadata(seoMetadata);

    // Generate structured data scripts
    const structuredDataScripts = options.includeStructuredData !== false
      ? this.structuredDataGenerator.generateAllStructuredDataScripts(userProfile, experiences)
      : [];

    // Generate optimized meta tags
    const metaTags = {
      title: MetaGenerator.optimizeMetaLength(seoMetadata.title, 60),
      description: MetaGenerator.optimizeMetaLength(seoMetadata.description, 160),
      keywords: seoMetadata.keywords.join(', '),
      robots: MetaGenerator.generateRobotsContent(process.env.NODE_ENV === 'production'),
    };

    return {
      metadata,
      structuredDataScripts,
      canonicalUrl: seoMetadata.canonical,
      metaTags,
    };
  }

  /**
   * Generate SEO for specific page sections
   */
  generateSectionSEO(
    section: 'experience' | 'skills' | 'education' | 'contact',
    userProfile: UserProfile,
    experiences: readonly ExperienceEntry[],
    options: SEOOptions = {}
  ): SEOPackage {
    return this.generatePortfolioSEO(userProfile, experiences, {
      ...options,
      section,
    });
  }

  /**
   * Generate minimal SEO for development environment
   */
  generateDevelopmentSEO(userProfile: UserProfile): SEOPackage {
    const basicMetadata: Metadata = {
      title: `${userProfile.name} - ${userProfile.title} (Development)`,
      description: `Development version of ${userProfile.name}'s portfolio`,
      robots: {
        index: false,
        follow: false,
      },
    };

    return {
      metadata: basicMetadata,
      structuredDataScripts: [],
      canonicalUrl: '',
      metaTags: {
        title: basicMetadata.title as string,
        description: basicMetadata.description as string,
        keywords: '',
        robots: 'noindex, nofollow',
      },
    };
  }

  /**
   * Generate Open Graph image URL for social sharing
   */
  generateOpenGraphImageUrl(userProfile: UserProfile, section?: string): string {
    const baseUrl = defaultSEOConfig.baseUrl;
    const params = new URLSearchParams({
      name: userProfile.name,
      title: userProfile.title,
      section: section || 'portfolio',
    });

    return `${baseUrl}/api/og?${params.toString()}`;
  }

  /**
   * Validate SEO configuration and content
   */
  validateSEOContent(userProfile: UserProfile, experiences: readonly ExperienceEntry[]): {
    readonly isValid: boolean;
    readonly warnings: readonly string[];
    readonly errors: readonly string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Validate user profile completeness
    if (!userProfile.name || userProfile.name.length < 2) {
      errors.push('User name is required and must be at least 2 characters');
    }

    if (!userProfile.title || userProfile.title.length < 5) {
      errors.push('User title is required and must be at least 5 characters');
    }

    if (!userProfile.summary || userProfile.summary.length < 50) {
      warnings.push('User summary should be at least 50 characters for better SEO');
    }

    if (userProfile.summary && userProfile.summary.length > 160) {
      warnings.push('User summary is longer than 160 characters, consider shortening for meta description');
    }

    // Validate experiences
    if (experiences.length === 0) {
      warnings.push('No experience entries found, this may impact SEO');
    }

    experiences.forEach((exp, index) => {
      if (!exp.description || exp.description.length < 20) {
        warnings.push(`Experience entry ${index + 1} has a very short description`);
      }

      if (exp.tags.length === 0) {
        warnings.push(`Experience entry ${index + 1} has no tags/skills`);
      }
    });

    // Validate image URLs
    if (!userProfile.profileImageUrl && !userProfile.profileImageWebUrl) {
      warnings.push('No profile image found, this may impact social sharing');
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
    };
  }

  /**
   * Generate sitemap entries for SEO
   */
  generateSitemapEntries(userProfile: UserProfile): readonly {
    readonly url: string;
    readonly lastModified: Date;
    readonly changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    readonly priority: number;
  }[] {
    const baseUrl = defaultSEOConfig.baseUrl;
    const now = new Date();

    return [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}#summary`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}#experience`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}#skills`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}#education`,
        lastModified: now,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}#contact`,
        lastModified: now,
        changeFrequency: 'yearly' as const,
        priority: 0.5,
      },
    ];
  }

  /**
   * Generate performance optimization hints
   */
  generatePerformanceHints(): readonly string[] {
    return [
      'Optimize images with WebP format and proper sizing',
      'Implement lazy loading for below-the-fold content',
      'Minimize CSS and JavaScript bundles',
      'Use Next.js Image component for automatic optimization',
      'Enable compression and caching headers',
      'Preload critical resources',
      'Implement proper font loading strategies',
    ];
  }
}

/**
 * Default SEO service instance
 */
export const seoService = new SEOService();

/**
 * Utility function to inject structured data into HTML head
 */
export function injectStructuredData(scripts: readonly string[]): string {
  return scripts.join('\n');
}

/**
 * Utility function to generate meta tags HTML
 */
export function generateMetaTagsHTML(metaTags: {
  readonly title: string;
  readonly description: string;
  readonly keywords: string;
  readonly robots: string;
}): string {
  return `
    <title>${metaTags.title}</title>
    <meta name="description" content="${metaTags.description}" />
    <meta name="keywords" content="${metaTags.keywords}" />
    <meta name="robots" content="${metaTags.robots}" />
  `.trim();
}