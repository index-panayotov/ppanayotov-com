import { ExperienceEntry } from "@/types";
import {
  LanguageProficiency,
  SocialLink,
  UserProfile,
  LanguageEntry,
  EducationEntry,
  Certification
} from "@/types/profile";
import { processFormValue, isEditorJSFormat } from "@/lib/editorjs-utils";
import systemSettings from "@/data/system_settings";
import { ApiResponse } from "@/types/core";

// Type definitions for admin handlers
export interface ToastFunction {
  (config: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
    className?: string;
  }): void;
}

export interface AdminApiResponse {
  success?: boolean;
  error?: string;
}

// Extended types for editing with temporary index
export interface ExperienceEntryWithIndex extends ExperienceEntry {
  _index?: number;
}

export interface LanguageEntryWithIndex extends LanguageEntry {
  _index?: number;
}

export interface EducationEntryWithIndex extends EducationEntry {
  _index?: number;
}

export interface CertificationWithIndex extends Certification {
  _index?: number;
}

export interface SocialLinkWithIndex extends SocialLink {
  _index?: number;
}

// Function to handle saving data to API
export const handleSave = async (
  file: string,
  data: unknown,
  setSaving: (value: boolean) => void,
  toast: ToastFunction
) => {
  try {
    setSaving(true);
    // Convert language proficiency string values to enum if needed
    if (data && typeof data === 'object' && 'languages' in data && Array.isArray((data as UserProfile).languages)) {
      (data as UserProfile).languages = ((data as UserProfile).languages as LanguageEntry[]).map((lang: LanguageEntry) => ({
        ...lang,
        proficiency:
          typeof lang.proficiency === "string"
            ? LanguageProficiency[
                lang.proficiency as keyof typeof LanguageProficiency
              ] || lang.proficiency
            : lang.proficiency
      }));
    }
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ file, data })
    });

    if (!res.ok) {
      const errorData = await res.json() as AdminApiResponse;
      throw new Error(errorData.error || "Failed to save data");
    }

    toast({
      title: "Success",
      description: `${file} saved successfully`,
      variant: "default",
      className: "bg-green-50 border-green-200 text-green-800"
    });
  } catch (err: unknown) {
    toast({
      title: "Error",
      description: err instanceof Error ? err.message : "Failed to save data",
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};

// Functions for handling textarea JSON changes
export const handleExperiencesChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
  setExperiences: (experiences: ExperienceEntry[]) => void
) => {
  try {
    const parsed = JSON.parse(e.target.value);
    setExperiences(parsed);
  } catch (err) {
    // Don't update state if JSON is invalid
    console.error("Invalid JSON:", err);
  }
};

export const handleTopSkillsChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
  setTopSkills: (topSkills: string[]) => void
) => {
  try {
    const parsed = JSON.parse(e.target.value);
    setTopSkills(parsed);
  } catch (err) {
    // Don't update state if JSON is invalid
    console.error("Invalid JSON:", err);
  }
};

export const handleProfileDataChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
  setProfileData: (profileData: UserProfile) => void
) => {
  try {
    const parsed = JSON.parse(e.target.value) as UserProfile;
    setProfileData(parsed);
  } catch (err) {
    // Don't update state if JSON is invalid
    console.error("Invalid JSON:", err);
  }
};

export const handleProfileFieldChange = (
  field: keyof UserProfile,
  value: string,
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void
) => {
  setProfileData({
    ...profileData,
    [field]: value
  } as UserProfile);
};

// Functions for experiences
export const addExperience = (
  setCurrentExperience: (experience: ExperienceEntryWithIndex | null) => void,
  setDialogOpen: (open: boolean) => void
) => {
  const newExperience: ExperienceEntryWithIndex = {
    title: "",
    company: "",
    dateRange: "",
    location: "",
    description: "",
    tags: []
  };
  setCurrentExperience(newExperience);
  setDialogOpen(true);
};

export const editExperience = (
  exp: ExperienceEntry,
  index: number,
  setCurrentExperience: (experience: ExperienceEntryWithIndex | null) => void,
  setDialogOpen: (open: boolean) => void
) => {
  setCurrentExperience({ ...exp, _index: index });
  setDialogOpen(true);
};

