// services/SchemaOrg.ts
// Provides schema.org structured data for the Person Contact Page

import { userProfile } from "@/data/user-profile";

/**
 * Generates a schema.org "Person" structured data object for a contact page.
 *
 * Populates the returned object with contact and professional details from the user profile, including name, job title, email, telephone, LinkedIn URL (if available), and address.
 *
 * @returns An object representing schema.org "Person" structured data for embedding in web pages.
 */
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
