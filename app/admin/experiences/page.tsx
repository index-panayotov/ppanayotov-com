'use client';

import { useState } from 'react';
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminPageWrapper } from "@/components/admin/admin-page-wrapper";
import { useAdminData } from "@/hooks/use-admin-data";
import { ExperienceEntry } from "@/lib/schemas";
import { logger } from "@/lib/logger";

import type { ExperienceEntryWithIndex } from '@/lib/handlers/types';
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic imports for components that use browser APIs
const ExperiencesTab = dynamic(
  () => import("@/components/admin/experiences-tab"),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> }
);

const ExperienceDialog = dynamic(
  () => import("@/components/admin/experience-dialog"),
  { ssr: false }
);

export default function ExperiencesPage() {
  const { data, loading, error, saving, handleSave, updateExperiences } = useAdminData();
  const [currentExperience, setCurrentExperience] = useState<ExperienceEntryWithIndex | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");



  const addExperience = () => {
    setCurrentExperience({
      title: "",
      company: "",
      dateRange: "",
      location: "",
      description: "",
      tags: [],
      isCurrentRole: false,
      achievements: [],
      technologies: []
    });
    setDialogOpen(true);
  };

  const editExperience = (exp: ExperienceEntry, index: number) => {
    setCurrentExperience({ ...exp, _index: index });
    setDialogOpen(true);
  };

  const saveExperience = async () => {
    if (!currentExperience || !data) return;

    try {
      const experiences = [...data.experiences];
      const experienceToSave = { ...currentExperience }; // Shallow copy
      delete experienceToSave._index; // Delete _index

      if (currentExperience._index !== undefined) {
        experiences[currentExperience._index] = experienceToSave; // Use the copy
      } else {
        experiences.push(experienceToSave); // Use the copy
      }

      await handleSave('cv-data', experiences as ExperienceEntry[]);
      updateExperiences(experiences as ExperienceEntry[]);
      setDialogOpen(false);
      setCurrentExperience(null);
    } catch (err) {
      logger.error('Failed to save experience', err as Error, {
        component: 'ExperiencesPage',
        action: 'saveExperience'
      });
    }
  };

  const deleteExperience = async (index: number) => {
    if (!data) return;

    // Compute new experiences array (filter out the deleted item)
    const newExperiences = data.experiences.filter((_, i) => i !== index);

    // Store previous data snapshot for rollback
    const previousExperiences = data.experiences;

    try {
      // Optimistic update: immediately update local state
      updateExperiences(newExperiences as ExperienceEntry[]);

      // Persist to backend
      await handleSave('cv-data', newExperiences as ExperienceEntry[]);
    } catch (err) {
      // Rollback on error: restore previous state
      updateExperiences(previousExperiences as ExperienceEntry[]);

      logger.error('Failed to delete experience', err as Error, {
        component: 'ExperiencesPage',
        action: 'deleteExperience'
      });
    }
  };

  const moveExperience = async (index: number, direction: "up" | "down") => {
    if (!data) return;

    try {
      const experiences = [...data.experiences];
      const newIndex = direction === "up" ? index - 1 : index + 1;

      if (newIndex >= 0 && newIndex < experiences.length) {
        const [movedExperience] = experiences.splice(index, 1);
        experiences.splice(newIndex, 0, movedExperience);
        await handleSave('cv-data', experiences as ExperienceEntry[]);
        updateExperiences(experiences as ExperienceEntry[]); // Keep updateExperiences for optimistic UI update
      }
    } catch (err) {
      logger.error('Failed to move experience', err as Error, {
        component: 'ExperiencesPage',
        action: 'moveExperience'
      });
    }
  };

  return (
    <AdminPageWrapper
      loading={loading}
      error={error || (!data ? 'Failed to load experiences data' : null)}
      loadingMessage="Loading experiences..."
    >
      <div className="h-full">
        <AdminNavigation
          saving={saving}
        />

        <div className="p-6">
          <ExperiencesTab
            experiences={data?.experiences ?? []}
            saving={saving}
            handleSave={handleSave}
            addExperience={addExperience}
            editExperience={editExperience}
            deleteExperience={deleteExperience}
            moveExperience={moveExperience}
          />
        </div>

        <ExperienceDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          currentExperience={currentExperience}
          setCurrentExperience={setCurrentExperience}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          saveExperience={saveExperience}
          saving={saving}
          systemSettings={data?.systemSettings ?? {} as any}
        />
      </div>
    </AdminPageWrapper>
  );
}