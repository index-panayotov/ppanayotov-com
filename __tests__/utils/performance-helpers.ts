/**
 * Performance Testing Utilities
 *
 * Helper functions for performance testing with Playwright:
 * - Web Vitals measurement helpers
 * - Network throttling utilities
 * - Performance monitoring tools
 * - Bundle analysis helpers
 */

import { Page, expect } from '@playwright/test';

export interface PerformanceMetrics {
  lcp?: number;
  fcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  tti?: number;
}

export interface ResourceTiming {
  name: string;
  size: number;
  type: string;
  duration: number;
}

/**
 * Measure Core Web Vitals on a page
 */
export async function measureWebVitals(page: Page): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    return new Promise<PerformanceMetrics>((resolve) => {
      const metrics: PerformanceMetrics = {};
      let measurementsCollected = 0;
      const expectedMeasurements = 3; // LCP, FCP, CLS

      const checkComplete = () => {
        measurementsCollected++;
        if (measurementsCollected >= expectedMeasurements) {
          resolve(metrics);
        }
      };

      // Measure LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          metrics.lcp = lastEntry.startTime;
          lcpObserver.disconnect();
          checkComplete();
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure FCP
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          metrics.fcp = fcpEntry.startTime;
          fcpObserver.disconnect();
          checkComplete();
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Measure CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Complete CLS measurement after 5 seconds
      setTimeout(() => {
        clsObserver.disconnect();
        metrics.cls = clsValue;
        checkComplete();
      }, 5000);

      // Fallback timeout
      setTimeout(() => {
        resolve(metrics);
      }, 10000);
    });
  });
}

/**
 * Get detailed resource timing information
 */
export async function getResourceTiming(page: Page): Promise<ResourceTiming[]> {
  return await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    return resources.map(resource => ({
      name: resource.name,
      size: resource.transferSize || 0,
      type: getResourceType(resource.name),
      duration: resource.duration
    }));
  });
}

/**
 * Helper function to determine resource type
 */
function getResourceType(url: string): string {
  if (url.includes('/_next/static/') && url.endsWith('.js')) return 'javascript';
  if (url.includes('/_next/static/') && url.endsWith('.css')) return 'stylesheet';
  if (/\.(png|jpg|jpeg|webp|avif|svg|gif)$/i.test(url)) return 'image';
  if (/\.(woff|woff2|ttf|eot)$/i.test(url)) return 'font';
  if (url.includes('/api/')) return 'api';
  return 'other';
}

/**
 * Simulate network conditions
 */
export async function simulateNetworkConditions(
  page: Page,
  condition: 'slow-3g' | 'fast-3g' | 'wifi' | 'offline'
) {
  const client = await page.context().newCDPSession(page);

  const conditions = {
    'slow-3g': {
      offline: false,
      downloadThroughput: 500 * 1024 / 8, // 500 kbps
      uploadThroughput: 500 * 1024 / 8,
      latency: 400
    },
    'fast-3g': {
      offline: false,
      downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6 Mbps
      uploadThroughput: 750 * 1024 / 8,
      latency: 150
    },
    'wifi': {
      offline: false,
      downloadThroughput: 30 * 1024 * 1024 / 8, // 30 Mbps
      uploadThroughput: 15 * 1024 * 1024 / 8,
      latency: 28
    },
    'offline': {
      offline: true,
      downloadThroughput: 0,
      uploadThroughput: 0,
      latency: 0
    }
  };

  await client.send('Network.emulateNetworkConditions', conditions[condition]);
}

/**
 * Wait for page to be performance-ready
 */
export async function waitForPerformanceReady(page: Page, timeout: number = 10000) {
  await page.waitForLoadState('networkidle', { timeout });

  // Wait for any pending animations to complete
  await page.waitForFunction(() => {
    const animations = document.getAnimations();
    return animations.every(animation => animation.playState === 'finished');
  }, { timeout: 5000 }).catch(() => {
    // Ignore timeout - animations might be infinite
  });
}

/**
 * Measure Time to Interactive (TTI)
 */
