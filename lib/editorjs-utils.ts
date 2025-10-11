/**
 * EditorJS utility functions for data processing and conversion
 */

interface EditorBlock {
  id?: string;
  type: string;
  data: any;
}

/**
 * Converts EditorJS blocks to plain text
 * @param blocks - Array of EditorJS blocks or JSON string
 * @returns Plain text string
 */
export function editorBlocksToText(blocks: EditorBlock[] | string): string {
  try {
    let blocksArray: EditorBlock[];
    
    // Handle different input formats
    if (typeof blocks === 'string') {
      try {
        const parsed = JSON.parse(blocks);
        if (Array.isArray(parsed)) {
          blocksArray = parsed;
        } else if (parsed && parsed.blocks && Array.isArray(parsed.blocks)) {
          blocksArray = parsed.blocks;
        } else {
          // If it's just a plain string, return it
          return blocks;
        }
      } catch {
        // Not valid JSON, return as plain text
        return blocks;
      }
    } else if (Array.isArray(blocks)) {
      blocksArray = blocks;
    } else {
      return '';
    }

    // Convert blocks to text
    return blocksArray.map(block => {
      switch (block.type) {
        case 'paragraph':
          return block.data?.text || '';
        case 'header':
          return block.data?.text || '';
        case 'list':
          if (Array.isArray(block.data?.items)) {
            return block.data.items.join('\n');
          }
          return '';
        case 'quote':
          return `"${block.data?.text || ''}"${block.data?.caption ? ` - ${block.data.caption}` : ''}`;
        case 'code':
          return block.data?.code || '';
        case 'delimiter':
          return '***';
        case 'table':
          if (Array.isArray(block.data?.content)) {
            return block.data.content.map((row: string[]) => row.join(' | ')).join('\n');
          }
          return '';
        default:
          // For unknown block types, try to extract text from common properties
          return block.data?.text || block.data?.content || '';
      }
    }).join('\n\n').trim();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error converting EditorJS blocks to text:', error);
    }
    return typeof blocks === 'string' ? blocks : '';
  }
}

/**
 * Converts plain text to EditorJS blocks format
 * @param text - Plain text string
 * @returns Array of EditorJS blocks
 */
export function textToEditorBlocks(text: string): EditorBlock[] {
  if (!text) return [];

  // Split by double newlines to separate paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  return paragraphs.map((paragraph, index) => ({
    id: generateBlockId(),
    type: 'paragraph',
    data: {
      text: paragraph.trim()
    }
  }));
}

/**
 * Validates if a string is valid EditorJS format
 * @param value - String to validate
 * @returns true if valid EditorJS format
 */
export function isEditorJSFormat(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) || (parsed && Array.isArray(parsed.blocks));
  } catch {
    return false;
  }
}

/**
 * Generates a random ID for EditorJS blocks
 * @returns Random string ID
 */
function generateBlockId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Processes form data based on WYSIWYG setting
 * @param value - Raw value from form
 * @param isWysiwyg - Whether WYSIWYG mode is enabled
 * @returns Processed text value
 */
export function processFormValue(value: string, isWysiwyg: boolean): string {
  if (!value) return '';
  
  if (isWysiwyg && isEditorJSFormat(value)) {
    return editorBlocksToText(value);
  }
  
  return value;
}