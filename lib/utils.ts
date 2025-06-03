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
 * Extracts plain text content from a WYSIWYG data structure or returns the input if it is already a string.
 *
 * If the input is an EditorJS-style object or array of blocks, only the text from "paragraph" blocks is included. HTML tags within the text are preserved.
 *
 * @param input - A string or a WYSIWYG data structure (such as EditorJS output).
 * @returns The extracted plain text, or the original string if input is already plain text.
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
