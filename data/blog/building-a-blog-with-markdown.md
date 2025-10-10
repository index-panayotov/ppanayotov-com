# Building a Blog System with Markdown and EditorJS

Creating a blog doesn't have to be complicated. In this guide, we'll explore how to build a flexible, file-based blog system that combines the simplicity of Markdown with the power of a WYSIWYG editor.

## Why Markdown?

Markdown is a lightweight markup language that's easy to read and write. It's perfect for blog content because:

- **Simple syntax**: Focus on writing, not formatting
- **Portable**: Markdown files are plain text and work everywhere
- **Version control friendly**: Easy to track changes in Git
- **Future-proof**: No database lock-in

## The Architecture

Our blog system uses a hybrid approach:

1. **Storage**: Blog content stored as `.md` files
2. **Editing**: WYSIWYG editor (EditorJS) for ease of use
3. **Rendering**: Convert Markdown to beautiful HTML
4. **Metadata**: Separate file for post information

### Directory Structure

```
data/
├── blog-posts.ts        # Metadata for all posts
└── blog/
    ├── post-one.md
    ├── post-two.md
    └── post-three.md
```

## Setting Up the Data Layer

First, create a schema for blog posts:

```typescript
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  author: string;
  tags: string[];
  featuredImage?: string;
  published: boolean;
  readingTime?: number;
}
```

## Markdown to EditorJS Conversion

The challenge is converting between Markdown (storage) and EditorJS (editing):

```typescript
function markdownToEditorJs(markdown: string) {
  // Parse markdown into blocks
  const lines = markdown.split('\n');
  const blocks = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      blocks.push({
        type: 'header',
        data: { text: line.slice(2), level: 1 }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        type: 'header',
        data: { text: line.slice(3), level: 2 }
      });
    } else {
      blocks.push({
        type: 'paragraph',
        data: { text: line }
      });
    }
  }

  return { blocks };
}
```

## SEO Considerations

A good blog needs excellent SEO. Here's what we implement:

### 1. Meta Tags

```tsx
export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  openGraph: {
    title: post.title,
    description: post.description,
    type: 'article',
    publishedTime: post.publishedDate,
  },
};
```

### 2. Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Blog Title",
  "datePublished": "2025-01-10",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  }
}
```

### 3. Sitemap Integration

Automatically include blog posts in your sitemap:

```typescript
const blogUrls = blogPosts.map(post => ({
  loc: `/blog/${post.slug}`,
  lastmod: post.updatedDate || post.publishedDate,
  priority: 0.7,
}));
```

## Rendering Markdown

Use `react-markdown` for beautiful, semantic HTML:

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-4xl font-bold mb-4" {...props} />
        ),
        // Custom component mapping
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

## Admin Panel Features

A professional blog needs a good admin interface:

- **WYSIWYG Editor**: Write content visually with EditorJS
- **Draft System**: Save drafts before publishing
- **Image Upload**: Drag-and-drop images up to 5MB
- **Tag Management**: Organize posts with tags
- **SEO Preview**: See how posts look in search results

## Performance Optimization

1. **Static Generation**: Pre-render blog posts at build time
2. **Image Optimization**: Use Next.js Image component
3. **Code Splitting**: Lazy load heavy components
4. **Caching**: Leverage browser and CDN caching

## Conclusion

Building a file-based blog system gives you:

- Complete control over your content
- No database complexity
- Easy version control
- Fast performance
- SEO-friendly output

This approach is perfect for personal blogs, documentation sites, and content-heavy applications.

Ready to start blogging? Let's build something amazing! ✨
