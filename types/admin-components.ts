import { ExperienceEntry } from "@/types"; // Assuming ExperienceEntry is in @/types/index.ts or similar

export interface TopSkillsTabProps {
  topSkills: string[];
  setTopSkills: (skills: string[]) => void;
  editMode: "visual" | "json";
  setEditMode: (mode: "visual" | "json") => void;
  saving: boolean;
  handleSave: (file: string, data: any) => void;
  handleTopSkillsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  addTopSkill: () => void;
  removeTopSkill: (skill: string) => void;
  moveTopSkill: (index: number, direction: "up" | "down") => void;
  generateAutomaticTopSkills: () => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
}

export interface ProfileDataTabProps {
  profileData: any;
  setProfileData: (data: any) => void;
  editMode: "visual" | "json";
  setEditMode: (mode: "visual" | "json") => void;
  saving: boolean;
  handleSave: (file: string, data: any) => void;
  handleProfileDataChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleProfileFieldChange: (field: string, value: string) => void;
  addLanguage: () => void;
  editLanguage: (lang: any, index: number) => void;
  deleteLanguage: (index: number) => void;
  moveLanguage: (index: number, direction: "up" | "down") => void;
  addEducation: () => void;
  editEducation: (edu: any, index: number) => void;
  deleteEducation: (index: number) => void;
  moveEducation: (index: number, direction: "up" | "down") => void;
  addCertification: () => void;
  editCertification: (cert: any, index: number) => void;
  deleteCertification: (index: number) => void;
  moveCertification: (index: number, direction: "up" | "down") => void;
}

export interface ExperiencesTabProps {
  experiences: ExperienceEntry[];
  setExperiences: (experiences: ExperienceEntry[]) => void;
  editMode: "visual" | "json";
  setEditMode: (mode: "visual" | "json") => void;
  saving: boolean;
  handleSave: (file: string, data: any) => void;
  handleExperiencesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
