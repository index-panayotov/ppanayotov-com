import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { logger } from './logger';

/**
 * Performance Monitoring Library for Core Web Vitals and Performance Metrics
 *
 * This library provides:
 * - Core Web Vitals tracking (LCP, FID, CLS, FCP, TTFB)
 * - Performance budget monitoring and alerts
 * - Metrics collection and reporting
 * - Performance regression detection
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  navigationType: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

export interface PerformanceBudgets {
  [key: string]: number;
}

// Performance budgets based on industry standards and story requirements
export const PERFORMANCE_BUDGETS: PerformanceBudgets = {
  LCP: 2500, // Largest Contentful Paint - 2.5 seconds
  FID: 100,  // First Input Delay - 100ms
  CLS: 100,  // Cumulative Layout Shift - 0.1 (x1000 for easier comparison)
  FCP: 1800, // First Contentful Paint - 1.8 seconds
  TTFB: 800, // Time to First Byte - 800ms
  TTI: 3500, // Time to Interactive - 3.5 seconds
} as const;

// Performance thresholds for alerts
export const PERFORMANCE_THRESHOLDS = {
  GOOD: 'good',
  NEEDS_IMPROVEMENT: 'needs-improvement',
  POOR: 'poor'
} as const;

/**
 * Get performance threshold rating for a metric
 */
export function getPerformanceRating(metric: PerformanceMetric): string {
  const { name, value } = metric;

  switch (name) {
    case 'LCP':
      if (value <= 2500) return PERFORMANCE_THRESHOLDS.GOOD;
      if (value <= 4000) return PERFORMANCE_THRESHOLDS.NEEDS_IMPROVEMENT;
      return PERFORMANCE_THRESHOLDS.POOR;

    case 'FID':
      if (value <= 100) return PERFORMANCE_THRESHOLDS.GOOD;
      if (value <= 300) return PERFORMANCE_THRESHOLDS.NEEDS_IMPROVEMENT;
      return PERFORMANCE_THRESHOLDS.POOR;

    case 'CLS':
      const clsValue = value * 1000; // CLS is multiplied by 1000 for reporting
      if (clsValue <= 100) return PERFORMANCE_THRESHOLDS.GOOD;
      if (clsValue <= 250) return PERFORMANCE_THRESHOLDS.NEEDS_IMPROVEMENT;
      return PERFORMANCE_THRESHOLDS.POOR;

    case 'FCP':
      if (value <= 1800) return PERFORMANCE_THRESHOLDS.GOOD;
      if (value <= 3000) return PERFORMANCE_THRESHOLDS.NEEDS_IMPROVEMENT;
      return PERFORMANCE_THRESHOLDS.POOR;

    case 'TTFB':
      if (value <= 800) return PERFORMANCE_THRESHOLDS.GOOD;
      if (value <= 1800) return PERFORMANCE_THRESHOLDS.NEEDS_IMPROVEMENT;
      return PERFORMANCE_THRESHOLDS.POOR;

    default:
      return PERFORMANCE_THRESHOLDS.GOOD;
  }
}

/**
 * Format metric for consistent reporting
 */
function formatMetric(metric: Metric): PerformanceMetric {
  return {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
    navigationType: metric.navigationType || 'unknown',
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };
}

/**
 * Send metrics to analytics service
 */
function sendToAnalytics(metric: PerformanceMetric) {
  // Send to Google Analytics if available
  if (typeof gtag !== 'undefined') {
    const rating = getPerformanceRating(metric);

    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      custom_map: {
        metric_rating: rating,
        navigation_type: metric.navigationType
      },
      non_interaction: true,
    });
  }

  // Send to performance monitoring API
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
      keepalive: true // Ensure data is sent even if page unloads
    }).catch(error => {
      console.warn('Failed to send performance metric:', error);
    });
  }
}

/**
 * Check performance budget and alert if exceeded
 */
