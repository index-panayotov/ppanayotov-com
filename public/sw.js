/**
 * Service Worker for CV Website Performance Optimization
 *
 * Implements advanced caching strategies for optimal performance:
 * - Cache First: Static assets (CSS, JS, images)
 * - Network First: API routes and dynamic content
 * - Stale While Revalidate: HTML pages
 * - Performance monitoring and metrics collection
 */

const CACHE_NAME = 'cv-website-v1.3';
const STATIC_CACHE_NAME = 'cv-static-v1.3';
const DYNAMIC_CACHE_NAME = 'cv-dynamic-v1.3';
const API_CACHE_NAME = 'cv-api-v1.3';
const RUNTIME_CACHE = 'cv-runtime-v1.3';

// Cache duration constants (in seconds)
const CACHE_DURATION = {
  STATIC: 31536000,    // 1 year for static assets
  DYNAMIC: 86400,      // 1 day for dynamic content
  API: 300,            // 5 minutes for API responses
  HTML: 3600,          // 1 hour for HTML pages
};

// Essential files to cache on install
const ESSENTIAL_CACHE = [
  '/',
  '/favicon.ico',
  '/offline.html', // Fallback page (we'll need to create this)
  '/_next/static/css/app/globals.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
  '/_next/static/chunks/pages/index.js',
];

// API routes to cache with Network First strategy
const API_ROUTES = [
  '/api/performance',
  '/api/text-image',
  '/api/feed.xml',
];

// Routes that should always be fetched from network
const NETWORK_ONLY_ROUTES = [
  '/api/admin',
  '/api/upload',
  '/api/ai',
];

// Enhanced cache strategies with performance optimization
const CACHE_FIRST_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /\/_next\/static\//,
  /\/static\//,
  /\.(?:css|js|woff|woff2|ttf|eot|png|jpg|jpeg|webp|avif|svg|ico)$/,
  /\/uploads\//  // Profile images
];

const NETWORK_FIRST_PATTERNS = [
  /\/api\/admin/,
  /\/api\/upload/,
  /\/api\/ai/,
  /\/admin\//
];

const STALE_WHILE_REVALIDATE_PATTERNS = [
  /\/$/,  // Homepage
  /\/blog/,  // Blog pages
  /\/api\/performance/,
  /\/api\/text-image/
];

/**
 * Service Worker Installation
 * Pre-cache essential resources
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential resources');
        return cache.addAll(ESSENTIAL_CACHE.map(url => {
          // Handle potential cache failures gracefully
          return fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
            console.warn('[SW] Failed to cache:', url);
          }).catch(error => {
            console.warn('[SW] Cache error for:', url, error);
          });
        }));
      })
      .then(() => {
        console.log('[SW] Essential resources cached successfully');
        // Take control immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

/**
 * Service Worker Activation
 * Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

/**
 * Fetch Event Handler
 * Implement caching strategies based on request type
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

/**
 * Handle different types of requests with appropriate caching strategies
 */
async function handleRequest(request) {
  const url = new URL(request.url);

  try {
    // If route is configured as network-only, always try network and
    // do not cache the response here. Fall back to cache only if
    // network fails (offline scenario).
    if (NETWORK_ONLY_ROUTES.some(route => {
      try { return new RegExp(route).test(url.pathname); } catch(e) { return url.pathname === route; }
    })) {
      return await networkOnly(request);
    }

    // Network first for API and admin routes
    if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return await networkFirst(request);
    }

    // Cache first for static assets
    if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.href))) {
      return await cacheFirst(request);
    }

    // Stale while revalidate for main pages
    return await staleWhileRevalidate(request);

  } catch (error) {
    console.error('[SW] Request handling failed:', error);
    return await handleOffline(request);
  }
}

/**
 * Cache First Strategy
 * Good for static assets that don't change often
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[SW] Cache first fetch failed:', error);
    throw error;
  }
}

/**
 * Network First Strategy
 * Good for dynamic content that should be fresh
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.warn('[SW] Network first failed, trying cache:', error);
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    throw error;
  }
}

/**
 * Network Only Strategy
 * Always try network and never store response in cache. If network fails,
 * fall back to cache (if available) to support offline scenarios.
 */
async function networkOnly(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.warn('[SW] Network-only failed, attempting cache fallback', error);
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy
 * Serve from cache immediately, update cache in background
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  // Fetch in background to update cache
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.warn('[SW] Background fetch failed:', error);
  });

  // Return cached version immediately if available
  if (cached) {
    return cached;
  }

  // Otherwise wait for network
  return fetchPromise;
}

/**
 * Handle offline scenarios
 * Provide fallback responses when network and cache fail
 */
