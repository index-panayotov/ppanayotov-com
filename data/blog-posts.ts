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
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js: A Comprehensive Guide",
    description: "Learn how to build modern web applications with Next.js. This comprehensive guide covers everything from setup to deployment, perfect for developers looking to level up their React skills.",
    publishedDate: "2025-01-15",
    updatedDate: "2025-01-20",
    author: "Your Name",
    tags: ["nextjs", "react", "web-development", "javascript"],
    featuredImage: "/uploads/blog/getting-started-with-nextjs/featured.webp",
    published: true,
    readingTime: 8
  },
  {
    slug: "building-a-blog-with-markdown",
    title: "Building a Blog System with Markdown and EditorJS",
    description: "Discover how to create a flexible blog system that combines the simplicity of Markdown with the power of a WYSIWYG editor. Learn about file-based content management and SEO optimization.",
    publishedDate: "2025-01-10",
    author: "Your Name",
    tags: ["markdown", "cms", "blog", "editorjs"],
    featuredImage: "/uploads/blog/building-a-blog-with-markdown/featured.webp",
    published: false,
    readingTime: 6
  }
];
