import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AIEnhancedInput } from '@/components/admin/ai-enhanced-input';
import { AIEnhancedTextarea } from '@/components/admin/ai-enhanced-textarea';
import { X } from 'lucide-react';
import { ExperienceEntry } from '@/types';

interface ExperienceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentExperience: ExperienceEntry | null;
  setCurrentExperience: (exp: ExperienceEntry | null) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  saveExperience: () => void;
  saving?: boolean;
}

const ExperienceDialog: React.FC<ExperienceDialogProps> = ({
  open,
  setOpen,
  currentExperience,
  setCurrentExperience,
  newSkill,
  setNewSkill,
  addTag,
  removeTag,
  saveExperience,
  saving = false,
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Stable state updater functions using useCallback
  const updateField = useCallback((field: keyof ExperienceEntry, value: string) => {
    setCurrentExperience(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  }, [setCurrentExperience]);

  const updateTitle = useCallback((value: string) => updateField('title', value), [updateField]);
  const updateCompany = useCallback((value: string) => updateField('company', value), [updateField]);
  const updateDateRange = useCallback((value: string) => updateField('dateRange', value), [updateField]);
  const updateLocation = useCallback((value: string) => updateField('location', value), [updateField]);
  const updateDescription = useCallback((value: string) => updateField('description', value), [updateField]);

  // Memoized values for input stabilization
  const inputValues = useMemo(() => ({
    title: currentExperience?.title || '',
    company: currentExperience?.company || '',
    dateRange: currentExperience?.dateRange || '',
    location: currentExperience?.location || '',
    description: currentExperience?.description || ''
  }), [currentExperience]);

  // Debounced validation to prevent excessive re-renders during typing
  useEffect(() => {
    if (!currentExperience) {
      setValidationErrors([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      const errors: string[] = [];
      if (!currentExperience.title?.trim()) {
        errors.push('Title is required');
      }
      if (!currentExperience.company?.trim()) {
        errors.push('Company is required');
      }
      if (!currentExperience.dateRange?.trim()) {
        errors.push('Date Range is required');
      }
      if (!currentExperience.description?.trim()) {
        errors.push('Description is required');
      }

      setValidationErrors(errors);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [currentExperience]);

  const handleSave = () => {
    if (validationErrors.length > 0) {
      return; // Don't save if there are validation errors
    }
    if (saving) {
      return; // Prevent double-submit while saving
    }
    saveExperience();
  };

  // Handle dialog close with confirmation if there are unsaved changes
  const handleDialogClose = useCallback((newOpen: boolean) => {
    if (!newOpen && saving) {
      // Prevent closing while saving
      return;
    }
    
    if (!newOpen && currentExperience && (
      inputValues.title.trim() || 
      inputValues.company.trim() || 
      inputValues.description.trim() ||
      inputValues.dateRange.trim()
    )) {
      // Show confirmation for unsaved changes
      if (window.confirm("You have unsaved changes. Are you sure you want to close without saving?")) {
        setOpen(newOpen);
      }
    } else {
      setOpen(newOpen);
    }
  }, [saving, currentExperience, inputValues, setOpen]);

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
      
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            Please fix the following errors:
            <ul className="mt-2 list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {currentExperience && (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <AIEnhancedInput 
                id="title" 
                fieldName="job title"
                value={inputValues.title} 
                onChange={(e) => updateTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">Company</label>
              <AIEnhancedInput 
                id="company" 
                fieldName="company name"
                value={inputValues.company} 
                onChange={(e) => updateCompany(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">            <div className="space-y-2">
              <label htmlFor="dateRange" className="text-sm font-medium">Date Range</label>
              <AIEnhancedInput 
                id="dateRange" 
                fieldName="date range"
                value={inputValues.dateRange} 
                onChange={(e) => updateDateRange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location (optional)</label>
              <AIEnhancedInput 
                id="location" 
                fieldName="job location"
                value={inputValues.location} 
                onChange={(e) => updateLocation(e.target.value)}
              />
            </div>
          </div>          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <span className="text-xs text-muted-foreground">
                {inputValues.description.length} characters
              </span>
            </div>
            <AIEnhancedTextarea 
              id="description" 
              fieldName="job description"
              rows={5}
              value={inputValues.description} 
              onChange={(e) => updateDescription(e.target.value)}
              placeholder="Describe your role, responsibilities, and key achievements..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentExperience.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">              <AIEnhancedInput 
                placeholder="Add new tag" 
                fieldName="skill tag"
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag}>Add</Button>
            </div>
          </div>
        </div>
      )}
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={() => handleDialogClose(false)}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={validationErrors.length > 0 || saving}
          className={validationErrors.length > 0 ? "opacity-50 cursor-not-allowed" : ""}
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
    </DialogContent>
  </Dialog>
  );
};

export default ExperienceDialog;
