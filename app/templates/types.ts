import { ExperienceEntry } from "@/types";
import { UserProfile, SystemSettings } from "@/lib/schemas";

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
  preview: string; // Preview image path
  features: string[];
  bestFor: string[];
}

/**
 * Available template IDs
 */
export type TemplateId = 'classic' | 'professional' | 'modern';

/**
 * Template Component Type
 */
export type TemplateComponent = React.ComponentType<TemplateProps>;

/**
 * Template Registry Entry
 */
export interface TemplateRegistryEntry {
  metadata: TemplateMetadata;
  component: TemplateComponent;
}
