'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { SocialLink, SocialPlatform } from '@/lib/schemas';
import { SocialLinkDialogProps } from '@/types/admin-components';
import {
  getAvailablePlatforms,
  getPlatformDefinition,
  detectPlatformFromUrl,
  validateSocialUrl,
  getSocialIcon
} from '@/lib/social-platforms';

// Platform key mappings - centralized to avoid duplication
const PLATFORM_MAP: Record<string, SocialPlatform> = {
  facebook: 'Facebook',
  github: 'GitHub',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  medium: 'Medium',
  devto: 'DevTo',
  stackoverflow: 'StackOverflow',
  discord: 'Discord',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  mastodon: 'Mastodon',
  threads: 'Threads',
  custom: 'Custom'
};

// Inverse mapping: PascalCase -> lowercase (for validation)
const PLATFORM_KEY_MAP: Record<SocialPlatform, string> = {
  'Facebook': 'facebook',
  'GitHub': 'github',
  'Twitter': 'twitter',
  'LinkedIn': 'linkedin',
  'Instagram': 'instagram',
  'YouTube': 'youtube',
  'TikTok': 'tiktok',
  'Medium': 'medium',
  'DevTo': 'devto',
  'StackOverflow': 'stackoverflow',
  'Discord': 'discord',
  'Telegram': 'telegram',
  'WhatsApp': 'whatsapp',
  'Mastodon': 'mastodon',
  'Threads': 'threads',
  'Custom': 'custom'
};

// Get platforms from configuration system
const SOCIAL_PLATFORMS: SocialPlatform[] = getAvailablePlatforms().map(key =>
  PLATFORM_MAP[key] || 'Custom'
);

const SocialLinkDialog: React.FC<SocialLinkDialogProps> = ({
  open,
  setOpen,
  currentSocialLink,
  setCurrentSocialLink,
  saveSocialLink,
  saving = false,
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationSuggestion, setValidationSuggestion] = useState<string>('');

  // Capture initial snapshot when dialog opens for unsaved changes detection
  const initialLinkRef = useRef<{
    platform: SocialPlatform;
    url: string;
    label: string;
    visible: boolean;
    visibleInHero: boolean;
  } | null>(null);

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

  const updateUrl = useCallback((value: string) => {
    updateField('url', value);

    // Auto-detect platform from URL
    if (value && !currentSocialLink?.platform) {
      const detectedPlatform = detectPlatformFromUrl(value);
      if (detectedPlatform) {
        const mappedPlatform = PLATFORM_MAP[detectedPlatform];
        if (mappedPlatform) {
          updateField('platform', mappedPlatform);
        }
      }
    }
  }, [updateField, currentSocialLink?.platform]);

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

  // Capture initial snapshot when dialog opens
  useEffect(() => {
    if (open) {
      initialLinkRef.current = {
        platform: currentSocialLink?.platform || 'Custom',
        url: currentSocialLink?.url || '',
        label: currentSocialLink?.label || '',
        visible: currentSocialLink?.visible || false,
        visibleInHero: currentSocialLink?.visibleInHero || false
      };
    }
  }, [open, currentSocialLink]);

  // Debounced validation using the new platform system
  useEffect(() => {
    if (!currentSocialLink) {
      setValidationErrors([]);
      setValidationSuggestion('');
      return;
    }

    const timeoutId = setTimeout(() => {
      const errors: string[] = [];
      let suggestion = '';

      // Platform-specific validation
      if (currentSocialLink.url?.trim()) {
        // Convert PascalCase platform names to lowercase keys for validation
        const platformKey = PLATFORM_KEY_MAP[currentSocialLink.platform] || 'custom';
        const validation = validateSocialUrl(platformKey, currentSocialLink.url);

        if (!validation.isValid && validation.error) {
          errors.push(validation.error);
          if (validation.suggestion) {
            suggestion = validation.suggestion;
          }
        }
      } else {
        errors.push('URL is required');
      }

      // Custom platform label validation
      if (currentSocialLink.platform === 'Custom' && !currentSocialLink.label?.trim()) {
        errors.push('Label is required for custom platforms');
      }

      setValidationErrors(errors);
      setValidationSuggestion(suggestion);
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

    // Check if any field has changed from initial values
    if (!newOpen && initialLinkRef.current) {
      const hasChanges = (
        inputValues.platform !== initialLinkRef.current.platform ||
        inputValues.url.trim() !== initialLinkRef.current.url.trim() ||
        inputValues.label.trim() !== initialLinkRef.current.label.trim() ||
        inputValues.visible !== initialLinkRef.current.visible ||
        inputValues.visibleInHero !== initialLinkRef.current.visibleInHero
      );

      if (hasChanges) {
        // Show confirmation for unsaved changes
        if (window.confirm("You have unsaved changes. Are you sure you want to close without saving?")) {
          setOpen(newOpen);
        }
        return;
      }
    }

    setOpen(newOpen);
  }, [saving, inputValues, setOpen]);

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
              {validationSuggestion && (
                <p className="mt-2 text-sm font-medium">
                  💡 {validationSuggestion}
                </p>
              )}
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
                    <SelectValue placeholder="Select a platform">
                      {inputValues.platform && (
                        <div className="flex items-center gap-2">
                          {getSocialIcon(inputValues.platform.toLowerCase(), "h-4 w-4")}
                          <span>{inputValues.platform}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        <div className="flex items-center gap-2">
                          {getSocialIcon(platform.toLowerCase(), "h-4 w-4")}
                          <span>{platform}</span>
                        </div>
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
                placeholder={
                  getPlatformDefinition(inputValues.platform.toLowerCase())?.placeholder || "https://..."
                }
              />
              {inputValues.platform && getPlatformDefinition(inputValues.platform.toLowerCase()) && (
                <p className="text-xs text-gray-600">
                  {getPlatformDefinition(inputValues.platform.toLowerCase())?.helpText}
                </p>
              )}
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