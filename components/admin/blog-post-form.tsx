'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BlogPost, BlogPostSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft, X, Sparkles } from 'lucide-react';
import { generateSlug, markdownToPlainText, truncateText } from '@/lib/markdown-utils';
import MarkdownEditor from '@/components/admin/markdown-editor';
import { apiClient } from '@/lib/api-client';

interface BlogPostFormProps {
  initialPost?: BlogPost | null;
  mode: 'create' | 'edit';
}

type BlogFormData = Omit<BlogPost, 'readingTime'>;

export default function BlogPostForm({ initialPost, mode }: BlogPostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const isEditMode = mode === 'edit';

  // Initialize form
  const form = useForm<BlogFormData>({
    resolver: zodResolver(BlogPostSchema.omit({ readingTime: true })),
    defaultValues: {
      slug: '',
      title: '',
      description: '',
      publishedDate: new Date().toISOString().split('T')[0],
      updatedDate: '',
      tags: [],
      featuredImage: '',
      published: true, // Default to published for simplicity
    },
    mode: 'onBlur',
  });

  const { handleSubmit, control, setValue, formState: { errors, isDirty }, reset } = form;

  // Load post content when editing
  useEffect(() => {
    const loadPostContent = async () => {
      if (initialPost && isEditMode) {
        setLoadingContent(true);
        try {
          // Fetch blog post content from API
          const result = await apiClient.get(`/api/admin/blog/${initialPost.slug}`) as any;

          if (result.error) {
            toast.error('Failed to load post', {
              description: result.error.message || 'Could not fetch blog post',
            });
            router.push('/admin/blog');
            return;
          }

          if (!result.success) {
            toast.error('Error Loading Post', {
              description: 'Failed to load blog post data',
            });
            router.push('/admin/blog');
            return;
          }

          const { metadata, content: markdownContent } = result.data;

          // Update form with metadata
          reset({
            slug: metadata.slug,
            title: metadata.title,
            description: metadata.description || '',
            publishedDate: metadata.publishedDate,
            updatedDate: metadata.updatedDate || '',
            tags: metadata.tags || [],
            featuredImage: metadata.featuredImage || '',
            published: metadata.published,
          });

          // Load markdown directly
          setContent(markdownContent || '');
        } catch (err) {
          toast.error('Connection Error', {
            description: `Failed to load blog post content. ${err instanceof Error ? err.message : ''}`,
          });
          router.push('/admin/blog');
        } finally {
          setLoadingContent(false);
        }
      } else if (!isEditMode) {
        // New post - initialize empty
        setContent('');
      }
    };

    loadPostContent();
  }, [initialPost, isEditMode, reset, router]);

  // Generate Title from content using AI
  const generateTitle = async () => {
    if (!content || content.trim().length === 0) {
      toast.error('No Content', {
        description: 'Please add blog content first before generating a title',
      });
      return;
    }

    setGeneratingTitle(true);

    try {
      const plainText = markdownToPlainText(content);
      const contentSample = truncateText(plainText, 1000);

      const response = await apiClient.post<{ response: string }>('/api/ai', {
        systemInput: `You are a professional blog editor.
Your task is to create a catchy, engaging, and SEO-friendly title for a blog post based on the provided content.

Requirements:
- Maximum 60 characters
- Engaging and click-worthy
- accurately reflect the content
- No quotation marks ("")
- No "Title:" prefix

Respond with ONLY the title text.`,
        data: `Content Preview:\n${contentSample}`,
        creativity: 0.4,
      });

      const generatedTitle = response.response?.trim() || '';
      // Remove any accidental quotes if the AI added them
      const cleanTitle = generatedTitle.replace(/^"|"$/g, '');

      setValue('title', cleanTitle, { shouldValidate: true, shouldDirty: true });

      toast.success('Title Generated', {
        description: 'AI has suggested a title based on your content',
      });
    } catch (error) {
      console.error('Title generation error:', error);
      toast.error('Generation Failed', {
        description: error instanceof Error ? error.message : 'Failed to generate title',
      });
    } finally {
      setGeneratingTitle(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: BlogFormData) => {
    if (!content || content.trim().length === 0) {
      toast.error('Validation Error', {
        description: 'Blog post content cannot be empty',
      });
      return;
    }

    setSaving(true);

    try {
      // Auto-generate fields for "stupid simple" mode
      const plainText = markdownToPlainText(content);
      const generatedDescription = truncateText(plainText, 160);
      const generatedSlug = isEditMode ? data.slug : generateSlug(data.title);

      const metadata: BlogPost = {
        ...data,
        slug: generatedSlug,
        description: data.description || generatedDescription, // Use existing or auto-generated
        published: true, // Always publish
        publishedDate: data.publishedDate || new Date().toISOString().split('T')[0],
        readingTime: 0, // Will be calculated by API
      };

      if (isEditMode) {
        // Update existing post
        await apiClient.put('/api/admin/blog', {
          metadata,
          content,
        });

        toast.success('Blog Post Updated', {
          description: `"${metadata.title}" has been updated successfully`,
        });
      } else {
        // Create new post
        await apiClient.post('/api/admin/blog', {
          metadata,
          content,
        });

        toast.success('Blog Post Created', {
          description: `"${metadata.title}" has been created successfully`,
        });
      }

      // Navigate back to blog list
      router.push('/admin/blog');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Save Failed', {
        description: error instanceof Error ? error.message : 'Failed to save blog post',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/admin/blog');
      }
    } else {
      router.push('/admin/blog');
    }
  };

  if (loadingContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold text-slate-900">
            {isEditMode ? 'Edit Post' : 'New Post'}
          </h1>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={saving}
            className="min-w-[100px]"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6">
        <Form {...form}>
          <form className="space-y-6">
            {/* Title Input */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="relative">
                  <div className="absolute right-0 top-0 z-10">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={generateTitle}
                      disabled={generatingTitle || !content || content.trim().length === 0}
                      className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      title={!content || content.trim().length === 0 ? "Add content first to generate title" : "Generate catchy title from content"}
                    >
                      {generatingTitle ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      {generatingTitle ? 'Generating...' : 'Generate Title'}
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Post Title"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm undefined pr-40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Markdown Editor */}
            <div className="min-h-[500px] border rounded-lg bg-white shadow-sm overflow-hidden">
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Write your story..."
                height={600}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
