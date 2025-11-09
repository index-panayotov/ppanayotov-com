import type { UserProfile, ExperienceEntry } from '@/types/schemas';
import type { Metadata } from 'next';

/**
 * Configuration for SEO meta generation
 */
interface SEOConfig {
  readonly baseUrl: string;
  readonly siteName: string;
  readonly defaultImage: string;
  readonly twitterHandle?: string;
}

/**
 * Page-specific SEO data
 */
interface PageSEOData {
  readonly title?: string;
  readonly description?: string;
  readonly keywords?: readonly string[];
  readonly image?: string;
  readonly path?: string;
  readonly type?: 'website' | 'profile' | 'article';
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
}

/**
 * Generated SEO metadata
 */
interface GeneratedSEOMetadata {
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly canonical: string;
  readonly openGraph: {
    readonly title: string;
    readonly description: string;
    readonly image: string;
    readonly url: string;
    readonly type: 'website' | 'profile' | 'article';
    readonly siteName: string;
    readonly locale: string;
  };
  readonly twitter: {
    readonly card: 'summary' | 'summary_large_image';
    readonly title: string;
    readonly description: string;
    readonly image: string;
    readonly creator?: string;
    readonly site?: string;
  };
}

/**
 * MetaGenerator service for creating comprehensive SEO metadata
 * 
 * Generates dynamic meta tags, Open Graph data, Twitter Cards, and canonical URLs
 * optimized for search engines and social media sharing.
 */
export class MetaGenerator {
  private readonly config: SEOConfig;

  constructor(config: SEOConfig) {
    this.config = config;
  }

  /**
   * Generate comprehensive SEO metadata for the main portfolio page
   */
  generatePortfolioMetadata(
    userProfile: UserProfile,
    experiences: readonly ExperienceEntry[],
    pageData?: PageSEOData
  ): GeneratedSEOMetadata {
    const skills = this.extractSkillsFromExperiences(experiences);
    const title = pageData?.title || `${userProfile.name} - ${userProfile.title}`;
    const description = pageData?.description || this.generatePortfolioDescription(userProfile, skills);
    const keywords = pageData?.keywords || this.generatePortfolioKeywords(userProfile, skills);
    const canonical = this.buildCanonicalUrl(pageData?.path || '');
    const image = pageData?.image || this.getProfileImageUrl(userProfile, pageData?.path?.replace('#', ''));

    return {
      title,
      description,
      keywords,
      canonical,
      openGraph: {
        title,
        description,
        image,
        url: canonical,
        type: pageData?.type || 'profile',
        siteName: this.config.siteName,
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        image,
        creator: this.config.twitterHandle,
        site: this.config.twitterHandle,
      },
    };
  }

