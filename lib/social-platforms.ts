/**
 * Social Platform Definitions with Optimized Icon Loading
 *
 * Icons are loaded individually for better tree-shaking and bundle optimization.
 * This module uses direct imports to prevent bundling entire icon libraries.
 */

import React from 'react';
// Optimized individual icon imports for better tree-shaking
import { FiLinkedin, FiGithub, FiTwitter, FiInstagram, FiYoutube, FiGlobe, FiExternalLink } from 'react-icons/fi';
import { FaFacebook } from 'react-icons/fa';
import { SiTiktok, SiMedium, SiDevdotto, SiStackoverflow, SiDiscord, SiTelegram, SiWhatsapp, SiMastodon, SiThreads } from 'react-icons/si';

export interface PlatformDefinition {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  urlPattern: RegExp;
  urlExample: string;
  placeholder: string;
  helpText: string;
  baseUrl?: string;
}

export const SUPPORTED_PLATFORMS: Record<string, PlatformDefinition> = {
  linkedin: {
    name: 'LinkedIn',
    icon: FiLinkedin,
    urlPattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
    urlExample: 'https://linkedin.com/in/username',
    placeholder: 'Enter your LinkedIn profile URL',
    helpText: 'Your LinkedIn profile URL (e.g., linkedin.com/in/yourname)',
    baseUrl: 'https://linkedin.com/in/'
  },
  github: {
    name: 'GitHub',
    icon: FiGithub,
    urlPattern: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
    urlExample: 'https://github.com/username',
    placeholder: 'Enter your GitHub profile URL',
    helpText: 'Your GitHub profile URL (e.g., github.com/username)',
    baseUrl: 'https://github.com/'
  },
  twitter: {
    name: 'Twitter',
    icon: FiTwitter,
    urlPattern: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w_]+\/?$/,
    urlExample: 'https://twitter.com/username',
    placeholder: 'Enter your Twitter/X profile URL',
    helpText: 'Your Twitter or X profile URL (e.g., twitter.com/username)',
    baseUrl: 'https://twitter.com/'
  },
  instagram: {
    name: 'Instagram',
    icon: FiInstagram,
    urlPattern: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+\/?$/,
    urlExample: 'https://instagram.com/username',
    placeholder: 'Enter your Instagram profile URL',
    helpText: 'Your Instagram profile URL (e.g., instagram.com/username)',
    baseUrl: 'https://instagram.com/'
  },
  youtube: {
    name: 'YouTube',
    icon: FiYoutube,
    urlPattern: /^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|user\/|@)[\w.-]+\/?$/,
    urlExample: 'https://youtube.com/@username',
    placeholder: 'Enter your YouTube channel URL',
    helpText: 'Your YouTube channel URL (e.g., youtube.com/@username)',
    baseUrl: 'https://youtube.com/@'
  },
  facebook: {
    name: 'Facebook',
    icon: FaFacebook,
    urlPattern: /^https?:\/\/(www\.)?facebook\.com\/[\w.-]+\/?$/,
    urlExample: 'https://facebook.com/username',
    placeholder: 'Enter your Facebook profile URL',
    helpText: 'Your Facebook profile URL (e.g., facebook.com/username)',
    baseUrl: 'https://facebook.com/'
  },
  tiktok: {
    name: 'TikTok',
    icon: SiTiktok,
    urlPattern: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/?$/,
    urlExample: 'https://tiktok.com/@username',
    placeholder: 'Enter your TikTok profile URL',
    helpText: 'Your TikTok profile URL (e.g., tiktok.com/@username)',
    baseUrl: 'https://tiktok.com/@'
  },
  medium: {
    name: 'Medium',
    icon: SiMedium,
    urlPattern: /^https?:\/\/(www\.)?medium\.com\/@?[\w.-]+\/?$/,
    urlExample: 'https://medium.com/@username',
    placeholder: 'Enter your Medium profile URL',
    helpText: 'Your Medium profile URL (e.g., medium.com/@username)',
    baseUrl: 'https://medium.com/@'
  },
  devto: {
    name: 'Dev.to',
    icon: SiDevdotto,
    urlPattern: /^https?:\/\/(www\.)?dev\.to\/[\w.-]+\/?$/,
    urlExample: 'https://dev.to/username',
    placeholder: 'Enter your Dev.to profile URL',
    helpText: 'Your Dev.to profile URL (e.g., dev.to/username)',
    baseUrl: 'https://dev.to/'
  },
  stackoverflow: {
    name: 'Stack Overflow',
    icon: SiStackoverflow,
    urlPattern: /^https?:\/\/(www\.)?stackoverflow\.com\/users\/\d+\/[\w.-]+\/?$/,
    urlExample: 'https://stackoverflow.com/users/123456/username',
    placeholder: 'Enter your Stack Overflow profile URL',
    helpText: 'Your Stack Overflow profile URL (e.g., stackoverflow.com/users/123456/username)',
  },
  discord: {
    name: 'Discord',
    icon: SiDiscord,
    urlPattern: /^https?:\/\/(www\.)?discord\.(gg|com)\/(invite\/)?[\w.-]+\/?$/,
    urlExample: 'https://discord.gg/yourserver',
    placeholder: 'Enter your Discord server invite URL',
    helpText: 'Your Discord server invite URL (e.g., discord.gg/yourserver)',
  },
  telegram: {
    name: 'Telegram',
    icon: SiTelegram,
    urlPattern: /^https?:\/\/(www\.)?t\.me\/[\w.-]+\/?$/,
    urlExample: 'https://t.me/username',
    placeholder: 'Enter your Telegram profile URL',
    helpText: 'Your Telegram profile URL (e.g., t.me/username)',
    baseUrl: 'https://t.me/'
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: SiWhatsapp,
    urlPattern: /^https?:\/\/(www\.)?wa\.me\/\d+\/?$/,
    urlExample: 'https://wa.me/1234567890',
    placeholder: 'Enter your WhatsApp business URL',
    helpText: 'Your WhatsApp business URL (e.g., wa.me/1234567890)',
  },
  mastodon: {
    name: 'Mastodon',
    icon: SiMastodon,
    urlPattern: /^https?:\/\/[\w.-]+\/@[\w.-]+\/?$/,
    urlExample: 'https://mastodon.social/@username',
    placeholder: 'Enter your Mastodon profile URL',
    helpText: 'Your Mastodon profile URL (e.g., mastodon.social/@username)',
  },
  threads: {
    name: 'Threads',
    icon: SiThreads,
    urlPattern: /^https?:\/\/(www\.)?threads\.net\/@[\w.-]+\/?$/,
    urlExample: 'https://threads.net/@username',
    placeholder: 'Enter your Threads profile URL',
    helpText: 'Your Threads profile URL (e.g., threads.net/@username)',
    baseUrl: 'https://threads.net/@'
  },
  custom: {
    name: 'Custom',
    icon: FiExternalLink,
    urlPattern: /^https?:\/\/.+\..+/,
    urlExample: 'https://yourwebsite.com',
    placeholder: 'Enter your website URL',
    helpText: 'Any custom website or platform URL',
  }
};

