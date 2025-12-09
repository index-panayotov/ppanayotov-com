'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const updateProfileData = useCallback((profileData: UserProfile) => {
    setData(prev => prev ? { ...prev, profileData } : null);
  }, []);

  const updateSystemSettings = useCallback((systemSettings: SystemSettings) => {
    setData(prev => prev ? { ...prev, systemSettings } : null);
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
  };
}