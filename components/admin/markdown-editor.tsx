'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the markdown editor to reduce bundle size
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 border rounded-md">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <span className="ml-2 text-sm text-slate-500">Loading editor...</span>
      </div>
    ),
  }
);

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
}

/**
 * Markdown Editor Component
 *
 * A lightweight markdown editor with live preview using @uiw/react-md-editor.
 * Features:
 * - Split view (editor + preview)
 * - Toolbar with common markdown formatting options
 * - Syntax highlighting
 * - No character limits
 * - Lightweight (~60KB)
 */
export default function MarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Enter markdown text...',
  height = 300,
  className = '',
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (val?: string) => {
    onChange?.(val || '');
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-12 border rounded-md">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className={className} data-color-mode="light">
      <MDEditor
        value={value}
        onChange={handleChange}
        height={height}
        preview="live"
        hideToolbar={false}
        enableScroll={true}
        visibleDragbar={true}
        textareaProps={{
          placeholder: placeholder,
        }}
        previewOptions={{
          rehypePlugins: [],
        }}
      />
    </div>
  );
}
