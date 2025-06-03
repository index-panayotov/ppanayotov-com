// services/SchemaOrg.ts
// Provides schema.org structured data for the Person Contact Page

import { userProfile } from "@/data/user-profile";

export function getPersonContactSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: userProfile.name,
    jobTitle: userProfile.title,
    email: userProfile.email,
    telephone: userProfile.phone,
    url: userProfile.linkedin
      ? `https://${userProfile.linkedin.replace(/^https?:\/\//i, "")}`
      : undefined,
    address: userProfile.location
    // Add more fields as needed
  };
}
