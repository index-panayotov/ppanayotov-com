"use client";

import React, { useEffect, useRef, memo } from "react";
import { OutputData } from '@editorjs/editorjs';
import { logger } from '@/lib/logger';

interface BlogEditorJSWrapperProps {
  data: OutputData | null;
  onChange: (data: OutputData) => void;
  slug: string;
}

const BlogEditorJSWrapper: React.FC<BlogEditorJSWrapperProps> = ({
  data,
  onChange,
  slug
}) => {
  const editorRef = useRef<any>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!holderRef.current || isInitialized.current) return;

    const initEditor = async () => {
      // Dynamically import EditorJS and tools
      const [
        EditorJSModule,
        HeaderModule,
        ListModule,
        CodeModule,
        QuoteModule,
        ImageModule,
        TableModule,
        DelimiterModule,
      ] = await Promise.all([
        import('@editorjs/editorjs'),
        import('@editorjs/header'),
        import('@editorjs/list'),
        import('@editorjs/code'),
        import('@editorjs/quote'),
        import('@editorjs/image'),
        import('@editorjs/table'),
        import('@editorjs/delimiter'),
      ]);

      const EditorJS = EditorJSModule.default;
      const Header = HeaderModule.default;
      const List = ListModule.default;
      const Code = CodeModule.default;
      const Quote = QuoteModule.default;
      const ImageTool = ImageModule.default;
      const Table = TableModule.default;
      const Delimiter = DelimiterModule.default;

      if (!holderRef.current) return;

      // Initialize EditorJS with blog-specific configuration
      editorRef.current = new EditorJS({
        holder: holderRef.current,
        data: data || { blocks: [] },
        placeholder: 'Start writing your blog post...',
        onChange: async () => {
          if (editorRef.current) {
            try {
              const outputData: OutputData = await editorRef.current.save();
              onChange(outputData);
            } catch (error) {
              logger.error('Error saving EditorJS data', error as Error, {
                component: 'BlogEditorJSWrapper',
                slug
              });
            }
          }
        },
        tools: {
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          code: {
            class: Code,
            config: {
              placeholder: 'Enter code here...'
            }
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote author',
            }
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('slug', slug);

                    const response = await fetch('/api/upload/blog', {
                      method: 'POST',
                      body: formData,
                    });

                    if (!response.ok) {
                      const error = await response.json();
                      throw new Error(error.error || 'Upload failed');
                    }

                    const data = await response.json();
                    return {
                      success: 1,
                      file: {
                        url: data.url,
                      }
                    };
                  } catch (error) {
                    logger.error('Image upload error', error as Error, {
                      component: 'BlogEditorJSWrapper',
                      slug,
                      action: 'uploadImage'
                    });
                    return {
                      success: 0,
                      error: error instanceof Error ? error.message : 'Upload failed'
                    };
                  }
                },
                uploadByUrl: async (url: string) => {
                  return {
                    success: 1,
                    file: {
                      url: url,
                    }
                  };
                }
              }
            }
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            }
          },
          delimiter: Delimiter,
        },
        autofocus: false,
        minHeight: 300,
      });

      isInitialized.current = true;
    };

    initEditor();

    // Cleanup
    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []); // Only initialize once

  // Update data when it changes externally
  useEffect(() => {
    if (editorRef.current && data && editorRef.current.render) {
      editorRef.current.render(data).catch((error: Error) => {
        logger.error('Error rendering EditorJS data', error, {
          component: 'BlogEditorJSWrapper',
          slug
        });
      });
    }
  }, [data]);

  return (
    <div
      ref={holderRef}
      className="min-h-[400px] border rounded-lg bg-white prose prose-slate max-w-none p-4"
      id={`editorjs-${slug}`}
    />
  );
};

export default memo(BlogEditorJSWrapper);
