import { ExperienceEntry } from "@/types";
import { UserProfile, SystemSettings } from "@/lib/schemas";

/**
 * Available template IDs
 */
export type TemplateId = 'classic' | 'professional' | 'modern' | 'dark';

/**
 * Template Data Props - all templates receive the same data
 */
export interface TemplateProps {
  experiences: ExperienceEntry[];
  topSkills: string[];
  profileData: UserProfile;
  systemSettings: SystemSettings;
}

/**
 * Template Metadata
 */
export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
  features: string[];
  bestFor: string[];
}
