import { ExperienceEntry } from "@/types";
import { LanguageProficiency } from "@/types/profile";

// Function to handle saving data to API
export const handleSave = async (
  file: string,
  data: any,
  setSaving: (value: boolean) => void,
  toast: any
) => {
  try {
    setSaving(true);
    // Convert language proficiency string values to enum if needed
    if (data.languages && Array.isArray(data.languages)) {
      data.languages = data.languages.map((lang: any) => ({
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
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to save data");
    }

    toast({
      title: "Success",
      description: `${file} saved successfully`,
      variant: "default",
      className: "bg-green-50 border-green-200 text-green-800"
    });
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Failed to save data",
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
  setProfileData: (profileData: any) => void
) => {
  try {
    const parsed = JSON.parse(e.target.value);
    setProfileData(parsed);
  } catch (err) {
    // Don't update state if JSON is invalid
    console.error("Invalid JSON:", err);
  }
};

export const handleProfileFieldChange = (
  field: string,
  value: string,
  profileData: any,
  setProfileData: (profileData: any) => void
) => {
  setProfileData({
    ...profileData,
    [field]: value
  });
};

// Functions for experiences
export const addExperience = (
  setCurrentExperience: (experience: ExperienceEntry | null) => void,
  setDialogOpen: (open: boolean) => void
) => {
  const newExperience: ExperienceEntry = {
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
  setCurrentExperience: (experience: ExperienceEntry | null) => void,
  setDialogOpen: (open: boolean) => void
) => {
  setCurrentExperience({ ...exp, _index: index });
  setDialogOpen(true);
};

export const saveExperience = (
  currentExperience: ExperienceEntry | null,
  experiences: ExperienceEntry[],
  setExperiences: (experiences: ExperienceEntry[]) => void,
  setDialogOpen: (open: boolean) => void,
  setCurrentExperience: (experience: ExperienceEntry | null) => void,
  setNewSkill: (skill: string) => void,
  toast: any
) => {
  if (!currentExperience) return;

  const expToSave = { ...currentExperience };
  const index = expToSave._index;
  delete expToSave._index;

  const newExperiences = [...experiences];

  if (index !== undefined) {
    // Update existing
    newExperiences[index] = expToSave;
    toast({
      title: "Experience Updated",
      description: `"${expToSave.title}" has been updated`,
      className: "bg-blue-50 border-blue-200 text-blue-800"
    });
  } else {
    // Add new
    newExperiences.push(expToSave);
    toast({
      title: "Experience Added",
      description: `"${expToSave.title}" has been added`,
      className: "bg-green-50 border-green-200 text-green-800"
    });
  }

  setExperiences(newExperiences);
  setDialogOpen(false);
  setCurrentExperience(null);
  setNewSkill("");
};

export const deleteExperience = (
  index: number,
  experiences: ExperienceEntry[],
  setExperiences: (experiences: ExperienceEntry[]) => void,
  toast: any
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

export const moveExperience = (
  index: number,
  direction: "up" | "down",
  experiences: ExperienceEntry[],
  setExperiences: (experiences: ExperienceEntry[]) => void
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

  setExperiences(newExperiences);
};

// Functions for tags/skills
export const addTag = (
  currentExperience: ExperienceEntry | null,
  newSkill: string,
  setCurrentExperience: (experience: ExperienceEntry | null) => void,
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
  currentExperience: ExperienceEntry | null,
  setCurrentExperience: (experience: ExperienceEntry | null) => void
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
  toast: any
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
  toast: any
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
  toast: any
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
    const data = await res.json();

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
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Failed to generate top skills",
      variant: "destructive"
    });
  } finally {
    setSaving(false);
  }
};

// Functions for managing languages
export const addLanguage = (
  setCurrentLanguage: (
    language: {
      name: string;
      proficiency: LanguageProficiency;
      _index?: number;
    } | null
  ) => void,
  setLanguageDialogOpen: (open: boolean) => void
) => {
  const newLanguage = {
    name: "",
    proficiency: LanguageProficiency.Professional
  };
  setCurrentLanguage(newLanguage);
  setLanguageDialogOpen(true);
};

export const editLanguage = (
  lang: any,
  index: number,
  setCurrentLanguage: (
    language: {
      name: string;
      proficiency: LanguageProficiency;
      _index?: number;
    } | null
  ) => void,
  setLanguageDialogOpen: (open: boolean) => void
) => {
  setCurrentLanguage({ ...lang, _index: index });
  setLanguageDialogOpen(true);
};

export const saveLanguage = (
  currentLanguage: {
    name: string;
    proficiency: LanguageProficiency;
    _index?: number;
  } | null,
  profileData: any,
  setProfileData: (profileData: any) => void,
  setLanguageDialogOpen: (open: boolean) => void,
  setCurrentLanguage: (
    language: {
      name: string;
      proficiency: LanguageProficiency;
      _index?: number;
    } | null
  ) => void,
  toast: any
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
  profileData: any,
  setProfileData: (profileData: any) => void,
  toast: any
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
  profileData: any,
  setProfileData: (profileData: any) => void
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
  setCurrentEducation: (
    education: {
      institution: string;
      degree: string;
      field: string;
      dateRange: string;
      _index?: number;
    } | null
  ) => void,
  setEducationDialogOpen: (open: boolean) => void
) => {
  const newEducation = {
    institution: "",
    degree: "",
    field: "",
    dateRange: ""
  };
  setCurrentEducation(newEducation);
  setEducationDialogOpen(true);
};

export const editEducation = (
  edu: any,
  index: number,
  setCurrentEducation: (
    education: {
      institution: string;
      degree: string;
      field: string;
      dateRange: string;
      _index?: number;
    } | null
  ) => void,
  setEducationDialogOpen: (open: boolean) => void
) => {
  setCurrentEducation({ ...edu, _index: index });
  setEducationDialogOpen(true);
};

export const saveEducation = (
  currentEducation: {
    institution: string;
    degree: string;
    field: string;
    dateRange: string;
    _index?: number;
  } | null,
  profileData: any,
  setProfileData: (profileData: any) => void,
  setEducationDialogOpen: (open: boolean) => void,
  setCurrentEducation: (
    education: {
      institution: string;
      degree: string;
      field: string;
      dateRange: string;
      _index?: number;
    } | null
  ) => void,
  toast: any
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
  profileData: any,
  setProfileData: (profileData: any) => void,
  toast: any
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
  profileData: any,
  setProfileData: (profileData: any) => void
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
  setCurrentCertification: (
    certification: {
      name: string;
      issuer?: string;
      date?: string;
      _index?: number;
    } | null
  ) => void,
  setCertificationDialogOpen: (open: boolean) => void
) => {
  const newCertification = {
    name: "",
    issuer: "",
    date: ""
  };
  setCurrentCertification(newCertification);
  setCertificationDialogOpen(true);
};

export const editCertification = (
  cert: any,
  index: number,
  setCurrentCertification: (
    certification: {
      name: string;
      issuer?: string;
      date?: string;
      _index?: number;
    } | null
  ) => void,
  setCertificationDialogOpen: (open: boolean) => void
) => {
  setCurrentCertification({ ...cert, _index: index });
  setCertificationDialogOpen(true);
};

export const saveCertification = (
  currentCertification: {
    name: string;
    issuer?: string;
    date?: string;
    _index?: number;
  } | null,
  profileData: any,
  setProfileData: (profileData: any) => void,
  setCertificationDialogOpen: (open: boolean) => void,
  setCurrentCertification: (
    certification: {
      name: string;
      issuer?: string;
      date?: string;
      _index?: number;
    } | null
  ) => void,
  toast: any
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
  profileData: any,
  setProfileData: (profileData: any) => void,
  toast: any
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
  profileData: any,
  setProfileData: (profileData: any) => void
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
