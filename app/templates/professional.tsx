"use client";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { TemplateProps } from "./types";

import { getSocialIcon } from "@/lib/social-platforms";

/**
 * Professional Template - Clean, minimal, ATS-optimized
 *
 * Features:
 * - No animations (ATS-friendly)
 * - Print-optimized layout
 * - Clear typography hierarchy
 * - Universal compatibility for all industries
 * - Semantic HTML for parsers
 * - Fast loading, minimal JavaScript
 */
export default function ProfessionalTemplate({ experiences, topSkills, profileData, systemSettings }: TemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header - Minimal, clean */}
      <header className="bg-slate-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{profileData.name}</h1>
              <h2 className="text-xl md:text-2xl text-slate-300 mb-4">{profileData.title}</h2>
              <div className="flex flex-wrap gap-4 text-slate-300 text-sm">
                {profileData.location && (
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>{profileData.location}</span>
                  </div>
                )}
                {profileData.email && (
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    <span>{profileData.email}</span>
                  </div>
                )}
                {profileData.phone && (
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {profileData.socialLinks && profileData.socialLinks.length > 0 && (
              <div className="flex gap-3">
                {profileData.socialLinks
                  .filter(link => link.visible)
                  .slice(0, 4)
                  .map((link, index) => (
                    <a
                      key={index}
                      href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                      aria-label={link.platform}
                    >
                      {getSocialIcon(link.platform, "w-5 h-5")}
                    </a>
                  ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* Professional Summary */}
        <section className="mb-12" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-2xl font-bold text-slate-800 border-b-2 border-slate-800 pb-2 mb-4">
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-lg">{profileData.summary}</p>
        </section>

        {/* Top Skills - Prominent */}
        <section className="mb-12" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="text-2xl font-bold text-slate-800 border-b-2 border-slate-800 pb-2 mb-4">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {topSkills.map((skill, index) => (
              <div key={index} className="px-4 py-2 bg-slate-100 text-slate-800 font-medium text-center rounded">
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience - Linear, clear */}
        <section className="mb-12" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="text-2xl font-bold text-slate-800 border-b-2 border-slate-800 pb-2 mb-6">
            Professional Experience
          </h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <article key={index} className="border-l-4 border-slate-300 pl-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{exp.title}</h3>
                    <p className="text-lg text-slate-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-slate-600 md:text-right">
                    <p className="font-medium">{exp.dateRange}</p>
                    {exp.location && <p className="text-sm">{exp.location}</p>}
                  </div>
                </div>
                <p className="text-slate-700 mb-3 leading-relaxed">{exp.description}</p>
                {exp.tags && exp.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Education */}
        {profileData.education && profileData.education.length > 0 && (
          <section className="mb-12" aria-labelledby="education-heading">
            <h2 id="education-heading" className="text-2xl font-bold text-slate-800 border-b-2 border-slate-800 pb-2 mb-4">
              Education
            </h2>
            <div className="space-y-4">
              {profileData.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-slate-300 pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{edu.degree}</h3>
                      <p className="text-slate-700">{edu.field}</p>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <p className="text-slate-600 font-medium md:text-right">{edu.dateRange}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {profileData.certifications && profileData.certifications.length > 0 && (
          <section className="mb-12" aria-labelledby="certifications-heading">
            <h2 id="certifications-heading" className="text-2xl font-bold text-slate-800 border-b-2 border-slate-800 pb-2 mb-4">
              Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.certifications.map((cert, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded">
                  <h3 className="font-bold text-slate-800">{cert.name}</h3>
                  {cert.issuer && <p className="text-slate-700">{cert.issuer}</p>}
                  {cert.dateIssued && <p className="text-slate-600 text-sm">{cert.dateIssued}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {profileData.languages && profileData.languages.length > 0 && (
          <section className="mb-12" aria-labelledby="languages-heading">
            <h2 id="languages-heading" className="text-2xl font-bold text-slate-800 border-b-2 border-slate-800 pb-2 mb-4">
              Languages
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profileData.languages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                  <span className="font-medium text-slate-800">{lang.name}</span>
                  <span className="text-sm text-slate-600">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-slate-100 py-6 mt-12">
        <div className="container mx-auto max-w-4xl px-4 text-center text-slate-600 text-sm">
          <p>© {new Date().getFullYear()} {profileData.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
