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
  // Find LinkedIn URL from social links
  const linkedinLink = userProfile.socialLinks?.find(link =>
    link.platform.toLowerCase() === 'linkedin' && link.visible
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: userProfile.name,
    jobTitle: userProfile.title,
    email: userProfile.email,
    telephone: userProfile.phone,
    url: linkedinLink
      ? (linkedinLink.url.startsWith('http') ? linkedinLink.url : `https://${linkedinLink.url}`)
      : undefined,
    address: userProfile.location
    // Add more fields as needed
  };
}
