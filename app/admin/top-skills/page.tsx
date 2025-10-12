'use client';

import { useState } from 'react';
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminPageWrapper } from "@/components/admin/admin-page-wrapper";
import { useAdminData } from "@/hooks/use-admin-data";
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


  const addTopSkill = () => {
    if (!newSkill.trim() || !data) return;
    const topSkills = [...data.topSkills, newSkill.trim()];
    handleSave('topSkills.ts', topSkills);
    updateTopSkills(topSkills);
    setNewSkill("");
  };

  const removeTopSkill = (skill: string) => {
    if (!data) return;
    const topSkills = data.topSkills.filter(s => s !== skill);
    handleSave('topSkills.ts', topSkills);
    updateTopSkills(topSkills);
  };

  const generateAutomaticTopSkills = async () => {
    if (!data) return;
    // Simplified - would extract skills from experiences
    const skills = ["JavaScript", "React", "Node.js", "TypeScript"];
    handleSave('topSkills.ts', skills);
    updateTopSkills(skills);
  };

  const moveTopSkill = (index: number, direction: "up" | "down") => {
    if (!data) return;
    const topSkills = [...data.topSkills];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < topSkills.length) {
      const [movedSkill] = topSkills.splice(index, 1);
      topSkills.splice(newIndex, 0, movedSkill);
      handleSave('topSkills.ts', topSkills);
      updateTopSkills(topSkills);
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
          />
        </div>
      </div>
    </AdminPageWrapper>
  );
}