"use client"

import { useState, useEffect } from "react"
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
 * Renders a work experience entry with title, company, date range, optional location, description, and skill tags.
 *
 * Displays the description as sanitized HTML if provided as a string, or as a bullet list if provided as an array. Shows a limited number of skill tags by default, with the option to expand and view all tags. Includes accessibility features and print-specific rendering for skill tags and ATS compatibility.
 *
 * @remark The description prop, if a string, is rendered as sanitized HTML using `dangerouslySetInnerHTML`. Any HTML tags within the description will be interpreted and rendered accordingly.
 */
export function ExperienceEntry({ title, company, dateRange, location, description, tags = [] }: ExperienceEntryProps) {
  const [showAllTags, setShowAllTags] = useState(false)
  const initialTagCount = 5
  const hasMoreTags = tags.length > initialTagCount
  
  // Sanitize function that works in both server and client environments
  const sanitize = (html: string): string => {
    return DOMPurify.sanitize(html);
  };

  const toggleShowAllTags = () => {
    setShowAllTags(!showAllTags)
  }

  // For screen display, show limited tags unless expanded
  const visibleTags = showAllTags ? tags : tags.slice(0, initialTagCount)

  return (
    <div className="mb-6 print:mb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
        <h3 className="font-semibold">
          {title}
          {company && `, ${company}`}
        </h3>
        <span className="text-gray-500 text-sm">{dateRange}</span>
      </div>

      {location && <p className="text-gray-500 text-sm mb-2">{location}</p>}

      {description && typeof description === "string" ? (
        <p className="text-gray-700 mb-3" dangerouslySetInnerHTML={{ __html: sanitize(description) }} />
      ) : (
        Array.isArray(description) &&
        description.length > 0 && (
          <ul className="text-gray-700 list-disc list-inside space-y-1 mb-3">
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )
      )}

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
            Skills: {tags.join(", ")}
          </div>
        </>
      )}
    </div>
  )
}
