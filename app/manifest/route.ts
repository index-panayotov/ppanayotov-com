import { NextResponse } from 'next/server';
import systemSettings from '@/data/system_settings';

/**
 * Dynamic PWA manifest endpoint that serves manifest.json based on system settings
 *
 * This approach keeps all PWA configuration in a single source of truth (system_settings.ts)
 * and enables programmatic updates, localization, and environment-specific overrides.
 *
 * Accessible at: /manifest/route.ts -> /manifest.json
 */
export async function GET() {
  try {
    const { pwa } = systemSettings;

    // Construct Web App Manifest following W3C specification
    const manifest = {
      name: pwa.siteName,
      short_name: pwa.shortName,
      description: pwa.description,
      start_url: pwa.startUrl,
      display: pwa.display,
      background_color: pwa.backgroundColor,
      theme_color: pwa.themeColor,
      orientation: pwa.orientation,
      categories: pwa.categories,
      icons: pwa.icons.map(icon => ({
        src: icon.src,
        sizes: icon.sizes,
        type: icon.type,
        purpose: icon.purpose
      })),

      // Additional PWA features for professional CV context
      scope: '/',
      lang: 'en',
      dir: 'ltr',

      // Professional app metadata
      prefer_related_applications: false,

      // Enable advanced PWA features
      display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],

      // Professional CV specific shortcuts
      shortcuts: [
        {
          name: 'Experience',
          short_name: 'Experience',
          description: 'View professional experience',
          url: '/#experience',
          icons: [
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            }
          ]
        },
        {
          name: 'Skills',
          short_name: 'Skills',
          description: 'View technical skills',
          url: '/#skills',
          icons: [
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            }
          ]
        },
        {
          name: 'Contact',
          short_name: 'Contact',
          description: 'View contact information',
          url: '/#contact',
          icons: [
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            }
          ]
        }
      ]
    };

    // Return manifest with proper headers
    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      }
    });

  } catch (error) {
    console.error('Error generating PWA manifest:', error);

    // Return minimal fallback manifest
    const fallbackManifest = {
      name: 'Professional CV',
      short_name: 'CV',
      description: 'Professional CV and Portfolio',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#0f172a',
      icons: []
    };

    return NextResponse.json(fallbackManifest, {
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
      }
    });
  }
}