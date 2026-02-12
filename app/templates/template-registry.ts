import { TemplateMetadata, TemplateId } from './types';

/**
 * Template Metadata Registry
 */
export const TEMPLATE_METADATA: Record<TemplateId, TemplateMetadata> = {
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
  },

  dark: {
    id: 'dark',
    name: 'Dark Premium',
    description: 'Elegant dark theme with sticky sidebar, teal accents, and mouse-following spotlight',
    preview: '/template-previews/dark.png',
    features: [
      'Dark navy background with teal accents',
      'Sticky sidebar navigation',
      'Mouse-following spotlight effect',
      'Section scroll tracking',
      'Metric highlight cards'
    ],
    bestFor: ['Engineering leadership', 'Tech industry', 'Senior roles', 'Executive presence']
  }
} as const;

/**
 * Get all available templates
 */
export const getAllTemplates = (): TemplateMetadata[] => Object.values(TEMPLATE_METADATA);

/**
 * Validate template ID
 */
export const isValidTemplateId = (id: string): id is TemplateId => id in TEMPLATE_METADATA;
