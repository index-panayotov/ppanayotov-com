/**
 * Profile Data Management Handlers (Languages, Education, Certifications)
 */

import {
  UserProfile,
  LanguageProficiency,
  LanguageEntry,
  EducationEntry,
  Certification
} from "@/lib/schemas";
import {
  ToastFunction,
  LanguageEntryWithIndex,
  EducationEntryWithIndex,
  CertificationWithIndex
} from "./types";

// === PROFILE FIELD HANDLER ===

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

// === LANGUAGE HANDLERS ===

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

// === EDUCATION HANDLERS ===

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

// === CERTIFICATION HANDLERS ===

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
