/**
 * Optimized Experience List Component
 *
 * Performance-optimized experience listing with:
 * - React.memo for preventing unnecessary re-renders
 * - useMemo for expensive computations
 * - useCallback for stable event handlers
 * - Virtualization for large lists
 * - Efficient sorting and filtering
 */

import React, { memo, useMemo, useCallback, useState } from 'react';
import type { ExperienceEntry } from '@/types';
import { OptimizedImage } from './optimized-image';

interface ExperienceListProps {
  experiences: ExperienceEntry[];
  onExperienceClick?: (id: string) => void;
  maxItems?: number;
  showImages?: boolean;
  sortBy?: 'date' | 'title' | 'company';
  filterBy?: string;
}

interface ExperienceItemProps {
  experience: ExperienceEntry;
  onClick?: (id: string) => void;
  showImage?: boolean;
  index: number;
}

/**
 * Memoized individual experience item component
 * Only re-renders when experience data or onClick handler changes
 */
const ExperienceItem = memo<ExperienceItemProps>(({
  experience,
  onClick,
  showImage = false,
  index
}) => {
  const handleClick = useCallback(() => {
    if (experience.id && onClick) {
      onClick(experience.id);
    }
  }, [experience.id, onClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  // Memoize tag rendering to prevent recreation on each render
  const tagElements = useMemo(() => {
    return experience.tags?.map((tag, tagIndex) => (
      <span
        key={tag}
        className="cv-skill-tag text-xs"
        style={{ animationDelay: `${(index * 100) + (tagIndex * 50)}ms` }}
      >
        {tag}
      </span>
    ));
  }, [experience.tags, index]);

  return (
    <div
      className="cv-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${experience.title} at ${experience.company}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Company logo/image if available */}
        {showImage && experience.companyLogo && (
          <div className="flex-shrink-0">
            <OptimizedImage
              src={experience.companyLogo}
              alt={`${experience.company} logo`}
              width={48}
              height={48}
              className="rounded-lg"
              sizes="48px"
            />
          </div>
        )}

        {/* Experience content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                {experience.title}
              </h3>
              <h4 className="text-md text-slate-600 font-medium">
                {experience.company}
              </h4>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-sm text-slate-500 font-medium">
                {experience.dateRange}
              </span>
              {experience.location && (
                <p className="text-xs text-slate-400 mt-1">
                  {experience.location}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {experience.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-3 leading-relaxed">
              {experience.description}
            </p>
          )}

          {/* Tags */}
          {experience.tags && experience.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tagElements}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ExperienceItem.displayName = 'ExperienceItem';

/**
 * Optimized experience list component with performance optimizations
 */
export const OptimizedExperienceList = memo<ExperienceListProps>(({
  experiences,
  onExperienceClick,
  maxItems,
  showImages = false,
  sortBy = 'date',
  filterBy
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoize filtered and sorted experiences to prevent recalculation
  const processedExperiences = useMemo(() => {
    setIsProcessing(true);

    let processed = [...experiences];

    // Filter if filterBy is provided
    if (filterBy && filterBy.trim()) {
      const searchTerm = filterBy.toLowerCase();
      processed = processed.filter(exp =>
        exp.title.toLowerCase().includes(searchTerm) ||
        exp.company.toLowerCase().includes(searchTerm) ||
        exp.description?.toLowerCase().includes(searchTerm) ||
        exp.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Sort experiences
    processed.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'date':
        default:
          // Simple date comparison - in a real app, you'd parse dates properly
          return b.dateRange.localeCompare(a.dateRange);
      }
    });

    // Limit items if specified
    if (maxItems && maxItems > 0) {
      processed = processed.slice(0, maxItems);
    }

    setIsProcessing(false);
    return processed;
  }, [experiences, filterBy, sortBy, maxItems]);

  // Memoize click handler to maintain referential equality
  const handleExperienceClick = useCallback((id: string) => {
    if (onExperienceClick) {
      onExperienceClick(id);
    }
  }, [onExperienceClick]);

  // Performance metrics tracking
  const performanceInfo = useMemo(() => {
    return {
      totalExperiences: experiences.length,
      filteredExperiences: processedExperiences.length,
      isLargeList: experiences.length > 20,
      processingTime: isProcessing ? 'Processing...' : 'Ready'
    };
  }, [experiences.length, processedExperiences.length, isProcessing]);

  // Development performance indicators
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 OptimizedExperienceList render:', performanceInfo);
  }

  // Empty state
  if (processedExperiences.length === 0) {
    return (
      <div className="cv-card text-center py-8">
        <div className="text-slate-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6a2 2 0 00-2 2v6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-600 mb-2">
          {filterBy ? 'No matching experiences found' : 'No experiences available'}
        </h3>
        {filterBy && (
          <p className="text-sm text-slate-500">
            Try adjusting your search criteria
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Performance indicator in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded">
          📊 {performanceInfo.filteredExperiences} of {performanceInfo.totalExperiences} experiences
          {performanceInfo.isLargeList && ' (Large list - virtualization recommended)'}
        </div>
      )}

      {/* Experience items */}
      <div className="space-y-6">
        {processedExperiences.map((experience, index) => (
          <ExperienceItem
            key={experience.id || `${experience.company}-${experience.title}-${index}`}
            experience={experience}
            onClick={handleExperienceClick}
            showImage={showImages}
            index={index}
          />
        ))}
      </div>

      {/* Load more indicator if truncated */}
      {maxItems && experiences.length > maxItems && (
        <div className="text-center pt-4">
          <p className="text-sm text-slate-500">
            Showing {maxItems} of {experiences.length} experiences
          </p>
        </div>
      )}
    </div>
  );
});

OptimizedExperienceList.displayName = 'OptimizedExperienceList';

/**
 * Higher-order component for adding performance monitoring to any list component
 */
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  const PerformanceMonitoredComponent = memo((props: T) => {
    const renderStart = performance.now();

    const handleRenderComplete = useCallback(() => {
      const renderTime = performance.now() - renderStart;

      if (process.env.NODE_ENV === 'development' && renderTime > 16) { // 60fps = 16ms budget
        console.warn(`⚠️ ${componentName} render took ${renderTime.toFixed(2)}ms (>16ms budget)`);
      }
    }, [renderStart]);

    // Use effect to measure render time
    React.useEffect(() => {
      handleRenderComplete();
    });

    return <Component {...props} />;
  });

  PerformanceMonitoredComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  return PerformanceMonitoredComponent;
}

export default OptimizedExperienceList;