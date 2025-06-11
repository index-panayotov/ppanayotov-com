"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MobileMenu } from "@/components/mobile-menu";
import {
  FiMail,
  FiLinkedin,
  FiMenu,
  FiX,
  FiPrinter,
  FiPhone
} from "react-icons/fi";
import { ExperienceEntry as ExperienceEntryComponent } from "@/components/experience-entry";
import { SectionHeading } from "@/components/section-heading";
import { SkillTag } from "@/components/skill-tag";
import { experiences } from "@/data/cv-data";
import { topSkills } from "@/data/topSkills";
import { userProfile } from "@/data/user-profile";
import { getProfileImageUrl } from "@/lib/image-utils";
import { SystemSettings } from "@/services/SystemSettings";
import DOMPurify from 'dompurify';

/**
 * Renders the main CV webpage with responsive layout, print optimization, and dynamic content sections.
 *
 * Displays user profile information, summary, experience, skills, languages, education, certifications, and optionally contact details. Includes navigation, print-friendly formatting, and accessibility features. Content is data-driven and conditionally rendered based on system settings.
 */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Safe sanitize function for client-side only rendering
  const sanitize = (html: string): string => {
    if (typeof window !== 'undefined' && isClient) {
      return DOMPurify.sanitize(html);
    }
    return html;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Experience data is imported from @/data/cv-data

  return (
    <div className="min-h-screen bg-white">
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
            Contact: {userProfile.email || "preslav.panayotov@gmail.com"},
            {userProfile.linkedin || "www.linkedin.com/in/preslav-panayotov"}
          </p>
          <p>
            Skills:{" "}
            {Array.from(new Set(experiences.flatMap(exp => exp.tags))).join(
              ", "
            )}
          </p>
        </div>
      </div>

      <header className="px-4 py-6 print:hidden md:sticky md:top-0 md:z-50 md:bg-white md:shadow-sm">
        <div className="container mx-auto">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* <span className="text-lg font-semibold">Personal Online CV</span> */}
            </div>
            <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
              <Link href="#summary" className="text-sm hover:text-gray-600">
                Summary
              </Link>
              <Link href="#experience" className="text-sm hover:text-gray-600">
                Experience
              </Link>
              <Link href="#skills" className="text-sm hover:text-gray-600">
                Skills
              </Link>
              <Link href="#education" className="text-sm hover:text-gray-600">
                Education
              </Link>
              <Link
                href="#certifications"
                className="text-sm hover:text-gray-600"
              >
                Certifications
              </Link>
              {SystemSettings.get("showContacts") && (
                <Link href="#contact" className="text-sm hover:text-gray-600">
                  Contact
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {SystemSettings.get("showPrint") && (
                <button
                  onClick={handlePrint}
                  className="p-2 border border-gray-300 rounded flex items-center text-sm"
                  aria-label="Print CV"
                >
                  <FiPrinter size={16} className="mr-1" />
                  <span className="hidden sm:inline">Print CV</span>
                </button>
              )}
              <button
                className="p-2 border border-gray-300 rounded md:hidden"
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

      <main className="container mx-auto px-4 py-8 max-w-4xl print:py-2 print:max-w-none">
        <section className="flex flex-col items-center mb-12 print:mb-6 print:items-start print:flex-row print:gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 print:mb-0 print:w-24 print:h-24">
            <Image
              src={getProfileImageUrl(userProfile, 'web')}
              alt={`Profile picture of ${userProfile.name}`}
              width={128}
              height={128}
              className="object-cover print:hidden"
            />
            {/* PDF optimized image for print */}
            <img
              src={getProfileImageUrl(userProfile, 'pdf')}
              alt={`Profile picture of ${userProfile.name}`}
              className="w-full h-full object-cover hidden print:block"
            />
          </div>
          <div className="text-center print:text-left">
            <h1 className="text-2xl font-bold mb-1">
              {userProfile.name}
            </h1>
            <h2 className="text-gray-600 mb-1">
              {userProfile.title}
            </h2>
            <p className="text-gray-500">
              {userProfile.location}
            </p>
          </div>
        </section>

        <section id="summary" className="mb-10 print:mb-6">
          <SectionHeading title="Summary" />
          <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: sanitize(userProfile.summary) }} />

          <div className="print:hidden text-gray-700 mb-10 flex flex-wrap justify-center gap-2">
            {topSkills.map((tag, index) => <SkillTag key={index} name={tag} />)}
          </div>
        </section>

        <section id="experience" className="mb-10 print:mb-6">
          <SectionHeading title="Experience" />

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
        </section>

        <section id="skills" className="mb-10 print:mb-6">
          <SectionHeading title="Skills" />
          <div className="flex flex-wrap gap-2 print:block print:space-y-0">
            {topSkills.map((skill, index) =>
              <SkillTag key={index} name={skill} />
            )}
          </div>

          {/* Hidden text for ATS - comprehensive skills list */}
          <div className="hidden print:block mt-4">
            <h3 className="font-semibold mb-2">Additional Skills</h3>
            <div className="print:block">
              {topSkills.slice(0, 5).map((skill, index) =>
                <span key={index} className="print:inline">
                  {skill}
                  {index < Math.min(topSkills.length, 5) - 1 ? ", " : ""}
                </span>
              )}
            </div>
            <div className="print:block">
              {Array.from(new Set(experiences.flatMap(exp => exp.tags)))
                .filter(skill => !topSkills.includes(skill))
                .slice(0, 5)
                .map((skill, index, array) =>
                  <span key={index} className="print:inline">
                    {skill}
                    {index < array.length - 1 ? ", " : ""}
                  </span>
                )}
            </div>
          </div>
        </section>

        <section id="languages" className="mb-10 print:mb-6">
          <SectionHeading title="Languages" />
          <div className="space-y-2">
            {userProfile.languages.map((language, index) =>
              <div key={index}>
                <span className="font-medium">{language.name}:</span>{" "}
                {language.proficiency}
              </div>
            )}
          </div>
        </section>

        <section id="education" className="mb-10 print:mb-6">
          <SectionHeading title="Education" />
          {userProfile.education.map((edu, index) =>
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                <h3 className="font-semibold">
                  {edu.institution}
                </h3>
                <span className="text-gray-500 text-sm">
                  {edu.dateRange}
                </span>
              </div>
              <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: sanitize(`${edu.degree}, ${edu.field}`) }} />
            </div>
          )}
        </section>

        <section id="certifications" className="mb-10 print:mb-6">
          <SectionHeading title="Certifications" />
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {userProfile.certifications.map((cert, index) =>
              <li key={index}>
                {cert.name}
                {cert.issuer &&
                  <span>
                    {" "}- {cert.issuer}
                  </span>}
                {cert.date &&
                  <span className="text-gray-500 text-sm ml-1">
                    ({cert.date})
                  </span>}
              </li>
            )}
          </ul>
        </section>

        {/* Contact Section - show/hide based on system settings */}
        {SystemSettings.get("showContacts") && (
          <section id="contact" className="print:mb-6">
            <SectionHeading title="Contact" />
            <div className="space-y-2 print:flex print:space-y-0 print:space-x-6">
              <div className="flex items-center">
                <FiMail className="w-5 h-5 mr-2 print:w-4 print:h-4" />
                <span>
                  Email:{" "}
                  <img
                    src={`/api/text-image?fieldType=email&size=24&color=%23222&bg=transparent`}
                    alt="Email address"
                    style={{
                      display: "inline",
                      verticalAlign: "middle",
                      height: 24
                    }}
                    draggable={false}
                  />
                </span>
              </div>
              <div className="flex items-center">
                <FiPhone className="w-5 h-5 mr-2 print:w-4 print:h-4" />
                <span>
                  Phone:{" "}
                  <img
                    src={`/api/text-image?fieldType=phone&size=24&color=%23222&bg=transparent`}
                    alt="Phone number"
                    style={{
                      display: "inline",
                      verticalAlign: "middle",
                      height: 24
                    }}
                    draggable={false}
                  />
                </span>
              </div>
              <div className="flex items-center">
                <FiLinkedin className="w-5 h-5 mr-2 print:w-4 print:h-4" />
                <span>
                  LinkedIn:{" "}
                  <a 
                    href={`https://${userProfile.linkedin?.replace(/^https?:\/\//i, '') || 'www.linkedin.com/in/preslav-panayotov'}`}
                    target="_blank" 
                    title={`LinkedIn Profile of ${userProfile.name}`}
                    rel="follow noopener noreferrer external"
                    className="hover:underline"
                  >
                    {userProfile.linkedin?.replace(/^https?:\/\//i, '') || 'www.linkedin.com/in/preslav-panayotov'}
                  </a>
                </span>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm print:hidden">
        <p>
          © {new Date().getFullYear()} {userProfile.name}. All rights reserved.
          <span className="ml-2 text-xs text-gray-400">
            | powered by <a href="https://github.com/index-panayotov/ppanayotov-com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">ppanayotov</a>
          </span>
        </p>
      </footer>
    </div>
  );
}
