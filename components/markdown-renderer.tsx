'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Markdown Renderer Component
 *
 * Renders markdown content as HTML for CV templates.
 * Supports GitHub Flavored Markdown (GFM) including:
 * - Bold, italic, strikethrough
 * - Lists (ordered and unordered)
 * - Links
 * - Code blocks
 * - Tables
 * - Task lists
 *
 * @param content - Markdown string to render
 * @param className - Optional CSS class for styling
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize paragraph spacing
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,

          // Customize list styling
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,

          // Customize link styling
          a: ({ href, children }) => (
            <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),

          // Customize strong (bold) styling
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,

          // Customize code styling
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
            ) : (
              <code className={`block bg-slate-100 p-2 rounded text-sm font-mono overflow-x-auto ${className}`}>
                {children}
              </code>
            );
          },

          // Customize heading styling (if markdown includes headings)
          h3: ({ children }) => <h3 className="font-semibold text-base mt-2 mb-1">{children}</h3>,
          h4: ({ children }) => <h4 className="font-medium text-sm mt-2 mb-1">{children}</h4>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
