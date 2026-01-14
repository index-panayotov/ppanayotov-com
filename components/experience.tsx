"use client";

import { experiences } from "@/data/experience";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function Experience() {
  return (
    <section id="experience" className="section-padding gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Professional Experience
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Over 10 years of progressive experience in software development
              and engineering leadership
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />

            {/* Experience Items */}
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative md:w-1/2 animate-slide-up",
                    index % 2 === 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Timeline Dot */}
                  <div
                    className={cn(
                      "absolute top-0 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow hidden md:block",
                      index % 2 === 0
                        ? "right-0 translate-x-1/2 md:-right-2"
                        : "left-0 -translate-x-1/2 md:-left-2"
                    )}
                  />

                  {/* Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-slate-100">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-primary-50 rounded-xl">
                        <Briefcase className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900">
                          {exp.title}
                        </h3>
                        <p className="text-lg text-primary-600 font-medium">
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.dateRange}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 mb-4">{exp.description}</p>

                    {/* Highlights */}
                    <ul className="space-y-2 mb-4">
                      {exp.highlights.slice(0, 4).map((highlight, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.slice(0, 5).map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
