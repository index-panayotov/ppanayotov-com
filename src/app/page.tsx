import { resumeData } from "@/data/resume-data";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { ProfilePhoto } from "@/components/sidebar/ProfilePhoto";
import { ContactInfo } from "@/components/sidebar/ContactInfo";
import { Competencies } from "@/components/sidebar/Competencies";
import { EducationSummary } from "@/components/sidebar/EducationSummary";
import { Languages } from "@/components/sidebar/Languages";
import { TechStack } from "@/components/sidebar/TechStack";
import { PersonalProfile } from "@/components/main/PersonalProfile";
import { WorkExperience } from "@/components/main/WorkExperience";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: resumeData.name,
  jobTitle: resumeData.title,
  url: "https://ppanayotov.com",
  email: resumeData.contact.email,
  telephone: resumeData.contact.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sofia",
    addressCountry: "BG",
  },
  sameAs: [resumeData.contact.linkedIn],
  knowsAbout: [
    "Software Engineering",
    "SAFe",
    "React",
    "Next.js",
    "TypeScript",
    "Team Leadership",
    "Delivery Management",
  ],
  alumniOf: resumeData.education.map((edu) => ({
    "@type": "EducationalOrganization",
    name: edu.institution,
  })),
  worksFor: {
    "@type": "Organization",
    name: "DSK Bank",
  },
};

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-zinc-100 print:bg-white">
        <article className="mx-auto max-w-[1100px] bg-white shadow-lg print:max-w-none print:shadow-none">
          <div className="flex flex-col md:flex-row print:flex-row">
            {/* Sidebar */}
            <aside className="w-full border-r-[3px] border-accent md:w-[38%] print:w-[38%]">
              <SidebarHeader name={resumeData.name} title={resumeData.title} />
              <ProfilePhoto />
              <ContactInfo contact={resumeData.contact} />
              <Competencies groups={resumeData.competencies} />
              <EducationSummary education={resumeData.education} />
              <Languages languages={resumeData.languages} />
              <TechStack categories={resumeData.techStack} />
            </aside>

            {/* Main Content */}
            <main className="w-full space-y-6 p-6 md:w-[62%] md:p-8 print:w-[62%] print:p-8">
              <PersonalProfile text={resumeData.profile} />
              <WorkExperience entries={resumeData.workExperience} />
            </main>
          </div>
        </article>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
