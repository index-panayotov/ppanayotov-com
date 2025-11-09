import type { UserProfile, ExperienceEntry, PersonStructuredData, WebSiteStructuredData } from '@/types/schemas';

/**
 * Organization structured data
 */
interface OrganizationStructuredData {
  readonly "@context": "https://schema.org";
  readonly "@type": "Organization";
  readonly name: string;
  readonly url?: string;
  readonly logo?: string;
  readonly description?: string;
}

/**
 * JobPosting structured data for experience entries
 */
interface JobPostingStructuredData {
  readonly "@context": "https://schema.org";
  readonly "@type": "JobPosting";
  readonly title: string;
  readonly description: string;
  readonly hiringOrganization: OrganizationStructuredData;
  readonly jobLocation: {
    readonly "@type": "Place";
    readonly address: string;
  };
  readonly datePosted: string;
  readonly employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY";
}

/**
 * BreadcrumbList structured data
 */
interface BreadcrumbListStructuredData {
  readonly "@context": "https://schema.org";
  readonly "@type": "BreadcrumbList";
  readonly itemListElement: readonly {
    readonly "@type": "ListItem";
    readonly position: number;
    readonly name: string;
    readonly item: string;
  }[];
}

/**
 * StructuredDataGenerator service for creating JSON-LD structured data
 * 
 * Generates schema.org compliant structured data for better search engine understanding
 * and rich snippets in search results.
 */
export class StructuredDataGenerator {
  private readonly baseUrl: string;
  private readonly siteName: string;

  constructor(baseUrl: string, siteName: string) {
    this.baseUrl = baseUrl;
    this.siteName = siteName;
  }

  /**
   * Generate Person schema structured data
   */
  generatePersonStructuredData(userProfile: UserProfile): PersonStructuredData {
    const locationParts = userProfile.location.split(',').map(part => part.trim());
    const city = locationParts[0] || '';
    const country = locationParts[locationParts.length - 1] || '';

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: userProfile.name,
      jobTitle: userProfile.title,
      email: userProfile.email,
      telephone: userProfile.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
        addressCountry: country,
      },
      sameAs: [
        userProfile.linkedin.startsWith('http') 
          ? userProfile.linkedin 
          : `https://${userProfile.linkedin}`,
      ],
      worksFor: userProfile.title.includes('Manager') || userProfile.title.includes('Lead') ? {
        "@type": "Organization",
        name: "Technology Industry",
      } : undefined,
    };
  }

  /**
   * Generate WebSite schema structured data
   */
  generateWebSiteStructuredData(userProfile: UserProfile): WebSiteStructuredData {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: this.siteName,
      url: this.baseUrl,
      description: `Professional portfolio and CV of ${userProfile.name}, ${userProfile.title}`,
      author: {
        "@type": "Person",
        name: userProfile.name,
      },
    };
  }

  /**
   * Generate Organization schema for companies in experience
   */
  generateOrganizationStructuredData(
    companyName: string,
    description?: string
  ): OrganizationStructuredData {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: companyName,
      description: description || `${companyName} - Technology company`,
    };
  }

  /**
   * Generate JobPosting schema for experience entries
   */
  generateJobPostingStructuredData(
    experience: ExperienceEntry,
    userProfile: UserProfile
  ): JobPostingStructuredData {
    // Parse date range to get start date
    const dateMatch = experience.dateRange.match(/(\w+) (\d{4})/);
    const startDate = dateMatch ? `${dateMatch[2]}-${this.getMonthNumber(dateMatch[1])}-01` : new Date().toISOString().split('T')[0];

    return {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: experience.title,
      description: experience.description,
      hiringOrganization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: experience.company,
      },
      jobLocation: {
        "@type": "Place",
        address: experience.location || userProfile.location,
      },
      datePosted: startDate,
      employmentType: "FULL_TIME", // Default assumption
    };
  }

  /**
   * Generate BreadcrumbList schema for navigation
   */
  generateBreadcrumbListStructuredData(
    breadcrumbs: readonly { name: string; path: string }[]
  ): BreadcrumbListStructuredData {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: breadcrumb.name,
        item: `${this.baseUrl}${breadcrumb.path}`,
      })),
    };
  }

  /**
   * Generate comprehensive structured data for the portfolio page
   */
  generatePortfolioStructuredData(
    userProfile: UserProfile,
    experiences: readonly ExperienceEntry[]
  ): {
    readonly person: PersonStructuredData;
    readonly website: WebSiteStructuredData;
    readonly breadcrumbs: BreadcrumbListStructuredData;
    readonly organizations: readonly OrganizationStructuredData[];
  } {
    const person = this.generatePersonStructuredData(userProfile);
    const website = this.generateWebSiteStructuredData(userProfile);
    
    // Generate breadcrumbs for main sections
    const breadcrumbs = this.generateBreadcrumbListStructuredData([
      { name: 'Home', path: '/' },
      { name: 'Summary', path: '#summary' },
      { name: 'Experience', path: '#experience' },
      { name: 'Skills', path: '#skills' },
      { name: 'Education', path: '#education' },
    ]);

    // Generate organization data for unique companies
    const uniqueCompanies = Array.from(new Set(experiences.map(exp => exp.company)));
    const organizations = uniqueCompanies.map(company => 
      this.generateOrganizationStructuredData(company)
    );

    return {
      person,
      website,
      breadcrumbs,
      organizations,
    };
  }

  /**
   * Generate all structured data as JSON-LD scripts
   */
  generateAllStructuredDataScripts(
    userProfile: UserProfile,
    experiences: readonly ExperienceEntry[]
  ): readonly string[] {
    const structuredData = this.generatePortfolioStructuredData(userProfile, experiences);
    
    return [
      this.toJSONLDScript(structuredData.person),
      this.toJSONLDScript(structuredData.website),
      this.toJSONLDScript(structuredData.breadcrumbs),
      ...structuredData.organizations.map(org => this.toJSONLDScript(org)),
    ];
  }

  /**
   * Convert structured data object to JSON-LD script tag
   */
  private toJSONLDScript(data: object): string {
    return `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`;
  }

  /**
   * Convert month name to number for date formatting
   */
  private getMonthNumber(monthName: string): string {
    const months: Record<string, string> = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12',
    };
    return months[monthName] || '01';
  }

  /**
   * Validate structured data against schema.org requirements
   */
  static validateStructuredData(data: object): {
    readonly isValid: boolean;
    readonly errors: readonly string[];
  } {
    const errors: string[] = [];
    
    // Basic validation for required fields
    if (typeof data !== 'object' || data === null) {
      errors.push('Structured data must be an object');
      return { isValid: false, errors };
    }

    const typedData = data as Record<string, unknown>;
    
    if (!typedData['@context']) {
      errors.push('Missing @context property');
    }
    
    if (!typedData['@type']) {
      errors.push('Missing @type property');
    }

    // Validate Person schema
    if (typedData['@type'] === 'Person') {
      if (!typedData.name) errors.push('Person schema missing name');
      if (!typedData.jobTitle) errors.push('Person schema missing jobTitle');
    }

    // Validate WebSite schema
    if (typedData['@type'] === 'WebSite') {
      if (!typedData.name) errors.push('WebSite schema missing name');
      if (!typedData.url) errors.push('WebSite schema missing url');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Default structured data generator instance
 */
export const structuredDataGenerator = new StructuredDataGenerator(
  process.env.NEXT_PUBLIC_BASE_URL || 'https://ppanayotov.com',
  'Preslav Panayotov - Portfolio'
);