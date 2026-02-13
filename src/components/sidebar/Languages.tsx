import type { LanguageEntry } from "@/data/types";
import { SectionHeading } from "@/components/SectionHeading";
import { LanguagesIcon } from "@/components/icons/SectionIcons";

interface LanguagesProps {
  languages: LanguageEntry[];
}

export function Languages({ languages }: LanguagesProps) {
  return (
    <section className="px-6 pb-6" aria-label="Languages">
      <SectionHeading title="Languages" icon={<LanguagesIcon />} />
      <div className="space-y-2">
        {languages.map((lang) => (
          <div key={lang.language}>
            <p className="text-sm font-bold text-foreground">{lang.language}</p>
            <p className="text-xs text-muted-text">{lang.level}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
