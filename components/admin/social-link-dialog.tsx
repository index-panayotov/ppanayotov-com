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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AIEnhancedInput } from '@/components/admin/ai-enhanced-input';
import { SocialLink, SocialPlatform } from '@/types/profile';

interface SocialLinkDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentSocialLink: (SocialLink & { _index?: number }) | null;
  setCurrentSocialLink: (link: (SocialLink & { _index?: number }) | null) => void;
  saveSocialLink: () => void;
  saving?: boolean;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  'Facebook', 'GitHub', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube', 'Custom'
];

const SocialLinkDialog: React.FC<SocialLinkDialogProps> = ({
  open,
  setOpen,
  currentSocialLink,
  setCurrentSocialLink,
  saveSocialLink,
  saving = false,
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Stable state updater functions using useCallback
  const updateField = useCallback((field: keyof SocialLink, value: string | boolean | number) => {
    setCurrentSocialLink(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  }, [setCurrentSocialLink]);

  const updatePlatform = useCallback((value: SocialPlatform) => updateField('platform', value), [updateField]);
  const updateUrl = useCallback((value: string) => updateField('url', value), [updateField]);
  const updateLabel = useCallback((value: string) => updateField('label', value), [updateField]);
  const updateVisible = useCallback((value: boolean) => updateField('visible', value), [updateField]);
  const updateVisibleInHero = useCallback((value: boolean) => updateField('visibleInHero', value), [updateField]);

  // Memoized values for input stabilization
  const inputValues = useMemo(() => ({
    platform: currentSocialLink?.platform || 'Custom',
    url: currentSocialLink?.url || '',
    label: currentSocialLink?.label || '',
    visible: currentSocialLink?.visible || false,
    visibleInHero: currentSocialLink?.visibleInHero || false
  }), [currentSocialLink]);

  // Debounced validation to prevent excessive re-renders during typing
  useEffect(() => {
    if (!currentSocialLink) {
      setValidationErrors([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      const errors: string[] = [];
      
      if (!currentSocialLink.url?.trim()) {
        errors.push('URL is required');
      } else {
        // Basic URL validation
        try {
          new URL(currentSocialLink.url.startsWith('http') ? currentSocialLink.url : `https://${currentSocialLink.url}`);
        } catch {
          errors.push('Please enter a valid URL');
        }
      }
      
      if (currentSocialLink.platform === 'Custom' && !currentSocialLink.label?.trim()) {
        errors.push('Label is required for custom platforms');
      }

      setValidationErrors(errors);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [currentSocialLink]);

  const handleSave = () => {
    if (validationErrors.length > 0) {
      return; // Don't save if there are validation errors
    }
    if (saving) {
      return; // Prevent double-submit while saving
    }
    saveSocialLink();
  };

  // Handle dialog close with confirmation if there are unsaved changes
  const handleDialogClose = useCallback((newOpen: boolean) => {
    if (!newOpen && saving) {
      // Prevent closing while saving
      return;
    }
    
    if (!newOpen && currentSocialLink && (
      inputValues.url.trim() || 
      inputValues.label.trim() ||
      inputValues.visible ||
      inputValues.visibleInHero
    )) {
      // Show confirmation for unsaved changes
      if (window.confirm("You have unsaved changes. Are you sure you want to close without saving?")) {
        setOpen(newOpen);
      }
    } else {
      setOpen(newOpen);
    }
  }, [saving, currentSocialLink, inputValues, setOpen]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentSocialLink?._index !== undefined ? 'Edit Social Link' : 'Add New Social Link'}
          </DialogTitle>
          <DialogDescription>
            Add or edit a social media link. Use the visibility checkbox to control whether it appears on your homepage.
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

        {currentSocialLink && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="platform" className="text-sm font-medium">Platform</label>
                <Select value={inputValues.platform} onValueChange={updatePlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {inputValues.platform === 'Custom' && (
                <div className="space-y-2">
                  <label htmlFor="label" className="text-sm font-medium">Label</label>
                  <AIEnhancedInput 
                    id="label" 
                    fieldName="social platform name"
                    value={inputValues.label} 
                    onChange={(e) => updateLabel(e.target.value)}
                    placeholder="e.g., Portfolio, Blog, etc."
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">URL</label>
              <AIEnhancedInput 
                id="url" 
                fieldName={`${inputValues.platform} URL`}
                type="url"
                value={inputValues.url} 
                onChange={(e) => updateUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="visible" 
                  checked={inputValues.visible}
                  onCheckedChange={updateVisible}
                />
                <label htmlFor="visible" className="text-sm font-medium cursor-pointer">
                  Visible in contact section
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="visibleInHero" 
                  checked={inputValues.visibleInHero}
                  onCheckedChange={updateVisibleInHero}
                />
                <label htmlFor="visibleInHero" className="text-sm font-medium cursor-pointer">
                  Visible in hero section
                </label>
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
              "Save Social Link"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SocialLinkDialog;