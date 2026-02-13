import type { ContactInfo as ContactInfoType } from "@/data/types";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeIcon,
  LinkedInIcon,
} from "@/components/icons/ContactIcons";

interface ContactInfoProps {
  contact: ContactInfoType;
}

export function ContactInfo({ contact }: ContactInfoProps) {
  return (
    <address className="not-italic space-y-2.5 px-6 pb-6 text-sm text-body-text">
      <div className="flex items-center gap-3">
        <MailIcon />
        <a href={`mailto:${contact.email}`} className="hover:underline">
          {contact.email}
        </a>
      </div>
      <div className="flex items-center gap-3">
        <PhoneIcon />
        <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:underline">
          {contact.phone}
        </a>
      </div>
      <div className="flex items-center gap-3">
        <MapPinIcon />
        <span>{contact.location}</span>
      </div>
      <div className="flex items-center gap-3">
        <GlobeIcon />
        <a
          href={contact.website}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {contact.website.replace(/^https?:\/\/www\./, "").replace(/\/$/, "")}
        </a>
      </div>
      <div className="flex items-center gap-3">
        <LinkedInIcon />
        <a
          href={contact.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {contact.linkedIn.replace(/^https?:\/\/www\./, "").replace(/\/$/, "")}
        </a>
      </div>
    </address>
  );
}
