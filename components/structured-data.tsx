import { userProfile } from "@/data/user-profile";
import { experiences } from "@/data/cv-data";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": userProfile.name,
    "jobTitle": userProfile.title,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": userProfile.location
    },
    "email": userProfile.email,
    "telephone": userProfile.phone,
    "sameAs": userProfile.linkedin ? [
      `https://${userProfile.linkedin.replace(/^https?:\/\//i, '')}`
    ] : [],
    "knowsAbout": Array.from(new Set(experiences.flatMap(exp => exp.tags))).slice(0, 10),
    "alumniOf": userProfile.education.map(edu => ({
      "@type": "EducationalOrganization",
      "name": edu.institution
    })),
    "hasCredential": userProfile.certifications.map(cert => ({
      "@type": "EducationalOccupationalCredential",
      "name": cert.name,
      "credentialCategory": "certificate"
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}