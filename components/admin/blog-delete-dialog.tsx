import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, AlertTriangle } from 'lucide-react';

interface BlogDeleteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  postToDelete: { slug: string; title: string } | null;
  onConfirm: () => void;
  saving: boolean;
}

const BlogDeleteDialog: React.FC<BlogDeleteDialogProps> = ({
  open,
  setOpen,
  postToDelete,
  onConfirm,
  saving,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Blog Post
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>&quot;{postToDelete?.title}&quot;</strong>?
            </p>
            <p className="text-sm">
              This action will:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Remove the blog post from the metadata file</li>
              <li>Delete the markdown content file</li>
              <li>Delete all uploaded images for this post</li>
            </ul>
            <p className="text-sm font-semibold text-red-600 mt-3">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Post'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlogDeleteDialog;