export async function measureTTI(page: Page): Promise<number> {
  return await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            // Simple TTI approximation: DOMContentLoaded + 500ms for scripts
            const tti = navEntry.domContentLoadedEventEnd + 500;
            observer.disconnect();
            resolve(tti);
            return;
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });

      setTimeout(() => {
        observer.disconnect();
        resolve(-1);
      }, 10000);
    });
  });
}

/**
 * Assert performance metrics meet thresholds
 */
export function assertPerformanceThresholds(metrics: PerformanceMetrics) {
  if (metrics.lcp !== undefined) {
    expect(metrics.lcp, `LCP should be < 2.5s, got ${metrics.lcp}ms`).toBeLessThan(2500);
  }

  if (metrics.fcp !== undefined) {
    expect(metrics.fcp, `FCP should be < 1.8s, got ${metrics.fcp}ms`).toBeLessThan(1800);
  }

  if (metrics.cls !== undefined) {
    expect(metrics.cls, `CLS should be < 0.1, got ${metrics.cls}`).toBeLessThan(0.1);
  }

  if (metrics.ttfb !== undefined) {
    expect(metrics.ttfb, `TTFB should be < 800ms, got ${metrics.ttfb}ms`).toBeLessThan(800);
  }
}

/**
 * Log performance metrics in a readable format
 */
export function logPerformanceMetrics(metrics: PerformanceMetrics, testName: string) {
  console.log(`\n📊 Performance Metrics for ${testName}:`);

  if (metrics.lcp !== undefined) {
    console.log(`   LCP: ${metrics.lcp.toFixed(0)}ms ${getPerformanceRating(metrics.lcp, 2500, 4000)}`);
  }

  if (metrics.fcp !== undefined) {
    console.log(`   FCP: ${metrics.fcp.toFixed(0)}ms ${getPerformanceRating(metrics.fcp, 1800, 3000)}`);
  }

  if (metrics.cls !== undefined) {
    console.log(`   CLS: ${metrics.cls.toFixed(3)} ${getPerformanceRating(metrics.cls * 1000, 100, 250)}`);
  }

  if (metrics.ttfb !== undefined) {
    console.log(`   TTFB: ${metrics.ttfb.toFixed(0)}ms ${getPerformanceRating(metrics.ttfb, 800, 1800)}`);
  }

  if (metrics.tti !== undefined) {
    console.log(`   TTI: ${metrics.tti.toFixed(0)}ms ${getPerformanceRating(metrics.tti, 3500, 7300)}`);
  }
}

/**
 * Get performance rating based on thresholds
 */
function getPerformanceRating(value: number, good: number, needsImprovement: number): string {
  if (value <= good) return '✅ Good';
  if (value <= needsImprovement) return '⚠️ Needs Improvement';
  return '❌ Poor';
}

/**
 * Generate performance report
 */
export function generatePerformanceReport(
  metrics: PerformanceMetrics,
  resources: ResourceTiming[]
): string {
  const jsSize = resources
    .filter(r => r.type === 'javascript')
    .reduce((total, r) => total + r.size, 0);

  const cssSize = resources
    .filter(r => r.type === 'stylesheet')
    .reduce((total, r) => total + r.size, 0);

  const imageSize = resources
    .filter(r => r.type === 'image')
    .reduce((total, r) => total + r.size, 0);

  const totalSize = resources.reduce((total, r) => total + r.size, 0);

  return `
📊 Performance Report
====================

Core Web Vitals:
- LCP: ${metrics.lcp?.toFixed(0) || 'N/A'}ms
- FCP: ${metrics.fcp?.toFixed(0) || 'N/A'}ms
- CLS: ${metrics.cls?.toFixed(3) || 'N/A'}
- TTFB: ${metrics.ttfb?.toFixed(0) || 'N/A'}ms

Bundle Sizes:
- JavaScript: ${(jsSize / 1024).toFixed(2)}KB
- CSS: ${(cssSize / 1024).toFixed(2)}KB
- Images: ${(imageSize / 1024).toFixed(2)}KB
- Total: ${(totalSize / 1024).toFixed(2)}KB

Resource Count:
- Total Resources: ${resources.length}
- JS Files: ${resources.filter(r => r.type === 'javascript').length}
- CSS Files: ${resources.filter(r => r.type === 'stylesheet').length}
- Images: ${resources.filter(r => r.type === 'image').length}
  `;
}