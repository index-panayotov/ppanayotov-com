import { NextResponse } from 'next/server';
import { userProfile } from '@/data/user-profile';
import { experiences } from '@/data/cv-data';
import { topSkills } from '@/data/topSkills';
import { loadSystemSettings, loadBlogPosts } from '@/lib/data-loader';
import { BlogPost } from '@/lib/schemas';
import fs from 'fs';
import path from 'path';

// Force static generation at build time
export const dynamic = 'force-static';

/**
 * Static sitemap.xml generation for professional CV website
 * Pulls data from /data/ folder to create SEO-optimized sitemap
 * Prerendered at build time for optimal performance.
 */
export async function GET() {
  const systemSettings = loadSystemSettings();
  const baseUrl = systemSettings.siteUrl;
  
  // Get file modification times for lastmod dates
  const getLastModified = (filePath: string): string => {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const stats = fs.statSync(fullPath);
      return stats.mtime.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  // Extract professional keywords from experience and skills
  const extractKeywords = (): string[] => {
    const experienceKeywords = experiences.flatMap(exp => exp.tags);
    const allKeywords = [...experienceKeywords, ...topSkills];
    return [...new Set(allKeywords)].slice(0, 20); // Top 20 unique keywords
  };

  const keywords = extractKeywords();
  const lastModProfile = getLastModified('data/user-profile.ts');
  const lastModExperience = getLastModified('data/cv-data.ts');
  const lastModSkills = getLastModified('data/topSkills.ts');

  // Generate sitemap URLs based on current data and features
  const urls = [
    {
      loc: `${baseUrl}/`,
      lastmod: lastModProfile,
      changefreq: 'monthly',
      priority: '1.0',
      description: `${userProfile.name} - ${userProfile.title} professional CV`
    },
    {
      loc: `${baseUrl}/#experience`,
      lastmod: lastModExperience,
      changefreq: 'quarterly', 
      priority: '0.9',
      description: `Professional experience in ${keywords.slice(0, 5).join(', ')}`
    },
    {
      loc: `${baseUrl}/#skills`,
      lastmod: lastModSkills,
      changefreq: 'quarterly',
      priority: '0.8',
      description: `Technical skills: ${keywords.slice(0, 8).join(', ')}`
    },
    {
      loc: `${baseUrl}/#education`,
      lastmod: lastModProfile,
      changefreq: 'yearly',
      priority: '0.7',
      description: `Education: ${userProfile.education.map(edu => edu.degree).join(', ')}`
    },
    {
      loc: `${baseUrl}/#languages`,
      lastmod: lastModProfile,
      changefreq: 'yearly',
      priority: '0.6',
      description: `Languages: ${userProfile.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}`
    },
    {
      loc: `${baseUrl}/#certifications`,
      lastmod: lastModProfile,
      changefreq: 'yearly',
      priority: '0.6',
      description: `Certifications: ${userProfile.certifications.map(cert => cert.name).join(', ')}`
    }
  ];

  // Only include contact section if enabled in system settings
  if (systemSettings.showContacts) {
    urls.push({
      loc: `${baseUrl}/#contact`,
      lastmod: lastModProfile,
      changefreq: 'monthly',
      priority: '0.7',
      description: `Contact ${userProfile.name} - ${userProfile.location}`
    });
  }

  // Include blog URLs if blog is enabled
  if (systemSettings.blogEnable) {
    const lastModBlog = getLastModified('data/blog-posts.ts');

    // Main blog page
    urls.push({
      loc: `${baseUrl}/blog`,
      lastmod: lastModBlog,
      changefreq: 'weekly',
      priority: '0.8',
      description: `Blog articles on software development and technology`
    });

    // Individual blog posts (only published)
    try {
      const blogPosts = loadBlogPosts() as BlogPost[];
      const publishedPosts = blogPosts.filter(post => post.published);

      publishedPosts.forEach(post => {
        const postLastMod = post.updatedDate || post.publishedDate;
        urls.push({
          loc: `${baseUrl}/blog/${post.slug}`,
          lastmod: new Date(postLastMod).toISOString(),
          changefreq: 'monthly',
          priority: '0.7',
          description: post.description
        });
      });
    } catch (error) {
      console.error('Error loading blog posts for sitemap:', error);
    }
  }

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable', // Cache for 24 hours (static)
    },
  });
}