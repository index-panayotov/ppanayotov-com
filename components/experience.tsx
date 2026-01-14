"use client";

import { experiences } from "@/data/experience";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function Experience() {
  return (
    <section id="experience" className="py-12 md:py-16 gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Professional Experience
            </h2>
            <p className="text-base text-slate-600">
              Over 7 years in software development and delivery management
            </p>
          </div>

          {/* Experience Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-100"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {exp.title}
                    </h3>
                    <p className="text-sm text-primary-600 font-medium">
                      {exp.company}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-2 ml-9">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{exp.dateRange}</span>
                    {exp.duration && <span className="text-slate-400">· {exp.duration}</span>}
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-3 ml-9">
                  {exp.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 ml-9">
                  {exp.tags.slice(0, 4).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                    >
                      {tag}
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
