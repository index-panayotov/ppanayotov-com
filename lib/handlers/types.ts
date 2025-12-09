/**
 * Shared types for admin handler functions
 */

import { ExperienceEntry } from "@/types";
import {
  Language,
  EducationEntry,
  Certification,
  SocialLink,
  BlogPost
} from "@/lib/schemas";

// Toast function type
export interface ToastFunction {
  (config: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
    className?: string;
  }): void;
}

// Extended types with index for editing
export interface ExperienceEntryWithIndex extends ExperienceEntry {
  _index?: number;
}

export interface LanguageEntryWithIndex extends Language {
  _index?: number;
}

export interface EducationEntryWithIndex extends EducationEntry {
  _index?: number;
}

export interface CertificationWithIndex extends Omit<Certification, 'dateIssued'> {
  _index?: number;
  date?: string; // For backward compatibility
  dateIssued?: string;
}

export interface SocialLinkWithIndex extends SocialLink {
  _index?: number;
}

export interface BlogPostWithIndex extends BlogPost {
  _index?: number;
}
