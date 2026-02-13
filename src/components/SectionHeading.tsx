import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  icon?: ReactNode;
}

export function SectionHeading({ title, icon }: SectionHeadingProps) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide text-foreground">
        {icon}
        {title}
      </h2>
      <hr className="mt-1.5 border-t-2 border-foreground" />
    </div>
  );
}