async function handleOffline(request) {
  const url = new URL(request.url);

  // For navigation requests, try to serve cached homepage or offline page
  if (request.mode === 'navigate') {
    const cache = await caches.open(CACHE_NAME);

    // Try cached homepage first
    const homepage = await cache.match('/');
    if (homepage) {
      return homepage;
    }

    // Fall back to offline page
    const offlinePage = await cache.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
  }

  // For other requests, return a generic offline response
  return new Response('Offline - Content not available', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}

/**
 * Background Sync (if supported)
 * Handle form submissions when back online
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'background-sync-contact') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log('[SW] Handling background sync for contact forms');
  // This could be expanded to handle offline form submissions
  // For now, just log that sync is working
}

/**
 * Push Notification Handler (future enhancement)
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  // Future enhancement for professional updates or notifications
});

/**
 * Message handler for communication with main thread
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Handle cache stats requests
  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    getCacheStats().then(stats => {
      event.ports[0].postMessage({
        type: 'CACHE_STATS',
        data: stats
      });
    });
  }

  // Handle performance measurement requests
  if (event.data && event.data.type === 'GET_PERFORMANCE_STATS') {
    getPerformanceStats().then(stats => {
      event.ports[0].postMessage({
        type: 'PERFORMANCE_STATS',
        data: stats
      });
    });
  }

  // Handle cache invalidation requests
  if (event.data && event.data.type === 'INVALIDATE_CACHE') {
    const { patterns } = event.data;
    invalidateCache(patterns).then(() => {
      event.ports[0].postMessage({
        type: 'CACHE_INVALIDATED',
        data: { patterns }
      });
    });
  }
});

/**
 * Enhanced utility functions for performance optimization
 */

function isStaticAsset(pathname) {
  return pathname.startsWith('/_next/static/') ||
         pathname.startsWith('/static/') ||
         pathname.startsWith('/uploads/') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.woff2') ||
         pathname.endsWith('.woff') ||
         pathname.endsWith('.ttf') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.webp') ||
         pathname.endsWith('.avif') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.ico');
}

function isAPIRoute(pathname) {
  return pathname.startsWith('/api/');
}

function isHTMLPage(pathname) {
  return !pathname.includes('.') || pathname.endsWith('.html');
}

function addCacheTimestamp(response) {
  const clonedResponse = response.clone();
  clonedResponse.headers.set('sw-cache-timestamp', Date.now().toString());
  return clonedResponse;
}

function isExpired(response, maxAge = CACHE_DURATION.STATIC) {
  const timestamp = response.headers.get('sw-cache-timestamp');
  if (!timestamp) return false;

  const age = Date.now() - parseInt(timestamp);
  return age > (maxAge * 1000); // Convert to milliseconds
}

/**
 * Invalidate cache entries matching given patterns
 */
async function invalidateCache(patterns) {
  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    const keysToDelete = keys.filter(request => {
      const url = new URL(request.url);
      return patterns.some(pattern => {
        if (typeof pattern === 'string') {
          return url.pathname.includes(pattern);
        }
        return pattern.test(url.pathname);
      });
    });

    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

/**
 * Get comprehensive cache statistics
 */
async function getCacheStats() {
  const cacheNames = await caches.keys();
  const stats = {};

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    // Calculate total cache size (approximate)
    let totalSize = 0;
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          totalSize += parseInt(contentLength);
        }
      }
    }

    stats[cacheName] = {
      count: keys.length,
      approximateSize: totalSize,
      urls: keys.slice(0, 10).map(req => req.url), // First 10 URLs for debugging
      lastUpdated: Date.now()
    };
  }

  return stats;
}

/**
 * Get performance statistics for monitoring
 */
async function getPerformanceStats() {
  return {
    cacheHits: self.cacheHits || 0,
    cacheMisses: self.cacheMisses || 0,
    networkRequests: self.networkRequests || 0,
    failedRequests: self.failedRequests || 0,
    totalRequests: (self.cacheHits || 0) + (self.cacheMisses || 0),
    cacheHitRatio: ((self.cacheHits || 0) / Math.max((self.cacheHits || 0) + (self.cacheMisses || 0), 1) * 100).toFixed(2) + '%',
    timestamp: Date.now()
  };
}

/**
 * Performance monitoring helpers
 */
function incrementCacheHit() {
  self.cacheHits = (self.cacheHits || 0) + 1;
}

function incrementCacheMiss() {
  self.cacheMisses = (self.cacheMisses || 0) + 1;
}

function incrementNetworkRequest() {
  self.networkRequests = (self.networkRequests || 0) + 1;
}

function incrementFailedRequest() {
  self.failedRequests = (self.failedRequests || 0) + 1;
}

console.log('🎯 Enhanced Service Worker loaded with performance monitoring!');