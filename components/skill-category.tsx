"use client"

import { SkillTag } from "./skill-tag"
import { useState } from "react"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"

interface SkillCategoryProps {
  title: string
  skills: string[]
  isExpanded?: boolean
  variant?: 'grid' | 'list'
}

export function SkillCategory({ title, skills, isExpanded = false, variant = 'grid' }: SkillCategoryProps) {
  const [expanded, setExpanded] = useState(isExpanded)
  
  return (
    <div className="cv-card print:bg-white print:border-none print:shadow-none print:p-0 print:mb-4 cv-skill-category">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left print:hidden"
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
          {skills.join(", ")}
        </div>
      </div>
      
      {/* Interactive version */}
      <div className={`mt-4 print:hidden transition-all duration-300 overflow-hidden ${
        expanded ? 'max-h-screen opacity-100' : 'max-h-16 opacity-70'
      }`}>
        {variant === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {skills.map((skill, index) => (
              <SkillTag key={index} name={skill} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <SkillTag key={index} name={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}