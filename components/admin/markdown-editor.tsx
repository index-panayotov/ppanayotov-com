'use client';

import React, { useEffect, useRef, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Editor as EditorType, EditorProps } from '@toast-ui/react-editor';

// Import Toast UI Editor CSS
import '@toast-ui/editor/dist/toastui-editor.css';

// Wrapper component to handle the dynamic import and ref forwarding
const TuiEditor = dynamic<EditorProps & { forwardedRef: React.MutableRefObject<EditorType | null> }>(
  () => import('@toast-ui/react-editor').then((mod) => {
    // Return a component that forwards the ref to the actual Editor
    const EditorWithRef = (props: EditorProps & { forwardedRef: React.MutableRefObject<EditorType | null> }) => (
      <mod.Editor {...props} ref={props.forwardedRef} />
    );
    return EditorWithRef;
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-12 border rounded-md bg-white">
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
 * Markdown Editor Component using Toast UI Editor
 *
 * Features:
 * - WYSIWYG and Markdown modes
 * - Split view preview
 * - Toolbar
 */
export default function MarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Enter markdown text...',
  height = 600, // Default height increased for better writing experience
  className = '',
}: MarkdownEditorProps) {
  const editorRef = useRef<EditorType>(null);
  // Track internal value to avoid cursor jumping or loops
  const lastValueRef = useRef(value);

  // Sync external value updates to the editor
  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance && value !== lastValueRef.current) {
      // Only update if value has actually changed from outside
      // Check strictly to avoid overwriting work in progress if there's a lag
      const currentEditorContent = editorInstance.getMarkdown();
      if (currentEditorContent !== value) {
        editorInstance.setMarkdown(value);
        lastValueRef.current = value;
      }
    }
  }, [value]);

  const handleChange = () => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      const markdown = editorInstance.getMarkdown();
      lastValueRef.current = markdown;
      onChange?.(markdown);
    }
  };

  return (
    <div className={className}>
      <TuiEditor
        forwardedRef={editorRef}
        initialValue={value}
        previewStyle="vertical"
        height={`${height}px`}
        initialEditType="markdown"
        useCommandShortcut={true}
        placeholder={placeholder}
        onChange={handleChange}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock'],
        ]}
      />
    </div>
  );
}
