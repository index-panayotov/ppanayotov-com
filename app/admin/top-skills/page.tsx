'use client';

import { useState } from 'react';
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminPageWrapper } from "@/components/admin/admin-page-wrapper";
import { useAdminData } from "@/hooks/use-admin-data";
import { logger } from "@/lib/logger";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic imports for components that use browser APIs
const TopSkillsTab = dynamic(
  () => import("@/components/admin/top-skills-tab"),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> }
);

export default function TopSkillsPage() {
  const { data, loading, error, saving, handleSave, updateTopSkills } = useAdminData();
  const [newSkill, setNewSkill] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);


  const addTopSkill = async () => {
    if (!newSkill.trim() || !data) return;

    const skillToAdd = newSkill.trim();
    const newTopSkills = [...data.topSkills, skillToAdd];

    try {
      // Persist to backend first
      await handleSave('topSkills', newTopSkills);

      // Only update state after successful save
      updateTopSkills(newTopSkills);
      setNewSkill("");
    } catch (err) {
      logger.error('Failed to add top skill', err as Error, {
        component: 'TopSkillsPage',
        action: 'addTopSkill',
        skill: skillToAdd
      });
    }
  };

  const removeTopSkill = async (skill: string) => {
    if (!data) return;

    const newTopSkills = data.topSkills.filter(s => s !== skill);
    const previousTopSkills = data.topSkills;

    try {
      // Optimistic update: immediately update local state
      updateTopSkills(newTopSkills);

      // Persist to backend
      await handleSave('topSkills', newTopSkills);
    } catch (err) {
      // Rollback on error: restore previous state
      updateTopSkills(previousTopSkills);

      logger.error('Failed to remove top skill', err as Error, {
        component: 'TopSkillsPage',
        action: 'removeTopSkill',
        skill
      });
    }
  };

  const generateAutomaticTopSkills = async () => {
    if (!data) return;

    setIsGenerating(true);
    const previousTopSkills = data.topSkills;

    // Collect all tags and technologies from experiences to send for analysis
    const experienceTexts = data.experiences.flatMap(exp => [
      ...(exp.tags || []),
      ...(exp.technologies || [])
    ]).filter(Boolean);

    // Collect job descriptions for better context
    const jobDescriptions = data.experiences.map(exp => exp.description).filter(Boolean) as string[];

    try {
      const response = await fetch('/api/admin/autoskills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ experienceTexts, jobDescriptions }),
      });

      if (!response.ok) {
        const errorMsg = `Failed to generate automatic top skills: ${response.statusText}`;
        logger.error(errorMsg, new Error(errorMsg), {
          component: 'TopSkillsPage',
          action: 'generateAutomaticTopSkills',
          status: response.status
        });
        return;
      }

      const result = await response.json();
      
      // Extract skills from response data (wrapped in 'data' property)
      // and handle object structure { name, frequency, confidence }
      const rawSkills = result.data?.skills || [];
      let skills = Array.isArray(rawSkills) 
        ? rawSkills.map((s: any) => typeof s === 'string' ? s : s.name) 
        : [];

      console.log("Extracted skills:", skills);

      // Ensure skills are unique and trimmed
      skills = Array.from(new Set(skills.map((s: string) => s.trim()))).filter(Boolean);

      // Persist to backend first
      await handleSave('topSkills', skills);

      // Only update state after successful save
      updateTopSkills(skills);
    } catch (err) {
      logger.error('Error generating automatic top skills', err as Error, {
        component: 'TopSkillsPage',
        action: 'generateAutomaticTopSkills'
      });
      // Keep UI unchanged on error (don't update state)
    } finally {
      setIsGenerating(false);
    }
  };

  const moveTopSkill = async (index: number, direction: "up" | "down") => {
    if (!data) return;

    const newTopSkills = [...data.topSkills];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newTopSkills.length) {
      return; // Invalid move, exit early
    }

    const [movedSkill] = newTopSkills.splice(index, 1);
    newTopSkills.splice(newIndex, 0, movedSkill);

    const previousTopSkills = data.topSkills;

    try {
      // Optimistic update: immediately update local state
      updateTopSkills(newTopSkills);

      // Persist to backend
      await handleSave('topSkills', newTopSkills);
    } catch (err) {
      // Rollback on error: restore previous state
      updateTopSkills(previousTopSkills);

      logger.error('Failed to move top skill', err as Error, {
        component: 'TopSkillsPage',
        action: 'moveTopSkill',
        skill: movedSkill,
        direction
      });
    }
  };

  return (
    <AdminPageWrapper
      loading={loading}
      error={error || (!data ? 'Failed to load top skills data' : null)}
      loadingMessage="Loading top skills..."
    >
      <div className="h-full">
        <AdminNavigation
          saving={saving}
        />

        <div className="p-6">
          <TopSkillsTab
            topSkills={data?.topSkills ?? []}
            saving={saving}
            handleSave={handleSave}
            addTopSkill={addTopSkill}
            removeTopSkill={removeTopSkill}
            moveTopSkill={moveTopSkill}
            generateAutomaticTopSkills={generateAutomaticTopSkills}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </AdminPageWrapper>
  );
}