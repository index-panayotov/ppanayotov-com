/**
 * RSS Feed for Blog
 *
 * Generates an RSS 2.0 feed for all published blog posts.
 * Accessible at /feed.xml
 *
 * Standards Compliance:
 * - RSS 2.0 specification
 * - Proper XML escaping
 * - Valid dates in RFC 822 format
 * - UTF-8 encoding
 * - Prerendered at build time for optimal performance
 */

import { NextResponse } from 'next/server';
import { loadBlogPosts, loadUserProfile, loadSystemSettings } from '@/lib/data-loader';
import { BlogPost } from '@/lib/schemas';

// Force static generation at build time
export const dynamic = 'force-static';

/**
 * Escapes XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates RSS 2.0 feed
 */
export async function GET() {
  try {
    // Load data from static files
    const blogPosts = loadBlogPosts() as BlogPost[];
    const userProfile = loadUserProfile();
    const systemSettings = loadSystemSettings();

    const publishedPosts = blogPosts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

    const siteUrl = systemSettings.siteUrl;
    const feedUrl = `${siteUrl}/feed.xml`;
    const blogUrl = `${siteUrl}/blog`;
    const siteTitle = systemSettings.pwa?.siteName || 'Portfolio';

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteTitle)} Blog</title>
    <link>${blogUrl}</link>
    <description>Insights on software development, technology trends, and lessons learned from building scalable applications</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <generator>Next.js</generator>
    <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(siteTitle)}</copyright>
    <category>Technology</category>
    <category>Software Development</category>
    <ttl>60</ttl>
${publishedPosts.map(post => {
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const pubDate = new Date(post.publishedDate).toUTCString();
  const guid = postUrl; // Use URL as GUID for consistency

  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${guid}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
${post.tags && post.tags.length > 0 ? post.tags.map(tag => `      <category>${escapeXml(tag)}</category>`).join('\n') : ''}
${post.featuredImage ? `      <enclosure url="${siteUrl}${post.featuredImage}" type="image/webp" />` : ''}
${post.readingTime ? `      <content:encoded><![CDATA[<p>Reading time: ${post.readingTime} minutes</p>]]></content:encoded>` : ''}
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('RSS feed generation error:', error);

    // Return minimal error feed instead of 500
    // Use generic fallback in case data loading failed
    const errorFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog</title>
    <link>/blog</link>
    <description>RSS feed temporarily unavailable</description>
  </channel>
</rss>`;

    return new NextResponse(errorFeed, {
      status: 200, // Return 200 to avoid breaking feed readers
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
