import { BlogPost } from "@/lib/schemas";

/**
 * Blog Posts Metadata
 *
 * This file contains metadata for all blog posts.
 * The actual content is stored in markdown files in /data/blog/
 *
 * Each blog post requires:
 * - A unique slug (used in URL and filename)
 * - A corresponding .md file at /data/blog/{slug}.md
 * - Metadata including title, description, dates, author, tags
 */

export const blogPosts: BlogPost[] = [
  {
    "slug": "how-ai-makes-life-easy",
    "title": "How AI Makes Life Easy: Building a Website with Multiple AI Models",
    "description": "A reflection on leveraging Gemini-CLI, Claude Code, and OpenAI for website development, highlighting their strengths, weaknesses, and cost-effectiveness.",
    "publishedDate": "2025-10-12",
    "updatedDate": "2025-10-12",
    "author": "Preslav Panayotov",
    "tags": [
      "AI",
      "Web Development",
      "Gemini-CLI",
      "Claude Code",
      "OpenAI",
      "Productivity"
    ],
    "published": true,
    "readingTime": 5
  },
  {
    "slug": "scaling-success-client-growth",
    "title": "Scaling Success: Growing a Client from 40 to 96 People in Under a Year",
    "description": "A case study on client growth, emphasizing active listening, team support, and business-side achievements.",
    "publishedDate": "2025-10-12",
    "updatedDate": "2025-10-12",
    "author": "Preslav Panayotov",
    "tags": [
      "Client Management",
      "Business Growth",
      "Team Leadership",
      "Project Management",
      "Success Story"
    ],
    "published": true,
    "readingTime": 7
  },
  {
    "slug": "getting-started-with-nextjs",
    "title": "Getting Started with Next.js: A Comprehensive Guide",
    "description": "Learn how to build modern web applications with Next.js. This comprehensive guide covers everything from setup to deployment, perfect for developers looking to level up their React skills.",
    "publishedDate": "2025-01-15",
    "updatedDate": "2025-01-20",
    "author": "Your Name",
    "tags": [
      "nextjs",
      "react",
      "web-development",
      "javascript"
    ],
    "featuredImage": "/uploads/blog/getting-started-with-nextjs/featured.webp",
    "published": true,
    "readingTime": 8
  }
];
