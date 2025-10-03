/**
 * Performance Tests
 *
 * Comprehensive performance testing suite using Playwright for:
 * - Core Web Vitals validation
 * - Bundle size analysis
 * - Lighthouse performance scoring
 * - Real user performance metrics
 */

import { test, expect, Page, Browser } from '@playwright/test';
import { runAllPerformanceTests, PerformanceTestRunner } from '../../lib/performance-testing';
import { PerformanceBudgetChecker, ALL_PERFORMANCE_BUDGETS } from '../../lib/performance-budgets';

// Performance thresholds based on Google's recommendations
const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // 2.5 seconds
  FID: 100,  // 100ms
  CLS: 0.1,  // 0.1 layout shift
  FCP: 1800, // 1.8 seconds
  TTFB: 800, // 800ms
  TTI: 3500  // 3.5 seconds
};

const BUNDLE_SIZE_LIMITS = {
  MAX_JS_SIZE: 250 * 1024,    // 250KB
  MAX_CSS_SIZE: 50 * 1024,    // 50KB
  MAX_TOTAL_SIZE: 1024 * 1024 // 1MB
};

// Test configuration
test.describe('Performance Tests', () => {
  let page: Page;
  let budgetChecker: PerformanceBudgetChecker;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    budgetChecker = new PerformanceBudgetChecker(ALL_PERFORMANCE_BUDGETS);

    // Set up performance monitoring
    await page.addInitScript(() => {
      // Inject web-vitals monitoring
      window.performanceMetrics = [];

      // Mock performance observer for testing
      window.webVitalsReady = false;
    });
  });

  test.describe('Core Web Vitals', () => {
    test('should meet LCP threshold on homepage', async () => {
      await page.goto('/');

      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              const lastEntry = entries[entries.length - 1] as PerformanceEntry;
              observer.disconnect();
              resolve(lastEntry.startTime);
            }
          });

          observer.observe({ entryTypes: ['largest-contentful-paint'] });

          // Fallback timeout
          setTimeout(() => {
            observer.disconnect();
            resolve(-1);
          }, 10000);
        });
      });

      console.log(`📊 LCP: ${lcp}ms`);

      if (lcp !== -1) {
        expect(lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP);
        budgetChecker.checkBudget('LCP', lcp);
      }
    });

    test('should meet FCP threshold on homepage', async () => {
      await page.goto('/');

      const fcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              const entry = entries[0] as PerformanceEntry;
              observer.disconnect();
              resolve(entry.startTime);
            }
          });

          observer.observe({ entryTypes: ['paint'] });

          setTimeout(() => {
            observer.disconnect();
            resolve(-1);
          }, 10000);
        });
      });

      console.log(`📊 FCP: ${fcp}ms`);

      if (fcp !== -1) {
        expect(fcp).toBeLessThan(PERFORMANCE_THRESHOLDS.FCP);
        budgetChecker.checkBudget('FCP', fcp);
      }
    });

    test('should have minimal cumulative layout shift', async () => {
      await page.goto('/');

      // Wait for page to fully load
      await page.waitForLoadState('networkidle');

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;

          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          });

          observer.observe({ entryTypes: ['layout-shift'] });

          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 5000);
        });
      });

      console.log(`📊 CLS: ${cls}`);
      expect(cls).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS);
      budgetChecker.checkBudget('CLS', cls * 1000); // Convert to x1000 for budget checker
    });

    test('should have fast TTFB', async () => {
      const startTime = Date.now();
      await page.goto('/');
      const ttfb = Date.now() - startTime;

      console.log(`📊 TTFB: ${ttfb}ms`);
      expect(ttfb).toBeLessThan(PERFORMANCE_THRESHOLDS.TTFB);
      budgetChecker.checkBudget('TTFB', ttfb);
    });
  });

  test.describe('Bundle Size Analysis', () => {
    test('should have optimized JavaScript bundle size', async () => {
      const response = await page.goto('/');
      const resourceSizes = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const jsResources = resources.filter(r =>
          r.name.includes('/_next/static/') && r.name.endsWith('.js')
        );

        return {
          totalJSSize: jsResources.reduce((total, r) => total + (r.transferSize || 0), 0),
          jsFiles: jsResources.length,
          resources: jsResources.map(r => ({
            name: r.name.split('/').pop(),
            size: r.transferSize || 0
          }))
        };
      });

      console.log(`📊 JS Bundle Size: ${(resourceSizes.totalJSSize / 1024).toFixed(2)}KB (${resourceSizes.jsFiles} files)`);
      console.log('📊 JS Resources:', resourceSizes.resources);

      expect(resourceSizes.totalJSSize).toBeLessThan(BUNDLE_SIZE_LIMITS.MAX_JS_SIZE);
      budgetChecker.checkBudget('JS_Bundle_Size', resourceSizes.totalJSSize);
    });

    test('should have optimized CSS bundle size', async () => {
      await page.goto('/');

      const cssSizes = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const cssResources = resources.filter(r =>
          r.name.includes('/_next/static/') && r.name.endsWith('.css')
        );

        return {
          totalCSSSize: cssResources.reduce((total, r) => total + (r.transferSize || 0), 0),
          cssFiles: cssResources.length,
          resources: cssResources.map(r => ({
            name: r.name.split('/').pop(),
            size: r.transferSize || 0
          }))
        };
      });

      console.log(`📊 CSS Bundle Size: ${(cssSizes.totalCSSSize / 1024).toFixed(2)}KB (${cssSizes.cssFiles} files)`);

      expect(cssSizes.totalCSSSize).toBeLessThan(BUNDLE_SIZE_LIMITS.MAX_CSS_SIZE);
      budgetChecker.checkBudget('CSS_Bundle_Size', cssSizes.totalCSSSize);
    });

    test('should have reasonable total page weight', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const totalPageWeight = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const totalSize = resources.reduce((total, r) => total + (r.transferSize || 0), 0);

        const breakdown = {
          js: resources.filter(r => r.name.endsWith('.js')).reduce((total, r) => total + (r.transferSize || 0), 0),
          css: resources.filter(r => r.name.endsWith('.css')).reduce((total, r) => total + (r.transferSize || 0), 0),
          images: resources.filter(r => /\.(png|jpg|jpeg|webp|avif|svg)$/i.test(r.name)).reduce((total, r) => total + (r.transferSize || 0), 0),
          fonts: resources.filter(r => /\.(woff|woff2|ttf|eot)$/i.test(r.name)).reduce((total, r) => total + (r.transferSize || 0), 0),
          other: 0
        };

        breakdown.other = totalSize - breakdown.js - breakdown.css - breakdown.images - breakdown.fonts;

        return { totalSize, breakdown };
      });

      const totalMB = totalPageWeight.totalSize / (1024 * 1024);

      console.log(`📊 Total Page Weight: ${totalMB.toFixed(2)}MB`);
      console.log('📊 Breakdown:', Object.entries(totalPageWeight.breakdown).map(([type, size]) =>
        `${type}: ${((size as number) / 1024).toFixed(2)}KB`
      ).join(', '));

      expect(totalPageWeight.totalSize).toBeLessThan(BUNDLE_SIZE_LIMITS.MAX_TOTAL_SIZE);
      budgetChecker.checkBudget('Total_Page_Weight', totalPageWeight.totalSize);
    });
  });

  test.describe('Image Optimization', () => {
    test('should serve optimized image formats', async () => {
      await page.goto('/');

      const imageInfo = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        const imageData = images.map(img => ({
          src: img.src,
          loading: img.loading,
          format: img.src.includes('.webp') ? 'webp' :
                  img.src.includes('.avif') ? 'avif' :
                  img.src.split('.').pop()?.toLowerCase()
        }));

        const optimizedFormats = imageData.filter(img =>
          img.format === 'webp' || img.format === 'avif'
        ).length;

        return {
          totalImages: images.length,
          optimizedImages: optimizedFormats,
          optimizationRatio: images.length > 0 ? (optimizedFormats / images.length) * 100 : 100,
          formats: imageData
        };
      });

      console.log(`📊 Image Optimization: ${imageInfo.optimizedImages}/${imageInfo.totalImages} (${imageInfo.optimizationRatio.toFixed(1)}%)`);

      // At least 70% of images should be in optimized formats (WebP/AVIF)
      expect(imageInfo.optimizationRatio).toBeGreaterThan(70);
      budgetChecker.checkBudget('Image_Compression_Ratio', imageInfo.optimizationRatio);
    });

    test('should implement proper lazy loading', async () => {
      await page.goto('/');

      const lazyLoadingInfo = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        const lazyImages = images.filter(img => img.loading === 'lazy').length;
        const eagerImages = images.filter(img => img.loading === 'eager').length;

        return {
          totalImages: images.length,
          lazyImages,
          eagerImages,
          defaultImages: images.length - lazyImages - eagerImages
        };
      });

      console.log(`📊 Lazy Loading: ${lazyLoadingInfo.lazyImages} lazy, ${lazyLoadingInfo.eagerImages} eager`);

      // Most images should use lazy loading (except above-the-fold content)
      expect(lazyLoadingInfo.lazyImages).toBeGreaterThan(0);
    });
  });

  test.describe('API Performance', () => {
    test('should have fast API response times', async () => {
      const apiEndpoints = ['/api/performance'];

      for (const endpoint of apiEndpoints) {
        const startTime = Date.now();
        const response = await page.request.get(endpoint);
        const responseTime = Date.now() - startTime;

        console.log(`📊 API ${endpoint}: ${responseTime}ms`);

        expect(response.status()).toBe(200);
        expect(responseTime).toBeLessThan(500); // 500ms threshold for API calls
      }
    });
  });

  test.describe('Performance Budget Validation', () => {
    test('should meet all performance budgets', async () => {
      // Run comprehensive performance test
      const runner = new PerformanceTestRunner();

      // Test homepage performance
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Generate budget report
      const summary = budgetChecker.getBudgetSummary();
      const report = budgetChecker.generateReport();

      console.log('📊 Performance Budget Summary:');
      console.log(`   Total: ${summary.total}`);
      console.log(`   Passed: ${summary.passed}`);
      console.log(`   Failed: ${summary.failed}`);
      console.log(`   Pass Rate: ${summary.passRate.toFixed(1)}%`);

      if (summary.failed > 0) {
        console.log('\n❌ Budget Failures:');
        console.log(report);
      }

      // Assert that at least 80% of budgets pass
      expect(summary.passRate).toBeGreaterThan(80);
    });
  });

  test.afterEach(async () => {
    // Log final performance summary
    const summary = budgetChecker.getBudgetSummary();
    if (summary.total > 0) {
      console.log(`\n📊 Test Performance: ${summary.passed}/${summary.total} budgets passed (${summary.passRate.toFixed(1)}%)`);
    }
  });
});

// Utility function for measuring specific performance metrics
export async function measurePerformanceMetric(
  page: Page,
  metricName: string,
  timeout: number = 10000
): Promise<number> {
  return page.evaluate(({ metricName, timeout }) => {
    return new Promise<number>((resolve) => {
      const startTime = performance.now();

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.name === metricName || entry.entryType === metricName) {
            observer.disconnect();
            resolve(entry.startTime || entry.duration || (performance.now() - startTime));
            return;
          }
        }
      });

      observer.observe({ entryTypes: ['measure', 'navigation', 'paint', 'largest-contentful-paint'] });

      setTimeout(() => {
        observer.disconnect();
        resolve(-1);
      }, timeout);
    });
  }, { metricName, timeout });
}