'use client';

import { useAdminData } from "@/hooks/use-admin-data";
import { AdminPageLayout, AdminLoadingSpinner } from "@/components/admin/admin-page-layout";
import dynamic from "next/dynamic";

// Dynamic imports for components that use browser APIs
const SettingsTab = dynamic(
  () => import("@/components/admin/settings-tab"),
  { ssr: false, loading: () => <AdminLoadingSpinner message="Loading settings..." /> }
);

export default function SettingsPage() {
  const { data, loading, error, saving, handleSave, updateSystemSettings } = useAdminData();

  return (
    <AdminPageLayout
      loading={loading}
      error={error}
      loadingMessage="Loading settings..."
      title="System Settings"
      saving={saving}
    >
      <SettingsTab
        saving={saving}
        handleSave={handleSave}
        systemSettings={data?.systemSettings || {
          blogEnable: false,
          useWysiwyg: true,
          showContacts: true,
          gtagEnabled: false,
          gtagCode: "",
          selectedTemplate: "classic" as const
        }}
        setSystemSettings={updateSystemSettings}
      />
    </AdminPageLayout>
  );
}