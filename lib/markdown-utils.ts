/**
 * Markdown Utilities
 *
 * Conversion utilities between Markdown and EditorJS formats
 * Plus reading time calculation
 */

import { EditorJSBlock } from './schemas';

/**
 * Convert EditorJS blocks to Markdown format
 *
 * @param blocks - Array of EditorJS blocks
 * @returns Markdown string
 */
export function editorJsToMarkdown(blocks: EditorJSBlock[]): string {
  const markdown: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'header':
        const level = block.data.level || 2;
        const hashes = '#'.repeat(level);
        markdown.push(`${hashes} ${block.data.text}\n`);
        break;

      case 'paragraph':
        if (block.data.text) {
          markdown.push(`${block.data.text}\n`);
        }
        break;

      case 'list':
        if (block.data.items && Array.isArray(block.data.items)) {
          block.data.items.forEach((item: string) => {
            const prefix = block.data.style === 'ordered' ? '1.' : '-';
            markdown.push(`${prefix} ${item}`);
          });
          markdown.push('');
        }
        break;

      case 'code':
        const language = block.data.language || '';
        markdown.push(`\`\`\`${language}`);
        markdown.push(block.data.code || '');
        markdown.push('```\n');
        break;

      case 'quote':
        markdown.push(`> ${block.data.text}`);
        if (block.data.caption) {
          markdown.push(`> — ${block.data.caption}`);
        }
        markdown.push('');
        break;

      case 'delimiter':
        markdown.push('---\n');
        break;

      case 'image':
        const alt = block.data.caption || 'Image';
        const url = block.data.file?.url || block.data.url || '';
        markdown.push(`![${alt}](${url})\n`);
        break;

      case 'table':
        if (block.data.content && Array.isArray(block.data.content)) {
          // Header row
          markdown.push('| ' + block.data.content[0].join(' | ') + ' |');
          // Separator
          markdown.push('| ' + block.data.content[0].map(() => '---').join(' | ') + ' |');
          // Data rows
          block.data.content.slice(1).forEach((row: string[]) => {
            markdown.push('| ' + row.join(' | ') + ' |');
          });
          markdown.push('');
        }
        break;

      default:
        // For unknown block types, try to extract text content
        if (block.data.text) {
          markdown.push(`${block.data.text}\n`);
        }
    }
  }

  return markdown.join('\n');
}

/**
 * Convert Markdown to EditorJS blocks
 *
 * @param markdown - Markdown string
 * @returns Array of EditorJS blocks
 */
export function markdownToEditorJs(markdown: string): EditorJSBlock[] {
  const blocks: EditorJSBlock[] = [];
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Headers
    if (line.startsWith('#')) {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        blocks.push({
          type: 'header',
          data: {
            text: match[2],
            level: match[1].length
          }
        });
        i++;
        continue;
      }
    }

    // Code blocks
    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'code',
        data: {
          code: codeLines.join('\n'),
          language
        }
      });
      i++; // Skip closing ```
      continue;
    }

    // Lists
    if (line.match(/^[-*+]\s/) || line.match(/^\d+\.\s/)) {
      const isOrdered = line.match(/^\d+\.\s/) !== null;
      const items: string[] = [];
      while (i < lines.length) {
        const listLine = lines[i].trim();
        if (!listLine || (!listLine.match(/^[-*+]\s/) && !listLine.match(/^\d+\.\s/))) {
          break;
        }
        const item = listLine.replace(/^[-*+]\s/, '').replace(/^\d+\.\s/, '');
        items.push(item);
        i++;
      }
      blocks.push({
        type: 'list',
        data: {
          style: isOrdered ? 'ordered' : 'unordered',
          items
        }
      });
      continue;
    }

    // Quotes
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().slice(1).trim());
        i++;
      }
      const text = quoteLines.join(' ');
      blocks.push({
        type: 'quote',
        data: { text }
      });
      continue;
    }

    // Horizontal rule
    if (line.match(/^[-*_]{3,}$/)) {
      blocks.push({
        type: 'delimiter',
        data: {}
      });
      i++;
      continue;
    }

    // Images
    if (line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)) {
      const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (match) {
        blocks.push({
          type: 'image',
          data: {
            url: match[2],
            caption: match[1],
            file: { url: match[2] }
          }
        });
        i++;
        continue;
      }
    }

    // Paragraphs (default)
    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const pLine = lines[i].trim();
      if (!pLine ||
          pLine.startsWith('#') ||
          pLine.startsWith('```') ||
          pLine.match(/^[-*+]\s/) ||
          pLine.match(/^\d+\.\s/) ||
          pLine.startsWith('>') ||
          pLine.match(/^[-*_]{3,}$/) ||
          pLine.match(/^!\[/)) {
        break;
      }
      paragraphLines.push(pLine);
      i++;
    }
    if (paragraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        data: {
          text: paragraphLines.join(' ')
        }
      });
    }
  }

  return blocks;
}

/**
 * Calculate reading time in minutes
 *
 * @param markdown - Markdown content
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadingTime(markdown: string): number {
  const wordsPerMinute = 200;
  const words = markdown
    .replace(/[#*`>\-\[\]()]/g, '') // Remove markdown syntax
    .split(/\s+/)
    .filter(word => word.length > 0);

  const minutes = words.length / wordsPerMinute;
  return Math.max(1, Math.ceil(minutes));
}

/**
 * Generate slug from title
 *
 * @param title - Blog post title
 * @returns URL-safe slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Truncate text to a specific length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Extract plain text from markdown
 *
 * @param markdown - Markdown string
 * @returns Plain text without markdown syntax
 */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/[#*`>\-\[\]()]/g, '') // Remove markdown syntax
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\n{2,}/g, '\n') // Collapse multiple newlines
    .trim();
}
