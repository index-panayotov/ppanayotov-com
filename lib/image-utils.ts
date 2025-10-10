/**
 * Utility functions for handling profile images
 */

/**
 * Get the appropriate image URL based on context (web or PDF)
 * Priority order for uploaded images:
 * 1. Context-specific optimized image (profileImageWebUrl/profileImagePdfUrl)
 * 2. Main profile image URL (profileImageUrl) as fallback
 *
 * @param profile User profile object
 * @param context Context for which the image is needed ('web' | 'pdf')
 * @returns The best available image URL for the context
 */
export function getProfileImageUrl(
  profile: {
    profileImageUrl: string;
    profileImageWebUrl?: string;
    profileImagePdfUrl?: string;
  },
  context: "web" | "pdf" = "web"
): string {
  // Priority 1: Use context-specific optimized image if available
  if (context === "web" && profile.profileImageWebUrl) {
    return profile.profileImageWebUrl;
  }

  if (context === "pdf" && profile.profileImagePdfUrl) {
    return profile.profileImagePdfUrl;
  }

  // Priority 2: Fallback to main profile image URL
  return profile.profileImageUrl || "";
}

/**
 * Check if an image URL is external (hosted externally)
 * @param url Image URL to check
 * @returns True if the URL is external, false if local
 */
export function isExternalImageUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Get a relative path for local images, or full URL for external images
 * @param url Image URL
 * @returns Properly formatted URL for storage
 */
export function formatImageUrlForStorage(url: string): string {
  if (isExternalImageUrl(url)) {
    return url; // Keep external URLs as-is
  }

  // For local URLs, ensure they start with /
  if (url && !url.startsWith("/")) {
    return `/${url}`;
  }

  return url;
}

/**
 * Validate image file type and size
 * @param file File to validate
 * @returns Validation result
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  // Check for supported formats
  const supportedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif"
  ];
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: "Supported formats: JPG, PNG, WebP, GIF" };
  }

  return { valid: true };
}
