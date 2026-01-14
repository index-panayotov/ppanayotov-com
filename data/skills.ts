export interface SkillCategory {
  name: string;
  skills: string[];
}

export const topSkills: string[] = [
  "Software Management",
  "Leading Development Teams",
  "Engineering Management",
  "Hands-on Technical Leadership",
  "Solution Architecture",
  "Software Quality",
  "Project Delivery",
  "Team Collaboration",
  "Code Review",
  "Deployment Management",
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Leadership & Management",
    skills: [
      "Software Management",
      "Engineering Management",
      "Leading Development Teams",
      "Delivery Management",
      "Team Leadership",
      "People Development",
      "Resource Allocation",
      "Project Planning",
    ],
  },
  {
    name: "Technical Architecture",
    skills: [
      "Solution Architecture",
      "Application Architecture",
      "Web Architecture",
      "Microservices",
      "Technical Design",
      "Code Review",
      "Software Quality",
    ],
  },
  {
    name: "Project & Delivery",
    skills: [
      "Project Delivery",
      "Client Satisfaction",
      "Stakeholder Management",
      "Team Collaboration",
      "Interpersonal Skills",
      "Problem Solving",
    ],
  },
  {
    name: "Technologies",
    skills: [
      "PHP",
      "MySQL",
      "PostgreSQL",
      "JavaScript",
      "CSS",
      "React",
      "nginx",
      "Apache",
      "Mobile Development",
    ],
  },
];
