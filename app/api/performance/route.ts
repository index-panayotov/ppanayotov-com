import { NextRequest } from 'next/server';
import {
  createTypedSuccessResponse,
  createTypedErrorResponse,
  API_ERROR_CODES
} from '@/types/api';

/**
 * Performance Metrics Collection API
 *
 * Handles Core Web Vitals and performance metrics from the client:
 * - Stores metrics for analysis
 * - Provides performance insights
 * - Tracks performance trends
 */

interface PerformanceMetricPayload {
  name: string;
  value: number;
  id: string;
  delta: number;
  navigationType: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface PerformanceAlert {
  type: string;
  metric: string;
  value: number;
  budget: number;
  overBudget: number;
  rating: string;
  timestamp: number;
  url: string;
}

// In-memory storage for development (in production, use database or external service)
const performanceMetrics: PerformanceMetricPayload[] = [];
const performanceAlerts: PerformanceAlert[] = [];

/**
 * POST /api/performance - Collect performance metrics
 */
export async function POST(request: NextRequest) {
  try {
    const metric = await request.json() as PerformanceMetricPayload;

    // Validate required fields
    if (!metric.name || typeof metric.value !== 'number') {
      return createTypedErrorResponse(
        API_ERROR_CODES.VALIDATION_ERROR,
        'Invalid metric data: name and value are required'
      );
    }

    // Store metric (in production, store in database)
    performanceMetrics.push({
      ...metric,
      timestamp: Date.now()
    });

    // Keep only last 1000 metrics to prevent memory issues
    if (performanceMetrics.length > 1000) {
      performanceMetrics.shift();
    }

    // Log important metrics in development
    if (process.env.NODE_ENV === 'development') {
      const rating = getMetricRating(metric);
      console.log(`📊 Metric collected: ${metric.name} = ${metric.value}${metric.name === 'CLS' ? '' : 'ms'} (${rating})`);
    }

    return createTypedSuccessResponse(
      { collected: true, total: performanceMetrics.length },
      'Performance metric collected successfully'
    );

  } catch (error) {
    console.error('Error collecting performance metric:', error);
    return createTypedErrorResponse(
      API_ERROR_CODES.INTERNAL_ERROR,
      'Failed to collect performance metric'
    );
  }
}

/**
 * GET /api/performance - Get performance metrics summary
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';
    const metric = searchParams.get('metric');

    // Calculate timeframe in milliseconds
    const timeframMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }[timeframe] || 24 * 60 * 60 * 1000;

    const cutoffTime = Date.now() - timeframMs;

    // Filter metrics by timeframe
    const filteredMetrics = performanceMetrics.filter(m => m.timestamp > cutoffTime);

    // Filter by specific metric if requested
    const metricsToAnalyze = metric
      ? filteredMetrics.filter(m => m.name === metric)
      : filteredMetrics;

    // Generate summary statistics
    const summary = generateMetricsSummary(metricsToAnalyze);

    return createTypedSuccessResponse({
      summary,
      totalMetrics: filteredMetrics.length,
      timeframe,
      alerts: performanceAlerts.filter(a => a.timestamp > cutoffTime)
    }, 'Performance summary generated successfully');

  } catch (error) {
    console.error('Error generating performance summary:', error);
    return createTypedErrorResponse(
      API_ERROR_CODES.INTERNAL_ERROR,
      'Failed to generate performance summary'
    );
  }
}

/**
 * Helper function to get metric rating
 */
function getMetricRating(metric: PerformanceMetricPayload): string {
  const { name, value } = metric;

  switch (name) {
    case 'LCP':
      if (value <= 2500) return 'good';
      if (value <= 4000) return 'needs-improvement';
      return 'poor';

    case 'FID':
      if (value <= 100) return 'good';
      if (value <= 300) return 'needs-improvement';
      return 'poor';

    case 'CLS':
      const clsValue = value * 1000;
      if (clsValue <= 100) return 'good';
      if (clsValue <= 250) return 'needs-improvement';
      return 'poor';

    case 'FCP':
      if (value <= 1800) return 'good';
      if (value <= 3000) return 'needs-improvement';
      return 'poor';

    case 'TTFB':
      if (value <= 800) return 'good';
      if (value <= 1800) return 'needs-improvement';
      return 'poor';

    default:
      return 'unknown';
  }
}

/**
 * Generate comprehensive metrics summary
 */
function generateMetricsSummary(metrics: PerformanceMetricPayload[]) {
  if (metrics.length === 0) {
    return { message: 'No metrics available for the selected timeframe' };
  }

  // Group metrics by name
  const metricsByName = metrics.reduce((acc, metric) => {
    if (!acc[metric.name]) {
      acc[metric.name] = [];
    }
    acc[metric.name]!.push(metric);
    return acc;
  }, {} as Record<string, PerformanceMetricPayload[]>);

  // Calculate statistics for each metric
  const summary = Object.entries(metricsByName).map(([name, values]) => {
    const sortedValues = values.map(v => v.value).sort((a, b) => a - b);
    const count = values.length;

    return {
      name,
      count,
      average: Number((sortedValues.reduce((sum, val) => sum + val, 0) / count).toFixed(2)),
      median: sortedValues[Math.floor(count / 2)],
      p75: sortedValues[Math.floor(count * 0.75)],
      p90: sortedValues[Math.floor(count * 0.90)],
      p95: sortedValues[Math.floor(count * 0.95)],
      min: sortedValues[0],
      max: sortedValues[count - 1],
      rating: getMetricRating({ name, value: sortedValues[Math.floor(count / 2)] } as PerformanceMetricPayload)
    };
  });

  return {
    metrics: summary,
    totalSamples: metrics.length,
    uniqueUrls: [...new Set(metrics.map(m => m.url))].length,
    timeRange: {
      earliest: Math.min(...metrics.map(m => m.timestamp)),
      latest: Math.max(...metrics.map(m => m.timestamp))
    }
  };
}

/**
 * Store performance alert
 */
export async function storePerformanceAlert(alert: PerformanceAlert) {
  performanceAlerts.push(alert);

  // Keep only last 100 alerts
  if (performanceAlerts.length > 100) {
    performanceAlerts.shift();
  }

  // In production, you might want to:
  // - Send alerts to monitoring service (Sentry, DataDog, etc.)
  // - Send notifications to team (Slack, email)
  // - Store in database for historical analysis
}