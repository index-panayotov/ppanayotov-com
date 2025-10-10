'use client';

import { useState, useEffect } from 'react';
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AuthCheck } from "@/components/admin/auth-check";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost } from "@/lib/schemas";
import { loadBlogPosts, deleteBlogPost } from "@/app/admin/handlers";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Calendar, User, Tag, Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic imports for components that use browser APIs
const BlogPostDialog = dynamic(
  () => import("@/components/admin/blog-post-dialog"),
  { ssr: false }
);

const BlogDeleteDialog = dynamic(
  () => import("@/components/admin/blog-delete-dialog"),
  { ssr: false }
);

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<{ slug: string; title: string } | null>(null);
  const { toast } = useToast();

  // Load blog posts on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await loadBlogPosts(setBlogPosts, toast);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [toast]);

  const handleCreateNew = () => {
    setCurrentPost(null);
    setDialogOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setDialogOpen(true);
  };

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete({ slug: post.slug, title: post.title });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    await deleteBlogPost(
      postToDelete.slug,
      postToDelete.title,
      blogPosts,
      setBlogPosts,
      setSaving,
      toast
    );
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  if (loading) {
    return (
      <AuthCheck>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading blog posts...</p>
          </div>
        </div>
      </AuthCheck>
    );
  }

  if (error) {
    return (
      <AuthCheck>
        <div className="p-8">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="h-full">
        <AdminNavigation
          experiencesCount={0}
          topSkillsCount={0}
          blogPostsCount={blogPosts.length}
          saving={saving}
        />

        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Blog Posts</h1>
              <p className="text-slate-600 mt-1">
                Manage your blog content, create new posts, and edit existing ones
              </p>
            </div>
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>

          {/* Blog Posts List */}
          {blogPosts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg mb-4">No blog posts yet</p>
                  <p className="text-slate-400 mb-6">Create your first blog post to get started</p>
                  <Button onClick={handleCreateNew} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create First Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {blogPosts.map((post) => (
                <Card key={post.slug} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{post.title}</CardTitle>
                          <Badge variant={post.published ? "default" : "secondary"} className="gap-1">
                            {post.published ? (
                              <>
                                <Eye className="h-3 w-3" />
                                Published
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                Draft
                              </>
                            )}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {post.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(post)}
                          title="Edit post"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(post)}
                          title="Delete post"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{post.publishedDate}</span>
                        {post.updatedDate && post.updatedDate !== post.publishedDate && (
                          <span className="text-slate-400">(updated {post.updatedDate})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      {post.readingTime && (
                        <div className="flex items-center gap-2">
                          <span>📖 {post.readingTime} min read</span>
                        </div>
                      )}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <Tag className="h-4 w-4 text-slate-400" />
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Dialogs */}
        <BlogPostDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          currentPost={currentPost}
          blogPosts={blogPosts}
          setBlogPosts={setBlogPosts}
          setSaving={setSaving}
        />

        <BlogDeleteDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          postToDelete={postToDelete}
          onConfirm={handleConfirmDelete}
          saving={saving}
        />
      </div>
    </AuthCheck>
  );
}
