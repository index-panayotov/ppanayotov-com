"use client";
import { Mail, Phone, MapPin, ExternalLink, Linkedin } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TemplateProps } from "./types";

import { getSocialIcon } from "@/lib/social-platforms";

/**
 * Modern Template - Bold, trendy design with vibrant colors
 *
 * Features:
 * - Vibrant gradients and colors
 * - Glassmorphism effects
 * - CSS Grid masonry layout
 * - Interactive hover states
 * - Card-based design
 * - Dark theme optimized
 * - Perfect for creative/design/tech roles
 */
export default function ModernTemplate({ experiences, topSkills, profileData, systemSettings }: TemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Modern Hero - Bold with gradient */}
      <header className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

        <div className="relative container mx-auto max-w-6xl px-4 py-20 md:py-32">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-bold rounded-full mb-4">
                AVAILABLE FOR HIRE
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {profileData.name}
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-300 mb-6">{profileData.title}</h2>

              {/* Contact Info - Bot Protected */}
              <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-6">
                {profileData.location && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
                    <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <img
                      src={`/api/text-image?fieldType=location&size=14&color=%2394a3b8&bg=transparent`}
                      alt="Location (protected from bots)"
                      className="inline-block h-[14px] object-contain"
                      draggable={false}
                      loading="eager"
                    />
                  </div>
                )}
                {profileData.email && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
                    <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <img
                      src={`/api/text-image?fieldType=email&size=14&color=%2394a3b8&bg=transparent`}
                      alt="Email address (protected from bots)"
                      className="inline-block h-[14px] object-contain"
                      draggable={false}
                      loading="eager"
                    />
                  </div>
                )}
                {profileData.phone && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
                    <Phone className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <img
                      src={`/api/text-image?fieldType=phone&size=14&color=%2394a3b8&bg=transparent`}
                      alt="Phone number (protected from bots)"
                      className="inline-block h-[14px] object-contain"
                      draggable={false}
                      loading="eager"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Social Links - Modern cards */}
            {profileData.socialLinks && profileData.socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {profileData.socialLinks
                  .filter(link => link.visible)
                  .slice(0, 5)
                  .map((link, index) => (
                    <a
                      key={index}
                      href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-110"
                      aria-label={link.platform}
                    >
                      {getSocialIcon(link.platform, "w-6 h-6 group-hover:text-cyan-400 transition-colors")}
                    </a>
                  ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-16">
        {/* Professional Summary - Glass card */}
        <section className="mb-16" aria-labelledby="summary-heading">
          <div className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            <h2 id="summary-heading" className="text-3xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <MarkdownRenderer
              content={profileData.summary}
              className="text-slate-300 text-lg leading-relaxed"
            />
          </div>
        </section>

        {/* Core Skills - Grid with gradient cards */}
        <section className="mb-16" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="text-3xl font-black mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Core Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topSkills.map((skill, index) => (
              <div
                key={index}
                className="group relative p-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-lg rounded-xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 rounded-xl transition-all duration-300" />
                <span className="relative font-bold text-center block text-slate-200 group-hover:text-white transition-colors">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience - Masonry grid */}
        <section className="mb-16" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="text-3xl font-black mb-8 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {experiences.map((exp, index) => (
              <article
                key={index}
                className="group p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-black text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      {exp.title}
                    </h3>
                    <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-lg font-bold text-purple-400">{exp.company}</p>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-2 text-sm text-slate-400">
                    <span className="font-medium">{exp.dateRange}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                </div>

                <MarkdownRenderer
                  content={exp.description}
                  className="text-slate-300 leading-relaxed mb-4"
                />

                {exp.tags && exp.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-full border border-cyan-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Education - Modern cards */}
        {profileData.education && profileData.education.length > 0 && (
          <section className="mb-16" aria-labelledby="education-heading">
            <h2 id="education-heading" className="text-3xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Education
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {profileData.education.map((edu, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <h3 className="text-xl font-black text-cyan-400 mb-2">{edu.degree}</h3>
                  <p className="text-lg text-purple-400 font-bold mb-1">{edu.field}</p>
                  <p className="text-slate-400">{edu.institution}</p>
                  <p className="text-slate-500 font-medium mt-2">{edu.dateRange}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications - Grid */}
        {profileData.certifications && profileData.certifications.length > 0 && (
          <section className="mb-16" aria-labelledby="certifications-heading">
            <h2 id="certifications-heading" className="text-3xl font-black mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Certifications
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
                >
                  <h3 className="font-black text-white mb-1">{cert.name}</h3>
                  {cert.issuer && <p className="text-purple-400 font-bold text-sm">{cert.issuer}</p>}
                  {cert.dateIssued && <p className="text-slate-500 text-sm mt-2">{cert.dateIssued}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages - Compact grid */}
        {profileData.languages && profileData.languages.length > 0 && (
          <section className="mb-16" aria-labelledby="languages-heading">
            <h2 id="languages-heading" className="text-3xl font-black mb-8 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Languages
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profileData.languages.map((lang, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-pink-400/50 transition-all duration-300 text-center"
                >
                  <span className="block font-black text-white mb-1">{lang.name}</span>
                  <span className="text-sm text-pink-400 font-bold">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {systemSettings.showContacts && (
          <section className="mb-16" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-3xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            {(() => {
              const linkedinLink = profileData.socialLinks?.find(link =>
                link.platform === 'LinkedIn' && link.visible
              );
              const hasLinkedIn = !!linkedinLink;
              const contactCount = 2 + (hasLinkedIn ? 1 : 0);
              const gridClass = contactCount === 3
                ? "grid grid-cols-1 md:grid-cols-3 gap-6"
                : "grid grid-cols-1 md:grid-cols-2 gap-6";

              return (
                <div className={gridClass}>
                  <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                        <Mail className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm mb-1">Email</h3>
                        <div className="flex items-center" style={{ minHeight: '20px' }}>
                          <img
                            src={`/api/text-image?fieldType=email&size=14&color=%2394a3b8&bg=transparent`}
                            alt="Email address (protected from bots)"
                            draggable={false}
                            loading="eager"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                        <Phone className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm mb-1">Phone</h3>
                        <div className="flex items-center" style={{ minHeight: '20px' }}>
                          <img
                            src={`/api/text-image?fieldType=phone&size=14&color=%2394a3b8&bg=transparent`}
                            alt="Phone number (protected from bots)"
                            draggable={false}
                            loading="eager"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {hasLinkedIn && (
                    <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-pink-400/50 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-xl">
                          <Linkedin className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm mb-1">LinkedIn</h3>
                          <a
                            href={linkedinLink.url.startsWith('http') ? linkedinLink.url : `https://${linkedinLink.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-400 hover:text-pink-300 transition-colors text-sm"
                          >
                            {linkedinLink.url.replace(/^https?:\/\//i, '')}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </section>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl py-8 mt-16">
        <div className="container mx-auto max-w-6xl px-4 text-center text-slate-400">
          <p className="font-medium">
            © {new Date().getFullYear()} {profileData.name}. Crafted with passion.
          </p>
        </div>
      </footer>
    </div>
  );
}
