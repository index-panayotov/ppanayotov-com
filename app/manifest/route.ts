import { NextResponse } from 'next/server';
import { loadSystemSettings } from '@/lib/data-loader';

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
    // Load system settings directly from file to bypass module cache
    const systemSettings = loadSystemSettings();

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
      icons: pwa.icons.map((icon: { src: string; sizes: string; type: string; purpose?: string }) => ({
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
      display_override: ['window-controls-overlay', 'standalone', 'minimal-ui']
    };

    // Return manifest with proper headers
    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate', // No cache in development
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