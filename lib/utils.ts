import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class name values into a single string, merging Tailwind CSS classes and resolving conflicts.
 *
 * @param inputs - Class name values to be combined.
 * @returns A merged class name string with Tailwind CSS conflicts resolved.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts and concatenates paragraph text from a WYSIWYG editor data structure or returns the input if it is already a string.
 *
 * If the input is an EditorJS-style object or array, only the text from blocks of type "paragraph" with a `data.text` property is included. The resulting text preserves any HTML tags present in the original block data.
 *
 * @param input - A plain string or a WYSIWYG editor data structure (such as EditorJS output).
 * @returns The extracted plain text, or the input string if already plain text.
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
