/**
 * Performance Budgets and Monitoring Alerts System
 *
 * Implements comprehensive performance governance:
 * - Performance budget enforcement
 * - Real-time monitoring and alerting
 * - Performance regression detection
 * - Automated notifications and reporting
 * - Continuous performance optimization feedback
 */

import { PerformanceTestResult, PerformanceTestRunner } from './performance-testing';

export interface PerformanceBudget {
  name: string;
  description: string;
  metric: string;
  threshold: number;
  unit: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'core-web-vitals' | 'bundle-size' | 'lighthouse' | 'api' | 'custom';
  enabled: boolean;
}

export interface PerformanceAlert {
  id: string;
  budget: PerformanceBudget;
  currentValue: number;
  threshold: number;
  difference: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
  url?: string;
  userAgent?: string;
  recommendations: string[];
}

export interface PerformanceReport {
  timestamp: number;
  summary: {
    totalBudgets: number;
    passedBudgets: number;
    failedBudgets: number;
    alerts: number;
    overallScore: number;
  };
  budgets: Array<{
    budget: PerformanceBudget;
    currentValue: number;
    status: 'passed' | 'failed' | 'warning';
    trend: 'improving' | 'stable' | 'degrading';
  }>;
  alerts: PerformanceAlert[];
  recommendations: string[];
}

/**
 * Comprehensive Performance Budgets Configuration
 */
export const PERFORMANCE_BUDGETS: PerformanceBudget[] = [
  // Core Web Vitals Budgets
  {
    name: 'LCP Budget',
    description: 'Largest Contentful Paint should occur within 2.5 seconds for good user experience',
    metric: 'LCP',
    threshold: 2500,
    unit: 'ms',
    severity: 'critical',
    category: 'core-web-vitals',
    enabled: true
  },
  {
    name: 'FID Budget',
    description: 'First Input Delay should be under 100ms for responsive interactions',
    metric: 'FID',
    threshold: 100,
    unit: 'ms',
    severity: 'high',
    category: 'core-web-vitals',
    enabled: true
  },
  {
    name: 'CLS Budget',
    description: 'Cumulative Layout Shift should be under 0.1 for visual stability',
    metric: 'CLS',
    threshold: 100, // 0.1 * 1000
    unit: 'score',
    severity: 'high',
    category: 'core-web-vitals',
    enabled: true
  },
  {
    name: 'FCP Budget',
    description: 'First Contentful Paint should occur within 1.8 seconds',
    metric: 'FCP',
    threshold: 1800,
    unit: 'ms',
    severity: 'medium',
    category: 'core-web-vitals',
    enabled: true
  },
  {
    name: 'TTFB Budget',
    description: 'Time to First Byte should be under 800ms for fast server response',
    metric: 'TTFB',
    threshold: 800,
    unit: 'ms',
    severity: 'medium',
    category: 'core-web-vitals',
    enabled: true
  },

  // Bundle Size Budgets
  {
    name: 'JavaScript Bundle Budget',
    description: 'Main JavaScript bundle should stay under 250KB for fast loading',
    metric: 'main-bundle-size',
    threshold: 250 * 1024, // 250KB
    unit: 'bytes',
    severity: 'high',
    category: 'bundle-size',
    enabled: true
  },
  {
    name: 'CSS Bundle Budget',
    description: 'CSS bundle should stay under 50KB to minimize render blocking',
    metric: 'css-bundle-size',
    threshold: 50 * 1024, // 50KB
    unit: 'bytes',
    severity: 'medium',
    category: 'bundle-size',
    enabled: true
  },
  {
    name: 'Total Page Weight Budget',
    description: 'Total page weight should not exceed 1MB for mobile users',
    metric: 'total-page-weight',
    threshold: 1024 * 1024, // 1MB
    unit: 'bytes',
    severity: 'high',
    category: 'bundle-size',
    enabled: true
  },
  {
    name: 'Image Optimization Budget',
    description: 'Images should be optimized with at least 70% compression ratio',
    metric: 'image-optimization',
    threshold: 70,
    unit: 'percentage',
    severity: 'medium',
    category: 'bundle-size',
    enabled: true
  },

  // Lighthouse Score Budgets
  {
    name: 'Performance Score Budget',
    description: 'Lighthouse Performance score should be 90 or higher',
    metric: 'lighthouse-performance',
    threshold: 90,
    unit: 'score',
    severity: 'high',
    category: 'lighthouse',
    enabled: true
  },
  {
    name: 'Accessibility Score Budget',
    description: 'Lighthouse Accessibility score should be 95 or higher',
    metric: 'lighthouse-accessibility',
    threshold: 95,
    unit: 'score',
    severity: 'high',
    category: 'lighthouse',
    enabled: true
  },
  {
    name: 'Best Practices Score Budget',
    description: 'Lighthouse Best Practices score should be 95 or higher',
    metric: 'lighthouse-best-practices',
    threshold: 95,
    unit: 'score',
    severity: 'medium',
    category: 'lighthouse',
    enabled: true
  },
  {
    name: 'SEO Score Budget',
    description: 'Lighthouse SEO score should be 100 for optimal discoverability',
    metric: 'lighthouse-seo',
    threshold: 100,
    unit: 'score',
    severity: 'medium',
    category: 'lighthouse',
    enabled: true
  },

  // API Performance Budgets
  {
    name: 'API Response Time Budget',
    description: 'API responses should complete within 200ms',
    metric: 'api-response-time',
    threshold: 200,
    unit: 'ms',
    severity: 'medium',
    category: 'api',
    enabled: true
  },
  {
    name: 'API Availability Budget',
    description: 'API should maintain 99.9% uptime',
    metric: 'api-availability',
    threshold: 99.9,
    unit: 'percentage',
    severity: 'critical',
    category: 'api',
    enabled: true
  }
];

