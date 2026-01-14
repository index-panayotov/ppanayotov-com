"use client";

import { profile } from "@/data/profile";
import { GraduationCap, Award, Languages } from "lucide-react";

export function Education() {
  return (
    <section id="education" className="section-padding gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Education & Certifications
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Education */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="p-3 bg-primary-50 rounded-xl w-fit mb-4">
                <GraduationCap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Education
              </h3>
              {profile.education.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <p className="font-semibold text-slate-900">
                    {edu.degree}
                  </p>
                  <p className="text-slate-600">{edu.field}</p>
                  <p className="text-primary-600 font-medium">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-slate-500">{edu.dateRange}</p>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="p-3 bg-primary-50 rounded-xl w-fit mb-4">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Certifications
              </h3>
              <ul className="space-y-3">
                {profile.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-600">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="p-3 bg-primary-50 rounded-xl w-fit mb-4">
                <Languages className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Languages
              </h3>
              <ul className="space-y-3">
                {profile.languages.map((lang, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">
                      {lang.name}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                      {lang.proficiency}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
