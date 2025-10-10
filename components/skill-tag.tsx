import { memo } from 'react';

interface SkillTagProps {
  name: string;
  variant?: 'default' | 'featured';
}

/**
 * Render a skill label that uses styled markup for screen and plain text for print.
 *
 * The component displays a visually styled tag on web (hidden in print) and a simple inline
 * text node when printing. When `variant` is `'featured'`, the web tag receives additional
 * emphasis styling (ring/highlight).
 *
 * @param name - Text shown for the skill.
 * @param variant - Visual variant for the web tag; `'default'` for normal styling or
 * `'featured'` to apply emphasis styling. Defaults to `'default'`.
 * @returns A JSX fragment containing the web and print versions of the skill label.
 */
export const SkillTag = memo(function SkillTag({ name, variant = 'default' }: SkillTagProps) {
  const webClasses = "print:hidden transition-all duration-200";
  const variantClasses = variant === 'featured' 
    ? "cv-skill-tag ring-2 ring-blue-200/50" 
    : "cv-skill-tag";
    
  return (
    <>
      {/* Web version */}
      <span className={`${webClasses} ${variantClasses}`}>
        {name}
      </span>
      {/* Print version - simple text */}
      <span className="hidden print:inline">
        {name}
      </span>
    </>
  );
});
