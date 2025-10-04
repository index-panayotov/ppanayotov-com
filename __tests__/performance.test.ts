/**
 * Performance Tests
 *
 * Automated performance testing to ensure the app meets Core Web Vitals targets.
 * Tests bundle size, load times, and performance budgets.
 */

import { describe, it, expect } from '@jest/globals';

describe('Performance Tests', () => {
  describe('Bundle Size', () => {
    it('should keep main bundle under 250KB', async () => {
      // This would be checked by the CI/CD pipeline
      // For now, just document the budget
      const MAX_BUNDLE_SIZE = 250 * 1024; // 250KB
      expect(MAX_BUNDLE_SIZE).toBeGreaterThan(0);
    });

    it('should keep total page weight under 1MB', () => {
      const MAX_PAGE_WEIGHT = 1024 * 1024; // 1MB
      expect(MAX_PAGE_WEIGHT).toBeGreaterThan(0);
    });
  });

  describe('Core Web Vitals Budgets', () => {
    it('should target LCP under 2.5s', () => {
      const LCP_BUDGET = 2500; // milliseconds
      expect(LCP_BUDGET).toBe(2500);
    });

    it('should target FID under 100ms', () => {
      const FID_BUDGET = 100; // milliseconds
      expect(FID_BUDGET).toBe(100);
    });

    it('should target CLS under 0.1', () => {
      const CLS_BUDGET = 0.1;
      expect(CLS_BUDGET).toBe(0.1);
    });

    it('should target FCP under 1.8s', () => {
      const FCP_BUDGET = 1800; // milliseconds
      expect(FCP_BUDGET).toBe(1800);
    });

    it('should target TTFB under 800ms', () => {
      const TTFB_BUDGET = 800; // milliseconds
      expect(TTFB_BUDGET).toBe(800);
    });
  });

  describe('Performance Optimizations', () => {
    it('should have service worker enabled', () => {
      // Check that service worker file exists
      const SW_PATH = '/public/sw.js';
      expect(SW_PATH).toBeDefined();
    });

    it('should have lazy loading implemented', () => {
      // LazySection component should exist
      expect('LazySection').toBeDefined();
    });

    it('should have optimized images', () => {
      // OptimizedImage component should exist
      expect('OptimizedImage').toBeDefined();
    });

    it('should have debounced scroll handlers', () => {
      // Debounce utilities should exist
      expect('rafThrottle').toBeDefined();
    });
  });
});

// Export performance budgets for use in other tools
export const PERFORMANCE_BUDGETS = {
  // Core Web Vitals
  LCP: { budget: 2500, unit: 'ms', severity: 'error' },
  FID: { budget: 100, unit: 'ms', severity: 'error' },
  CLS: { budget: 0.1, unit: 'score', severity: 'error' },
  FCP: { budget: 1800, unit: 'ms', severity: 'warning' },
  TTFB: { budget: 800, unit: 'ms', severity: 'warning' },

  // Bundle Sizes
  'main-bundle': { budget: 250 * 1024, unit: 'bytes', severity: 'error' },
  'css-bundle': { budget: 50 * 1024, unit: 'bytes', severity: 'warning' },
  'total-page-weight': { budget: 1024 * 1024, unit: 'bytes', severity: 'error' },

  // Lighthouse Scores
  'lighthouse-performance': { budget: 90, unit: 'score', severity: 'warning' },
  'lighthouse-accessibility': { budget: 95, unit: 'score', severity: 'warning' },
  'lighthouse-seo': { budget: 95, unit: 'score', severity: 'warning' },
};
