'use client';

import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AuthCheck } from "@/components/admin/auth-check";
import { useAdminData } from "@/hooks/use-admin-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic imports for components that use browser APIs
const SettingsTab = dynamic(
  () => import("@/components/admin/settings-tab"),
  { ssr: false, loading: () => <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> }
);

export default function SettingsPage() {
  const { data, loading, error, saving, handleSave, updateSystemSettings } = useAdminData();

  if (loading) {
    return (
      <AuthCheck>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading settings...</p>
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
            <AlertDescription>{error || 'Failed to load settings'}</AlertDescription>
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
          <SettingsTab
            saving={saving}
            handleSave={handleSave}
            systemSettings={data.systemSettings}
            setSystemSettings={updateSystemSettings}
          />
        </div>
      </div>
    </AuthCheck>
  );
}