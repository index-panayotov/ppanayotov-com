/**
 * Optimized Icon Registry for Dynamic Icon Loading
 *
 * This module provides lazy-loaded icons to improve tree-shaking and reduce bundle size.
 * Icons are only loaded when requested, preventing the entire icon library from being bundled.
 */

import { lazy, ComponentType } from 'react';

export interface IconProps {
  className?: string;
  size?: number | string;
}

// Type for lazy-loaded icon components
type LazyIcon = ComponentType<IconProps>;

/**
 * Icon loader with dynamic imports for optimal tree-shaking
 */
export const iconRegistry: Record<string, () => Promise<{ default: LazyIcon }>> = {
  // Feather Icons (react-icons/fi)
  FiLinkedin: () => import('react-icons/fi/FiLinkedin'),
  FiGithub: () => import('react-icons/fi/FiGithub'),
  FiTwitter: () => import('react-icons/fi/FiTwitter'),
  FiInstagram: () => import('react-icons/fi/FiInstagram'),
  FiYoutube: () => import('react-icons/fi/FiYoutube'),
  FiGlobe: () => import('react-icons/fi/FiGlobe'),
  FiExternalLink: () => import('react-icons/fi/FiExternalLink'),
  FiMail: () => import('react-icons/fi/FiMail'),
  FiPhone: () => import('react-icons/fi/FiPhone'),

  // Font Awesome Icons (react-icons/fa)
  FaFacebook: () => import('react-icons/fa/FaFacebook'),

  // Simple Icons (react-icons/si)
  SiTiktok: () => import('react-icons/si/SiTiktok'),
  SiMedium: () => import('react-icons/si/SiMedium'),
  SiDevdotto: () => import('react-icons/si/SiDevdotto'),
  SiStackoverflow: () => import('react-icons/si/SiStackoverflow'),
  SiDiscord: () => import('react-icons/si/SiDiscord'),
  SiTelegram: () => import('react-icons/si/SiTelegram'),
  SiWhatsapp: () => import('react-icons/si/SiWhatsapp'),
  SiMastodon: () => import('react-icons/si/SiMastodon'),
  SiThreads: () => import('react-icons/si/SiThreads'),
};

/**
 * Synchronously imported icons for critical rendering paths
 * These are loaded immediately for above-the-fold content
 */
import { FiMail, FiLinkedin, FiGithub, FiGlobe } from 'react-icons/fi';

export const criticalIcons: Record<string, LazyIcon> = {
  FiMail,
  FiLinkedin,
  FiGithub,
  FiGlobe,
};

/**
 * Get an icon by name with lazy loading
 * Returns a lazy-loaded component for non-critical icons
 */
export function getIcon(iconName: string): LazyIcon {
  // Check if it's a critical icon (loaded synchronously)
  if (criticalIcons[iconName]) {
    return criticalIcons[iconName];
  }

  // Return lazy-loaded icon
  const iconLoader = iconRegistry[iconName];
  if (!iconLoader) {
    console.warn(`Icon "${iconName}" not found in registry`);
    return criticalIcons.FiGlobe; // Fallback icon
  }

  return lazy(iconLoader);
}

/**
 * Preload specific icons for better UX
 * Call this to prefetch icons before they're needed
 */
export async function preloadIcons(iconNames: string[]): Promise<void> {
  const promises = iconNames.map(name => {
    const loader = iconRegistry[name];
    return loader ? loader() : Promise.resolve();
  });

  await Promise.all(promises);
}

export default getIcon;
