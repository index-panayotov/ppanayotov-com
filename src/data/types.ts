export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedIn: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
}

export interface LanguageEntry {
  language: string;
  level: string;
}

export interface TechCategory {
  category: string;
  items: string[];
}

export interface SubRole {
  client: string;
  roleTitle?: string;
  duration?: string;
  description?: string;
  bullets: string[];
}

export interface WorkEntry {
  title: string;
  company: string;
  companyNote?: string;
  period: string;
  location?: string;
  description?: string;
  bullets?: string[];
  subRoles?: SubRole[];
}

export interface ResumeData {
  name: string;
  title: string;
  contact: ContactInfo;
  profile: string;
  competencies: SkillGroup[];
  education: Education[];
  languages: LanguageEntry[];
  techStack: TechCategory[];
  workExperience: WorkEntry[];
}
