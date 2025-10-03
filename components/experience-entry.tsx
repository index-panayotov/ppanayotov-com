"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { FiPlus, FiMinus } from "react-icons/fi"
import { SkillTag } from "./skill-tag"
import DOMPurify from 'isomorphic-dompurify';

interface ExperienceEntryProps {
  title: string
  company: string
  dateRange: string
  location?: string
  description?: string | string[]
  tags?: string[]
}

/**
 * Render a single work experience entry including title, company, dates, optional location, description, and skill tags.
 *
 * The `description` prop is rendered as sanitized HTML when provided as a string, or as a bulleted list when provided as an array. Skill tags show up to five items by default with a screen-only toggle to expand/collapse; the print view always includes all tags and an ATS-friendly plain-text skills line.
 *
 * Accessibility: the tag toggle button includes an appropriate `aria-label`.
 *
 * @remarks
 * Sanitization is applied to string descriptions to prevent injection when rendering HTML content.
 */
export const ExperienceEntry = memo(function ExperienceEntry({ title, company, dateRange, location, description, tags = [] }: ExperienceEntryProps) {
  const [showAllTags, setShowAllTags] = useState(false)

  // Memoize constants and computed values
  const initialTagCount = 5
  const hasMoreTags = useMemo(() => tags.length > initialTagCount, [tags.length])

  // Memoize sanitize function to prevent recreation on every render
  const sanitize = useCallback((html: string): string => {
    return DOMPurify.sanitize(html);
  }, []);

  // Memoize toggle function
  const toggleShowAllTags = useCallback(() => {
    setShowAllTags(!showAllTags)
  }, [showAllTags])

  // Memoize visible tags calculation
  const visibleTags = useMemo(() =>
    showAllTags ? tags : tags.slice(0, initialTagCount),
    [showAllTags, tags]
  )

  // Memoize tag list text for ATS
  const tagListText = useMemo(() => tags.join(", "), [tags])

  // Memoize description content rendering
  const descriptionContent = useMemo(() => {
    if (!description) return null;

    if (typeof description === "string") {
      return (
        <p
          className="text-slate-700 leading-relaxed mb-4 print:mb-3"
          dangerouslySetInnerHTML={{ __html: sanitize(description) }}
        />
      );
    }

    if (Array.isArray(description) && description.length > 0) {
      return (
        <ul className="text-slate-700 list-disc list-inside space-y-1 mb-4 print:mb-3">
          {description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    return null;
  }, [description, sanitize])

  return (
    <div className="relative pl-8 print:pl-0 print:mb-4 experience-item">
      {/* Timeline dot and line */}
      <div className="absolute left-0 top-0 print:hidden">
        <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
        <div className="absolute left-1/2 top-4 w-0.5 h-full bg-slate-200 -translate-x-1/2"></div>
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-lg p-6 print:bg-white print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 print:mb-1">
          <div>
            <h3 className="font-bold text-slate-800 text-lg print:text-base">
              {title}
            </h3>
            {company && <p className="text-blue-600 font-medium print:text-black print:inline print:before:content-[',_']">{company}</p>}
          </div>
          <span className="text-slate-500 text-sm bg-slate-100 px-3 py-1 rounded-full print:bg-white print:px-0 print:py-0 mt-2 sm:mt-0">
            {dateRange}
          </span>
        </div>

        {location && <p className="text-slate-600 text-sm mb-3 print:mb-2">{location}</p>}

        {descriptionContent}

      {tags.length > 0 && (
        <>
          {/* Screen version - with toggle functionality */}
          <div className="mt-2 print:hidden">
            <div className="flex flex-wrap gap-2 mb-2">
              {visibleTags.map((tag, index) => (
                <SkillTag key={index} name={tag} />
              ))}

              {hasMoreTags && (
                <button
                  onClick={toggleShowAllTags}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label={showAllTags ? "Show fewer skills" : "Show more skills"}
                >
                  {showAllTags ? <FiMinus size={14} /> : <FiPlus size={14} />}
                </button>
              )}
            </div>

            {showAllTags && hasMoreTags && (
              <button onClick={toggleShowAllTags} className="text-sm text-gray-500 hover:text-gray-700 mt-1">
                Show less
              </button>
            )}
          </div>

          {/* Print version - always show all tags */}
          <div className="hidden print:block mt-2">
            <div className="print:block">
              {tags.map((tag, index) => (
                <SkillTag key={index} name={tag} />
              ))}
            </div>
          </div>

          {/* Hidden text for ATS - all skills in plain text */}
          <div className="hidden print:block text-[0.1px] text-white whitespace-normal overflow-hidden h-[0.1px]">
            Skills: {tagListText}
          </div>
        </>
      )}
      </div>
    </div>
  )
});
