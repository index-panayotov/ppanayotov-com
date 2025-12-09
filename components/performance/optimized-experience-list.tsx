/**
 * Experience List Component
 *
 * Simple experience listing with filtering and sorting
 */

import React from 'react';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import type { ExperienceListProps, ExperienceItemProps } from '@/types';

/**
 * Individual experience item component
 */
const ExperienceItem = ({
  experience,
  onClick,
  index
}: ExperienceItemProps) => {
  const handleClick = () => {
    if (experience.id && onClick) {
      onClick(experience.id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

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
            <MarkdownRenderer
              content={experience.description}
              className="text-sm text-slate-600 mb-3 leading-relaxed"
            />
          )}

          {/* Tags */}
          {experience.tags && experience.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {experience.tags.map((tag, tagIndex) => (
                <span
                  key={tag}
                  className="cv-skill-tag text-xs"
                  style={{ animationDelay: `${(index * 100) + (tagIndex * 50)}ms` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Experience list component
 */
export const OptimizedExperienceList = ({
  experiences,
  onExperienceClick,
  maxItems,
  sortBy = 'date',
  filterBy
}: ExperienceListProps) => {
  // Filter experiences
  let processedExperiences = [...experiences];

  if (filterBy && filterBy.trim()) {
    const searchTerm = filterBy.toLowerCase();
    processedExperiences = processedExperiences.filter(exp =>
      exp.title.toLowerCase().includes(searchTerm) ||
      exp.company.toLowerCase().includes(searchTerm) ||
      exp.description?.toLowerCase().includes(searchTerm) ||
      exp.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Sort experiences
  processedExperiences.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'company':
        return a.company.localeCompare(b.company);
      case 'date':
      default:
        return b.dateRange.localeCompare(a.dateRange);
    }
  });

  // Limit items if specified
  if (maxItems && maxItems > 0) {
    processedExperiences = processedExperiences.slice(0, maxItems);
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
      {/* Experience items */}
      <div className="space-y-6">
        {processedExperiences.map((experience, index) => (
          <ExperienceItem
            key={experience.id || `${experience.company}-${experience.title}-${index}`}
            experience={experience}
            onClick={onExperienceClick}
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
};

export default OptimizedExperienceList;
