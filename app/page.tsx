"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MobileMenu } from "@/components/mobile-menu";
import {
  FiMail,
  FiLinkedin,
  FiMenu,
  FiX,
  FiPhone
} from "react-icons/fi";
import { ExperienceEntry as ExperienceEntryComponent } from "@/components/experience-entry";
import { SectionHeading } from "@/components/section-heading";
import { SkillTag } from "@/components/skill-tag";
import { SkillCategory } from "@/components/skill-category";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/back-to-top";
import { TypingEffect } from "@/components/typing-effect";
import { experiences } from "@/data/cv-data";
import { topSkills } from "@/data/topSkills";
import { userProfile } from "@/data/user-profile";
import { getProfileImageUrl } from "@/lib/image-utils";
import { SystemSettings } from "@/services/SystemSettings";
import DOMPurify from 'isomorphic-dompurify';

/**
 * Client React component that renders a data-driven, accessible CV/resume page.
 *
 * Renders profile, summary, experience, skills, languages, education, certifications and an optional contact section (controlled by SystemSettings). Includes responsive header and mobile menu, print/ATS-friendly hidden metadata, sanitization of HTML snippets via DOMPurify, and UI helper components (progress, back-to-top, section headings, skill/experience entries, etc.).
 */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Sanitize function that works in both server and client environments
  const sanitize = (html: string): string => {
    return DOMPurify.sanitize(html);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };


  // Experience data is imported from @/data/cv-data


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
      
      {/* Hidden metadata for ATS */}
      <div className="hidden print:block">
        <div
          aria-hidden="true"
          className="text-[0.1px] text-white overflow-hidden h-[0.1px]"
        >
          <h1>
            {userProfile.name} - {userProfile.title}
          </h1>
          <p>
            Contact: {userProfile.email},
            {userProfile.linkedin}
          </p>
          <p>
            Skills:{" "}
            {Array.from(new Set(experiences.flatMap(exp => exp.tags))).join(
              ", "
            )}
          </p>
        </div>
      </div>

      <header className="px-4 py-6 md:sticky md:top-0 md:z-50 md:bg-white/80 md:backdrop-blur-md md:shadow-sm md:border-b md:border-slate-200/50" role="banner">
        <div className="container mx-auto">
          <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-800">
                {userProfile.name}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <Link href="#hero" className="cv-nav-link">
                Home
              </Link>
              <Link href="#summary" className="cv-nav-link">
                Summary
              </Link>
              <Link href="#experience" className="cv-nav-link">
                Experience
              </Link>
              <Link href="#skills" className="cv-nav-link">
                Skills
              </Link>
              <Link href="#education" className="cv-nav-link">
                Education
              </Link>
              <Link href="#certifications" className="cv-nav-link">
                Certifications
              </Link>
              {SystemSettings.get("showContacts") && (
                <Link href="#contact" className="cv-nav-link">
                  Contact
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="cv-button-secondary md:hidden"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />

      <main id="main-content">
        {/* Hero Section */}
        <section id="hero" className="relative py-20 px-4 overflow-hidden" role="main" aria-label="Professional profile and introduction">
          <div className="absolute inset-0 cv-hero-gradient"></div>
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative container mx-auto max-w-4xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {userProfile.name}
                </h1>
                <h2 className="text-xl lg:text-2xl text-blue-100 mb-6">
                  <TypingEffect text={userProfile.title} speed={80} />
                </h2>
                <p className="text-blue-50 mb-2">
                  {userProfile.location}
                </p>
                <p className="text-blue-50/90 text-lg mb-6 max-w-2xl">
                  {userProfile.summary}
                </p>
                
                {/* Social Media Links */}
                <div className="flex gap-4 justify-center lg:justify-start mb-8">
                  {userProfile.linkedin && (
                    <a
                      href={`https://${userProfile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors duration-200 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
                      aria-label="LinkedIn Profile"
                    >
                      <FiLinkedin size={20} />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </a>
                  )}
                </div>
                {SystemSettings.get("showContacts") && (
                  <div className="flex justify-center lg:justify-start">
                    <a
                      href="#contact"
                      className="cv-button-primary"
                    >
                      <FiMail size={18} className="mr-2" />
                      Get in Touch
                    </a>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                    <Image
                      src={getProfileImageUrl(userProfile, 'web')}
                      alt={`Profile picture of ${userProfile.name}`}
                      width={224}
                      height={224}
                      className="object-cover w-full h-full"
                      priority
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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

        <section id="summary" className="cv-section">
          <SectionHeading title="Summary" subtitle="Professional overview and core competencies" />
          <p className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitize(userProfile.summary) }} />

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
              {topSkills.slice(0, 8).map((tag, index) => <SkillTag key={index} name={tag} variant="featured" />)}
            </div>
          </div>
        </section>

        <section id="experience" className="cv-section" role="region" aria-labelledby="experience-heading">
          <SectionHeading title="Experience" subtitle="Professional work history and achievements" />

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-slate-200"></div>
            
            <div className="space-y-8">
              {experiences.map((exp, index) =>
                <ExperienceEntryComponent
                  key={index}
                  title={exp.title}
                  company={exp.company}
                  dateRange={exp.dateRange}
                  location={exp.location}
                  description={exp.description}
                  tags={exp.tags}
                />
              )}
            </div>
          </div>
        </section>

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

        <section id="languages" className="cv-section" role="region" aria-labelledby="languages-heading">
          <SectionHeading title="Languages" subtitle="Communication abilities" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userProfile.languages.map((language, index) =>
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-800">{language.name}</span>
                <span className="cv-badge">
                  {language.proficiency}
                </span>
              </div>
            )}
          </div>
        </section>

        <section id="education" className="cv-section" role="region" aria-labelledby="education-heading">
          <SectionHeading title="Education" subtitle="Academic background and qualifications" />
          <div className="space-y-4">
            {userProfile.education.map((edu, index) =>
              <div key={index} className="cv-card education-item">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                  <h3 className="font-semibold text-slate-800">
                    {edu.institution}
                  </h3>
                  <span className="cv-badge bg-slate-100 text-slate-500">
                    {edu.dateRange}
                  </span>
                </div>
                <p className="text-slate-700" dangerouslySetInnerHTML={{ __html: sanitize(`${edu.degree}, ${edu.field}`) }} />
              </div>
            )}
          </div>
        </section>

        <section id="certifications" className="cv-section" role="region" aria-labelledby="certifications-heading">
          <SectionHeading title="Certifications" subtitle="Professional credentials and achievements" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userProfile.certifications.map((cert, index) =>
              <div key={index} className="flex items-center p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{cert.name}</div>
                  {cert.issuer && (
                    <div className="text-slate-600 text-sm">
                      {cert.issuer}
                    </div>
                  )}
                  {cert.date && (
                    <div className="text-slate-500 text-xs">
                      {cert.date}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section - show/hide based on system settings */}
        {SystemSettings.get("showContacts") && (
          <section id="contact" className="cv-section">
            <SectionHeading title="Contact" subtitle="Let's connect and discuss opportunities" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="contact-card">
                <div className="contact-layout">
                  <div className="contact-icon bg-blue-100">
                    <FiMail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                    <div className="cursor-default">
                      <img
                        src={`/api/text-image?fieldType=email&size=16&color=%23059669&bg=transparent`}
                        alt="Email address (protected from bots)"
                        className="protected-image"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="contact-card">
                <div className="contact-layout">
                  <div className="contact-icon bg-green-100">
                    <FiPhone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                    <div className="cursor-default">
                      <img
                        src={`/api/text-image?fieldType=phone&size=16&color=%2316a34a&bg=transparent`}
                        alt="Phone number (protected from bots)"
                        className="protected-image"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {userProfile.linkedin && (
                <div className="contact-card">
                  <div className="contact-layout">
                    <div className="contact-icon bg-indigo-100">
                      <FiLinkedin className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">LinkedIn</h3>
                      <a 
                        href={`https://${userProfile.linkedin.replace(/^https?:\/\//i, '')}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        {userProfile.linkedin.replace(/^https?:\/\//i, '')}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </section>
        )}
        
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} {userProfile.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Powered by{" "}
            <a 
              href="https://github.com/index-panayotov/ppanayotov-com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ppanayotov-com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
