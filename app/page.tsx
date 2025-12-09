import { loadCVData, loadTopSkills, loadUserProfile, loadSystemSettings } from "@/lib/data-loader";
import { isValidTemplateId } from "./templates/template-registry";
import ClassicTemplate from "./templates/classic";
import ProfessionalTemplate from "./templates/professional";
import ModernTemplate from "./templates/modern";

/**
 * Force dynamic rendering to ensure fresh data on every request.
 *
 * This is critical for the admin panel workflow:
 * - Data is stored in JSON files that can be updated at runtime
 * - Without dynamic rendering, Next.js would serve stale cached pages
 * - revalidatePath() in API routes triggers cache invalidation
 */
export const dynamic = 'force-dynamic';

/**
 * Main Page - Template Loader (Server Component)
 *
 * Dynamically rendered to reflect latest data changes from admin panel.
 * Reads template selection from system_settings and renders the appropriate template.
 */
export default function Home() {
  // Load system settings
  const systemSettings = loadSystemSettings();
  const templateId = systemSettings.selectedTemplate;

  // Load data files
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

  // Render the selected template directly (no lazy loading)
  switch (validTemplateId) {
    case "professional":
      return <ProfessionalTemplate {...templateProps} />;
    case "modern":
      return <ModernTemplate {...templateProps} />;
    case "classic":
    default:
      return <ClassicTemplate {...templateProps} />;
  }
}
