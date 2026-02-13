import type { WorkEntry } from "@/data/types";

interface ExperienceEntryProps {
  entry: WorkEntry;
}

export function ExperienceEntry({ entry }: ExperienceEntryProps) {
  return (
    <article className="mb-6 last:mb-0">
      <div className="mb-1.5">
        <h3 className="text-sm font-bold text-foreground">
          {entry.title}
          {entry.company && (
            <>
              ,{" "}
              <span className="font-bold">
                {entry.company}
                {entry.companyNote && (
                  <span className="font-normal text-muted-text">
                    {" "}
                    ({entry.companyNote})
                  </span>
                )}
              </span>
            </>
          )}
        </h3>
        <p className="text-xs text-muted-text">
          {entry.period}
          {entry.location && <> | {entry.location}</>}
        </p>
      </div>

      {entry.description && (
        <p className="mb-2 text-xs italic leading-relaxed text-body-text">
          {entry.description}
        </p>
      )}

      {entry.bullets && entry.bullets.length > 0 && (
        <ul className="ml-3 space-y-1">
          {entry.bullets.map((bullet, i) => (
            <li
              key={i}
              className="relative pl-3 text-xs leading-relaxed text-body-text before:absolute before:left-0 before:content-['-']"
            >
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {entry.subRoles && entry.subRoles.length > 0 && (
        <div className="mt-3 space-y-4">
          {entry.subRoles.map((sub) => (
            <div key={sub.client}>
              <h4 className="text-xs font-bold text-foreground">
                {sub.client}
                {sub.roleTitle && (
                  <span className="font-normal text-body-text">
                    {" "}
                    - {sub.roleTitle}
                  </span>
                )}
                {sub.duration && (
                  <span className="font-normal text-muted-text">
                    {" "}
                    | {sub.duration}
                  </span>
                )}
              </h4>
              {sub.bullets.length > 0 && (
                <ul className="ml-3 mt-1 space-y-1">
                  {sub.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="relative pl-3 text-xs leading-relaxed text-body-text before:absolute before:left-0 before:content-['-']"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