/**
 * Performance Budget Monitor
 */
export class PerformanceBudgetMonitor {
  private alerts: PerformanceAlert[] = [];
  private historicalData: Array<{ timestamp: number; metrics: Record<string, number> }> = [];

  /**
   * Check all performance budgets against current metrics
   */
  async checkBudgets(metrics: Record<string, number>, url?: string): Promise<PerformanceAlert[]> {
    const newAlerts: PerformanceAlert[] = [];

    for (const budget of PERFORMANCE_BUDGETS) {
      if (!budget.enabled) continue;

      const currentValue = metrics[budget.metric];
      if (currentValue === undefined || currentValue === -1) continue;

      const alert = this.checkBudget(budget, currentValue, url);
      if (alert) {
        newAlerts.push(alert);
      }
    }

    // Store alerts and update historical data
    this.alerts.push(...newAlerts);
    this.historicalData.push({
      timestamp: Date.now(),
      metrics
    });

    // Keep only last 100 data points
    if (this.historicalData.length > 100) {
      this.historicalData = this.historicalData.slice(-100);
    }

    return newAlerts;
  }

  /**
   * Check a single performance budget
   */
  private checkBudget(budget: PerformanceBudget, currentValue: number, url?: string): PerformanceAlert | null {
    const isBudgetExceeded = currentValue > budget.threshold;

    if (!isBudgetExceeded) {
      return null;
    }

    const difference = currentValue - budget.threshold;
    const percentageOver = (difference / budget.threshold) * 100;

    // Determine severity based on how much the budget is exceeded
    let severity = budget.severity;
    if (percentageOver > 50) {
      severity = 'critical';
    } else if (percentageOver > 25) {
      severity = 'high';
    } else if (percentageOver > 10) {
      severity = 'medium';
    }

    const alert: PerformanceAlert = {
      id: `${budget.metric}-${Date.now()}`,
      budget,
      currentValue,
      threshold: budget.threshold,
      difference,
      severity,
      message: this.generateAlertMessage(budget, currentValue, difference, percentageOver),
      timestamp: Date.now(),
      resolved: false,
      url,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      recommendations: this.generateRecommendations(budget, currentValue, difference)
    };

    return alert;
  }

