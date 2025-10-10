import React from 'react';

interface EditorJsRendererProps {
  content: string; // JSON string from Editor.js
  className?: string; // Optional className for the root div
}

interface EditorBlock {
  id?: string;
  type: string;
  data: any;
}

const EditorJsRenderer: React.FC<EditorJsRendererProps> = ({ content, className }) => {
  if (!content) {
    return null;
  }

  let blocks: EditorBlock[] = [];

  // Check if content looks like JSON before attempting to parse
  const looksLikeJson = content.trim().startsWith('[') || content.trim().startsWith('{');

  if (looksLikeJson) {
    try {
      let parsedContent = JSON.parse(content);

      // If the content is a string after the first parse, try parsing again
      if (typeof parsedContent === 'string') {
        parsedContent = JSON.parse(parsedContent);
      }

      if (Array.isArray(parsedContent)) {
        blocks = parsedContent;
      } else if (parsedContent && Array.isArray(parsedContent.blocks)) {
        blocks = parsedContent.blocks;
      }
    } catch (e) {
      // Silently fall through to plain text rendering
      // This is expected for malformed JSON or plain text that starts with { or [
    }
  }

  // If no blocks were parsed, render as plain text (preserve line breaks)
  if (blocks.length === 0) {
    return (
      <div className={className}>
        {content.split('\n').map((line, index) => (
          <p key={index}>{line || '\u00A0'}</p>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
          case 'header':
            const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
            return <HeaderTag key={block.id} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
          case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={block.id}>
                {block.data.items.map((item: string, index: number) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ListTag>
            );
          case 'quote':
            return (
              <blockquote key={block.id}>
                <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                {block.data.caption && <footer dangerouslySetInnerHTML={{ __html: block.data.caption }} />}
              </blockquote>
            );
          case 'code':
            return (
              <pre key={block.id}>
                <code>{block.data.code}</code>
              </pre>
            );
          case 'delimiter':
            return <hr key={block.id} />;
          // Add more cases for other block types as needed
          default:
            return <p key={block.id}>Unsupported block type: {block.type}</p>;
        }
      })}
    </div>
  );
};

export default EditorJsRenderer;
