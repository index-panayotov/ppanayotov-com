"use client";

import { topSkills, skillCategories } from "@/data/skills";
import { Star, Code, Users, Lightbulb } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "Leadership & Management": <Users className="w-6 h-6" />,
  "Technical Architecture": <Lightbulb className="w-6 h-6" />,
  Methodologies: <Star className="w-6 h-6" />,
  Technologies: <Code className="w-6 h-6" />,
};

export function Skills() {
  return (
    <section id="skills" className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Skills & Expertise
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A comprehensive blend of technical and leadership capabilities
              developed over a decade
            </p>
          </div>

          {/* Top Skills */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">
              Core Competencies
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {topSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-5 py-2.5 bg-primary-50 text-primary-700 rounded-full font-medium text-sm hover:bg-primary-100 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skill Categories */}
          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                    {categoryIcons[category.name] || <Star className="w-6 h-6" />}
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    {category.name}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white text-slate-600 text-sm rounded-lg shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
