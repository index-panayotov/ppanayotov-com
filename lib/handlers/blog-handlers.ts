/**
 * Blog Post Management Handlers
 */

import { BlogPost } from "@/lib/schemas";
import { apiClient } from "@/lib/api-client";
import { ToastFunction } from "./types";

/**
 * Load all blog posts from API
 */
export const loadBlogPosts = async (
  setBlogPosts: (posts: BlogPost[]) => void,
  toast: ToastFunction
) => {
  try {
    const data = await apiClient.get<{ success?: boolean; data?: BlogPost[]; error?: string }>("/api/admin/blog");

    // Handle error response from API
    if (data.error) {
      throw new Error(data.error);
    }

    // Handle success response with data
    if (data.success && data.data && Array.isArray(data.data)) {
      setBlogPosts(data.data);
      return;
    }

    // Unexpected response format - log it and throw error
    console.error('Unexpected API response format:', data);
    throw new Error('Unexpected response format from blog API');
  } catch (err: unknown) {
    console.error('loadBlogPosts error:', err);
    toast({
      title: "Error",
      description: err instanceof Error ? err.message : "Failed to load blog posts",
      variant: "destructive"
    });
    throw err; // Re-throw so the page can show error state
  }
};

/**
 * Create new blog post
 */
export const createBlogPost = async (
  metadata: BlogPost,
  content: string,
  blogPosts: BlogPost[],
  setBlogPosts: (posts: BlogPost[]) => void,
  setDialogOpen: (open: boolean) => void,
  setSaving: (value: boolean) => void,
  toast: ToastFunction
) => {
  try {
    setSaving(true);

    const data = await apiClient.post<{ success?: boolean; data?: BlogPost; error?: string }>(
      "/api/admin/blog",
      {
        metadata,
        content
      }
    );

    // Update local state
    if (data.data) {
      setBlogPosts([...blogPosts, data.data]);
    }

    toast({
      title: "Blog Post Created & Saved",
      description: `"${metadata.title}" has been created and saved`,
      className: "bg-green-50 border-green-200 text-green-800"
    });

    setDialogOpen(false);
  } catch (err: unknown) {
    toast({
      title: "Error",
      description: err instanceof Error ? err.message : "Failed to create blog post",
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};

/**
 * Update existing blog post
 */
export const updateBlogPost = async (
  metadata: BlogPost,
  content: string,
  blogPosts: BlogPost[],
  setBlogPosts: (posts: BlogPost[]) => void,
  setDialogOpen: (open: boolean) => void,
  setSaving: (value: boolean) => void,
  toast: ToastFunction
) => {
  try {
    setSaving(true);

    const data = await apiClient.put<{ success?: boolean; data?: BlogPost; error?: string }>(
      "/api/admin/blog",
      {
        metadata,
        content
      }
    );

    // Update local state
    if (data.data) {
      const index = blogPosts.findIndex(p => p.slug === data.data!.slug);
      if (index !== -1) {
        const newBlogPosts = [...blogPosts];
        newBlogPosts[index] = data.data;
        setBlogPosts(newBlogPosts);
      }
    }

    toast({
      title: "Blog Post Updated & Saved",
      description: `"${metadata.title}" has been updated and saved`,
      className: "bg-blue-50 border-blue-200 text-blue-800"
    });

    setDialogOpen(false);
  } catch (err: unknown) {
    toast({
      title: "Error",
      description: err instanceof Error ? err.message : "Failed to update blog post",
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};

/**
 * Delete blog post
 */
export const deleteBlogPost = async (
  slug: string,
  title: string,
  blogPosts: BlogPost[],
  setBlogPosts: (posts: BlogPost[]) => void,
  setSaving: (value: boolean) => void,
  toast: ToastFunction
) => {
  try {
    setSaving(true);

    await apiClient.delete(`/api/admin/blog?slug=${encodeURIComponent(slug)}`);

    // Update local state
    setBlogPosts(blogPosts.filter(p => p.slug !== slug));

    toast({
      title: "Blog Post Deleted",
      description: `"${title}" has been deleted`,
      variant: "destructive"
    });
  } catch (err: unknown) {
    toast({
      title: "Error",
      description: err instanceof Error ? err.message : "Failed to delete blog post",
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};
