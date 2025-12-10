"use client"

import { SkillTag } from "./skill-tag"
import {useMemo, memo } from "react"
import type { SkillCategoryProps } from "@/types"

/**
 * Collapsible skill group UI that displays a title and a set of skill tags, with a print-friendly fallback.
 *
 * Renders a header button that toggles an internal expanded state. In screen view the skills are shown
 * in either a responsive grid or a wrapping list of SkillTag components depending on `variant`. For printing,
 * an always-visible, non-interactive block shows the title and skills as a comma-separated string.
 *
 * @param variant - Layout mode for the interactive section: `'grid'` renders a responsive multi-column grid,
 *   any other value (commonly `'list'`) renders a wrapping horizontal list (default: `'grid'`).
 * @returns The SkillCategory React element.
 */
export const SkillCategory = memo(function SkillCategory({ title, skills,  variant = 'grid' }: SkillCategoryProps) {

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

  return (
    <div className="cv-card print:bg-white print:border-none print:shadow-none print:p-0 print:mb-4 cv-skill-category">

      {/* Interactive version */}
      <div
        id={`skill-category-${title.replace(/\s+/g, '-').toLowerCase()}-content`}
        className={`mt-4 print:hidden transition-all duration-300 overflow-hiddenmax-h-screen opacity-100`}
      >
        {skillsContent}
      </div>
    </div>
  )
});