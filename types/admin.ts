import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

/**
 * Admin panel specific types and interfaces
 */

// User profile data structure
export interface UserProfile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone?: string;
  linkedin?: string;
  profileImage?: string;
  profileImageUrl?: string;
  profileImageWebUrl?: string;
  profileImagePdfUrl?: string;
  summary: string;
  languages: Language[];
  education: Education[];
  certifications: Certification[];
}

export interface Language {
  name: string;
  proficiency: LanguageProficiency;
}

export type LanguageProficiency = 
  | "Beginner" 
  | "Intermediate" 
  | "Advanced" 
  | "Fluent" 
  | "Native";

export interface Education {
  institution: string;
  degree: string;
  field: string;
  dateRange: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  date?: string;
}

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
  completionScore: number;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  action: () => void;
  color: string;
}

export interface ActivityItem {
  action: string;
  time: string;
  type: 'experience' | 'skill' | 'ai' | 'certification' | 'education' | 'profile';
}

export interface AdminDashboardProps {
  experiences: ExperienceEntry[];
  topSkills: string[];
  profileData: UserProfile;
}

// Experience management types
export interface ExperienceEntry {
  title: string;
  company: string;
  dateRange: string;
  location?: string;
  description: string;
  tags: string[];
}

// Admin component prop types
export interface AdminTabProps {
  editMode: "visual" | "json";
  setEditMode: (mode: "visual" | "json") => void;
  saving: boolean;
  handleSave: (file: string, data: any) => Promise<void>;
}

export interface ExperiencesTabProps extends AdminTabProps {
  experiences: ExperienceEntry[];
  setExperiences: (experiences: ExperienceEntry[]) => void;
  handleExperiencesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  addExperience: () => void;
  editExperience: (exp: ExperienceEntry, index: number) => void;
  deleteExperience: (index: number) => void;
  moveExperience: (index: number, direction: "up" | "down") => void;
}

export interface TopSkillsTabProps extends AdminTabProps {
  topSkills: string[];
  setTopSkills: (skills: string[]) => void;
  handleTopSkillsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  addTopSkill: () => void;
  removeTopSkill: (skill: string) => void;
  moveTopSkill: (index: number, direction: "up" | "down") => void;
  generateAutomaticTopSkills: () => Promise<void>;
  newSkill: string;
  setNewSkill: (skill: string) => void;
}

export interface ProfileDataTabProps extends AdminTabProps {
  profileData: UserProfile;
  setProfileData: (data: UserProfile) => void;
  handleProfileDataChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleProfileFieldChange: (field: string, value: string) => void;
  addLanguage: () => void;
  editLanguage: (lang: Language, index: number) => void;
  deleteLanguage: (index: number) => void;
  moveLanguage: (index: number, direction: "up" | "down") => void;
  addEducation: () => void;
  editEducation: (edu: Education, index: number) => void;
  deleteEducation: (index: number) => void;
  moveEducation: (index: number, direction: "up" | "down") => void;
  addCertification: () => void;
  editCertification: (cert: Certification, index: number) => void;
  deleteCertification: (index: number) => void;
  moveCertification: (index: number, direction: "up" | "down") => void;
}

// Dialog and form types
export interface ExperienceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentExperience: (ExperienceEntry & { _index?: number }) | null;
  setCurrentExperience: (exp: (ExperienceEntry & { _index?: number }) | null) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  saveExperience: () => void;
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