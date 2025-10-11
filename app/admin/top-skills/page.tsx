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

  // Handler functions (simplified)
  const addTopSkill = () => {
    if (!newSkill.trim() || !data) return;
    const topSkills = [...data.topSkills, newSkill.trim()];
    handleSave('topSkills', topSkills);
    updateTopSkills(topSkills);
    setNewSkill("");
  };

  const removeTopSkill = (skill: string) => {
    if (!data) return;
    const topSkills = data.topSkills.filter(s => s !== skill);
    handleSave('topSkills', topSkills);
    updateTopSkills(topSkills);
  };

  const generateAutomaticTopSkills = async () => {
    if (!data) return;
    // Simplified - would extract skills from experiences
    const skills = ["JavaScript", "React", "Node.js", "TypeScript"];
    handleSave('topSkills', skills);
    updateTopSkills(skills);
  };

  return (
    <AdminPageWrapper
      loading={loading}
      error={error || (!data ? 'Failed to load top skills data' : null)}
      loadingMessage="Loading top skills..."
    >
      <div className="h-full">
        <AdminNavigation
          experiencesCount={data?.experiences.length ?? 0}
          topSkillsCount={data?.topSkills.length ?? 0}
          blogPostsCount={0}
          saving={saving}
        />

        <div className="p-6">
          <TopSkillsTab
            topSkills={data?.topSkills ?? []}
            saving={saving}
            handleSave={handleSave}
            addTopSkill={addTopSkill}
            removeTopSkill={removeTopSkill}
            moveTopSkill={() => {}} // Would implement
            generateAutomaticTopSkills={generateAutomaticTopSkills}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
          />
        </div>
      </div>
    </AdminPageWrapper>
  );
}