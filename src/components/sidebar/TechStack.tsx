import type { TechCategory } from "@/data/types";
import { SectionHeading } from "@/components/SectionHeading";
import { CodeIcon } from "@/components/icons/SectionIcons";

interface TechStackProps {
  categories: TechCategory[];
}

export function TechStack({ categories }: TechStackProps) {
  return (
    <section className="px-6 pb-6" aria-label="Technology Stack">
      <SectionHeading title="Technology Stack" icon={<CodeIcon />} />
      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.category}
            className="rounded-lg border border-badge-border bg-badge-bg px-3 py-2"
          >
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              <span className="text-xs font-bold text-foreground">
                {cat.category} &mdash;
              </span>
              {cat.items.map((item, i) => (
                <span key={item} className="text-xs text-body-text">
                  {item}
                  {i < cat.items.length - 1 && (
                    <span className="ml-1.5 text-muted-text">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
