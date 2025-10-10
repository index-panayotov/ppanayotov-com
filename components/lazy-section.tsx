"use client";

import { useEffect, useRef, useState, ReactNode } from 'react';
import { LoadingSkeleton } from './loading-skeleton';

interface LazySectionProps {
  children: ReactNode;
  /**
   * Root margin for IntersectionObserver
   * Default: '200px' - loads 200px before section enters viewport
   */
  rootMargin?: string;
  /**
   * Show loading skeleton while loading
   */
  showSkeleton?: boolean;
  /**
   * Custom skeleton component
   */
  skeleton?: ReactNode;
  /**
   * Minimum height while loading to prevent layout shift
   */
  minHeight?: string;
  /**
   * Optional className for the wrapper
   */
  className?: string;
  /**
   * Callback when section becomes visible
   */
  onVisible?: () => void;
}

/**
 * Lazy Section Component
 *
 * Loads section content only when it's about to enter the viewport.
 * Uses IntersectionObserver for efficient lazy loading.
 *
 * Benefits:
 * - Reduces initial bundle size
 * - Improves Time to Interactive (TTI)
 * - Better Core Web Vitals scores
 * - Prevents layout shift with minHeight
 */
export function LazySection({
  children,
  rootMargin = '200px',
  showSkeleton = true,
  skeleton,
  minHeight,
  className = '',
  onVisible,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately if IntersectionObserver not supported
      setIsVisible(true);
      setHasLoaded(true);
      onVisible?.();
      return;
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            onVisible?.();

            // Disconnect after first intersection
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold: 0.01, // Trigger as soon as 1% is visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasLoaded, rootMargin, onVisible]);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={minHeight && !isVisible ? { minHeight } : undefined}
    >
      {isVisible ? (
        children
      ) : showSkeleton ? (
        skeleton || <SectionSkeleton />
      ) : (
        <div style={minHeight ? { minHeight } : { height: '400px' }} />
      )}
    </div>
  );
}

/**
 * Default section skeleton
 */
function SectionSkeleton() {
  return (
    <div className="cv-section animate-pulse">
      {/* Section heading skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-slate-200 rounded-lg w-48 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-64"></div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="cv-card">
            <div className="flex justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/5"></div>
            </div>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-6 bg-slate-200 rounded-full w-20"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LazySection;
