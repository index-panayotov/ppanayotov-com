'use client';


import { Button } from '@/components/ui/button';

import { AIEnhancedInput } from '@/components/admin/ai-enhanced-input';
import { AIEnhancedTextarea } from '@/components/admin/ai-enhanced-textarea';
import { adminClassNames } from './design-system';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ProfileDataTabProps } from '@/types/admin-components';
import ImageUpload from '@/components/admin/image-upload';

/**
 * Renders a user profile editing interface with visual editing forms.
 *
 * Provides structured forms for editing basic profile information, languages, education, and certifications. Supports adding, editing, deleting, and reordering list items, and allows profile image uploads. All data changes and persistence actions are delegated to handler functions provided via props.
 *
 * @param profileData - The current user profile data to display and edit.
 * @param setProfileData - Updates the profile data state.
 * @param saving - Indicates whether a save operation is in progress.
 * @param handleSave - Invoked to persist the profile data.
 * @param handleProfileFieldChange - Handles changes to individual profile fields in the visual editor.
 * @param addLanguage - Adds a new language entry.
 * @param editLanguage - Edits an existing language entry.
 * @param deleteLanguage - Deletes a language entry.
 * @param moveLanguage - Moves a language entry up or down in the list.
 * @param addEducation - Adds a new education entry.
 * @param editEducation - Edits an existing education entry.
 * @param deleteEducation - Deletes an education entry.
 * @param moveEducation - Moves an education entry up or down in the list.
 * @param addCertification - Adds a new certification entry.
 * @param editCertification - Edits an existing certification entry.
 * @param deleteCertification - Deletes a certification entry.
 * @param moveCertification - Moves a certification entry up or down in the list.
 *
 * @remark The component does not perform internal validation or error handling; all data management is handled externally via the provided handler functions.
 */
export default function ProfileDataTab({
  profileData,
  setProfileData,
  saving,
  handleSave,
  systemSettings,
  handleProfileFieldChange
}: ProfileDataTabProps) {
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">
            Update your personal information, education, and certifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              handleSave('user-profile.ts', profileData);
            }}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile Data'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <AIEnhancedInput 
                    id="name" 
                    value={profileData.name || ''}
                    fieldName="name" 
                    onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <AIEnhancedInput 
                    id="title" 
                    value={profileData.title || ''}
                    fieldName="professional title" 
                    onChange={(e) => handleProfileFieldChange('title', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">Location</label>
                  <AIEnhancedInput 
                    id="location" 
                    fieldName="location"
                    value={profileData.location || ''} 
                    onChange={(e) => handleProfileFieldChange('location', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <AIEnhancedInput 
                    id="email" 
                    fieldName="email"
                    type="email"
                    value={profileData.email || ''} 
                    onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                  />
                </div>
              </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <AIEnhancedInput
                    id="phone"
                    fieldName="phone"
                    type="tel"
                    value={profileData.phone || ''}
                    onChange={(e) => handleProfileFieldChange('phone', e.target.value)}
                  />
                </div>

              {/* Profile Image Upload Section */}
              <ImageUpload
                currentImageUrl={profileData.profileImageUrl || ''}
                currentWebUrl={profileData.profileImageWebUrl}
                currentPdfUrl={profileData.profileImagePdfUrl}                onImageChange={(imageUrl, webUrl, pdfUrl) => {
                  // Update all image fields in a single state update
                  setProfileData({
                    ...profileData,
                    profileImageUrl: imageUrl,
                    profileImageWebUrl: webUrl || '',
                    profileImagePdfUrl: pdfUrl || ''
                  });
                }}
              />
                <div className="space-y-2">
                <label htmlFor="summary" className="text-sm font-medium">Summary</label>
                <AIEnhancedTextarea
                  id="summary"
                  fieldName="professional summary"
                  rows={5}
                  value={profileData.summary || ''}
                  onChange={(e) => handleProfileFieldChange('summary', e.target.value)}
                  systemSettings={systemSettings}
                />
              </div>
            </CardContent>
          </Card>
          

          

        </div>
    </div>
  );
}
