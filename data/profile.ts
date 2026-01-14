export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  dateRange: string;
}

export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  languages: { name: string; proficiency: string }[];
  education: Education[];
  certifications: string[];
}

export const profile: Profile = {
  name: "Preslav Panayotov",
  title: "Software Delivery Manager",
  email: "preslav.panayotov@gmail.com",
  phone: "+359 883 41 44 99",
  location: "Sofia, Bulgaria",
  summary:
    "Software Delivery Manager with over 10 years of experience in the IT industry, including 5 years in leading delivery and engineering teams. Proven expertise in software development, project execution, and process optimization, ensuring on-time delivery, high-quality outcomes, and continuous team performance improvement.",
  linkedin: "https://www.linkedin.com/in/preslav-panayotov",
  languages: [
    { name: "Bulgarian", proficiency: "Native" },
    { name: "English", proficiency: "Professional" },
  ],
  education: [
    {
      institution: "Sofia University St. Kliment Ohridski",
      degree: "Bachelor's degree",
      field: "Mathematics and Computer Science",
      dateRange: "2010 - 2013",
    },
  ],
  certifications: [
    "Business English",
    "Security Awareness Essentials",
    "Shaping up with Angular.js",
  ],
};
