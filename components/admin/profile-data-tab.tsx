'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Edit, Trash2, Plus } from 'lucide-react';
import { ProfileDataTabProps } from '@/types/admin-components';
import ImageUpload from '@/components/admin/image-upload';

/**
 * Renders a user profile editing interface with both visual and JSON editing modes.
 *
 * Provides structured forms for editing basic profile information, languages, education, and certifications, as well as a JSON editor for advanced editing. Supports adding, editing, deleting, and reordering list items, and allows profile image uploads. All data changes and persistence actions are delegated to handler functions provided via props.
 *
 * @param profileData - The current user profile data to display and edit.
 * @param setProfileData - Updates the profile data state.
 * @param editMode - The current editing mode, either "visual" or "json".
 * @param setEditMode - Changes the editing mode.
 * @param saving - Indicates whether a save operation is in progress.
 * @param handleSave - Invoked to persist the profile data.
 * @param handleProfileDataChange - Handles changes in the JSON editor.
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
  editMode,
  setEditMode,
  saving,
  handleSave,
  handleProfileDataChange,
  handleProfileFieldChange,
  addLanguage,
  editLanguage,
  deleteLanguage,
  moveLanguage,
  addEducation,
  editEducation,
  deleteEducation,
  moveEducation,
  addCertification,
  editCertification,
  deleteCertification,
  moveCertification
}: ProfileDataTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Profile Data</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setEditMode(editMode === 'visual' ? 'json' : 'visual')}
          >
            Switch to {editMode === 'visual' ? 'JSON' : 'Visual'} Editor
          </Button>
          <Button 
            onClick={() => handleSave('user-profile.ts', profileData)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile Data'}
          </Button>
        </div>
      </div>

      {editMode === 'json' ? (
        <Textarea 
          className="font-mono h-[70vh]"
          value={JSON.stringify(profileData, null, 2)}
          onChange={handleProfileDataChange}
        />
      ) : (
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
                <div className="grid grid-cols-2 gap-4">                <div className="space-y-2">
                  <label htmlFor="linkedin" className="text-sm font-medium">LinkedIn</label>
                  <AIEnhancedInput 
                    id="linkedin" 
                    fieldName="LinkedIn URL"
                    value={profileData.linkedin || ''} 
                    onChange={(e) => handleProfileFieldChange('linkedin', e.target.value)}
                  />
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
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Languages, Education, and Certifications</CardTitle>
              <CardDescription>For detailed editing of these sections, use the JSON editor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Languages</h3>
                  <Button onClick={addLanguage} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Language
                  </Button>
                </div>
                <div className="space-y-2">
                  {profileData.languages?.map((lang: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{lang.name}</span>
                        <Badge variant="outline" className="text-xs">{lang.proficiency}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveLanguage(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveLanguage(index, 'down')}
                          disabled={!profileData.languages || index === profileData.languages.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editLanguage(lang, index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteLanguage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!profileData.languages?.length && <p className={`text-sm ${adminClassNames.text.muted}`}>No languages added</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Education</h3>
                  <Button onClick={addEducation} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Education
                  </Button>
                </div>
                <div className="space-y-2">
                  {profileData.education?.map((edu: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{edu.institution}</p>
                        <p className="text-sm">{edu.degree}, {edu.field}</p>
                        <p className={`text-xs ${adminClassNames.text.muted}`}>{edu.dateRange}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveEducation(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveEducation(index, 'down')}
                          disabled={!profileData.education || index === profileData.education.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editEducation(edu, index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteEducation(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!profileData.education?.length && <p className={`text-sm ${adminClassNames.text.muted}`}>No education entries added</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Certifications</h3>
                  <Button onClick={addCertification} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Certification
                  </Button>
                </div>
                <div className="space-y-2">
                  {profileData.certifications?.map((cert: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        {cert.issuer && <p className="text-sm">{cert.issuer}</p>}
                        {cert.date && <p className={`text-xs ${adminClassNames.text.muted}`}>{cert.date}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveCertification(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveCertification(index, 'down')}
                          disabled={!profileData.certifications || index === profileData.certifications.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editCertification(cert, index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteCertification(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!profileData.certifications?.length && <p className={`text-sm ${adminClassNames.text.muted}`}>No certifications added</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
