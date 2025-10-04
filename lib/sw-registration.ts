/**
 * Service Worker Registration and Management
 *
 * Handles Progressive Web App functionality:
 * - Service worker registration
 * - Update notifications
 * - Cache management
 * - Offline support
 */

export interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  registration?: ServiceWorkerRegistration;
}

let swStatus: ServiceWorkerStatus = {
  isSupported: false,
  isRegistered: false,
  isUpdateAvailable: false,
};

/**
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerStatus> {
  // Check if service workers are supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported');
    return swStatus;
  }

  swStatus.isSupported = true;

  try {
    // Register the service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none', // Always check for updates
    });

    swStatus.isRegistered = true;
    swStatus.registration = registration;

    console.log('[SW] Service worker registered successfully');

    // Check for updates periodically (every hour)
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    // Handle service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            swStatus.isUpdateAvailable = true;
            console.log('[SW] New version available');

            // Notify user about update
            notifyUpdate();
          }
        });
      }
    });

    // Handle messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('[SW] Message from service worker:', event.data);

      if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('[SW] Cache has been updated');
      }
    });

    // Activate waiting service worker immediately on page load
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    return swStatus;

  } catch (error) {
    console.error('[SW] Service worker registration failed:', error);
    return swStatus;
  }
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!swStatus.registration) {
    return false;
  }

  try {
    const success = await swStatus.registration.unregister();
    if (success) {
      console.log('[SW] Service worker unregistered');
      swStatus.isRegistered = false;
      swStatus.registration = undefined;
    }
    return success;
  } catch (error) {
    console.error('[SW] Failed to unregister service worker:', error);
    return false;
  }
}

/**
 * Update the service worker
 */
export async function updateServiceWorker(): Promise<void> {
  if (!swStatus.registration) {
    console.warn('[SW] No service worker registered');
    return;
  }

  try {
    await swStatus.registration.update();
    console.log('[SW] Service worker update check completed');
  } catch (error) {
    console.error('[SW] Service worker update failed:', error);
  }
}

/**
 * Skip waiting and activate new service worker immediately
 */
export function skipWaiting(): void {
  if (!swStatus.registration || !swStatus.registration.waiting) {
    return;
  }

  swStatus.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

  // Reload page to use new service worker
  window.location.reload();
}

/**
 * Get cache statistics from service worker
 */
export async function getCacheStats(): Promise<any> {
  if (!navigator.serviceWorker.controller) {
    return null;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      if (event.data && event.data.type === 'CACHE_STATS') {
        resolve(event.data.data);
      }
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_STATS' },
      [messageChannel.port2]
    );

    // Timeout after 5 seconds
    setTimeout(() => resolve(null), 5000);
  });
}

/**
 * Get performance statistics from service worker
 */
export async function getPerformanceStats(): Promise<any> {
  if (!navigator.serviceWorker.controller) {
    return null;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      if (event.data && event.data.type === 'PERFORMANCE_STATS') {
        resolve(event.data.data);
      }
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_PERFORMANCE_STATS' },
      [messageChannel.port2]
    );

    // Timeout after 5 seconds
    setTimeout(() => resolve(null), 5000);
  });
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<boolean> {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('[SW] All caches cleared');
    return true;
  } catch (error) {
    console.error('[SW] Failed to clear caches:', error);
    return false;
  }
}

/**
 * Notify user about service worker update
 */
function notifyUpdate(): void {
  // This can be customized to show a toast/banner to the user
  if (process.env.NODE_ENV === 'development') {
    console.log('[SW] 🔄 New version available. Refresh to update.');
  }

  // Dispatch custom event that can be listened to by the UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sw-update-available'));
  }
}

/**
 * Check if app is running in standalone mode (installed PWA)
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * Get service worker status
 */
export function getServiceWorkerStatus(): ServiceWorkerStatus {
  return swStatus;
}

export default registerServiceWorker;
