interface SkillTagProps {
  name: string;
  variant?: 'default' | 'featured';
}

export function SkillTag({ name, variant = 'default' }: SkillTagProps) {
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
}
