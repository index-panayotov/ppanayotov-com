import { SystemSettings, UserProfile, ExperienceEntry } from "@/lib/schemas";

/**
 * Union type for all admin data types that can be saved
 */
export type AdminDataTypes = SystemSettings | ExperienceEntry[] | string[] | UserProfile;

export interface AdminData {
  experiences: ExperienceEntry[];
  topSkills: string[];
  profileData: UserProfile;
  systemSettings: SystemSettings;
}

export interface AdminDataResponse extends AdminData {
  isDev: boolean;
}

export async function loadAdminData(): Promise<AdminDataResponse> {
  // Force a fresh request to the admin API to ensure we always read
  // the latest files from /data (no caching or edge caches).
  const res = await fetch("/api/admin", { cache: 'no-store' });

  if (res.status === 403) {
    throw new Error("Admin panel is only available in development mode");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  const response = await res.json();

  // Unwrap the typed API response
  const data = response.data || response;

  // Normalize data structure
  const profileData: UserProfile = data.profileData || {
    name: "",
    title: "",
    location: "",
    email: "",
    phone: "",
    profileImageUrl: "",
    summary: "",
    languages: [],
    education: [],
    certifications: [],
    socialLinks: []
  };

  const adminData: AdminDataResponse = {
    experiences: data.experiences || [],
    topSkills: data.topSkills || [],
    profileData,
    systemSettings: data.systemSettings || {
      blogEnable: false,
      useWysiwyg: true,
      showContacts: true,
      gtagCode: "gtagCode",
      gtagEnabled: false,
      selectedTemplate: "classic",
      pwa: {}
    },
    isDev: true
  };


  return adminData;
}

export async function saveAdminData(file: string, data: AdminDataTypes): Promise<void> {
  // Normalize file name: add .ts extension if not present
  const fileName = file.endsWith('.ts') ? file : `${file}.ts`;

  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: fileName, data }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'Failed to save data');
  }
}