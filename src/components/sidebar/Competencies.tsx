import type { SkillGroup } from "@/data/types";
import { SectionHeading } from "@/components/SectionHeading";
import { StarIcon } from "@/components/icons/SectionIcons";

interface CompetenciesProps {
  groups: SkillGroup[];
}

export function Competencies({ groups }: CompetenciesProps) {
  return (
    <section className="px-6 pb-6" aria-label="Competencies">
      <SectionHeading title="Competencies" icon={<StarIcon />} />
      {groups.map((group) => (
        <div key={group.label} className="mb-4 last:mb-0">
          <h3 className="mb-1.5 text-sm font-bold text-foreground">
            {group.label}
          </h3>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item} className="text-xs leading-relaxed text-body-text">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
