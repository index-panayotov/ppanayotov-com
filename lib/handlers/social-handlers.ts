/**
 * Social Links Management Handlers
 */

import { UserProfile, SocialLink } from "@/lib/schemas";
import { apiClient } from "@/lib/api-client";
import { ToastFunction, SocialLinkWithIndex } from "./types";

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
    await apiClient.post("/api/admin", {
      file: "user-profile.ts",
      data: { ...profileData, socialLinks: newSocialLinks }
    });

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
    await apiClient.post("/api/admin", {
      file: "user-profile.ts",
      data: { ...profileData, socialLinks: newSocialLinks }
    });

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
    await apiClient.post("/api/admin", {
      file: "user-profile.ts",
      data: { ...profileData, socialLinks: newSocialLinks }
    });

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
