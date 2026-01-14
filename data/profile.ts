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
  title: "Software Engineering Manager | Hands-on Technical Leadership",
  email: "preslav.panayotov@gmail.com",
  phone: "+359 883 41 44 99",
  location: "Sofia, Bulgaria",
  summary:
    "With over seven years of experience in software development and delivery management, I specialize in deployment management, team collaboration, and hands-on technical leadership. I am committed to ensuring project success and client satisfaction by fostering a collaborative environment and leveraging my strong technical expertise and interpersonal skills. My approach aligns with delivering high-quality software solutions and empowering teams to achieve their best.",
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
    "Security Awareness Essentials - Inspired eLearning",
    "Business English - MentorMate Bulgaria",
    "Shaping up with Angular.js",
  ],
};