export function checkPerformanceBudget(metric: PerformanceMetric) {
  const budget = PERFORMANCE_BUDGETS[metric.name];
  const actualValue = metric.name === 'CLS' ? metric.value * 1000 : metric.value;

  if (budget && actualValue > budget) {
    const rating = getPerformanceRating(metric);
    const overBudget = actualValue - budget;

    console.warn(`🚨 Performance budget exceeded for ${metric.name}`, {
      metric: metric.name,
      actualValue: actualValue,
      budget: budget,
      overBudget: overBudget,
      rating: rating,
      url: metric.url
    });

    // Alert in development for immediate feedback
    if (process.env.NODE_ENV === 'development') {
      console.table({
        'Metric': metric.name,
        'Actual Value': `${actualValue}${metric.name === 'CLS' ? '' : 'ms'}`,
        'Budget': `${budget}${metric.name === 'CLS' ? '' : 'ms'}`,
        'Over Budget': `${overBudget}${metric.name === 'CLS' ? '' : 'ms'}`,
        'Rating': rating,
        'Status': rating === PERFORMANCE_THRESHOLDS.POOR ? '🔴 Poor' : '⚠️ Needs Improvement'
      });
    }

    // Send alert to monitoring service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/performance/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'budget_exceeded',
          metric: metric.name,
          value: actualValue,
          budget: budget,
          overBudget: overBudget,
          rating: rating,
          timestamp: metric.timestamp,
          url: metric.url
        }),
        keepalive: true
      }).catch(console.warn);
    }
  }
}

/**
 * Process and handle each Web Vital metric
 */
function handleMetric(metric: Metric) {
  const formattedMetric = formatMetric(metric);

  // Log performance metrics in development
  if (process.env.NODE_ENV === 'development') {
    const rating = getPerformanceRating(formattedMetric);
    const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '🔴';

    logger.debug(`${emoji} ${formattedMetric.name}: ${formattedMetric.value}${formattedMetric.name === 'CLS' ? '' : 'ms'} (${rating})`);
  }

  // Check performance budgets
  checkPerformanceBudget(formattedMetric);

  // Send to analytics and monitoring
  sendToAnalytics(formattedMetric);
}

/**
 * Initialize Core Web Vitals monitoring
 */
export function initPerformanceMonitoring() {
  try {
    // Initialize all Core Web Vitals metrics
    onCLS(handleMetric, { reportAllChanges: true });
    onFID(handleMetric);
    onFCP(handleMetric, { reportAllChanges: true });
    onLCP(handleMetric, { reportAllChanges: true });
    onTTFB(handleMetric);

    logger.info('🚀 Performance monitoring initialized');

    // Performance observer for additional metrics
    if (typeof PerformanceObserver !== 'undefined') {
      // Monitor Time to Interactive (TTI) approximation
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;

            // TTI approximation: domContentLoadedEventEnd + buffer
            const tti = navEntry.domContentLoadedEventEnd + 50;

            const ttiMetric: PerformanceMetric = {
              name: 'TTI',
              value: tti,
              id: `${Date.now()}-${Math.random()}`,
              delta: tti,
              navigationType: navEntry.type || 'unknown',
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent
            };

            handleMetric(ttiMetric as Metric);
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
    }

  } catch (error) {
    console.error('Failed to initialize performance monitoring:', error);
  }
}

/**
 * Get current performance metrics summary
 */
export function getPerformanceSummary(): Record<string, any> {
  const performance = window.performance;
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (!navigation) {
    return { error: 'Navigation timing not available' };
  }

  return {
    // Navigation metrics
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    domComplete: navigation.domComplete - navigation.navigationStart,

    // Network metrics
    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcpConnect: navigation.connectEnd - navigation.connectStart,
    tlsHandshake: navigation.connectEnd - navigation.secureConnectionStart,
    serverResponse: navigation.responseEnd - navigation.requestStart,

    // Resource metrics
    resources: performance.getEntriesByType('resource').length,

    // Memory (if available)
    memory: (performance as any).memory ? {
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
    } : null,

    timestamp: Date.now()
  };
}

/**
 * Performance debugging utilities
 */
export const PerformanceDebug = {
  /**
   * Mark start of a performance measurement
   */
  mark(name: string) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`);
    }
  },

  /**
   * Mark end of a performance measurement and log duration
   */
  measure(name: string) {
    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name)[0];
      if (measure && process.env.NODE_ENV === 'development') {
        logger.debug(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
      }
    }
  },

  /**
   * Clear all performance marks and measures
   */
  clear() {
    if (typeof performance !== 'undefined' && performance.clearMarks && performance.clearMeasures) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
};

// Export for global access
declare global {
  interface Window {
    performanceMonitoring: typeof PerformanceDebug;
  }
}

if (typeof window !== 'undefined') {
  window.performanceMonitoring = PerformanceDebug;
}

export default {
  init: initPerformanceMonitoring,
  getPerformanceRating,
  checkPerformanceBudget,
  getPerformanceSummary,
  debug: PerformanceDebug,
  PERFORMANCE_BUDGETS,
  PERFORMANCE_THRESHOLDS
};