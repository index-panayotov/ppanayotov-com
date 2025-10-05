'use client';

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AuthCheck } from "@/components/admin/auth-check";
import { useAdminData } from "@/hooks/use-admin-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
  const { data, loading, error, saving } = useAdminData();

  if (loading) {
    return (
      <AuthCheck>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
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
            <AlertDescription>{error || 'Failed to load dashboard data'}</AlertDescription>
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
          <AdminDashboard
            experiences={data.experiences}
            topSkills={data.topSkills}
            profileData={data.profileData}
          />
        </div>
      </div>
    </AuthCheck>
  );
}