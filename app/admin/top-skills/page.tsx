'use client';

import { useState } from 'react';
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AuthCheck } from "@/components/admin/auth-check";
import { useAdminData } from "@/hooks/use-admin-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic imports for components that use browser APIs
const TopSkillsTab = dynamic(
  () => import("@/components/admin/top-skills-tab"),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> }
);

export default function TopSkillsPage() {
  const { data, loading, error, saving, handleSave, updateTopSkills } = useAdminData();
  const [editMode, setEditMode] = useState<"visual" | "json">("visual");
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

  if (loading) {
    return (
      <AuthCheck>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading top skills...</p>
          </div>
        </div>
      </AuthCheck>
    );
  }

  if (error || !data) {
    return (
      <AuthCheck>
        <div className="p-8">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Failed to load top skills data'}</AlertDescription>
          </Alert>
        </div>
      </AuthCheck>
    );
  }

  return (
    <AuthCheck>
      <div className="h-full">
        <AdminNavigation
          experiencesCount={data.experiences.length}
          topSkillsCount={data.topSkills.length}
          saving={saving}
        />

        <div className="p-6">
          <TopSkillsTab
            topSkills={data.topSkills}
            setTopSkills={updateTopSkills}
            editMode={editMode}
            setEditMode={setEditMode}
            saving={saving}
            handleSave={handleSave}
            handleTopSkillsChange={() => {}} // Would implement
            addTopSkill={addTopSkill}
            removeTopSkill={removeTopSkill}
            moveTopSkill={() => {}} // Would implement
            generateAutomaticTopSkills={generateAutomaticTopSkills}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
          />
        </div>
      </div>
    </AuthCheck>
  );
}