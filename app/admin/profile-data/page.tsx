'use client';

import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminPageWrapper } from "@/components/admin/admin-page-wrapper";
import { useAdminData } from "@/hooks/use-admin-data";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic imports for components that use browser APIs
const ProfileDataTab = dynamic(
  () => import("@/components/admin/profile-data-tab"),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> }
);

export default function ProfileDataPage() {
  const { data, loading, error, saving, handleSave, updateProfileData } = useAdminData();

  // Simplified handlers - would implement full logic
  const handleProfileFieldChange = (field: string, value: string) => {
    if (!data) return;
    const updatedData = { ...data.profileData, [field]: value };
    updateProfileData(updatedData);
  };

  return (
    <AdminPageWrapper
      loading={loading}
      error={error || (!data ? 'Failed to load profile data' : null)}
      loadingMessage="Loading profile data..."
    >
      <div className="h-full">
        <AdminNavigation
          experiencesCount={data?.experiences.length ?? 0}
          topSkillsCount={data?.topSkills.length ?? 0}
          blogPostsCount={0}
          saving={saving}
        />

        <div className="p-6">
          <ProfileDataTab
            profileData={data?.profileData ?? {} as any}
            setProfileData={updateProfileData}
            saving={saving}
            handleSave={handleSave}
            handleProfileFieldChange={handleProfileFieldChange}
            systemSettings={data?.systemSettings ?? {} as any}
            addLanguage={() => {}} // Would implement
            editLanguage={() => {}} // Would implement
            deleteLanguage={() => {}} // Would implement
            moveLanguage={() => {}} // Would implement
            addEducation={() => {}} // Would implement
            editEducation={() => {}} // Would implement
            deleteEducation={() => {}} // Would implement
            moveEducation={() => {}} // Would implement
            addCertification={() => {}} // Would implement
            editCertification={() => {}} // Would implement
            deleteCertification={() => {}} // Would implement
            moveCertification={() => {}} // Would implement
            addSocialLink={() => {}} // Would implement
            editSocialLink={() => {}} // Would implement
            deleteSocialLink={() => {}} // Would implement
            moveSocialLink={() => {}} // Would implement
          />
        </div>
      </div>
    </AdminPageWrapper>
  );
}