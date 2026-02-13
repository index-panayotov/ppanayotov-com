import { SectionHeading } from "@/components/SectionHeading";
import { UserIcon } from "@/components/icons/SectionIcons";

interface PersonalProfileProps {
  text: string;
}

export function PersonalProfile({ text }: PersonalProfileProps) {
  return (
    <section aria-label="Personal Profile">
      <SectionHeading title="Personal Profile" icon={<UserIcon />} />
      <p className="text-sm leading-relaxed text-body-text">{text}</p>
    </section>
  );
}
