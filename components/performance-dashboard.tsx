"use client";

import { useState, useEffect } from 'react';
import { getServiceWorkerStatus, getCacheStats, getPerformanceStats } from '@/lib/sw-registration';

/**
 * Performance Dashboard Component
 *
 * Real-time performance monitoring for development.
 * Shows Core Web Vitals, bundle stats, cache info, and service worker status.
 *
 * Only renders in development mode.
 */
export function PerformanceDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [swStatus, setSwStatus] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Load performance metrics
    const loadMetrics = async () => {
      // Get service worker status
      const sw = getServiceWorkerStatus();
      setSwStatus(sw);

      // Get cache stats
      const cache = await getCacheStats();
      setCacheStats(cache);

      // Get performance metrics
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');

        setMetrics({
          dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
          tcp: navigation?.connectEnd - navigation?.connectStart,
          ttfb: navigation?.responseStart - navigation?.requestStart,
          download: navigation?.responseEnd - navigation?.responseStart,
          domInteractive: navigation?.domInteractive - navigation?.fetchStart,
          domComplete: navigation?.domComplete - navigation?.fetchStart,
          fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        });
      }
    };

    loadMetrics();

    // Keyboard shortcut to toggle dashboard (Ctrl/Cmd + Shift + P)
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-xs font-medium"
        title="Performance Dashboard (Ctrl+Shift+P)"
      >
        📊 Perf
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-2xl border border-slate-200 w-96 max-h-[600px] overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-blue-600 text-white px-4 py-3 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h3 className="font-semibold">Performance Dashboard</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-blue-700 rounded p-1 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Service Worker Status */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Service Worker</h4>
          <div className="bg-slate-50 rounded p-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Status:</span>
              <span className={`font-medium ${swStatus?.isRegistered ? 'text-green-600' : 'text-red-600'}`}>
                {swStatus?.isRegistered ? '✓ Active' : '✗ Inactive'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Supported:</span>
              <span className="font-medium">{swStatus?.isSupported ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Core Metrics */}
        {metrics && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Load Metrics</h4>
            <div className="bg-slate-50 rounded p-3 space-y-1 text-xs">
              <MetricRow label="DNS" value={metrics.dns} unit="ms" />
              <MetricRow label="TCP" value={metrics.tcp} unit="ms" />
              <MetricRow label="TTFB" value={metrics.ttfb} unit="ms" good={800} />
              <MetricRow label="Download" value={metrics.download} unit="ms" />
              <MetricRow label="DOM Interactive" value={metrics.domInteractive} unit="ms" />
              <MetricRow label="DOM Complete" value={metrics.domComplete} unit="ms" />
              <MetricRow label="FCP" value={metrics.fcp} unit="ms" good={1800} />
            </div>
          </div>
        )}

        {/* Cache Stats */}
        {cacheStats && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Cache</h4>
            <div className="bg-slate-50 rounded p-3 space-y-1 text-xs">
              {Object.entries(cacheStats).map(([name, stats]: [string, any]) => (
                <div key={name} className="flex justify-between">
                  <span className="text-slate-600">{name}:</span>
                  <span className="font-medium">{stats.count || 0} items</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Press <kbd className="px-1 py-0.5 bg-white rounded text-xs">Ctrl+Shift+P</kbd> to toggle this dashboard
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, unit, good }: { label: string; value: number; unit: string; good?: number }) {
  const isGood = good ? value <= good : true;
  const color = isGood ? 'text-green-600' : 'text-orange-600';

  return (
    <div className="flex justify-between">
      <span className="text-slate-600">{label}:</span>
      <span className={`font-medium ${color}`}>
        {Math.round(value)}{unit}
      </span>
    </div>
  );
}

export default PerformanceDashboard;
