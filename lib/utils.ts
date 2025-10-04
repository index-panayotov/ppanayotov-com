import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { EditorJSData, EditorJSBlock } from "@/lib/schemas";

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
 * Extracts plain text content from a WYSIWYG data structure or returns the input if it is already a string.
 *
 * If the input is an EditorJS-style object or array of blocks, only the text from "paragraph" blocks is included. HTML tags within the text are preserved.
 *
 * @param input - A string, EditorJS data structure, or array of EditorJS blocks.
 * @returns The extracted plain text, or the original string if input is already plain text.
 */
export function extractPlainText(input: string | EditorJSData | EditorJSBlock[] | unknown): string {
  // If input is already a string, return it
  if (typeof input === "string") {
    return input;
  }

  // Handle null, undefined, or other invalid inputs
  if (!input || typeof input !== "object") {
    return "";
  }

  // Determine if we have blocks array directly or nested in an EditorJS data structure
  let blocks: EditorJSBlock[] = [];

  if (Array.isArray(input)) {
    // Input is an array of blocks
    blocks = input.filter((item): item is EditorJSBlock =>
      typeof item === "object" &&
      item !== null &&
      "type" in item &&
      "data" in item
    );
  } else if (typeof input === "object" && "blocks" in input && Array.isArray(input.blocks)) {
    // Input is an EditorJS data structure with blocks property
    blocks = input.blocks.filter((item): item is EditorJSBlock =>
      typeof item === "object" &&
      item !== null &&
      "type" in item &&
      "data" in item
    );
  }

  // Extract text from paragraph blocks
  return blocks
    .filter((block): block is EditorJSBlock =>
      block.type === "paragraph" &&
      block.data &&
      typeof block.data.text === "string"
    )
    .map((block) => block.data.text || "")
    .join("\n")
    .trim();
}

/**
 * Type-safe helper to check if a value is a valid EditorJS data structure
 */
export function isEditorJSData(value: unknown): value is EditorJSData {
  return (
    typeof value === "object" &&
    value !== null &&
    "blocks" in value &&
    Array.isArray((value as EditorJSData).blocks)
  );
}

/**
 * Type-safe helper to check if a value is an array of EditorJS blocks
 */
export function isEditorJSBlocks(value: unknown): value is EditorJSBlock[] {
  return (
    Array.isArray(value) &&
    value.every(item =>
      typeof item === "object" &&
      item !== null &&
      "type" in item &&
      "data" in item
    )
  );
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

  if (isEditorJSData(input) || isEditorJSBlocks(input)) {
    return extractPlainText(input);
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
