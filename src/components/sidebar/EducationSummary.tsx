import type { Education } from "@/data/types";
import { SectionHeading } from "@/components/SectionHeading";
import { AcademicCapIcon } from "@/components/icons/SectionIcons";

interface EducationSummaryProps {
  education: Education[];
}

export function EducationSummary({ education }: EducationSummaryProps) {
  return (
    <section className="px-6 pb-6" aria-label="Education">
      <SectionHeading title="Education Summary" icon={<AcademicCapIcon />} />
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.degree}>
            <h3 className="text-sm font-bold text-foreground">{edu.degree}</h3>
            <p className="text-xs italic text-body-text">{edu.institution}</p>
            <p className="text-xs text-muted-text">{edu.period}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
