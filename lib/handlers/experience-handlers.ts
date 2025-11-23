/**
 * Experience and Skills Management Handlers
 */

import { ExperienceEntry } from "@/types";
import { apiClient } from "@/lib/api-client";
import { ToastFunction, ExperienceEntryWithIndex } from "./types";

// === EXPERIENCE HANDLERS ===

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
    tags: [],
    isCurrentRole: false,
    achievements: [],
    technologies: []
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

  // Validate required fields FIRST before any updates
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

  // Clean up empty optional fields
  if (!expToSave.location?.trim()) {
    delete expToSave.location;
  }

  // Build new array for optimistic update
  const isNew = index === undefined;
  let newExperiences: ExperienceEntry[];

  if (isNew) {
    newExperiences = [...experiences, expToSave];
  } else {
    newExperiences = [...experiences];
    newExperiences[index] = expToSave;
  }

  try {
    setSaving(true);

    // Optimistic update: Update UI immediately AFTER validation
    setExperiences(newExperiences);

    // Automatically persist to file system
    await apiClient.post("/api/admin", {
      file: "cv-data.ts",
      data: newExperiences
    });

    // Show success message
    if (!isNew) {
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
    await apiClient.post("/api/admin", {
      file: "cv-data.ts",
      data: newExperiences
    });

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

// === TAG HANDLERS ===

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

// === TOP SKILLS HANDLERS ===

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
