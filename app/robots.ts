import { MetadataRoute } from 'next';

/**
 * Generate robots.txt for SEO optimization
 * 
 * Provides search engine crawling instructions and sitemap location.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ppanayotov.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/uploads/temp/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}