import { loadCVData, loadTopSkills, loadUserProfile, loadSystemSettings } from "@/lib/data-loader";
import { isValidTemplateId } from "./templates/template-registry";
import ClassicTemplate from "./templates/classic";
import ProfessionalTemplate from "./templates/professional";
import ModernTemplate from "./templates/modern";

/**
 * Main Page - Template Loader (Server Component)
 *
 * Statically generated at build time. Reads template selection from
 * system_settings.ts and pre-renders the appropriate template.
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
