import { Dispatch, SetStateAction } from 'react';
import { 
  ExperienceEntry, 
  Language, 
  EducationEntry as Education, 
  Certification,
  SystemSettings,
  SocialLink
} from "@/lib/schemas";

// === Dialog Props ===

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

export interface SocialLinkDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentSocialLink: (SocialLink & { _index?: number }) | null;
  setCurrentSocialLink: Dispatch<SetStateAction<(SocialLink & { _index?: number }) | null>>;
  saveSocialLink: () => void;
  saving?: boolean;
}

// === Component Props ===

export interface ImageUploadProps {
  currentImageUrl: string;
  currentWebUrl?: string;
  currentPdfUrl?: string;
  onImageChange: (imageUrl: string, webUrl?: string, pdfUrl?: string, timestamp?: number) => void;
}

export interface ImageUploadResponse {
  success: boolean;
  webUrl?: string;
  pdfUrl?: string;
  message?: string;
  error?: string;
}