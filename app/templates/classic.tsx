"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { MobileMenu } from "@/components/mobile-menu";
import { Mail, Linkedin, Menu, X, Phone } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { SkillTag } from "@/components/skill-tag";
import { SkillCategory } from "@/components/skill-category";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/back-to-top";
import { TypingEffect } from "@/components/typing-effect";
import { LazySection } from "@/components/lazy-section";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { OptimizedExperienceList } from "@/components/performance/optimized-experience-list";
import { getProfileImageUrl } from "@/lib/image-utils";


import { getSocialIcon } from "@/lib/social-platforms";
import { TemplateProps } from "./types";
import { Footer } from "@/components/footer";

/**
 * Classic Template - Animated, modern design with typing effects
 *
 * Features:
 * - Animated typing effect in hero
 * - Gradient backgrounds
 * - Smooth scroll animations
 * - Professional color scheme
 */
export default function ClassicTemplate({ experiences, topSkills, profileData, systemSettings }: TemplateProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // Memoized helper function to get social media platform icon
  const getSocialIconForDisplay = useCallback((platform: string) => {
    return getSocialIcon(platform, "h-5 w-5");
  }, []);

  // Memoized menu handlers
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-slate-100/50">
      {/* Skip Links for Accessibility */}
      <div className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50">
        <a
          href="#main-content"
          className="cv-button-primary focus:ring-4 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
      </div>

      <ScrollProgress />
      <BackToTop />

      <header className="px-4 py-6 md:sticky md:top-0 md:z-50 md:bg-white/80 md:backdrop-blur-md md:shadow-sm md:border-b md:border-slate-200/50" role="banner">
        <div className="container mx-auto">
          <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-800">
                {profileData.name}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <Link href="/#hero" className="cv-nav-link">Home</Link>
              <Link href="/#summary" className="cv-nav-link">Summary</Link>
              <Link href="/#experience" className="cv-nav-link">Experience</Link>
              <Link href="/#skills" className="cv-nav-link">Skills</Link>
              <Link href="/#education" className="cv-nav-link">Education</Link>
              <Link href="/#certifications" className="cv-nav-link">Certifications</Link>
              {systemSettings.blogEnable && (
                <Link href="/blog" className="cv-nav-link">Blog</Link>
              )}
          {systemSettings.showContacts && (
                <Link href="/#contact" className="cv-nav-link">Contact</Link>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="cv-button-secondary md:hidden"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />}

      <main id="main-content">
        {/* Hero Section */}
        <section id="hero" className="relative py-20 px-4 overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute inset-0 cv-hero-gradient"></div>
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative container mx-auto max-w-4xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ minHeight: '2.5rem' }}>
                  {profileData.name}
                </h1>
                <h2 className="text-xl lg:text-2xl text-blue-100 mb-6" style={{ minHeight: '3rem' }}>
                  <TypingEffect text={profileData.title} speed={80} />
                </h2>
                <p className="text-blue-50 mb-2">{profileData.location}</p>
                <MarkdownRenderer
                  content={profileData.summary}
                  className="text-blue-50/90 text-lg mb-6 max-w-2xl"
                />

                {/* Social Media Links */}
                {profileData.socialLinks?.filter(link => link.visibleInHero).length > 0 && (
                  <div className="flex gap-4 justify-center lg:justify-start mb-8 flex-wrap">
                    {profileData.socialLinks
                      .filter(link => link.visibleInHero)
                      .sort((a, b) => (a.position || 0) - (b.position || 0))
                      .map((link, index) => (
                        <a
                          key={index}
                          href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
                          aria-label={`${link.platform === 'Custom' ? link.label : link.platform} Profile`}
                        >
                          {getSocialIconForDisplay(link.platform)}
                          <span className="hidden sm:inline">
                            {link.platform === 'Custom' ? link.label : link.platform}
                          </span>
                        </a>
                      ))}
                  </div>
                )}
              {systemSettings.showContacts && (
                  <div className="flex justify-center lg:justify-start">
                    <a href="/#contact" className="cv-button-primary">
                      <Mail size={18} className="mr-2" />
                      Get in Touch
                    </a>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                    <OptimizedImage
                      src={getProfileImageUrl(profileData, 'web')}
                      alt={`Profile picture of ${profileData.name}`}
                      width={224}
                      height={224}
                      className="object-cover w-full h-full"
                      priority={true}
                      quality={90}
                      sizes="(max-width: 768px) 192px, 224px"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl">
          <LazySection rootMargin="100px" minHeight="300px">
            <section id="summary" className="cv-section" aria-labelledby="summary-heading">
              <SectionHeading id="summary-heading" title="Summary" 
              //subtitle="Professional overview and core competencies"
               />
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Top Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {topSkills.slice(0, 8).map((tag, index) => <SkillTag key={index} name={tag} variant="featured" />)}
                </div>
              </div>
            </section>
          </LazySection>

          <LazySection rootMargin="150px" minHeight="600px">
            <section id="experience" className="cv-section" role="region" aria-labelledby="experience-heading">
              <SectionHeading title="Experience" subtitle="Professional work history and achievements" />
              <OptimizedExperienceList
                experiences={experiences}
                sortBy="date"
              />
            </section>
          </LazySection>

          <LazySection rootMargin="150px" minHeight="500px">
            <section id="skills" className="cv-section" role="region" aria-labelledby="skills-heading">
              <SectionHeading title="Skills" subtitle="Technical expertise and professional capabilities" />
              <div className="space-y-6">
                <SkillCategory
                  title="Leadership & Management"
                  skills={["Team Management", "Engineering Management", "Project Management", "Delivery Management", "Team Leadership", "Coaching & Mentoring", "Program Management"]}
                  isExpanded={true}
                />
                <SkillCategory
                  title="Technical Skills"
                  skills={["Programming", "Web Architecture", "Microservices", "Databases", "Software as a Service (SaaS)", "Service-Oriented Architecture (SOA)", "Deployment Management"]}
                  isExpanded={true}
                />
                <SkillCategory
                  title="Quality & Process"
                  skills={["Software Quality", "Code Review", "Coding Standards", "Defect Management", "Technical Design", "Scrum", "Software Project Management"]}
                />
                <SkillCategory
                  title="Communication & Collaboration"
                  skills={["Team Collaboration", "Communication", "Interpersonal Communication", "Client Requirements", "Knowledge Sharing", "Problem Solving"]}
                />
                <SkillCategory
                  title="Strategy & Planning"
                  skills={["Solution Architecture", "Product Strategy", "Project Plans", "Capacity Planning", "Hands-on Technical Leadership"]}
                />
              </div>
            </section>
          </LazySection>

          <LazySection rootMargin="150px" minHeight="250px">
            <section id="languages" className="cv-section" role="region" aria-labelledby="languages-heading">
              <SectionHeading title="Languages" subtitle="Communication abilities" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileData.languages?.map((language, index) =>
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-800">{language.name}</span>
                    <span className="cv-badge">{language.proficiency}</span>
                  </div>
                )}
              </div>
            </section>
          </LazySection>

          <LazySection rootMargin="150px" minHeight="300px">
            <section id="education" className="cv-section" role="region" aria-labelledby="education-heading">
              <SectionHeading id="education-heading" title="Education" subtitle="Academic background and qualifications" />
              <div className="space-y-4">
                {profileData.education?.map((edu, index) =>
                  <div key={index} className="cv-card education-item">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <h3 className="font-semibold text-slate-800">{edu.institution}</h3>
                      <span className="cv-badge bg-slate-100 text-slate-500">{edu.dateRange}</span>
                    </div>
                    <p className="text-slate-700">{`${edu.degree}, ${edu.field}`}</p>
                  </div>
                )}
              </div>
            </section>
          </LazySection>

          <LazySection rootMargin="150px" minHeight="300px">
            <section id="certifications" className="cv-section" role="region" aria-labelledby="certifications-heading">
              <SectionHeading title="Certifications" subtitle="Professional credentials and achievements" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profileData.certifications?.map((cert, index) =>
                  <div key={index} className="flex items-center p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{cert.name}</div>
                      {cert.issuer && <div className="text-slate-600 text-sm">{cert.issuer}</div>}
                      {cert.dateIssued && <div className="text-slate-500 text-xs">{cert.dateIssued}</div>}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </LazySection>

          {/* Contact Section */}
          {systemSettings.showContacts && (
            <LazySection rootMargin="150px" minHeight="400px">
              <section id="contact" className="cv-section">
                <SectionHeading title="Contact" subtitle="Let's connect and discuss opportunities" />
                {(() => {
                  const linkedinLink = profileData.socialLinks?.find(link =>
                    link.platform === 'LinkedIn' && link.visible
                  );
                  const hasLinkedIn = !!linkedinLink;
                  const contactCount = 2 + (hasLinkedIn ? 1 : 0);
                  const gridClass = contactCount === 3
                    ? "grid grid-cols-1 md:grid-cols-3 gap-6"
                    : "grid grid-cols-1 md:grid-cols-2 gap-6 justify-center max-w-2xl mx-auto";

                  return (
                    <div className={gridClass}>
                      <div className="contact-card">
                        <div className="contact-layout">
                          <div className="contact-icon bg-blue-100">
                            <Mail className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                            <div className="cursor-default" style={{ minHeight: '40px', display: 'flex', alignItems: 'center' }}>
                              <img
                                src={`/api/text-image?fieldType=email&size=16&color=%23059669&bg=transparent`}
                                alt="Email address (protected from bots)"
                                className="protected-image"
                                draggable={false}
                                loading="eager"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="contact-card">
                        <div className="contact-layout">
                          <div className="contact-icon bg-green-100">
                            <Phone className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                            <div className="cursor-default" style={{ minHeight: '40px', display: 'flex', alignItems: 'center' }}>
                              <img
                                src={`/api/text-image?fieldType=phone&size=16&color=%2316a34a&bg=transparent`}
                                alt="Phone number (protected from bots)"
                                className="protected-image"
                                draggable={false}
                                loading="eager"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {hasLinkedIn && (
                        <div className="contact-card">
                          <div className="contact-layout">
                            <div className="contact-icon bg-indigo-100">
                              <Linkedin className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800 mb-1">LinkedIn</h3>
                              <a
                                href={linkedinLink.url.startsWith('http') ? linkedinLink.url : `https://${linkedinLink.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-700 transition-colors"
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

                {/* Social Links */}
                {profileData.socialLinks && profileData.socialLinks.filter(link => link.visible).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Follow Me</h3>
                    <div className="flex justify-center flex-wrap gap-4">
                      {profileData.socialLinks
                        .filter(link => link.visible)
                        .sort((a, b) => (a.position || 0) - (b.position || 0))
                        .map((link, index) => (
                          <a
                            key={index}
                            href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-md transition-all duration-200 text-slate-700 hover:text-slate-900"
                            title={`Visit ${link.platform === 'Custom' ? link.label : link.platform}`}
                          >
                            {getSocialIcon(link.platform)}
                            <span className="text-sm font-medium">
                              {link.platform === 'Custom' ? link.label : link.platform}
                            </span>
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </section>
            </LazySection>
          )}
        </div>
      </main>

      <Footer  
        profileData={profileData}
        selectedTemplate={systemSettings.selectedTemplate}
      />
    </div>
  );
}
