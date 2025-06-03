// editorjs-wrapper.tsx
import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData, EditorConfig } from "@editorjs/editorjs";

interface EditorJsWrapperProps {
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  config: EditorConfig;
}

const EditorJsWrapper: React.FC<EditorJsWrapperProps> = ({
  value,
  onChange,
  config
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  // const holderId = config.holder || "editorjs";
  const initialData = value ? (() => {
    try {
      const parsed = JSON.parse(value);
      // If already in Editor.js format (has blocks), use as is
      if (parsed && parsed.blocks) return parsed;
      // If it's a plain string, wrap in a paragraph block
      if (typeof parsed === "string") {
        return { blocks: [{ type: "paragraph", data: { text: parsed } }] };
      }
      // If it's an array (legacy), wrap in blocks
      if (Array.isArray(parsed)) {
        return { blocks: parsed };
      }
      // Fallback: treat as plain text
      return { blocks: [{ type: "paragraph", data: { text: value } }] };
    } catch {
      // Not JSON, treat as plain text
      return { blocks: [{ type: "paragraph", data: { text: value || "" } }] };
    }
  })() : undefined;

  // Remove holderId from config, only use holderRef
  useEffect(() => {
    if (!editorRef.current && holderRef.current) {
      editorRef.current = new EditorJS({
        ...config,
        holder: holderRef.current,
        data: initialData,
        onChange: async () => {
          if (editorRef.current && onChange) {
            const output: OutputData = await editorRef.current.save();
            onChange({ target: { value: JSON.stringify(output.blocks) } });
          }
        },
      });
    }
    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
    <div ref={holderRef} className="min-h-[120px] border rounded bg-white" />
  );
};

export default EditorJsWrapper;
