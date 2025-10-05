import { TemplateRegistryEntry, TemplateId, TemplateComponent } from './types';
import { lazy } from 'react';

/**
 * Template Metadata Registry
 */
export const TEMPLATE_METADATA: Record<TemplateId, TemplateRegistryEntry['metadata']> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Animated, modern design with typing effects and smooth scrolling',
    preview: '/template-previews/classic.png',
    features: [
      'Animated typing effect',
      'Gradient hero section',
      'Smooth scroll animations',
      'Professional color scheme'
    ],
    bestFor: ['Tech industry', 'Creative roles', 'Modern companies']
  },

  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, minimal design optimized for ATS and all job types',
    preview: '/template-previews/professional.png',
    features: [
      'ATS-scanner friendly',
      'Print-optimized layout',
      'Clear typography hierarchy',
      'Universal compatibility'
    ],
    bestFor: ['All industries', 'Corporate roles', 'Traditional companies', 'Job applications']
  },

  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Bold, trendy design with vibrant colors and interactive elements',
    preview: '/template-previews/modern.png',
    features: [
      'Glassmorphism effects',
      'CSS Grid masonry layout',
      'Dark mode support',
      'Interactive hover states'
    ],
    bestFor: ['Design roles', 'Startups', 'Creative industries', 'Portfolio showcase']
  }
};

/**
 * Lazy-loaded template components
 */
const TEMPLATE_COMPONENTS: Record<TemplateId, () => Promise<{ default: TemplateComponent }>> = {
  classic: () => import('./classic'),
  professional: () => import('./professional'),
  modern: () => import('./modern')
};

/**
 * Get template component (lazy-loaded)
 */
export function getTemplateComponent(templateId: TemplateId): TemplateComponent {
  return lazy(TEMPLATE_COMPONENTS[templateId]);
}

/**
 * Get template metadata
 */
export function getTemplateMetadata(templateId: TemplateId): TemplateRegistryEntry['metadata'] {
  return TEMPLATE_METADATA[templateId];
}

/**
 * Get all available templates
 */
export function getAllTemplates(): TemplateRegistryEntry['metadata'][] {
  return Object.values(TEMPLATE_METADATA);
}

/**
 * Validate template ID
 */
export function isValidTemplateId(id: string): id is TemplateId {
  return id in TEMPLATE_METADATA;
}
