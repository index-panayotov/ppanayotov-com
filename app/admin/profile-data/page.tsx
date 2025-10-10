'use client';


import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AuthCheck } from "@/components/admin/auth-check";
import { useAdminData } from "@/hooks/use-admin-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

  if (loading) {
    return (
      <AuthCheck>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading profile data...</p>
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
            <AlertDescription>{error || 'Failed to load profile data'}</AlertDescription>
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
          blogPostsCount={0}
          saving={saving}
        />

        <div className="p-6">
          <ProfileDataTab
            profileData={data.profileData}
            setProfileData={updateProfileData}
            saving={saving}
            handleSave={handleSave}
            handleProfileFieldChange={handleProfileFieldChange}
            systemSettings={data.systemSettings}
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
    </AuthCheck>
  );
}