  /**
   * Generate Next.js Metadata object for use in layout or page components
   */
  generateNextJSMetadata(seoData: GeneratedSEOMetadata): Metadata {
    return {
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords.join(', '),
      authors: [{ name: seoData.openGraph.title.split(' - ')[0] }],
      creator: seoData.openGraph.title.split(' - ')[0],
      publisher: seoData.openGraph.siteName,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: seoData.canonical,
      },
      openGraph: {
        title: seoData.openGraph.title,
        description: seoData.openGraph.description,
        url: seoData.openGraph.url,
        siteName: seoData.openGraph.siteName,
        images: [
          {
            url: seoData.openGraph.image,
            width: 1200,
            height: 630,
            alt: `Profile picture of ${seoData.openGraph.title.split(' - ')[0]}`,
          },
        ],
        locale: seoData.openGraph.locale,
        type: seoData.openGraph.type,
      },
      twitter: {
        card: seoData.twitter.card,
        title: seoData.twitter.title,
        description: seoData.twitter.description,
        creator: seoData.twitter.creator,
        site: seoData.twitter.site,
        images: [seoData.twitter.image],
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
        yandex: process.env.YANDEX_VERIFICATION,
        yahoo: process.env.YAHOO_VERIFICATION,
      },
      category: 'technology',
    };
  }

  /**
   * Generate meta tags for specific sections (experience, skills, etc.)
   */
  generateSectionMetadata(
    section: 'experience' | 'skills' | 'education' | 'contact',
    userProfile: UserProfile,
    experiences: readonly ExperienceEntry[]
  ): GeneratedSEOMetadata {
    const sectionTitles = {
      experience: 'Professional Experience',
      skills: 'Technical Skills',
      education: 'Education & Certifications',
      contact: 'Contact Information',
    };

    const sectionDescriptions = {
      experience: `Explore ${userProfile.name}'s professional experience as ${userProfile.title}, including roles at leading companies and key achievements.`,
      skills: `Technical skills and expertise of ${userProfile.name}, ${userProfile.title}, including programming languages, frameworks, and tools.`,
      education: `Educational background and certifications of ${userProfile.name}, ${userProfile.title}.`,
      contact: `Get in touch with ${userProfile.name}, ${userProfile.title}. Contact information and professional links.`,
    };

    return this.generatePortfolioMetadata(userProfile, experiences, {
      title: `${userProfile.name} - ${sectionTitles[section]}`,
      description: sectionDescriptions[section],
      path: `#${section}`,
    });
  }

  /**
   * Extract skills from experience entries
   */
  private extractSkillsFromExperiences(experiences: readonly ExperienceEntry[]): readonly string[] {
    const allSkills = experiences.flatMap(exp => exp.tags);
    return Array.from(new Set(allSkills)).slice(0, 20); // Limit to top 20 unique skills
  }

  /**
   * Generate optimized description for portfolio
   */
  private generatePortfolioDescription(userProfile: UserProfile, skills: readonly string[]): string {
    const topSkills = skills.slice(0, 5).join(', ');
    const location = userProfile.location.split(',')[0]; // Get city only
    
    return `${userProfile.name} is a ${userProfile.title} based in ${location}. Expertise in ${topSkills}. ${userProfile.summary.substring(0, 100)}...`;
  }

  /**
   * Generate SEO-optimized keywords
   */
  private generatePortfolioKeywords(userProfile: UserProfile, skills: readonly string[]): readonly string[] {
    const baseKeywords = [
      userProfile.name,
      userProfile.title,
      userProfile.location.split(',')[0], // City
      'CV',
      'Resume',
      'Portfolio',
      'Software Engineer',
      'Developer',
    ];

    return [...baseKeywords, ...skills.slice(0, 15)];
  }

  /**
   * Build canonical URL
   */
  private buildCanonicalUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.config.baseUrl}${cleanPath}`;
  }

  /**
   * Get profile image URL with fallback to dynamic OG image
   */
  private getProfileImageUrl(userProfile: UserProfile, section?: string): string {
    // For social sharing, prefer dynamic OG image
    if (section) {
      const params = new URLSearchParams({
        name: userProfile.name,
        title: userProfile.title,
        section,
      });
      return `${this.config.baseUrl}/api/og?${params.toString()}`;
    }

    if (userProfile.profileImageWebUrl) {
      return userProfile.profileImageWebUrl.startsWith('http') 
        ? userProfile.profileImageWebUrl 
        : `${this.config.baseUrl}${userProfile.profileImageWebUrl}`;
    }
    
    if (userProfile.profileImageUrl) {
      return userProfile.profileImageUrl.startsWith('http') 
        ? userProfile.profileImageUrl 
        : `${this.config.baseUrl}${userProfile.profileImageUrl}`;
    }

    // Fallback to dynamic OG image
    const params = new URLSearchParams({
      name: userProfile.name,
      title: userProfile.title,
      section: 'portfolio',
    });
    return `${this.config.baseUrl}/api/og?${params.toString()}`;
  }

  /**
   * Generate JSON-LD structured data script tag
   */
  generateStructuredDataScript(structuredData: object): string {
    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
  }

  /**
   * Validate and optimize meta tag lengths
   */
  static optimizeMetaLength(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    // Find the last complete word within the limit
    const truncated = text.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`;
  }

  /**
   * Generate meta robots content based on environment
   */
  static generateRobotsContent(isProduction: boolean): string {
    return isProduction 
      ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      : 'noindex, nofollow';
  }
}

/**
 * Default SEO configuration
 */
export const defaultSEOConfig: SEOConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://ppanayotov.com',
  siteName: 'Preslav Panayotov - Portfolio',
  defaultImage: '/uploads/profile-default-og.webp',
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
};

/**
 * Default meta generator instance
 */
export const metaGenerator = new MetaGenerator(defaultSEOConfig);