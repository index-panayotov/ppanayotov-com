"use client";
import React, { useEffect, useRef } from "react";
import { textToEditorBlocks, editorBlocksToText, isEditorJSFormat } from "@/lib/editorjs-utils";

// Define types for EditorJS
interface OutputData {
  blocks: any[];
}

interface EditorConfig {
  holder?: string;
  tools?: any;
  [key: string]: any;
}

// Dynamic import of EditorJS
let EditorJS: any = null;

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
  const editorRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  // Dynamically load EditorJS only in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@editorjs/editorjs").then(({ default: EditorJSModule }) => {
        EditorJS = EditorJSModule;
        initEditor();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initEditor = () => {
    if (!editorRef.current && holderRef.current && EditorJS) {
      const initialData = value ? (() => {
        try {
          // Check if it's already in EditorJS format
          if (isEditorJSFormat(value)) {
            const parsed = JSON.parse(value);
            // If it has blocks property, use it directly
            if (parsed && parsed.blocks) {
              return parsed;
            }
            // If it's an array of blocks, wrap it
            if (Array.isArray(parsed)) {
              return { blocks: parsed };
            }
          }
          
          // If not EditorJS format, treat as plain text and convert
          return { blocks: textToEditorBlocks(value) };
        } catch {
          // If parsing fails, treat as plain text
          return { blocks: textToEditorBlocks(value || "") };
        }
      })() : { blocks: [] };

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
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // Run only once on unmount

  return (
    <div ref={holderRef} className="min-h-[120px] border rounded bg-background" />
  );
};

export default EditorJsWrapper;
