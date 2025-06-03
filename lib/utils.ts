import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts plain text from a WYSIWYG (e.g., EditorJS) data object or returns the input if already plain text.
 * Supports EditorJS-style arrays of blocks, or just returns the string if not an object.
 * @param input WYSIWYG data (object/array) or plain text
 * @returns string
 */
export function extractPlainText(input: any): string {
  if (typeof input === "string") return input;
  // EditorJS: { blocks: [...] } or just an array of blocks
  const blocks: any[] = Array.isArray(input)
    ? input
    : input && Array.isArray(input.blocks)
    ? input.blocks
    : [];
  return blocks
    .filter(
      (block: any) =>
        block.type === "paragraph" && block.data && block.data.text
    )
    .map((block: any) => block.data.text)
    .join("\n"); // Keep HTML tags if present
}