  /**
   * Generate alert message
   */
  private generateAlertMessage(budget: PerformanceBudget, currentValue: number, difference: number, percentageOver: number): string {
    const formatValue = (value: number, unit: string) => {
      if (unit === 'bytes') {
        return this.formatBytes(value);
      }
      return `${value}${unit}`;
    };

    return `🚨 Performance Budget Exceeded: ${budget.name}
Current: ${formatValue(currentValue, budget.unit)}
Budget: ${formatValue(budget.threshold, budget.unit)}
Exceeded by: ${formatValue(difference, budget.unit)} (${percentageOver.toFixed(1)}%)`;
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(budget: PerformanceBudget, currentValue: number, difference: number): string[] {
    const recommendations: string[] = [];

    switch (budget.category) {
      case 'core-web-vitals':
        recommendations.push(...this.getCoreWebVitalsRecommendations(budget.metric));
        break;
      case 'bundle-size':
        recommendations.push(...this.getBundleSizeRecommendations(budget.metric));
        break;
      case 'lighthouse':
        recommendations.push(...this.getLighthouseRecommendations(budget.metric));
        break;
      case 'api':
        recommendations.push(...this.getAPIRecommendations(budget.metric));
        break;
    }

    return recommendations;
  }

  /**
   * Get Core Web Vitals specific recommendations
   */
  private getCoreWebVitalsRecommendations(metric: string): string[] {
    const recommendations = {
      LCP: [
        'Optimize images with next/image and WebP format',
        'Implement critical CSS to reduce render-blocking resources',
        'Use CDN for faster asset delivery',
        'Minimize server response times',
        'Preload key resources'
      ],
      FID: [
        'Minimize JavaScript execution time',
        'Break up long tasks with setTimeout',
        'Use React.memo and useMemo for expensive computations',
        'Implement code splitting',
        'Remove unused JavaScript'
      ],
      CLS: [
        'Set size attributes for images and videos',
        'Reserve space for ads and embeds',
        'Avoid inserting content above existing content',
        'Use transform animations instead of layout changes',
        'Ensure web fonts display quickly'
      ],
      FCP: [
        'Minimize render-blocking resources',
        'Eliminate unused CSS',
        'Inline critical CSS',
        'Minimize browser reflow',
        'Optimize font loading'
      ],
      TTFB: [
        'Optimize server performance',
        'Use CDN for edge caching',
        'Implement efficient caching strategies',
        'Minimize server processing time',
        'Optimize database queries'
      ]
    };

    return recommendations[metric] || [];
  }

  /**
   * Get bundle size specific recommendations
   */
  private getBundleSizeRecommendations(metric: string): string[] {
    const recommendations = {
      'main-bundle-size': [
        'Implement code splitting with dynamic imports',
        'Remove unused dependencies',
        'Use tree-shaking to eliminate dead code',
        'Implement lazy loading for components',
        'Optimize third-party libraries'
      ],
      'css-bundle-size': [
        'Remove unused CSS with PurgeCSS',
        'Use CSS-in-JS for component-specific styles',
        'Implement critical CSS extraction',
        'Minimize CSS with optimization tools',
        'Use CSS custom properties efficiently'
      ],
      'total-page-weight': [
        'Implement image optimization and compression',
        'Use efficient formats (WebP, AVIF)',
        'Implement lazy loading for images',
        'Minimize font files',
        'Optimize asset delivery'
      ],
      'image-optimization': [
        'Use next/image for automatic optimization',
        'Implement responsive images',
        'Convert images to modern formats',
        'Compress images without quality loss',
        'Use appropriate image dimensions'
      ]
    };

    return recommendations[metric] || [];
  }

  /**
   * Get Lighthouse specific recommendations
   */
  private getLighthouseRecommendations(metric: string): string[] {
    const recommendations = {
      'lighthouse-performance': [
        'Follow Core Web Vitals optimization guidelines',
        'Implement efficient caching strategies',
        'Optimize critical rendering path',
        'Minimize main thread work',
        'Use service worker for offline functionality'
      ],
      'lighthouse-accessibility': [
        'Add proper ARIA labels and roles',
        'Ensure sufficient color contrast',
        'Implement keyboard navigation',
        'Add alt text for images',
        'Use semantic HTML elements'
      ],
      'lighthouse-best-practices': [
        'Use HTTPS for all resources',
        'Implement CSP headers',
        'Avoid deprecated APIs',
        'Handle errors gracefully',
        'Use modern JavaScript features appropriately'
      ],
      'lighthouse-seo': [
        'Add proper meta descriptions',
        'Use structured data',
        'Implement proper heading hierarchy',
        'Add canonical URLs',
        'Optimize for mobile devices'
      ]
    };

    return recommendations[metric] || [];
  }

  /**
   * Get API specific recommendations
   */
  private getAPIRecommendations(metric: string): string[] {
    const recommendations = {
      'api-response-time': [
        'Implement database query optimization',
        'Add proper caching layers',
        'Use connection pooling',
        'Optimize API endpoint logic',
        'Implement response compression'
      ],
      'api-availability': [
        'Implement proper error handling',
        'Add health check endpoints',
        'Use circuit breaker pattern',
        'Implement retry mechanisms',
        'Monitor and alert on failures'
      ]
    };

    return recommendations[metric] || [];
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport(): PerformanceReport {
    const enabledBudgets = PERFORMANCE_BUDGETS.filter(b => b.enabled);
    const recentMetrics = this.getRecentMetrics();

    let passedBudgets = 0;
    let failedBudgets = 0;
    const budgetStatuses = [];

    for (const budget of enabledBudgets) {
      const currentValue = recentMetrics[budget.metric];
      if (currentValue === undefined || currentValue === -1) continue;

      const passed = currentValue <= budget.threshold;
      if (passed) passedBudgets++;
      else failedBudgets++;

      budgetStatuses.push({
        budget,
        currentValue,
        status: passed ? 'passed' : 'failed' as 'passed' | 'failed',
        trend: this.calculateTrend(budget.metric)
      });
    }

    const activeAlerts = this.alerts.filter(a => !a.resolved);
    const overallScore = enabledBudgets.length > 0 ? (passedBudgets / enabledBudgets.length) * 100 : 100;

    return {
      timestamp: Date.now(),
      summary: {
        totalBudgets: enabledBudgets.length,
        passedBudgets,
        failedBudgets,
        alerts: activeAlerts.length,
        overallScore
      },
      budgets: budgetStatuses,
      alerts: activeAlerts,
      recommendations: this.generateGlobalRecommendations()
    };
  }

  /**
   * Calculate performance trend for a metric
   */
  private calculateTrend(metric: string): 'improving' | 'stable' | 'degrading' {
    if (this.historicalData.length < 3) return 'stable';

    const recent = this.historicalData.slice(-3);
    const values = recent.map(d => d.metrics[metric]).filter(v => v !== undefined);

    if (values.length < 2) return 'stable';

    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const change = ((lastValue - firstValue) / firstValue) * 100;

    if (change < -5) return 'improving'; // 5% improvement
    if (change > 5) return 'degrading';  // 5% degradation
    return 'stable';
  }

  /**
   * Get the most recent metrics
   */
  private getRecentMetrics(): Record<string, number> {
    if (this.historicalData.length === 0) return {};
    return this.historicalData[this.historicalData.length - 1].metrics;
  }

  /**
   * Generate global performance recommendations
   */
  private generateGlobalRecommendations(): string[] {
    const report = this.generateReport();
    const recommendations: string[] = [];

    // Add recommendations based on failed budgets
    const failedCategories = new Set(
      report.budgets
        .filter(b => b.status === 'failed')
        .map(b => b.budget.category)
    );

    if (failedCategories.has('core-web-vitals')) {
      recommendations.push('Prioritize Core Web Vitals optimization for better user experience');
    }

    if (failedCategories.has('bundle-size')) {
      recommendations.push('Implement code splitting and bundle optimization strategies');
    }

    if (failedCategories.has('lighthouse')) {
      recommendations.push('Follow Lighthouse recommendations for overall performance improvement');
    }

    if (failedCategories.has('api')) {
      recommendations.push('Optimize API performance and reliability');
    }

    // Add trend-based recommendations
    const degradingMetrics = report.budgets.filter(b => b.trend === 'degrading');
    if (degradingMetrics.length > 0) {
      recommendations.push('Monitor and address performance regressions in degrading metrics');
    }

    return recommendations;
  }

  /**
   * Utility function to format bytes
   */
  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Get all alerts
   */
  getAlerts(): PerformanceAlert[] {
    return this.alerts;
  }

  /**
   * Get active (unresolved) alerts
   */
  getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(a => !a.resolved);
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Clear historical data
   */
  clearHistoricalData(): void {
    this.historicalData = [];
  }
}

/**
 * Global performance budget monitor instance
 */
export const performanceBudgetMonitor = new PerformanceBudgetMonitor();

/**
 * Convenience function to check performance budgets with current metrics
 */
export async function checkPerformanceBudgets(): Promise<PerformanceAlert[]> {
  if (typeof window === 'undefined') {
    return [];
  }

  // Collect current performance metrics
  const metrics: Record<string, number> = {};

  // Get Core Web Vitals (simplified - in real implementation, use web-vitals library)
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    metrics['TTFB'] = navigation.responseStart - navigation.requestStart;
    metrics['FCP'] = navigation.domContentLoadedEventEnd - navigation.navigationStart;
  }

  // Get bundle sizes
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  metrics['main-bundle-size'] = resources
    .filter(r => r.name.includes('_next/static') && r.name.endsWith('.js'))
    .reduce((total, r) => total + (r.transferSize || 0), 0);

  metrics['css-bundle-size'] = resources
    .filter(r => r.name.includes('_next/static') && r.name.endsWith('.css'))
    .reduce((total, r) => total + (r.transferSize || 0), 0);

  metrics['total-page-weight'] = resources
    .reduce((total, r) => total + (r.transferSize || 0), 0);

  return performanceBudgetMonitor.checkBudgets(metrics, window.location.href);
}

export default PerformanceBudgetMonitor;