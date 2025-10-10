'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { loadAdminData, saveAdminData, AdminData } from '@/lib/admin-data-loader';
import { ExperienceEntry } from '@/types';
import { UserProfile, SystemSettings } from '@/lib/schemas';
import { getErrorMessage } from '@/lib/utils';

export function useAdminData() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check authentication. Do NOT redirect from inside a hook - allow
        // the AuthCheck component to manage navigation and UI. If not
        // authenticated, set an error so the UI can respond predictably.
        let isAuthenticated = false;
        if (typeof document !== 'undefined') {
          isAuthenticated = document.cookie.includes('admin_authenticated=true');
        }
        if (!isAuthenticated) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

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
  const handleSave = useCallback(async (file: string, newData: any) => {
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

      toast({
        title: 'Success',
        description: 'Data saved successfully',
        className: 'bg-green-50 border-green-200 text-green-800',
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setSaving(false);
    }
  }, [data, toast]);

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