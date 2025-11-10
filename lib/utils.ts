import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class name values into a single string, merging Tailwind CSS classes and resolving conflicts.
 *
 * Accepts any number of class name inputs, including strings, arrays, or objects, and returns a merged class string suitable for use in HTML class attributes.
 *
 * @returns The merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely convert various input types to a consistent string format
 */
export function normalizeToString(input: unknown): string {
  if (typeof input === "string") {
    return input.trim();
  }

  if (typeof input === "number") {
    return input.toString();
  }

  if (typeof input === "boolean") {
    return input.toString();
  }

  if (Array.isArray(input)) {
    return input.map(normalizeToString).join(", ");
  }

  if (input === null || input === undefined) {
    return "";
  }

  // For objects, try to stringify but fallback to empty string
  try {
    return JSON.stringify(input);
  } catch {
    return "";
  }
}

/**
 * Safely extract a string value from an object property
 */
export function safeGetString(
  obj: Record<string, unknown> | null | undefined,
  key: string,
  defaultValue = ""
): string {
  if (!obj || typeof obj !== "object") {
    return defaultValue;
  }

  const value = obj[key];

  if (typeof value === "string") {
    return value;
  }

  return defaultValue;
}

/**
 * Safely extract a number value from an object property
 */
export function safeGetNumber(
  obj: Record<string, unknown> | null | undefined,
  key: string,
  defaultValue = 0
): number {
  if (!obj || typeof obj !== "object") {
    return defaultValue;
  }

  const value = obj[key];

  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  return defaultValue;
}

/**
 * Safely extract a boolean value from an object property
 */
export function safeGetBoolean(
  obj: Record<string, unknown> | null | undefined,
  key: string,
  defaultValue = false
): boolean {
  if (!obj || typeof obj !== "object") {
    return defaultValue;
  }

  const value = obj[key];

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return defaultValue;
}

/**
 * Safely extract error message from various error types
 */

import { TemplateId } from "@/app/templates/types";

/**
 * Returns Tailwind CSS classes for the main container based on the selected template.
 * This helps in applying consistent theme-specific backgrounds and text colors.
 */
export function getThemeClasses(templateId: TemplateId): string {
  switch (templateId) {
    case "professional":
      return "min-h-screen bg-white text-slate-800 dark:bg-gray-900 dark:text-slate-200";
    case "modern":
      return "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white";
    case "classic":
    default:
      return "min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-slate-100/50 text-slate-800";
  }
}

/**
 * Returns Tailwind CSS classes for the blog header based on the selected template.
 */
export function getBlogHeaderClasses(templateId: TemplateId): string {
  switch (templateId) {
    case "professional":
      return "bg-white text-slate-800 dark:bg-gray-900 dark:text-slate-200";
    case "modern":
      return "bg-gradient-to-r from-blue-600 to-purple-700 text-white";
    case "classic":
    default:
      return "bg-gradient-to-r from-slate-700 to-slate-800 text-white";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return 'An unknown error occurred';
}
