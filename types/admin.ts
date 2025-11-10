import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import {
  SystemSettings,
  UserProfile,
  Language,
  EducationEntry as Education,
  Certification,
  ExperienceEntry
} from "@/lib/schemas";

/**
 * Admin panel specific types and interfaces
 *
 * Note: Core data types (UserProfile, Language, Education, Certification, LanguageProficiency)
 * are imported from @/lib/schemas to avoid duplication and ensure consistency.
 */

// Navigation and sidebar types
export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export interface AdminSidebarProps {
  onLogout: () => void;
}

// Dashboard specific types
export interface DashboardStats {
  experiences: number;
  topSkills: number;
  languages: number;
  education: number;
  certifications: number;
  lastUpdated: string;
  totalWords: number;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  action: () => void;
  color: string;
}



export interface AdminDashboardProps {
  experiences: ExperienceEntry[];
  topSkills: string[];
  profileData: UserProfile;
}

// Experience management types - imported from schemas for consistency
export type { ExperienceEntry } from "@/lib/schemas";

// Admin component prop types
// Note: TopSkillsTabProps, ProfileDataTabProps, and ExperiencesTabProps are now
// defined in @/types/admin-components.ts to avoid duplication

// Dialog and form types
export interface ExperienceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentExperience: (ExperienceEntry & { _index?: number }) | null;
  setCurrentExperience: (exp: (ExperienceEntry & { _index?: number }) | null) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  saveExperience: (experienceData: ExperienceEntry & { _index?: number }) => Promise<void>;
  saving?: boolean;
  systemSettings: SystemSettings;
}

export interface LanguageDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentLanguage: (Language & { _index?: number }) | null;
  setCurrentLanguage: (lang: (Language & { _index?: number }) | null) => void;
  saveLanguage: () => void;
}

export interface EducationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentEducation: (Education & { _index?: number }) | null;
  setCurrentEducation: (edu: (Education & { _index?: number }) | null) => void;
  saveEducation: () => void;
}

export interface CertificationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentCertification: (Certification & { _index?: number }) | null;
  setCurrentCertification: (cert: (Certification & { _index?: number }) | null) => void;
  saveCertification: () => void;
}

// Theme types
export type Theme = "light" | "dark" | "system";

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

// API response types
export interface AdminApiResponse {
  experiences: ExperienceEntry[];
  topSkills: string[];
  profileData: UserProfile;
}

export interface SaveResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AIResponse {
  response: string;
  success: boolean;
  error?: string;
}