export const saveExperience = async (
  currentExperience: ExperienceEntryWithIndex | null,
  experiences: ExperienceEntry[],
  setExperiences: (experiences: ExperienceEntry[]) => void,
  setDialogOpen: (open: boolean) => void,
  setCurrentExperience: (experience: ExperienceEntryWithIndex | null) => void,
  setNewSkill: (skill: string) => void,
  setSaving: (value: boolean) => void,
  toast: ToastFunction
) => {
  if (!currentExperience) return;

  // Validate required fields
  const requiredFields = [
    { field: 'title', name: 'Title' },
    { field: 'company', name: 'Company' },
    { field: 'dateRange', name: 'Date Range' },
    { field: 'description', name: 'Description' }
  ];

  const missingFields = requiredFields.filter(
    ({ field }) => !currentExperience[field as keyof ExperienceEntry]?.toString().trim()
  );

  if (missingFields.length > 0) {
    toast({
      title: "Validation Error",
      description: `Please fill in the following required fields: ${missingFields.map(f => f.name).join(', ')}`,
      variant: "destructive"
    });
    return;
  }

  const expToSave = { ...currentExperience };
  const index = expToSave._index;
  delete expToSave._index;

  // Process description to handle EditorJS format
  if (expToSave.description) {
    expToSave.description = processFormValue(expToSave.description, systemSettings.useWysiwyg);
  }

  // Clean up empty optional fields
  if (!expToSave.location?.trim()) {
    delete expToSave.location;
  }

  const newExperiences = [...experiences];

  if (index !== undefined) {
    // Update existing
    newExperiences[index] = expToSave;
  } else {
    // Add new
    newExperiences.push(expToSave);
  }

  try {
    setSaving(true);
    
    // Update local state first
    setExperiences(newExperiences);
    
    // Automatically persist to file system
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ file: "cv-data.ts", data: newExperiences })
    });

    if (!res.ok) {
      const errorData = await res.json() as AdminApiResponse;
      throw new Error(errorData.error || "Failed to save data");
    }
    
    // Show success message
    if (index !== undefined) {
      toast({
        title: "Experience Updated & Saved",
        description: `"${expToSave.title}" has been updated and saved to file`,
        className: "bg-blue-50 border-blue-200 text-blue-800"
      });
    } else {
      toast({
        title: "Experience Added & Saved",
        description: `"${expToSave.title}" has been added and saved to file`,
        className: "bg-green-50 border-green-200 text-green-800"
      });
    }
    
    // Close dialog and reset state on success
    setDialogOpen(false);
    setCurrentExperience(null);
    setNewSkill("");
    
  } catch (error) {
    // Revert local state on error
    setExperiences(experiences);
    
    toast({
      title: "Save Failed",
      description: `Failed to save "${expToSave.title}" to file. Please try again.`,
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};

export const deleteExperience = (
  index: number,
  experiences: ExperienceEntry[],
  setExperiences: (experiences: ExperienceEntry[]) => void,
  toast: ToastFunction
) => {
  const title = experiences[index].title;
  const newExperiences = [...experiences];
  newExperiences.splice(index, 1);
  setExperiences(newExperiences);

  toast({
    title: "Experience Deleted",
    description: `"${title}" has been removed`,
    variant: "destructive"
  });
};

export const moveExperience = async (
  index: number,
  direction: "up" | "down",
  experiences: ExperienceEntry[],
  setExperiences: (experiences: ExperienceEntry[]) => void,
  setSaving: (value: boolean) => void,
  toast: ToastFunction
) => {
  if (
    (direction === "up" && index === 0) ||
    (direction === "down" && index === experiences.length - 1)
  ) {
    return;
  }

  const newExperiences = [...experiences];
  const newIndex = direction === "up" ? index - 1 : index + 1;

  [newExperiences[index], newExperiences[newIndex]] = [
    newExperiences[newIndex],
    newExperiences[index]
  ];

  try {
    setSaving(true);
    
    // Update local state first
    setExperiences(newExperiences);
    
    // Automatically persist to file system
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ file: "cv-data.ts", data: newExperiences })
    });

    if (!res.ok) {
      const errorData = await res.json() as AdminApiResponse;
      throw new Error(errorData.error || "Failed to save data");
    }
    
    // Show success message
    toast({
      title: "Experience Reordered & Saved",
      description: `"${newExperiences[newIndex].title}" moved ${direction} and saved to file`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
    
  } catch (error) {
    // Revert local state on error
    setExperiences(experiences);
    
    toast({
      title: "Reorder Failed",
      description: "Failed to save the new order. Please try again.",
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};

// Functions for tags/skills
export const addTag = (
  currentExperience: ExperienceEntryWithIndex | null,
  newSkill: string,
  setCurrentExperience: (experience: ExperienceEntryWithIndex | null) => void,
  setNewSkill: (skill: string) => void
) => {
  if (!currentExperience || !newSkill.trim()) return;

  if (!currentExperience.tags.includes(newSkill)) {
    setCurrentExperience({
      ...currentExperience,
      tags: [...currentExperience.tags, newSkill]
    });
  }

  setNewSkill("");
};

export const removeTag = (
  tag: string,
  currentExperience: ExperienceEntryWithIndex | null,
  setCurrentExperience: (experience: ExperienceEntryWithIndex | null) => void
) => {
  if (!currentExperience) return;

  setCurrentExperience({
    ...currentExperience,
    tags: currentExperience.tags.filter((t) => t !== tag)
  });
};

export const addTopSkill = (
  newSkill: string,
  topSkills: string[],
  setTopSkills: (topSkills: string[]) => void,
  setNewSkill: (skill: string) => void,
  toast: ToastFunction
) => {
  if (!newSkill.trim()) return;

  if (!topSkills.includes(newSkill)) {
    setTopSkills([...topSkills, newSkill]);
    setNewSkill("");

    toast({
      title: "Skill Added",
      description: `"${newSkill}" has been added to top skills`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
  } else {
    toast({
      title: "Skill Already Exists",
      description: `"${newSkill}" is already in the list`,
      variant: "default"
    });
    setNewSkill("");
  }
};

export const removeTopSkill = (
  skill: string,
  topSkills: string[],
  setTopSkills: (topSkills: string[]) => void,
  toast: ToastFunction
) => {
  setTopSkills(topSkills.filter((s) => s !== skill));

  toast({
    title: "Skill Removed",
    description: `"${skill}" has been removed`,
    variant: "destructive"
  });
};

export const moveTopSkill = (
  index: number,
  direction: "up" | "down",
  topSkills: string[],
  setTopSkills: (topSkills: string[]) => void
) => {
  if (
    (direction === "up" && index === 0) ||
    (direction === "down" && index === topSkills.length - 1)
  ) {
    return;
  }

  const newTopSkills = [...topSkills];
  const newIndex = direction === "up" ? index - 1 : index + 1;

  [newTopSkills[index], newTopSkills[newIndex]] = [
    newTopSkills[newIndex],
    newTopSkills[index]
  ];

  setTopSkills(newTopSkills);
};

export const generateAutomaticTopSkills = async (
  experiences: ExperienceEntry[],
  setTopSkills: (topSkills: string[]) => void,
  setSaving: (saving: boolean) => void,
  toast: ToastFunction
) => {
  try {
    setSaving(true);
    const res = await fetch("/api/admin/autoskills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ experiences })
    });
    const data = await res.json() as { topSkills?: string[]; error?: string };

    if (!res.ok) {
      throw new Error(data.error || "Failed to generate top skills");
    }

    if (!data.topSkills || !Array.isArray(data.topSkills)) {
      throw new Error("Invalid response format from AI service");
    }

    setTopSkills(data.topSkills);

    toast({
      title: "Top Skills Generated",
      description:
        "Top skills have been automatically generated based on your experience",
      className: "bg-green-50 border-green-200 text-green-800"
    });
  } catch (err: unknown) {
    toast({
      title: "Error",
      description: err instanceof Error ? err.message : "Failed to generate top skills",
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};

// Functions for managing languages
export const addLanguage = (
  setCurrentLanguage: (language: LanguageEntryWithIndex | null) => void,
  setLanguageDialogOpen: (open: boolean) => void
) => {
  const newLanguage: LanguageEntryWithIndex = {
    name: "",
    proficiency: LanguageProficiency.Professional
  };
  setCurrentLanguage(newLanguage);
  setLanguageDialogOpen(true);
};

export const editLanguage = (
  lang: LanguageEntry,
  index: number,
  setCurrentLanguage: (language: LanguageEntryWithIndex | null) => void,
  setLanguageDialogOpen: (open: boolean) => void
) => {
  setCurrentLanguage({ ...lang, _index: index });
  setLanguageDialogOpen(true);
};

export const saveLanguage = (
  currentLanguage: LanguageEntryWithIndex | null,
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void,
  setLanguageDialogOpen: (open: boolean) => void,
  setCurrentLanguage: (language: LanguageEntryWithIndex | null) => void,
  toast: ToastFunction
) => {
  if (!currentLanguage) return;

  const langToSave = { ...currentLanguage };
  const index = langToSave._index;
  delete langToSave._index;

  const newLanguages = [...(profileData.languages || [])];

  if (index !== undefined) {
    // Update existing
    newLanguages[index] = langToSave;
    toast({
      title: "Language Updated",
      description: `"${langToSave.name}" has been updated`,
      className: "bg-blue-50 border-blue-200 text-blue-800"
    });
  } else {
    // Add new
    newLanguages.push(langToSave);
    toast({
      title: "Language Added",
      description: `"${langToSave.name}" has been added`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
  }

  setProfileData({
    ...profileData,
    languages: newLanguages
  });
  setLanguageDialogOpen(false);
  setCurrentLanguage(null);
};

export const deleteLanguage = (
  index: number,
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void,
  toast: ToastFunction
) => {
  const name = profileData.languages?.[index]?.name || "";
  const newLanguages = [...(profileData.languages || [])];
  newLanguages.splice(index, 1);
  setProfileData({
    ...profileData,
    languages: newLanguages
  });

  toast({
    title: "Language Deleted",
    description: `"${name}" has been removed`,
    variant: "destructive"
  });
};

export const moveLanguage = (
  index: number,
  direction: "up" | "down",
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void
) => {
  if (
    !profileData.languages ||
    (direction === "up" && index === 0) ||
    (direction === "down" && index === profileData.languages.length - 1)
  ) {
    return;
  }

  const newLanguages = [...profileData.languages];
  const newIndex = direction === "up" ? index - 1 : index + 1;

  [newLanguages[index], newLanguages[newIndex]] = [
    newLanguages[newIndex],
    newLanguages[index]
  ];

  setProfileData({
    ...profileData,
    languages: newLanguages
  });
};

// Functions for managing education
export const addEducation = (
  setCurrentEducation: (education: EducationEntryWithIndex | null) => void,
  setEducationDialogOpen: (open: boolean) => void
) => {
  const newEducation: EducationEntryWithIndex = {
    institution: "",
    degree: "",
    field: "",
    dateRange: ""
  };
  setCurrentEducation(newEducation);
  setEducationDialogOpen(true);
};

export const editEducation = (
  edu: EducationEntry,
  index: number,
  setCurrentEducation: (education: EducationEntryWithIndex | null) => void,
  setEducationDialogOpen: (open: boolean) => void
) => {
  setCurrentEducation({ ...edu, _index: index });
  setEducationDialogOpen(true);
};

export const saveEducation = (
  currentEducation: EducationEntryWithIndex | null,
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void,
  setEducationDialogOpen: (open: boolean) => void,
  setCurrentEducation: (education: EducationEntryWithIndex | null) => void,
  toast: ToastFunction
) => {
  if (!currentEducation) return;

  const eduToSave = { ...currentEducation };
  const index = eduToSave._index;
  delete eduToSave._index;

  const newEducation = [...(profileData.education || [])];

  if (index !== undefined) {
    // Update existing
    newEducation[index] = eduToSave;
    toast({
      title: "Education Updated",
      description: `"${eduToSave.institution}" has been updated`,
      className: "bg-blue-50 border-blue-200 text-blue-800"
    });
  } else {
    // Add new
    newEducation.push(eduToSave);
    toast({
      title: "Education Added",
      description: `"${eduToSave.institution}" has been added`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
  }

  setProfileData({
    ...profileData,
    education: newEducation
  });
  setEducationDialogOpen(false);
  setCurrentEducation(null);
};

export const deleteEducation = (
  index: number,
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void,
  toast: ToastFunction
) => {
  const institution = profileData.education?.[index]?.institution || "";
  const newEducation = [...(profileData.education || [])];
  newEducation.splice(index, 1);
  setProfileData({
    ...profileData,
    education: newEducation
  });

  toast({
    title: "Education Deleted",
    description: `"${institution}" has been removed`,
    variant: "destructive"
  });
};

export const moveEducation = (
  index: number,
  direction: "up" | "down",
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void
) => {
  if (
    !profileData.education ||
    (direction === "up" && index === 0) ||
    (direction === "down" && index === profileData.education.length - 1)
  ) {
    return;
  }

  const newEducation = [...profileData.education];
  const newIndex = direction === "up" ? index - 1 : index + 1;

  [newEducation[index], newEducation[newIndex]] = [
    newEducation[newIndex],
    newEducation[index]
  ];

  setProfileData({
    ...profileData,
    education: newEducation
  });
};

// Functions for managing certifications
export const addCertification = (
  setCurrentCertification: (certification: CertificationWithIndex | null) => void,
  setCertificationDialogOpen: (open: boolean) => void
) => {
  const newCertification: CertificationWithIndex = {
    name: "",
    issuer: "",
    date: ""
  };
  setCurrentCertification(newCertification);
  setCertificationDialogOpen(true);
};

export const editCertification = (
  cert: Certification,
  index: number,
  setCurrentCertification: (certification: CertificationWithIndex | null) => void,
  setCertificationDialogOpen: (open: boolean) => void
) => {
  setCurrentCertification({ ...cert, _index: index });
  setCertificationDialogOpen(true);
};

export const saveCertification = (
  currentCertification: CertificationWithIndex | null,
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void,
  setCertificationDialogOpen: (open: boolean) => void,
  setCurrentCertification: (certification: CertificationWithIndex | null) => void,
  toast: ToastFunction
) => {
  if (!currentCertification) return;

  const certToSave = { ...currentCertification };
  const index = certToSave._index;
  delete certToSave._index;

  const newCertifications = [...(profileData.certifications || [])];

  if (index !== undefined) {
    // Update existing
    newCertifications[index] = certToSave;
    toast({
      title: "Certification Updated",
      description: `"${certToSave.name}" has been updated`,
      className: "bg-blue-50 border-blue-200 text-blue-800"
    });
  } else {
    // Add new
    newCertifications.push(certToSave);
    toast({
      title: "Certification Added",
      description: `"${certToSave.name}" has been added`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
  }

  setProfileData({
    ...profileData,
    certifications: newCertifications
  });
  setCertificationDialogOpen(false);
  setCurrentCertification(null);
};

export const deleteCertification = (
  index: number,
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void,
  toast: ToastFunction
) => {
  const name = profileData.certifications?.[index]?.name || "";
  const newCertifications = [...(profileData.certifications || [])];
  newCertifications.splice(index, 1);
  setProfileData({
    ...profileData,
    certifications: newCertifications
  });

  toast({
    title: "Certification Deleted",
    description: `"${name}" has been removed`,
    variant: "destructive"
  });
};

export const moveCertification = (
  index: number,
  direction: "up" | "down",
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void
) => {
  if (
    !profileData.certifications ||
    (direction === "up" && index === 0) ||
    (direction === "down" && index === profileData.certifications.length - 1)
  ) {
    return;
  }

  const newCertifications = [...profileData.certifications];
  const newIndex = direction === "up" ? index - 1 : index + 1;

  [newCertifications[index], newCertifications[newIndex]] = [
    newCertifications[newIndex],
    newCertifications[index]
  ];

  setProfileData({
    ...profileData,
    certifications: newCertifications
  });
};

// Functions for managing social links
export const addSocialLink = (
  setCurrentSocialLink: (socialLink: SocialLinkWithIndex | null) => void,
  setSocialLinkDialogOpen: (open: boolean) => void,
  profileData: UserProfile
) => {
  const newSocialLink: SocialLinkWithIndex = {
    platform: "Custom",
    url: "",
    label: "",
    visible: true,
    visibleInHero: false,
    position: (profileData.socialLinks || []).length // Set position as next available
  };
  setCurrentSocialLink(newSocialLink);
  setSocialLinkDialogOpen(true);
};

export const editSocialLink = (
  link: SocialLink,
  index: number,
  setCurrentSocialLink: (socialLink: SocialLinkWithIndex | null) => void,
  setSocialLinkDialogOpen: (open: boolean) => void
) => {
  setCurrentSocialLink({ ...link, _index: index });
  setSocialLinkDialogOpen(true);
};

export const saveSocialLink = async (
  currentSocialLink: SocialLinkWithIndex | null,
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void,
  setSocialLinkDialogOpen: (open: boolean) => void,
  setCurrentSocialLink: (socialLink: SocialLinkWithIndex | null) => void,
  setSaving: (value: boolean) => void,
  toast: ToastFunction
) => {
  if (!currentSocialLink) return;

  // Validate required fields
  const requiredFields = [
    { field: 'url', name: 'URL' }
  ];

  if (currentSocialLink.platform === 'Custom') {
    requiredFields.push({ field: 'label', name: 'Label' });
  }

  const missingFields = requiredFields.filter(
    ({ field }) => !currentSocialLink[field as keyof SocialLink]?.toString().trim()
  );

  if (missingFields.length > 0) {
    toast({
      title: "Validation Error",
      description: `Please fill in the following required fields: ${missingFields.map(f => f.name).join(', ')}`,
      variant: "destructive"
    });
    return;
  }

  const linkToSave = { ...currentSocialLink };
  const index = linkToSave._index;
  delete linkToSave._index;

  // Clean up empty optional fields
  if (!linkToSave.label?.trim()) {
    linkToSave.label = undefined;
  }

  const newSocialLinks = [...(profileData.socialLinks || [])];

  try {
    setSaving(true);
    
    if (index !== undefined) {
      // Update existing
      newSocialLinks[index] = linkToSave;
    } else {
      // Add new
      newSocialLinks.push(linkToSave);
    }

    // Update local state first
    setProfileData({
      ...profileData,
      socialLinks: newSocialLinks
    });
    
    // Automatically persist to file system
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ file: "user-profile.ts", data: { ...profileData, socialLinks: newSocialLinks } })
    });

    if (!res.ok) {
      const errorData = await res.json() as AdminApiResponse;
      throw new Error(errorData.error || "Failed to save data");
    }
    
    // Show success message
    if (index !== undefined) {
      toast({
        title: "Social Link Updated & Saved",
        description: `"${linkToSave.platform}" link has been updated and saved to file`,
        className: "bg-blue-50 border-blue-200 text-blue-800"
      });
    } else {
      toast({
        title: "Social Link Added & Saved",
        description: `"${linkToSave.platform}" link has been added and saved to file`,
        className: "bg-green-50 border-green-200 text-green-800"
      });
    }
    
    // Close dialog and reset state on success
    setSocialLinkDialogOpen(false);
    setCurrentSocialLink(null);
    
  } catch (error) {
    // Revert local state on error
    setProfileData(profileData);
    
    toast({
      title: "Save Failed",
      description: `Failed to save "${linkToSave.platform}" link to file. Please try again.`,
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};

export const deleteSocialLink = async (
  index: number,
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void,
  setSaving: (value: boolean) => void,
  toast: ToastFunction
) => {
  const platform = profileData.socialLinks?.[index]?.platform || "";
  const newSocialLinks = [...(profileData.socialLinks || [])];
  newSocialLinks.splice(index, 1);

  try {
    setSaving(true);
    
    // Update local state first
    setProfileData({
      ...profileData,
      socialLinks: newSocialLinks
    });
    
    // Automatically persist to file system
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ file: "user-profile.ts", data: { ...profileData, socialLinks: newSocialLinks } })
    });

    if (!res.ok) {
      const errorData = await res.json() as AdminApiResponse;
      throw new Error(errorData.error || "Failed to save data");
    }
    
    toast({
      title: "Social Link Deleted & Saved",
      description: `"${platform}" link has been removed and changes saved to file`,
      variant: "destructive"
    });
    
  } catch (error) {
    // Revert local state on error
    setProfileData(profileData);
    
    toast({
      title: "Delete Failed",
      description: "Failed to delete social link. Please try again.",
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};

export const moveSocialLink = async (
  index: number,
  direction: "up" | "down",
  profileData: UserProfile,
  setProfileData: (profileData: UserProfile) => void,
  setSaving: (value: boolean) => void,
  toast: ToastFunction
) => {
  const socialLinks = profileData.socialLinks || [];
  
  if (
    (direction === "up" && index === 0) ||
    (direction === "down" && index === socialLinks.length - 1)
  ) {
    return;
  }

  const newSocialLinks = [...socialLinks];
  const newIndex = direction === "up" ? index - 1 : index + 1;

  // Swap the links
  [newSocialLinks[index], newSocialLinks[newIndex]] = [
    newSocialLinks[newIndex],
    newSocialLinks[index]
  ];

  // Update position numbers
  newSocialLinks.forEach((link, i) => {
    link.position = i;
  });

  try {
    setSaving(true);
    
    // Update local state first
    setProfileData({
      ...profileData,
      socialLinks: newSocialLinks
    });
    
    // Automatically persist to file system
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ file: "user-profile.ts", data: { ...profileData, socialLinks: newSocialLinks } })
    });

    if (!res.ok) {
      const errorData = await res.json() as AdminApiResponse;
      throw new Error(errorData.error || "Failed to save data");
    }
    
    // Show success message
    toast({
      title: "Social Link Reordered & Saved",
      description: `"${newSocialLinks[newIndex].platform}" moved ${direction} and saved to file`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
    
  } catch (error) {
    // Revert local state on error
    setProfileData(profileData);
    
    toast({
      title: "Reorder Failed",
      description: "Failed to save the new order. Please try again.",
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};
