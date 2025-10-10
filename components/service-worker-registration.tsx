"use client";

import { useEffect, useState } from 'react';
import { registerServiceWorker, getServiceWorkerStatus } from '@/lib/sw-registration';
import { logger } from '@/lib/logger';

/**
 * Service Worker Registration Component
 *
 * Automatically registers the service worker when the app loads.
 * Provides PWA functionality including offline support and caching.
 */
export function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Only register in production or when explicitly enabled
    const shouldRegister =
      process.env.NODE_ENV === 'production' ||
      process.env.NEXT_PUBLIC_SW_ENABLED === 'true';

    if (!shouldRegister) {
      logger.info('[SW] Service worker disabled in development');
      return;
    }

    // Register service worker
    registerServiceWorker()
      .then((status) => {
        if (status) {
          logger.info('[SW] ✓ PWA enabled with offline support');
        }
      })
      .catch((error) => {
        logger.error('[SW] Registration error', error instanceof Error ? error : new Error(String(error)));
      });

    // Listen for update notifications
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
    };

    window.addEventListener('sw-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable);
    };
  }, []);

  // Show update notification banner
  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium">Update Available</p>
          <p className="text-sm text-blue-100">A new version is ready.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-white text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Reload
        </button>
      </div>
    );
  }

  return null;
}

export default ServiceWorkerRegistration;
