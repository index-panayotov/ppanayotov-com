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
import { apiClient } from '@/lib/api-client';
import { logger } from '@/lib/logger';

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
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
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

      const result = await apiClient.upload<{ webUrl: string; pdfUrl: string }>('/api/upload', formData);
      onImageChange(result.webUrl, result.webUrl, result.pdfUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded and optimized successfully",
      });
      
    } catch (error) {
      logger.error('Upload error', error as Error, {
        component: 'ImageUpload'
      });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (currentWebUrl?.startsWith('/uploads/') || currentPdfUrl?.startsWith('/uploads/')) {
      try {
        const params = new URLSearchParams();
        if (currentWebUrl) params.append('webUrl', currentWebUrl);
        if (currentPdfUrl) params.append('pdfUrl', currentPdfUrl);
        
        await apiClient.delete(`/api/upload?${params}`);
      } catch (error) {
        logger.error('Failed to delete uploaded files', error as Error, {
          component: 'ImageUpload',
          action: 'deleteFiles'
        });
      }
    }
    onImageChange('', '', '');
    setExternalUrl('');
    toast({
      title: "Success",
      description: "Image removed successfully",
    });
  };

  const hasImage = currentImageUrl || currentWebUrl || currentPdfUrl;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image</CardTitle>
        <CardDescription>Upload an image or link to an external one.</CardDescription>
      </CardHeader>
      <CardContent>
        {hasImage ? (
          <div className="relative">
            <img
              src={currentImageUrl || currentWebUrl || ''}
              alt="Current"
              className="rounded-md object-cover w-[300px] h-[300px]"
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div 
                className={`mt-4 border-2 border-dashed rounded-md p-8 text-center ${dragOver ? 'border-primary' : 'border-border'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {uploading ? 'Uploading...' : 'Drag & drop an image, or click to select'}
                </p>
                <Input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/png, image/jpeg, image/gif, image/webp"
                />
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  Select File
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="url">
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="external-url">Image URL</Label>
                  <Input 
                    id="external-url" 
                    placeholder="https://example.com/image.png" 
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                </div>
                <Button onClick={handleExternalUrlSubmit}>Set Image from URL</Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
