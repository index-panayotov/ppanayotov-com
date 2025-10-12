'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { ComponentPropsWithoutRef } from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Sanitization Schema for Blog Content
 *
 * Security: This schema defines which HTML elements and attributes are allowed
 * in blog post content. It extends the default rehype-sanitize schema with
 * additional safe elements for rich content display.
 *
 * IMPORTANT: Do not add script, iframe, embed, or object tags without careful
 * security review. These can introduce XSS vulnerabilities.
 *
 * Allowed elements:
 * - Standard markdown elements (p, h1-h6, a, img, ul, ol, li, blockquote, code, pre)
 * - Tables (table, thead, tbody, tr, th, td)
 * - Text formatting (strong, em, del, ins, sup, sub)
 * - Code blocks with syntax highlighting (pre, code with className)
 * - Horizontal rules (hr)
 * - Line breaks (br)
 *
 * Blocked elements (for security):
 * - script: JavaScript execution
 * - iframe: Embedding external content
 * - object, embed: Plugin content
 * - form, input: Form elements
 * - style: Inline CSS injection
 */
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Allow className for code syntax highlighting
    code: [...(defaultSchema.attributes?.code || []), 'className'],
    // Allow safe attributes for images
    img: ['src', 'alt', 'title', 'width', 'height', 'className'],
    // Allow safe attributes for links (target, rel already restricted by default)
    a: ['href', 'title', 'className', 'target', 'rel'], // Add target and rel
    // Allow className for custom styling on other elements
    '*': [...(defaultSchema.attributes?.['*'] || []), 'className'],
  },
  protocols: {
    // mailto and tel are intentionally excluded for bot protection (handled by custom 'a' component)
    // Relative URLs are allowed by default when not restricted, this is a render-time check (second layer of defense)
    href: ['http', 'https'],
  },
  // Explicitly list allowed tag names for clarity
  tagNames: [
    ...(defaultSchema.tagNames || []),
    // Block elements
    'p', 'div', 'blockquote', 'pre', 'hr', 'br',
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Lists
    'ul', 'ol', 'li',
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    // Inline elements
    'a', 'strong', 'em', 'code', 'del', 'ins', 'sup', 'sub', 'mark',
    // Media
    'img',
    // Definition lists
    'dl', 'dt', 'dd',
  ],
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={{
          // Headings
          h1: ({ node, ...props }: ComponentPropsWithoutRef<'h1'>) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 text-slate-900" {...props} />
          ),
          h2: ({ node, ...props }: ComponentPropsWithoutRef<'h2'>) => (
            <h2 className="text-3xl font-bold mt-8 mb-4 text-slate-900" {...props} />
          ),
          h3: ({ node, ...props }: ComponentPropsWithoutRef<'h3'>) => (
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-slate-800" {...props} />
          ),
          h4: ({ node, ...props }: ComponentPropsWithoutRef<'h4'>) => (
            <h4 className="text-xl font-semibold mt-6 mb-3 text-slate-800" {...props} />
          ),
          h5: ({ node, ...props }: ComponentPropsWithoutRef<'h5'>) => (
            <h5 className="text-lg font-semibold mt-4 mb-2 text-slate-700" {...props} />
          ),
          h6: ({ node, ...props }: ComponentPropsWithoutRef<'h6'>) => (
            <h6 className="text-base font-semibold mt-4 mb-2 text-slate-700" {...props} />
          ),

          // Paragraphs
          p: ({ node, ...props }: ComponentPropsWithoutRef<'p'>) => (
            <p className="my-4 text-slate-700 leading-relaxed" {...props} />
          ),

          // Links
          a: ({ node, href, ...props }: ComponentPropsWithoutRef<'a'>) => {
            const normalizedHref = href?.trim().toLowerCase(); // Normalize href
            if (normalizedHref && (normalizedHref.startsWith('mailto:') || normalizedHref.startsWith('tel:'))) {
              return (
                <span
                  className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors cursor-not-allowed"
                  aria-label={href}
                  {...props}
                >
                  {props.children}
                </span>
              );
            }
            return (
              <a
                className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                href={href}
                {...props}
              />
            );
          },

          // Lists
          ul: ({ node, ...props }: ComponentPropsWithoutRef<'ul'>) => (
            <ul className="my-4 ml-6 list-disc space-y-2 text-slate-700" {...props} />
          ),
          ol: ({ node, ...props }: ComponentPropsWithoutRef<'ol'>) => (
            <ol className="my-4 ml-6 list-decimal space-y-2 text-slate-700" {...props} />
          ),
          li: ({ node, ...props }: ComponentPropsWithoutRef<'li'>) => (
            <li className="leading-relaxed" {...props} />
          ),

          // Code blocks
          pre: ({ node, ...props }: ComponentPropsWithoutRef<'pre'>) => (
            <pre className="my-6 overflow-x-auto rounded-lg bg-slate-900 p-4" {...props} />
          ),
          code: ({ node, className, children, ...props }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) => {
            const isInline = !className;
            return isInline ? (
              <code
                className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-slate-800"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="font-mono text-sm text-slate-100"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Blockquotes
          blockquote: ({ node, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
            <blockquote
              className="my-6 border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 italic text-slate-700"
              {...props}
            />
          ),

          // Images
          img: ({ node, ...props }: ComponentPropsWithoutRef<'img'>) => (
            <img
              className="my-6 rounded-lg shadow-md max-w-full h-auto"
              {...props}
              alt={props.alt || 'Blog image'}
            />
          ),

          // Horizontal rules
          hr: ({ node, ...props }: ComponentPropsWithoutRef<'hr'>) => (
            <hr className="my-8 border-t-2 border-slate-200" {...props} />
          ),

          // Tables
          table: ({ node, ...props }: ComponentPropsWithoutRef<'table'>) => (
            <div className="my-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-300" {...props} />
            </div>
          ),
          thead: ({ node, ...props }: ComponentPropsWithoutRef<'thead'>) => (
            <thead className="bg-slate-100" {...props} />
          ),
          tbody: ({ node, ...props }: ComponentPropsWithoutRef<'tbody'>) => (
            <tbody className="divide-y divide-slate-200 bg-white" {...props} />
          ),
          tr: ({ node, ...props }: ComponentPropsWithoutRef<'tr'>) => (
            <tr {...props} />
          ),
          th: ({ node, ...props }: ComponentPropsWithoutRef<'th'>) => (
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-slate-900"
              {...props}
            />
          ),
          td: ({ node, ...props }: ComponentPropsWithoutRef<'td'>) => (
            <td className="px-4 py-3 text-sm text-slate-700" {...props} />
          ),

          // Strong and emphasis
          strong: ({ node, ...props }: ComponentPropsWithoutRef<'strong'>) => (
            <strong className="font-bold text-slate-900" {...props} />
          ),
          em: ({ node, ...props }: ComponentPropsWithoutRef<'em'>) => (
            <em className="italic text-slate-800" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
