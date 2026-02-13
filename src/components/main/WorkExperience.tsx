import type { WorkEntry } from "@/data/types";
import { SectionHeading } from "@/components/SectionHeading";
import { BriefcaseIcon } from "@/components/icons/SectionIcons";
import { ExperienceEntry } from "./ExperienceEntry";

interface WorkExperienceProps {
  entries: WorkEntry[];
}

export function WorkExperience({ entries }: WorkExperienceProps) {
  return (
    <section aria-label="Work Experience">
      <SectionHeading title="Work Experience" icon={<BriefcaseIcon />} />
      {entries.map((entry) => (
        <ExperienceEntry key={entry.title + entry.period} entry={entry} />
      ))}
    </section>
  );
}
