import React, { useState, useEffect, useCallback } from 'react';
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

import { Badge } from '@/components/ui/badge';

import { ExperienceDialogProps } from '@/types/admin';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AIEnhancedInput } from '@/components/admin/ai-enhanced-input';
import { AIEnhancedTextarea } from '@/components/admin/ai-enhanced-textarea';
import { X } from 'lucide-react';
import { logger } from '@/lib/logger';

import {
  ExperienceFormSchema,
  ExperienceFormData,
  getDefaultFormValues
} from '@/lib/admin-form-schemas';



const ExperienceDialog: React.FC<ExperienceDialogProps> = ({
  open,
  setOpen,
  currentExperience,
  setCurrentExperience,
  newSkill,
  setNewSkill,
  saveExperience,
  saving = false,
  systemSettings,
}) => {

  // Initialize form with react-hook-form and Zod validation
  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(ExperienceFormSchema),
    defaultValues: getDefaultFormValues.experience(),
    mode: 'onBlur' // Validate on blur for better UX
  });

  const { handleSubmit, control, watch, setValue, formState: { errors, isDirty }, reset } = form;

  const currentTags = watch('tags');

  // Update form when currentExperience changes
  useEffect(() => {
    if (currentExperience) {
      reset({
        title: currentExperience.title || '',
        company: currentExperience.company || '',
        dateRange: currentExperience.dateRange || '',
        location: currentExperience.location || '',
        description: currentExperience.description || '',
        tags: currentExperience.tags || []
      });
    } else {
      reset(getDefaultFormValues.experience());
    }
  }, [currentExperience, reset]);

  // Handle form submission
  const onSubmit = async (data: ExperienceFormData) => {
    if (saving) return;

    try {
      // Update current experience with form data
      setCurrentExperience({
        title: data.title,
        company: data.company,
        dateRange: data.dateRange,
        description: data.description,
        tags: data.tags,
        ...(data.location && { location: data.location }),
        ...(currentExperience?._index !== undefined && { _index: currentExperience._index })
      });
      // Call save function
      await saveExperience();
      setNewSkill('');
      setOpen(false);
    } catch (error) {
      logger.error('Failed to save experience', error as Error, {
        component: 'ExperienceDialog'
      });
    }
  };

  // Tag management functions
  const addFormTag = useCallback(() => {
    if (!newSkill.trim()) return;

    const currentTags = form.getValues('tags');
    if (!currentTags.includes(newSkill.trim())) {
      setValue('tags', [...currentTags, newSkill.trim()], { shouldValidate: true });
      setNewSkill('');
    }
  }, [newSkill, form, setValue]);

  const removeFormTag = useCallback((tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove), { shouldValidate: true });
  }, [form, setValue]);

  // Handle dialog close with confirmation for unsaved changes
  const handleDialogClose = useCallback((newOpen: boolean) => {
    if (!newOpen && saving) {
      return; // Prevent closing while saving
    }

    if (!newOpen && isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close without saving?")) {
        setOpen(newOpen);
        reset(getDefaultFormValues.experience());
        setNewSkill('');
      }
    } else {
      setOpen(newOpen);
      if (!newOpen) {
        reset(getDefaultFormValues.experience());
        setNewSkill('');
      }
    }
  }, [saving, isDirty, setOpen, reset]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentExperience?._index !== undefined ? 'Edit Experience' : 'Add New Experience'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for this experience entry. All changes will be automatically saved to your CV file.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Information Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <AIEnhancedInput
                        fieldName="job title"
                        placeholder="e.g., Senior Software Engineer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <AIEnhancedInput
                        fieldName="company name"
                        placeholder="e.g., Microsoft"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date and Location Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Range</FormLabel>
                    <FormControl>
                      <AIEnhancedInput
                        fieldName="date range"
                        placeholder="e.g., Jan 2020 - Present"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (optional)</FormLabel>
                    <FormControl>
                      <AIEnhancedInput
                        fieldName="job location"
                        placeholder="e.g., Sofia, Bulgaria"
                        {...field}
                      />
                    </FormControl>
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
                  <div className="flex justify-between items-center">
                    <FormLabel>Description</FormLabel>
                    <span className="text-xs text-muted-foreground">
                      {field.value?.length || 0} characters
                    </span>
                  </div>
                  <FormControl>
                    <AIEnhancedTextarea
                      fieldName="job description"
                      rows={5}
                      placeholder="Describe your role, responsibilities, and key achievements..."
                      systemSettings={systemSettings}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum 10 characters, maximum 2000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags/Skills */}
            <FormField
              control={control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills & Technologies</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {/* Current Tags */}
                      <div className="flex flex-wrap gap-2 min-h-[2rem] p-2 rounded-md border">
                        {currentTags?.length > 0 ? (
                          currentTags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeFormTag(tag)}
                              />
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No tags added yet</span>
                        )}
                      </div>

                      {/* Add New Tag */}
                      <div className="flex gap-2">
                        <AIEnhancedInput
                          placeholder="Add new skill or technology"
                          fieldName="skill tag"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addFormTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={addFormTag} disabled={!newSkill.trim()}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || Object.keys(errors).length > 0}
              >
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                    Saving...
                  </>
                ) : (
                  "Save & Persist to File"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceDialog;
