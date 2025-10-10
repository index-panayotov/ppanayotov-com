import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { createBlogPost, updateBlogPost } from '@/app/admin/handlers';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText } from 'lucide-react';
import { generateSlug, markdownToEditorJs, editorJsToMarkdown } from '@/lib/markdown-utils';
import dynamic from 'next/dynamic';
import { OutputData } from '@editorjs/editorjs';
import ImageUpload from '@/components/admin/image-upload';
import { userProfile } from '@/data/user-profile';

// Dynamic import for EditorJS wrapper
const BlogEditorJSWrapper = dynamic(
  () => import('@/components/admin/blog-editorjs-wrapper'),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div> }
);

interface BlogPostDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentPost: BlogPost | null;
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[]) => void;
  setSaving: (saving: boolean) => void;
}

type BlogFormData = Omit<BlogPost, 'readingTime'>;

const BlogPostDialog: React.FC<BlogPostDialogProps> = ({
  open,
  setOpen,
  currentPost,
  blogPosts,
  setBlogPosts,
  setSaving,
}) => {
  const [editorData, setEditorData] = useState<OutputData | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!currentPost;

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
    const loadContent = async () => {
      if (currentPost && open) {
        setLoadingContent(true);
        try {
          // Fetch blog post content from API
          const response = await fetch(`/api/admin/blog/${currentPost.slug}`);

          // Handle specific HTTP error codes
          if (response.status === 404) {
            toast({
              title: 'Not Found',
              description: `Blog post "${currentPost.slug}" was not found. It may have been deleted.`,
              variant: 'destructive',
            });
            setOpen(false);
            return;
          }

          if (response.status === 403) {
            toast({
              title: 'Access Denied',
              description: 'Blog API is only available in development mode.',
              variant: 'destructive',
            });
            setOpen(false);
            return;
          }

          if (!response.ok) {
            const errorText = await response.text();
            toast({
              title: 'Server Error',
              description: `Failed to fetch blog post (HTTP ${response.status}). ${errorText ? 'Error: ' + errorText : ''}`,
              variant: 'destructive',
            });
            setOpen(false);
            return;
          }

          const result = await response.json();
          if (!result.success) {
            toast({
              title: 'Error Loading Post',
              description: result.error || 'Failed to load blog post data',
              variant: 'destructive',
            });
            setOpen(false);
            return;
          }

          const { metadata, content } = result.data;

          // Update form with metadata
          reset({
            slug: metadata.slug,
            title: metadata.title,
            description: metadata.description,
            publishedDate: metadata.publishedDate,
            updatedDate: metadata.updatedDate || '',
            author: metadata.author || authorName, // Use existing author or fallback to profile name
            tags: metadata.tags || [],
            featuredImage: metadata.featuredImage || '',
            published: metadata.published,
          });

          // Convert markdown to EditorJS
          const blocks = markdownToEditorJs(content);
          setEditorData({ time: Date.now(), blocks, version: '2.28.0' });
        } catch (err) {
          // Handle network errors and parsing errors
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          toast({
            title: 'Connection Error',
            description: `Failed to load blog post content. ${errorMessage}`,
            variant: 'destructive',
          });
          setOpen(false);
        } finally {
          setLoadingContent(false);
        }
      } else if (!currentPost && open) {
        // New post - reset everything
        reset({
          slug: '',
          title: '',
          description: '',
          publishedDate: new Date().toISOString().split('T')[0],
          updatedDate: '',
          author: authorName, // Auto-populate from user profile
          tags: [],
          featuredImage: '',
          published: false,
        });
        setEditorData({ time: Date.now(), blocks: [], version: '2.28.0' });
      }
    };

    loadContent();
  }, [currentPost, open, reset, toast, authorName]);

  // Handle form submission
  const onSubmit = async (data: BlogFormData) => {
    if (!editorData || editorData.blocks.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Blog post content cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    // Convert EditorJS to markdown
    const content = editorJsToMarkdown(editorData.blocks);

    const metadata: BlogPost = {
      ...data,
      readingTime: 0, // Will be calculated by API
    };

    if (isEditMode) {
      await updateBlogPost(
        metadata,
        content,
        blogPosts,
        setBlogPosts,
        setOpen,
        setSaving,
        toast
      );
    } else {
      await createBlogPost(
        metadata,
        content,
        blogPosts,
        setBlogPosts,
        setOpen,
        setSaving,
        toast
      );
    }
  };

  // Handle image upload
  const handleImageUpload = (imageUrl: string, webUrl: string, pdfUrl: string) => {
    setValue('featuredImage', imageUrl || webUrl, { shouldValidate: true });
  };

  // Handle dialog close
  const handleDialogClose = useCallback((newOpen: boolean) => {
    if (!newOpen && isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close without saving?')) {
        setOpen(newOpen);
        setEditorData(null);
      }
    } else {
      setOpen(newOpen);
      if (!newOpen) {
        setEditorData(null);
      }
    }
  }, [isDirty, setOpen]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the blog post details and content. Changes will be saved to file.'
              : 'Create a new blog post with rich content using the editor below.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title and Slug */}
            <div className="grid grid-cols-2 gap-4">
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
                  <FormLabel>Description (SEO)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="A compelling description for search engines (50-160 characters recommended)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0} characters (recommended: 50-160 for SEO)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Published Status */}
            <div className="grid grid-cols-2 gap-4">
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Published</FormLabel>
                      <FormDescription className="text-xs">
                        Make post visible
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
            <div className="space-y-2">
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
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Blog Content
              </FormLabel>
              {loadingContent ? (
                <div className="flex items-center justify-center p-8 border rounded-lg">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading content...</span>
                </div>
              ) : editorData ? (
                <BlogEditorJSWrapper
                  data={editorData}
                  onChange={setEditorData}
                  slug={currentSlug || 'temp'}
                />
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={Object.keys(errors).length > 0}
              >
                {isEditMode ? 'Update Post' : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostDialog;
