import { loadCVData, loadTopSkills, loadUserProfile, loadSystemSettings } from "@/lib/data-loader";
import { getTemplateComponent, isValidTemplateId } from "./templates/template-registry";
import { Suspense } from "react";
import { logger } from "@/lib/logger";

// Force dynamic rendering - don't cache this page
// This ensures we always read fresh system_settings on each request
export const dynamic = 'force-dynamic';

/**
 * Main Page - Template Loader (Server Component)
 *
 * Server Component that reads the selected template from system settings
 * and renders the appropriate template. No hydration issues because the
 * server knows which template to render from the start.
 *
 * Template changes take effect on page refresh without server restart.
 */
export default async function Home() {
  // Read system settings directly from file to bypass Node.js module cache
  let templateId = "classic";
  let systemSettings;

  try {
    systemSettings = loadSystemSettings();
    templateId = systemSettings.selectedTemplate;
    logger.info(`[Homepage] Loaded template from file: ${templateId}`);
  } catch (error) {
    logger.error("Error reading system settings, using default template", error instanceof Error ? error : new Error(String(error)));
    // Load default system settings if file read fails
    systemSettings = {
      selectedTemplate: "classic",
      blogEnable: false,
      useWysiwyg: false,
      showContacts: false,
      showPrint: false,
      gtagCode: "G-NR6KNX7RM6",
      gtagEnabled: false
    };
  }

  // Load data files with lazy loading
  const experiences = loadCVData();
  const topSkills = loadTopSkills();
  const userProfile = loadUserProfile();

  // Shared props for all templates
  const templateProps = {
    experiences,
    topSkills,
    profileData: userProfile,
    systemSettings
  };

  // Validate template ID and fallback to classic if invalid
  const validTemplateId = isValidTemplateId(templateId) ? templateId : "classic";

  // Get the lazy-loaded template component
  const TemplateComponent = getTemplateComponent(validTemplateId);

  // Render the selected template with Suspense for lazy loading
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemplateComponent {...templateProps} />
    </Suspense>
  );
}
