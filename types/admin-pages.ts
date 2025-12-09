import { 
  ExperienceEntry, 
  UserProfile, 
  SystemSettings 
} from "@/lib/schemas";

/**
 * Props for the main dashboard view
 */
export interface AdminDashboardProps {
  experiences: ExperienceEntry[];
  topSkills: string[];
  profileData: UserProfile;
}

/**
 * Props for the Profile Data management tab/page
 */
export interface ProfileDataTabProps {
  profileData: UserProfile;
  setProfileData: (data: UserProfile) => void;
  saving: boolean;
  handleSave: (file: string, data: UserProfile) => Promise<void>;
  handleProfileFieldChange: (field: string, value: string) => void;
  systemSettings: SystemSettings;
}

/**
 * Props for the Experiences management tab/page
 */
export interface ExperiencesTabProps {
  experiences: ExperienceEntry[];
  saving: boolean;
  handleSave: (file: string, data: ExperienceEntry[]) => Promise<void>;
  addExperience: () => void;
  editExperience: (exp: ExperienceEntry, index: number) => void;
  deleteExperience: (index: number) => void;
  moveExperience: (index: number, direction: "up" | "down") => void;
}

/**
 * Props for the Top Skills management tab/page
 */
export interface TopSkillsTabProps {
  topSkills: string[];
  saving: boolean;
  handleSave: (file: string, data: string[]) => Promise<void>;
  addTopSkill: () => void;
  removeTopSkill: (skill: string) => void;
  moveTopSkill: (index: number, direction: "up" | "down") => void;
  generateAutomaticTopSkills: () => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  isGenerating?: boolean;
}

/**
 * Props for the Settings management tab/page
 */
export interface SettingsTabProps {
  saving: boolean;
  handleSave: (file: string, data: SystemSettings) => Promise<void>;
  systemSettings: SystemSettings;
  setSystemSettings: (settings: SystemSettings) => void;
}
