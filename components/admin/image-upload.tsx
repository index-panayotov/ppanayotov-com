'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react';
import { adminClassNames } from './design-system';
import { useToast } from '@/hooks/use-toast';
import { validateImageFile, isExternalImageUrl } from '@/lib/image-utils';
import type { ImageUploadProps } from '@/types/admin-components';

export default function ImageUpload({
  currentImageUrl, 
  currentWebUrl,
  currentPdfUrl,
  onImageChange 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [externalUrl, setExternalUrl] = useState(currentImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();  const handleFileUpload = async (file: File) => {
    // Validate file first
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
        // Update all three image fields with the new uploaded images
      onImageChange(result.webUrl, result.webUrl, result.pdfUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded and optimized successfully",
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      const validation = validateImageFile(file);
      if (validation.valid) {
        handleFileUpload(file);
      } else {
        toast({
          title: "Error",
          description: validation.error,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please drop an image file",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };
  const handleExternalUrlSubmit = () => {
    if (externalUrl) {
      onImageChange(externalUrl, '', '');
      toast({
        title: "Success",
        description: "External image URL set successfully",
      });
    }
  };

  const handleRemoveImage = async () => {
    // If it's a local upload, try to delete the files
    if (currentWebUrl?.startsWith('/uploads/') || currentPdfUrl?.startsWith('/uploads/')) {
      try {
        const params = new URLSearchParams();
        if (currentWebUrl) params.append('webUrl', currentWebUrl);
        if (currentPdfUrl) params.append('pdfUrl', currentPdfUrl);
        
        await fetch(`/api/upload?${params}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to delete uploaded files:', error);
      }    }
    onImageChange('', '', '');
    setExternalUrl('');
    toast({
      title: "Success",
      description: "Image removed successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Profile Image
        </CardTitle>
        <CardDescription>
          Upload a new image or use an external URL. Images will be automatically optimized for web and PDF.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="url">External URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
                ${dragOver ? 'border-primary bg-primary/5' : 'border-slate-300'}
                ${uploading ? 'opacity-50' : 'cursor-pointer hover:border-primary hover:bg-primary/5'}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              
              <Upload className={`w-8 h-8 mx-auto mb-2 ${adminClassNames.text.muted}`} />
              <p className={`text-sm ${adminClassNames.text.body} mb-1`}>
                {uploading ? 'Uploading...' : 'Drop an image here or click to browse'}
              </p>
              <p className={`text-xs ${adminClassNames.text.muted}`}>
                Supports JPG, PNG, WebP (max 5MB)
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="external-url">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="external-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                />
                <Button 
                  onClick={handleExternalUrlSubmit}
                  disabled={!externalUrl}
                >
                  <Link className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Current Image Preview */}
        {currentImageUrl && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Current Image</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="text-slate-600 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <img
                src={currentImageUrl}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
              />              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {isExternalImageUrl(currentImageUrl) ? 'External URL' : 'Local Upload'}
                </p>
                <p className={`${adminClassNames.text.muted} break-all`}>
                  {currentImageUrl}
                </p>
                {currentWebUrl && currentPdfUrl && (
                  <div className={`text-xs ${adminClassNames.text.muted}`}>
                    <p>Web: {currentWebUrl}</p>
                    <p>PDF: {currentPdfUrl}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
