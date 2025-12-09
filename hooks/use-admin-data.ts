'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loadAdminData, saveAdminData, AdminData, AdminDataTypes } from '@/lib/admin-data-loader';
import { ExperienceEntry } from '@/types';
import { UserProfile, SystemSettings } from '@/lib/schemas';
import { getErrorMessage } from '@/lib/utils';

export function useAdminData() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Ref always has the latest data - no stale closure issues
  const dataRef = useRef<AdminData | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // SECURITY: Authentication is now handled by server-side middleware
        // If the user has reached this point, they are authenticated
        // (middleware would have redirected them to /admin/login otherwise)
        // No need to check cookies client-side

        const adminData = await loadAdminData();
        setData(adminData);
      } catch (err) {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Save data function
  const handleSave = useCallback(async (file: string, newData: AdminDataTypes) => {
    if (!data) return;

    try {
      setSaving(true);
      await saveAdminData(file, newData);

      // Update local state
      setData(prev => {
        if (!prev) return prev;

        switch (file) {
          case 'cv-data':
            return { ...prev, experiences: newData };
          case 'topSkills':
            return { ...prev, topSkills: newData };
          case 'user-profile':
            return { ...prev, profileData: newData };
          case 'system_settings':
            return { ...prev, systemSettings: newData };
          default:
            return prev;
        }
      });

      toast.success('Success', {
        description: 'Data saved successfully',
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save';
      toast.error('Error', {
        description: errorMsg,
      });
      throw err;
    } finally {
      setSaving(false);
    }
  }, [data]);

  // Update functions for specific data types
  const updateExperiences = useCallback((experiences: ExperienceEntry[]) => {
    setData(prev => prev ? { ...prev, experiences } : null);
  }, []);

  const updateTopSkills = useCallback((topSkills: string[]) => {
    setData(prev => prev ? { ...prev, topSkills } : null);
  }, []);

  const updateProfileData = useCallback((
    profileDataOrUpdater: UserProfile | ((prev: UserProfile) => UserProfile)
  ) => {
    setData(prev => {
      if (!prev) return null;
      const newProfileData = typeof profileDataOrUpdater === 'function'
        ? profileDataOrUpdater(prev.profileData)
        : profileDataOrUpdater;
      return { ...prev, profileData: newProfileData };
    });
  }, []);

  const updateSystemSettings = useCallback((systemSettings: SystemSettings) => {
    setData(prev => prev ? { ...prev, systemSettings } : null);
  }, []);

  // Specialized save function that reads from current state
  // This avoids stale closure issues where the caller passes old data
  const saveProfileData = useCallback(async () => {
    // Use a ref-like pattern: read current state via setState callback
    return new Promise<void>((resolve, reject) => {
      setData(currentData => {
        if (!currentData) {
          reject(new Error('No data to save'));
          return currentData;
        }

        // Perform the save with the CURRENT state
        setSaving(true);
        saveAdminData('user-profile.ts', currentData.profileData)
          .then(() => {
            toast.success('Success', {
              description: 'Profile data saved successfully',
            });
            resolve();
          })
          .catch((err) => {
            const errorMsg = err instanceof Error ? err.message : 'Failed to save';
            toast.error('Error', {
              description: errorMsg,
            });
            reject(err);
          })
          .finally(() => {
            setSaving(false);
          });

        // Return unchanged state (we're just reading it)
        return currentData;
      });
    });
  }, []);

  // Save profile with explicit image data - uses ref for latest data
  const saveProfileWithImage = useCallback(async (imageData: {
    profileImageUrl: string;
    profileImageWebUrl: string;
    profileImagePdfUrl: string;
    profileImageUpdatedAt?: number;
  }) => {
    const currentData = dataRef.current;
    if (!currentData) {
      console.error('No data available');
      return;
    }

    // Merge current profile with new image data
    const updatedProfile: UserProfile = {
      ...currentData.profileData,
      ...imageData,
    };

    console.log('=== AUTO-SAVE AFTER UPLOAD ===');
    console.log('New profile data:', updatedProfile);
    console.log('profileImageWebUrl:', updatedProfile.profileImageWebUrl);
    console.log('profileImagePdfUrl:', updatedProfile.profileImagePdfUrl);

    // Save directly
    setSaving(true);
    try {
      await saveAdminData('user-profile.ts', updatedProfile);

      // Update local state to match
      setData(prev => prev ? { ...prev, profileData: updatedProfile } : null);

      toast.success('Success', {
        description: 'Profile image saved successfully',
      });
    } catch (err) {
      toast.error('Error', {
        description: err instanceof Error ? err.message : 'Failed to save',
      });
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    saving,
    handleSave,
    updateExperiences,
    updateTopSkills,
    updateProfileData,
    updateSystemSettings,
    saveProfileData,
    saveProfileWithImage,
  };
}