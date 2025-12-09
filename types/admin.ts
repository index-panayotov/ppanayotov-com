import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { UserProfile, ExperienceEntry } from "@/lib/schemas";

/**
 * Admin panel specific types and interfaces
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
