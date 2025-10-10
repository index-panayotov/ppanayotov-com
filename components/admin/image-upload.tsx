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

      const result = await apiClient.upload<{ webUrl: string; pdfUrl: string }>('/api/upload', formData);
        // Update all three image fields with the new uploaded images
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
        logger.error('Failed to delete uploaded files', error as Error, {
          component: 'ImageUpload',
          action: 'deleteFiles'
        });
      }