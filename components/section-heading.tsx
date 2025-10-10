import { memo } from 'react';

interface SectionHeadingProps {
  id?: string
  title: string
  subtitle?: string
}

/**
 * Renders a section heading with a decorative gradient underline and an optional subtitle.
 *
 * The component outputs a top-level container with print-aware spacing, an H2 title that includes
 * a short rounded gradient underline positioned beneath the title text, and an optional subtitle
 * paragraph that is hidden when printing.
 *
 * @param id - Optional id used as the H2 anchor (omitted from the element if not provided).
 * @param title - The main heading text to display.
 * @param subtitle - Optional supporting line rendered below the title; hidden in print output.
 * @returns A React element representing the styled section heading block.
 */
export const SectionHeading = memo(function SectionHeading({ id, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-6 print:mb-3">
      <h2 id={id} className="text-2xl font-bold mb-2 print:text-lg text-slate-800 relative">
        <span className="relative z-10">{title}</span>
        <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </h2>
      {subtitle && (
        <p className="text-slate-600 text-sm print:hidden">{subtitle}</p>
      )}
    </div>
  )
});
