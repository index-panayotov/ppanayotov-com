/**
 * Service Worker Registration Utilities
 *
 * Handles service worker registration, updates, and status monitoring
 * for Progressive Web App functionality.
 */

export interface ServiceWorkerStatus {
  isRegistered: boolean;
  isActive: boolean;
  isWaiting: boolean;
  updateAvailable: boolean;
  error?: string;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker registered:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('New service worker version available');
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
}

/**
 * Get current service worker status
 */
export function getServiceWorkerStatus(): ServiceWorkerStatus {
  if (!('serviceWorker' in navigator)) {
    return {
      isRegistered: false,
      isActive: false,
      isWaiting: false,
      updateAvailable: false,
      error: 'Service workers not supported'
    };
  }

  const registration = navigator.serviceWorker.controller ? true : false;
  const active = navigator.serviceWorker.controller !== null;

  return {
    isRegistered: registration,
    isActive: active,
    isWaiting: false, // Would need to check registration.waiting
    updateAvailable: false, // Would need to check for updates
  };
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('Service worker unregistered');
    return true;
  } catch (error) {
    console.error('Service worker unregistration failed:', error);
    return false;
  }
}

/**
 * Skip waiting for service worker update
 */
export function skipWaiting(): void {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; entries: number } {
  // This would normally query the Cache API
  // For now, return mock data
  return {
    size: 0,
    entries: 0,
  };
}

/**
 * Get performance statistics
 */
export function getPerformanceStats(): { loadTime: number; domContentLoaded: number; firstPaint: number } {
  if (!performance.timing) {
    return {
      loadTime: 0,
      domContentLoaded: 0,
      firstPaint: 0,
    };
  }

  const timing = performance.timing;
  return {
    loadTime: timing.loadEventEnd - timing.navigationStart,
    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
    firstPaint: timing.responseStart - timing.navigationStart,
  };
}