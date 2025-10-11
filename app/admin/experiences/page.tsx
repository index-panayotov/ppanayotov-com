'use client';

import { useState } from 'react';
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminPageWrapper } from "@/components/admin/admin-page-wrapper";
import { useAdminData } from "@/hooks/use-admin-data";
import { ExperienceEntry } from "@/lib/schemas";
import { logger } from "@/lib/logger";

// Extended type for admin editing with index
type ExperienceEntryWithIndex = ExperienceEntry & { _index?: number };
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


  // Handler functions (simplified - would include all the logic from handlers.ts)
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
      if (currentExperience._index !== undefined) {
        experiences[currentExperience._index] = currentExperience;
      } else {
        experiences.push(currentExperience);
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

  const deleteExperience = (index: number) => {
    if (!data) return;
    const experiences = data.experiences.filter((_, i) => i !== index);
    handleSave('cv-data', experiences as ExperienceEntry[]);
    updateExperiences(experiences as ExperienceEntry[]);
  };

  return (
    <AdminPageWrapper
      loading={loading}
      error={error || (!data ? 'Failed to load experiences data' : null)}
      loadingMessage="Loading experiences..."
    >
      <div className="h-full">
        <AdminNavigation
          experiencesCount={data?.experiences.length ?? 0}
          topSkillsCount={data?.topSkills.length ?? 0}
          blogPostsCount={0}
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
            moveExperience={() => {}} // Would implement
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