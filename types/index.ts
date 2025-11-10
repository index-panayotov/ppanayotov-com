import { ReactNode, ErrorInfo } from 'react';
import { ImageProps } from 'next/image';
import { UserProfile, SystemSettings } from '@/lib/schemas';
import { TemplateId } from '@/app/templates/types';

// ============================================================================
// Data Types
// ============================================================================

export interface ExperienceEntry {
  title: string;
  company: string;
  dateRange: string;
  location?: string;
  description: string;
  tags: string[];
}

export interface OpenRouterOptions {
  systemInput: string;
  data: string;
  creativity?: number; // 0 = deterministic, 1 = max creativity
  signal?: AbortSignal; // For request timeout handling
  customModel?: string; // Optional model override
}

// ============================================================================
// Core Component Props
// ============================================================================

export interface LazySectionProps {
  children: ReactNode;
  /**
   * Root margin for IntersectionObserver
   * Default: '200px' - loads 200px before section enters viewport
   */
  rootMargin?: string;
  /**
   * Show loading skeleton while loading
   */
  showSkeleton?: boolean;
  /**
   * Custom skeleton component
   */
  skeleton?: ReactNode;
  /**
   * Minimum height while loading to prevent layout shift
   */
  minHeight?: string;
  /**
   * Optional className for the wrapper
   */
  className?: string;
  /**
   * Callback when section becomes visible
   */
  onVisible?: () => void;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ContactSectionProps {
  profileData: UserProfile;
}

export interface SkillCategoryProps {
  title: string;
  skills: string[];
  isExpanded?: boolean;
  variant?: 'grid' | 'list';
}

export interface TypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
}

export interface SkillTagProps {
  name: string;
  variant?: 'default' | 'featured';
}

export interface MarkdownRendererProps {
  content?: string;
  className?: string;
}

export interface FooterProps {
  profileData: UserProfile;
  selectedTemplate: TemplateId;
}

export interface ExperienceEntryProps {
  title: string;
  company: string;
  dateRange: string;
  location?: string;
  description?: string | string[];
  tags?: string[];
}

export interface SectionHeadingProps {
  id?: string;
  title: string;
  subtitle?: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// ============================================================================
// Blog Component Props
// ============================================================================

export interface BlogHeaderProps {
  profileData: UserProfile;
  systemSettings: SystemSettings;
  selectedTemplate: TemplateId;
}

export interface BlogMarkdownRendererProps {
  content: string;
}

// ============================================================================
// Performance Component Props
// ============================================================================

export interface ExperienceListProps {
  experiences: ExperienceEntry[];
  onExperienceClick?: (id: string) => void;
  maxItems?: number;
  sortBy?: 'date' | 'title' | 'company';
  filterBy?: string;
}

export interface ExperienceItemProps {
  experience: ExperienceEntry;
  onClick?: (id: string) => void;
  index: number;
}

// ============================================================================
// SEO Component Props
// ============================================================================

export interface StructuredDataProps {
  readonly data: object;
}

export interface MultipleStructuredDataProps {
  readonly dataArray: readonly object[];
}

// ============================================================================
// UI Component Props
// ============================================================================

export interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoadingComplete?: () => void;
  onError?: () => void;
}