export const PLATFORM_ORDER = [
  'linkedin', 'github', 'twitter', 'instagram', 'youtube', 'facebook',
  'medium', 'devto', 'stackoverflow', 'tiktok', 'discord', 'telegram',
  'mastodon', 'threads', 'whatsapp', 'custom'
];

/**
 * Detects the platform from a given URL
 * @param url The URL to analyze
 * @returns The platform key or null if not detected
 */
export const detectPlatformFromUrl = (url: string): string | null => {
  if (!url) return null;

  // Ensure URL has protocol
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

  // Check each platform pattern
  for (const [key, platform] of Object.entries(SUPPORTED_PLATFORMS)) {
    if (key === 'custom') continue; // Skip custom for auto-detection

    if (platform.urlPattern.test(normalizedUrl)) {
      return key;
    }
  }

  return null;
};

/**
 * Validates a URL for a specific platform
 * @param platform The platform key
 * @param url The URL to validate
 * @returns Validation result with error message and suggestion if invalid
 */
export const validateSocialUrl = (platform: string, url: string): {
  isValid: boolean;
  error?: string;
  suggestion?: string;
} => {
  const platformDef = SUPPORTED_PLATFORMS[platform];

  if (!platformDef) {
    return { isValid: false, error: 'Unsupported platform' };
  }

  if (!url?.trim()) {
    return { isValid: false, error: 'URL is required' };
  }

  // Normalize URL
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

  // Basic URL validation first
  try {
    new URL(normalizedUrl);
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format',
      suggestion: `Example: ${platformDef.urlExample}`
    };
  }

  // Platform-specific validation
  if (!platformDef.urlPattern.test(normalizedUrl)) {
    return {
      isValid: false,
      error: `Invalid ${platformDef.name} URL format`,
      suggestion: `Example: ${platformDef.urlExample}`
    };
  }

  return { isValid: true };
};

/**
 * Gets the icon component for a platform
 * @param platform The platform key
 * @param className Optional CSS class name for the icon
 * @returns React icon component
 */
export const getSocialIcon = (platform: string, className = "h-5 w-5"): React.ReactElement => {
  const platformDef = SUPPORTED_PLATFORMS[platform.toLowerCase()];
  const IconComponent = platformDef?.icon || FiGlobe;

  return React.createElement(IconComponent, { className });
};

/**
 * Gets all available platforms in display order
 * @returns Array of platform keys in recommended display order
 */
export const getAvailablePlatforms = (): string[] => {
  return PLATFORM_ORDER;
};

/**
 * Gets platform definition by key
 * @param platform The platform key
 * @returns Platform definition or null if not found
 */
export const getPlatformDefinition = (platform: string): PlatformDefinition | null => {
  return SUPPORTED_PLATFORMS[platform.toLowerCase()] || null;
};