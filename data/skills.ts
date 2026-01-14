export interface SkillCategory {
  name: string;
  skills: string[];
}

export const topSkills: string[] = [
  "Hands-on Technical Leadership",
  "Coaching & Mentoring",
  "Code Review",
  "Software Quality",
  "Engineering Management",
  "Solution Architecture",
  "Web Architecture",
  "Microservices",
  "Team Collaboration",
  "Scrum",
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Leadership & Management",
    skills: [
      "Engineering Management",
      "Delivery Management",
      "Team Leadership",
      "Coaching & Mentoring",
      "Capacity Planning",
      "Project Management",
    ],
  },
  {
    name: "Technical Architecture",
    skills: [
      "Solution Architecture",
      "Web Architecture",
      "Microservices",
      "Service-Oriented Architecture",
      "Technical Design",
      "Code Review",
    ],
  },
  {
    name: "Methodologies",
    skills: [
      "Scrum",
      "Agile",
      "SAFe",
      "Software Quality",
      "Coding Standards",
      "Deployment Management",
    ],
  },
  {
    name: "Technologies",
    skills: [
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "PHP",
      "MySQL",
      "PostgreSQL",
      "AWS",
    ],
  },
];
