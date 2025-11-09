'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BlogPost, BlogPostSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { Loader2, FileText, Sparkles, ArrowLeft, Save, X } from 'lucide-react';
import { generateSlug, markdownToPlainText, truncateText } from '@/lib/markdown-utils';
import MarkdownEditor from '@/components/admin/markdown-editor';
import ImageUpload from '@/components/admin/image-upload';
import { userProfile } from '@/data/user-profile';
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
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditMode = mode === 'edit';

  // Get author name from user profile
  const authorName = userProfile.name || 'Anonymous';

  // Initialize form
  const form = useForm<BlogFormData>({
    resolver: zodResolver(BlogPostSchema.omit({ readingTime: true })),
    defaultValues: {
      slug: '',
      title: '',
      description: '',
      publishedDate: new Date().toISOString().split('T')[0],
      updatedDate: '',
      author: authorName,
      tags: [],
      featuredImage: '',
      published: false,
    },
    mode: 'onBlur',
  });

  const { handleSubmit, control, watch, setValue, formState: { errors, isDirty }, reset } = form;
  const currentTitle = watch('title');
  const currentSlug = watch('slug');
  const currentFeaturedImage = watch('featuredImage');

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditMode && currentTitle && (!currentSlug || currentSlug === generateSlug(currentTitle))) {
      setValue('slug', generateSlug(currentTitle), { shouldValidate: false });
    }
  }, [currentTitle, currentSlug, isEditMode, setValue]);

  // Load post content when editing
  useEffect(() => {
    const loadPostContent = async () => {
      if (initialPost && isEditMode) {
        setLoadingContent(true);
        try {
          // Fetch blog post content from API
          const result = await apiClient.get(`/api/admin/blog/${initialPost.slug}`);

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
            author: metadata.author || authorName,
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
  }, [initialPost, isEditMode, reset, authorName, router]);

  // Generate SEO description from content using AI
  const generateSeoDescription = async () => {
    if (!content || content.trim().length === 0) {
      toast.error('No Content', {
        description: 'Please add blog content first before generating an SEO description',
      });
      return;
    }

    setGeneratingDescription(true);

    try {
      const plainText = markdownToPlainText(content);
      const contentSample = truncateText(plainText, 500);

      const response = await apiClient.post<{ response: string }>('/api/ai', {
        systemInput: `You are an SEO expert specializing in meta descriptions.
Your task is to create a compelling meta description for a blog post based on the provided content.

Requirements:
- Length: 50-160 characters (strict requirement)
- Include primary keywords naturally
- Make it engaging and click-worthy
- Summarize the main value/benefit of the post
- No quotation marks or special characters
- Write in active voice

Respond with ONLY the meta description text, nothing else.`,
        data: `Blog Title: ${currentTitle}\n\nContent Preview:\n${contentSample}`,
        creativity: 0.3,
      });

      const generatedDesc = response.response?.trim() || '';
      const finalDesc = generatedDesc.length > 160
        ? truncateText(generatedDesc, 157)
        : generatedDesc;

      setValue('description', finalDesc, { shouldValidate: true, shouldDirty: true });

      toast.success('SEO Description Generated', {
        description: 'AI has created an optimized meta description from your content',
      });
    } catch (error) {
      console.error('SEO generation error:', error);
      toast.error('Generation Failed', {
        description: error instanceof Error ? error.message : 'Failed to generate SEO description',
      });
    } finally {
      setGeneratingDescription(false);
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
      // Auto-generate description if blank
      let finalDescription = data.description?.trim() || '';
      if (!finalDescription && content.trim().length > 0) {
        try {
          toast.info('Generating SEO Description', {
            description: 'Creating optimized meta description from content...',
          });

          const plainText = markdownToPlainText(content);
          const contentSample = truncateText(plainText, 500);

          const response = await apiClient.post<{ response: string }>('/api/ai', {
            systemInput: `You are an SEO expert specializing in meta descriptions.
Your task is to create a compelling meta description for a blog post based on the provided content.

Requirements:
- Length: 50-160 characters (strict requirement)
- Include primary keywords naturally
- Make it engaging and click-worthy
- Summarize the main value/benefit of the post
- No quotation marks or special characters
- Write in active voice

Respond with ONLY the meta description text, nothing else.`,
            data: `Blog Title: ${data.title}\n\nContent Preview:\n${contentSample}`,
            creativity: 0.3,
          });

          const generatedDesc = response.response?.trim() || '';
          finalDescription = generatedDesc.length > 160
            ? truncateText(generatedDesc, 157)
            : generatedDesc;
        } catch (error) {
          console.error('Auto-generation error:', error);
          // Continue without description - it's optional now
        }
      }

      const metadata: BlogPost = {
        ...data,
        description: finalDescription,
        readingTime: 0, // Will be calculated by API
      };

      if (isEditMode) {
        // Update existing post
        const response = await apiClient.put('/api/admin/blog', {
          metadata,
          content,
        });

        toast.success('Blog Post Updated', {
          description: `"${metadata.title}" has been updated successfully`,
        });
      } else {
        // Create new post
        const response = await apiClient.post('/api/admin/blog', {
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

  // Handle image upload
  const handleImageUpload = (imageUrl: string, webUrl: string, pdfUrl: string) => {
    setValue('featuredImage', imageUrl || webUrl, { shouldValidate: true });
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
    <div className="h-full bg-slate-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Breadcrumb & Title */}
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Blog</span>
                <span>/</span>
                <span className="font-medium text-slate-900">
                  {isEditMode ? 'Edit Post' : 'New Post'}
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {saving && (
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                form="blog-post-form"
                disabled={saving || Object.keys(errors).length > 0}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isEditMode ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Form {...form}>
          <form id="blog-post-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Title and Slug */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Getting Started with Next.js"
                        {...field}
                        className="text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="auto-generated-from-title"
                        {...field}
                        disabled={isEditMode}
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditMode ? 'Slug cannot be changed after creation' : 'Auto-generated from title'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Description (SEO) - Optional</FormLabel>
                    {(!field.value || field.value.trim() === '') && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateSeoDescription}
                        disabled={generatingDescription || !content || content.trim().length === 0}
                        className="gap-2 shrink-0"
                        title={!content || content.trim().length === 0 ? "Add blog content first to enable AI generation" : "Generate SEO description from your content"}
                      >
                        {generatingDescription ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3" />
                            Generate AI
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Leave blank to auto-generate, or write your own SEO description (50-160 characters recommended)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0} characters (recommended: 50-160 for SEO)
                    {(!field.value || field.value.trim() === '') && ' - Will be auto-generated from content if left blank'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Published Status */}
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={control}
                name="publishedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Published Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Published</FormLabel>
                      <FormDescription>
                        Make post visible on your blog
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Featured Image */}
            <div className="space-y-2 bg-white p-6 rounded-lg border">
              <FormLabel>Featured Image (optional)</FormLabel>
              <ImageUpload
                currentImageUrl={currentFeaturedImage}
                currentWebUrl={currentFeaturedImage}
                currentPdfUrl=""
                onImageChange={handleImageUpload}
              />
              <FormDescription>
                Upload a featured image for this blog post (will appear in post listings and social media previews)
              </FormDescription>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5" />
                Blog Content
              </FormLabel>
              <div className="rounded-lg border bg-white overflow-hidden">
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your blog post content in markdown...

**Markdown tips:**
- Use **bold** and *italic* for emphasis
- Create lists with - or 1.
- Add links: [text](url)
- Insert images: ![alt text](url)
- Add code blocks with ```
"
                  height={600}
                />
              </div>
              <FormDescription className="text-sm text-slate-500">
                Write your blog content using markdown formatting. The editor supports live preview.
              </FormDescription>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
