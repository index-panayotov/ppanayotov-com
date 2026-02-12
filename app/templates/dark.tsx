"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TemplateProps } from "./types";
import { getProfileImageUrl } from "@/lib/image-utils";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getSocialIcon } from "@/lib/social-platforms";
import { Mail, Phone, MapPin, GraduationCap, Award, Briefcase, ChevronRight } from "lucide-react";

function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <a
      href={href}
      className={`group flex items-center gap-3 py-2 transition-all duration-300 ${
        isActive
          ? "text-[hsl(var(--dark-accent))]"
          : "text-[hsl(var(--dark-muted))] hover:text-[hsl(var(--dark-text))]"
      }`}
    >
      <span
        className={`h-px transition-all duration-300 ${
          isActive ? "w-16 bg-[hsl(var(--dark-accent))]" : "w-8 bg-[hsl(var(--dark-muted))] group-hover:w-16 group-hover:bg-[hsl(var(--dark-text))]"
        }`}
      />
      <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
    </a>
  );
}

function ExperienceCard({
  title,
  company,
  dateRange,
  description,
  tags,
  achievements,
}: {
  title: string;
  company: string;
  dateRange: string;
  description?: string;
  tags?: string[];
  achievements?: string[];
}) {
  const bullets = description
    ? description.split("\n").filter((line) => line.trim().startsWith("-")).map((line) => line.replace(/^-\s*/, "").trim())
    : [];

  const paragraphs = description
    ? description.split("\n\n").filter((p) => !p.trim().startsWith("-") && p.trim().length > 0)
    : [];

  // Check for subsections (bold headers like **Augeo Marketing**)
  const hasSubsections = description?.includes("**") && description.includes("**\n");

  return (
    <div className="group relative flex flex-col gap-1 rounded-lg p-5 transition-all duration-300 hover:bg-[hsl(var(--dark-card-hover))] lg:flex-row lg:gap-6">
      <div className="shrink-0 pt-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--dark-muted))] lg:w-36">
        {dateRange}
      </div>
      <div className="flex-1">
        <h3 className="font-medium leading-snug text-[hsl(var(--dark-text))]">
          {title}
          <span className="text-[hsl(var(--dark-muted))]">{" \u00B7 "}</span>
          <span className="text-[hsl(var(--dark-accent))]">{company}</span>
        </h3>

        {paragraphs.length > 0 && !hasSubsections && (
          <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--dark-body))]">
            {paragraphs[0]}
          </p>
        )}

        {hasSubsections && description && (
          <div className="mt-3 space-y-4">
            {description.split("\n\n").map((block, i) => {
              if (block.trim().startsWith("**")) {
                const titleMatch = block.match(/\*\*(.+?)\*\*/);
                const subTitle = titleMatch ? titleMatch[1] : "";
                const subBullets = block
                  .split("\n")
                  .filter((l) => l.trim().startsWith("-"))
                  .map((l) => l.replace(/^-\s*/, "").trim());

                return (
                  <div key={i}>
                    <h4 className="text-sm font-medium text-[hsl(var(--dark-text))] opacity-90">{subTitle}</h4>
                    {subBullets.length > 0 && (
                      <ul className="mt-1 space-y-1">
                        {subBullets.map((b, j) => (
                          <li key={j} className="flex gap-2 text-sm leading-relaxed text-[hsl(var(--dark-body))]">
                            <ChevronRight size={14} className="mt-1 shrink-0 text-[hsl(var(--dark-accent))]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

              if (block.trim().startsWith("-")) {
                return null;
              }

              return (
                <p key={i} className="text-sm leading-relaxed text-[hsl(var(--dark-body))]">
                  {block.replace(/\*\*/g, "")}
                </p>
              );
            })}
          </div>
        )}

        {!hasSubsections && bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-[hsl(var(--dark-body))]">
                <ChevronRight size={14} className="mt-1 shrink-0 text-[hsl(var(--dark-accent))]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {achievements && achievements.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {achievements.map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-[hsl(var(--dark-accent))]/10 px-3 py-1 text-xs font-medium text-[hsl(var(--dark-accent))]"
              >
                {a}
              </span>
            ))}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-[hsl(var(--dark-accent))]/10 px-3 py-1 text-xs font-medium text-[hsl(var(--dark-accent))]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SkillPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-[hsl(var(--dark-accent))]/10 px-3 py-1.5 text-xs font-medium text-[hsl(var(--dark-accent))]">
      {label}
    </span>
  );
}

export default function DarkTemplate({
  experiences,
  topSkills,
  profileData,
  systemSettings,
}: TemplateProps) {
  const sectionIds = ["about", "experience", "skills", "education", "contact"];
  const activeSection = useActiveSection(sectionIds);

  const getSocialIconForDisplay = useCallback(
    (platform: string) => getSocialIcon(platform, "h-5 w-5"),
    []
  );

  // Spotlight effect
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Categorize skills from the resume data
  const coreSkills = [
    "SAFe PI Planning & Execution",
    "Multi-team Delivery Management",
    "Client Escalation Management",
    "Team Scaling & Onboarding",
    "Cross-functional Collaboration",
    "Stakeholder Management",
    "CI/CD & Release Management",
    "Budget & Resource Allocation",
    "Technical Debt Reduction",
    "Sprint Predictability Optimization",
    "Contract Negotiation & Account Management",
    "Quality Assurance & Defect Management",
    "Engineering Process Improvement",
  ];

  const aiSkills = [
    "Claude (Code / Agents / Workflows)",
    "Gemini (CLI / Stitch)",
    "Ollama",
    "n8n workflows",
    "Prompt Engineering",
    "AI-augmented Code Review",
  ];

  const softSkills = [
    "Conflict Resolution",
    "Proactive Communication",
    "Mentoring & Coaching",
    "Team Building",
    "Relationship Building",
    "Adaptability",
  ];

  const techStack = {
    Languages: ["TypeScript", "JavaScript", "PHP", "Java"],
    Frontend: ["React", "Next.js"],
    Backend: ["Node.js", "Strapi", "NestJS", "Laravel", "Zend Framework"],
    Databases: ["PostgreSQL", "MSSQL"],
    "Cloud & Infrastructure": ["AWS (EC2, Fargate)", "Docker", "Apache", "Nginx", "Varnish"],
    "Tools & Methodologies": ["Git", "Jira", "Azure DevOps", "Confluence", "SAFe", "Scrum", "Kanban", "Jenkins", "GitHub Actions"],
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[hsl(var(--dark-bg))]"
    >
      {/* Spotlight gradient following the cursor */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--dark-accent) / 0.07), transparent 80%)`,
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 py-12 lg:flex-row lg:gap-4 lg:px-12 lg:py-0">
        {/* ===== LEFT SIDEBAR (Sticky) ===== */}
        <header className="flex flex-col lg:sticky lg:top-0 lg:h-screen lg:w-1/2 lg:max-w-md lg:justify-between lg:py-24">
          <div>
            {/* Profile Image */}
            <div className="mb-6 h-24 w-24 overflow-hidden rounded-full border-2 border-[hsl(var(--dark-accent))]/30">
              <OptimizedImage
                src={getProfileImageUrl(profileData, "web")}
                alt={`Profile picture of ${profileData.name}`}
                width={96}
                height={96}
                className="h-full w-full object-cover"
                priority
                quality={90}
                sizes="96px"
              />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--dark-text))] lg:text-5xl">
              {profileData.name}
            </h1>
            <h2 className="mt-3 text-lg font-medium text-[hsl(var(--dark-body))]">
              {profileData.title}
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[hsl(var(--dark-muted))]">
              {profileData.location ? (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {profileData.location}
                </span>
              ) : null}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[hsl(var(--dark-body))]">
              I bridge the gap between business vision and technical execution — ensuring realistic planning, measurable quality improvements, and predictable delivery.
            </p>

            {/* Navigation */}
            <nav className="mt-12 hidden lg:block" aria-label="Section navigation">
              <NavLink href="#about" label="About" isActive={activeSection === "about"} />
              <NavLink href="#experience" label="Experience" isActive={activeSection === "experience"} />
              <NavLink href="#skills" label="Skills" isActive={activeSection === "skills"} />
              <NavLink href="#education" label="Education" isActive={activeSection === "education"} />
              {systemSettings.showContacts && (
                <NavLink href="#contact" label="Contact" isActive={activeSection === "contact"} />
              )}
            </nav>
          </div>

          {/* Social Links at bottom of sidebar */}
          <div className="mt-8 flex items-center gap-5 lg:mt-0">
            {profileData.socialLinks
              ?.filter((link) => link.visible)
              .sort((a, b) => (a.position || 0) - (b.position || 0))
              .map((link, index) => (
                <a
                  key={index}
                  href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--dark-muted))] transition-colors duration-200 hover:text-[hsl(var(--dark-accent))]"
                  aria-label={`${link.platform === "Custom" ? link.label : link.platform} Profile`}
                >
                  {getSocialIconForDisplay(link.platform)}
                </a>
              ))}
            {systemSettings.showContacts && profileData.email && (
              <a
                href={`mailto:${profileData.email}`}
                className="text-[hsl(var(--dark-muted))] transition-colors duration-200 hover:text-[hsl(var(--dark-accent))]"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            )}
          </div>
        </header>

        {/* ===== RIGHT CONTENT (Scrolling) ===== */}
        <main className="pt-12 lg:w-1/2 lg:py-24">
          {/* ----- ABOUT SECTION ----- */}
          <section id="about" className="mb-24 scroll-mt-24" aria-labelledby="about-heading">
            <h2 id="about-heading" className="mb-6 text-sm font-semibold uppercase tracking-widest text-[hsl(var(--dark-text))] lg:sr-only">
              About
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[hsl(var(--dark-body))]">
              <p>
                Software Engineering Manager with <strong className="text-[hsl(var(--dark-text))]">12+ years</strong> of progressive experience from backend development to leading cross-functional teams of up to <strong className="text-[hsl(var(--dark-text))]">96 engineers</strong> across diverse technology stacks.
              </p>
              <p>
                Track record of scaling teams (from 3 to 21, from 40 to 96), rescuing failing projects, reducing client escalations to near-zero, and cutting cloud costs by 30%.
              </p>
              <p>
                Leverages a strong engineering foundation to bridge the gap between business vision and technical execution — ensuring realistic planning, measurable quality improvements, and predictable delivery in fast-paced, regulated environments.
              </p>
            </div>

            {/* Key metrics */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: "12+", label: "Years Experience" },
                { value: "96", label: "Engineers Led" },
                { value: "87.5%", label: "Defect Reduction" },
                { value: "30%", label: "Cost Savings" },
              ].map((metric, i) => (
                <div key={i} className="rounded-lg border border-[hsl(var(--dark-border))] p-4 text-center">
                  <div className="text-2xl font-bold text-[hsl(var(--dark-accent))]">{metric.value}</div>
                  <div className="mt-1 text-xs text-[hsl(var(--dark-muted))]">{metric.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ----- EXPERIENCE SECTION ----- */}
          <section id="experience" className="mb-24 scroll-mt-24" aria-labelledby="experience-heading">
            <h2 id="experience-heading" className="mb-6 text-sm font-semibold uppercase tracking-widest text-[hsl(var(--dark-text))] lg:sr-only">
              Experience
            </h2>
            <div className="-mx-5 space-y-2">
              {experiences.map((exp, index) => (
                <ExperienceCard
                  key={index}
                  title={exp.title}
                  company={exp.company}
                  dateRange={exp.dateRange}
                  description={exp.description}
                  tags={exp.tags}
                  achievements={exp.achievements}
                />
              ))}
            </div>
          </section>

          {/* ----- SKILLS SECTION ----- */}
          <section id="skills" className="mb-24 scroll-mt-24" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className="mb-8 text-sm font-semibold uppercase tracking-widest text-[hsl(var(--dark-text))] lg:sr-only">
              Skills
            </h2>

            {/* Core Skills */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[hsl(var(--dark-text))]">
                <Briefcase size={16} className="text-[hsl(var(--dark-accent))]" />
                Core Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {coreSkills.map((skill, i) => (
                  <SkillPill key={i} label={skill} />
                ))}
              </div>
            </div>

            {/* AI Skills */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[hsl(var(--dark-text))]">
                <Award size={16} className="text-[hsl(var(--dark-accent))]" />
                AI Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {aiSkills.map((skill, i) => (
                  <SkillPill key={i} label={skill} />
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[hsl(var(--dark-text))]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[hsl(var(--dark-accent))]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill, i) => (
                  <SkillPill key={i} label={skill} />
                ))}
              </div>
            </div>

            {/* Technology Stack */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[hsl(var(--dark-text))]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[hsl(var(--dark-accent))]"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                Technology Stack
              </h3>
              <div className="space-y-3">
                {Object.entries(techStack).map(([category, skills]) => (
                  <div key={category} className="flex flex-col gap-2 rounded-lg border border-[hsl(var(--dark-border))] p-4 sm:flex-row sm:items-start sm:gap-4">
                    <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--dark-muted))] sm:w-40">
                      {category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, i) => (
                        <span key={i} className="text-sm text-[hsl(var(--dark-body))]">
                          {skill}{i < skills.length - 1 ? <span className="text-[hsl(var(--dark-muted))]">{" \u00B7 "}</span> : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ----- EDUCATION SECTION ----- */}
          <section id="education" className="mb-24 scroll-mt-24" aria-labelledby="education-heading">
            <h2 id="education-heading" className="mb-6 text-sm font-semibold uppercase tracking-widest text-[hsl(var(--dark-text))] lg:sr-only">
              Education
            </h2>
            <div className="space-y-4">
              {profileData.education?.map((edu, index) => (
                <div
                  key={index}
                  className="group flex flex-col gap-1 rounded-lg border border-[hsl(var(--dark-border))] p-5 transition-all duration-300 hover:border-[hsl(var(--dark-accent))]/30 hover:bg-[hsl(var(--dark-card-hover))] lg:flex-row lg:gap-6"
                >
                  <div className="shrink-0 pt-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--dark-muted))] lg:w-36">
                    {edu.dateRange}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <GraduationCap size={18} className="mt-0.5 shrink-0 text-[hsl(var(--dark-accent))]" />
                      <div>
                        <h3 className="font-medium text-[hsl(var(--dark-text))]">{edu.institution}</h3>
                        <p className="mt-1 text-sm text-[hsl(var(--dark-body))]">
                          {edu.degree}, {edu.field}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            {profileData.languages && profileData.languages.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-sm font-semibold text-[hsl(var(--dark-text))]">Languages</h3>
                <div className="flex gap-4">
                  {profileData.languages.map((lang, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border border-[hsl(var(--dark-border))] px-4 py-3">
                      <span className="text-sm font-medium text-[hsl(var(--dark-text))]">{lang.name}</span>
                      <span className="text-xs text-[hsl(var(--dark-muted))]">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ----- CONTACT SECTION ----- */}
          {systemSettings.showContacts && (
            <section id="contact" className="mb-24 scroll-mt-24" aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="mb-6 text-sm font-semibold uppercase tracking-widest text-[hsl(var(--dark-text))] lg:sr-only">
                Contact
              </h2>
              <div className="rounded-lg border border-[hsl(var(--dark-border))] p-6">
                <p className="mb-6 text-sm leading-relaxed text-[hsl(var(--dark-body))]">
                  {"I'm always open to discussing new opportunities, leadership challenges, and engineering strategy. Feel free to reach out."}
                </p>
                <div className="space-y-4">
                  {profileData.email && (
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-[hsl(var(--dark-accent))]" />
                      <div className="cursor-default" style={{ minHeight: "28px", display: "flex", alignItems: "center" }}>
                        <img
                          src="/api/text-image?fieldType=email&size=14&color=%2364ffda&bg=transparent"
                          alt="Email address (protected from bots)"
                          className="inline-block"
                          draggable={false}
                          loading="eager"
                        />
                      </div>
                    </div>
                  )}
                  {profileData.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-[hsl(var(--dark-accent))]" />
                      <div className="cursor-default" style={{ minHeight: "28px", display: "flex", alignItems: "center" }}>
                        <img
                          src="/api/text-image?fieldType=phone&size=14&color=%2364ffda&bg=transparent"
                          alt="Phone number (protected from bots)"
                          className="inline-block"
                          draggable={false}
                          loading="eager"
                        />
                      </div>
                    </div>
                  )}
                  {profileData.location && (
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-[hsl(var(--dark-accent))]" />
                      <span className="text-sm text-[hsl(var(--dark-body))]">{profileData.location}</span>
                    </div>
                  )}

                  {/* Social links */}
                  {profileData.socialLinks?.filter((link) => link.visible).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {profileData.socialLinks
                        ?.filter((link) => link.visible)
                        .sort((a, b) => (a.position || 0) - (b.position || 0))
                        .map((link, index) => (
                          <a
                            key={index}
                            href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border border-[hsl(var(--dark-border))] px-4 py-2 text-sm text-[hsl(var(--dark-body))] transition-all duration-200 hover:border-[hsl(var(--dark-accent))]/50 hover:text-[hsl(var(--dark-accent))]"
                          >
                            {getSocialIcon(link.platform, "h-4 w-4")}
                            <span>{link.platform === "Custom" ? link.label : link.platform}</span>
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Footer text */}
          <footer className="border-t border-[hsl(var(--dark-border))] py-8">
            <p className="text-xs leading-relaxed text-[hsl(var(--dark-muted))]">
              Designed and built with{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[hsl(var(--dark-body))] hover:text-[hsl(var(--dark-accent))] transition-colors"
              >
                Next.js
              </a>{" "}
              and{" "}
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[hsl(var(--dark-body))] hover:text-[hsl(var(--dark-accent))] transition-colors"
              >
                Tailwind CSS
              </a>
              . All text is set in the{" "}
              <a
                href="https://rsms.me/inter/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[hsl(var(--dark-body))] hover:text-[hsl(var(--dark-accent))] transition-colors"
              >
                Inter
              </a>{" "}
              typeface.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
