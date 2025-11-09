import { ExperienceEntry, UserProfile, SystemSettings } from "@/lib/schemas";

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
}

export interface ProfileDataTabProps {
  profileData: UserProfile;
  setProfileData: (data: UserProfile) => void;
  saving: boolean;
  handleSave: (file: string, data: UserProfile) => Promise<void>;
  handleProfileFieldChange: (field: string, value: string) => void;
  systemSettings: SystemSettings;
}

export interface ExperiencesTabProps {
  experiences: ExperienceEntry[];
  saving: boolean;
  handleSave: (file: string, data: ExperienceEntry[]) => Promise<void>;
  addExperience: () => void;
  editExperience: (exp: ExperienceEntry, index: number) => void;
  deleteExperience: (index: number) => void;
  moveExperience: (index: number, direction: "up" | "down") => void;
}

export interface CertificationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentCertification: {
    name: string;
    issuer?: string;
    date?: string;
    _index?: number;
  } | null;
  setCurrentCertification: (
    cert: {
      name: string;
      issuer?: string;
      date?: string;
      _index?: number;
    } | null
  ) => void;
  saveCertification: () => void;
}

export interface ImageUploadProps {
  currentImageUrl: string;
  currentWebUrl?: string;
  currentPdfUrl?: string;
  onImageChange: (imageUrl: string, webUrl?: string, pdfUrl?: string) => void;
}

export interface ImageUploadResponse {
  success: boolean;
  webUrl?: string;
  pdfUrl?: string;
  message?: string;
  error?: string;
}
