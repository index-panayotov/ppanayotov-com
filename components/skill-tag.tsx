interface SkillTagProps {
  name: string;
}

export function SkillTag({ name }: SkillTagProps) {
  return (
    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm print:hidden">
      {name}
    </span>
  );
}
