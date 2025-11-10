"use client"

import { SkillTag } from "./skill-tag"
import { useState, useMemo, useCallback, memo } from "react"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
import type { SkillCategoryProps } from "@/types"

/**
 * Collapsible skill group UI that displays a title and a set of skill tags, with a print-friendly fallback.
 *
 * Renders a header button that toggles an internal expanded state. In screen view the skills are shown
 * in either a responsive grid or a wrapping list of SkillTag components depending on `variant`. For printing,
 * an always-visible, non-interactive block shows the title and skills as a comma-separated string.
 *
 * @param isExpanded - Initial expanded state for the interactive section (default: `false`).
 * @param variant - Layout mode for the interactive section: `'grid'` renders a responsive multi-column grid,
 *   any other value (commonly `'list'`) renders a wrapping horizontal list (default: `'grid'`).
 * @returns The SkillCategory React element.
 */
export const SkillCategory = memo(function SkillCategory({ title, skills, isExpanded = false, variant = 'grid' }: SkillCategoryProps) {
  const [expanded, setExpanded] = useState(isExpanded)

  // Memoize toggle function to prevent unnecessary re-renders
  const toggleExpanded = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  // Memoize skills rendering based on variant and skills array
  const skillsContent = useMemo(() => {
    if (variant === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {skills.map((skill, index) => (
            <SkillTag key={index} name={skill} />
          ))}
        </div>
      )
    } else {
      return (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <SkillTag key={index} name={skill} />
          ))}
        </div>
      )
    }
  }, [skills, variant])

  // Memoize print skills text
  const printSkillsText = useMemo(() => skills.join(", "), [skills])
  
  return (
    <div className="cv-card print:bg-white print:border-none print:shadow-none print:p-0 print:mb-4 cv-skill-category">
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between text-left print:hidden"
        aria-expanded={expanded}
        aria-controls={`skill-category-${title.replace(/\s+/g, '-').toLowerCase()}-content`}
      >
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <div className="ml-2 text-slate-500">
          {expanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </div>
      </button>

      {/* Print version - always show title and skills */}
      <div className="hidden print:block">
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="text-gray-700 leading-relaxed">
          {printSkillsText}
        </div>
      </div>

      {/* Interactive version */}
      <div
        id={`skill-category-${title.replace(/\s+/g, '-').toLowerCase()}-content`}
        className={`mt-4 print:hidden transition-all duration-300 overflow-hidden ${
          expanded ? 'max-h-screen opacity-100' : 'max-h-16 opacity-70'
        }`}
      >
        {skillsContent}
      </div>
    </div>
  )
});