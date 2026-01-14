export interface Experience {
  title: string;
  company: string;
  dateRange: string;
  duration?: string;
  location?: string;
  type?: string;
  description: string;
  tags: string[];
}

export const experiences: Experience[] = [
  {
    title: "Software Engineering Manager",
    company: "DSK Bank",
    dateRange: "Oct 2025 - Present",
    duration: "4 mos",
    location: "Sofia, Bulgaria",
    type: "Full-time · On-site",
    description:
      "Led high-performing software engineering team at DSK Bank, ensuring alignment with business objectives and regulatory standards. Managed project execution, resource allocation, and planning for future initiatives to drive timely delivery. Oversaw technical aspects of software design, including mobile application preparation and production deployment.",
    tags: [
      "Software Management",
      "Engineering Management",
      "Leading Development Teams",
      "Mobile Development",
    ],
  },
  {
    title: "Delivery Manager",
    company: "MentorMate",
    dateRange: "Nov 2020 - Oct 2025",
    duration: "5 yrs",
    location: "Sofia, Bulgaria",
    type: "Full-time · Hybrid",
    description:
      "Apart from technical expertise, has very strong interpersonal skills and willing to see every project succeed. Usually involved in projects with bigger scope. Trusted by clients to organize, enable and lead project teams and to ensure the successful delivery of working software. Can step into roles involved in people management and development. Primary focus is on project outcome and client satisfaction with excellent interpersonal skills and strong technical knowledge.",
    tags: [
      "Solution Architecture",
      "Software Quality",
      "Project Delivery",
      "Team Leadership",
      "Client Management",
    ],
  },
  {
    title: "Senior Software Developer",
    company: "MentorMate",
    dateRange: "Feb 2018 - Nov 2020",
    duration: "2 yrs 10 mos",
    location: "Sofia, Bulgaria",
    description:
      "Subject matter expert in software development with significant knowledge and hands-on experience in application architecture. Ready to work on many fronts by exhibiting technical competence to support different projects. Important role in the software development life cycle - setting application architecture, code reviewing process to ensure quality. Focus on guiding clients and teams to the right software solution with high degree of technical experience, expertise, and solid soft skills.",
    tags: [
      "Solution Architecture",
      "Software Quality",
      "Code Review",
      "Application Architecture",
      "Technical Leadership",
    ],
  },
  {
    title: "Software Developer",
    company: "MentorMate",
    dateRange: "Jun 2016 - Feb 2018",
    duration: "1 yr 9 mos",
    location: "Sofia, Bulgaria",
    description:
      "Worked on moderately complex tasks in technical area. Worked quite independently and able to apply knowledge and skills to evaluate different options to resolve problems. Rather than writing code, started to build software. Primary focus on executing project tasks by understanding the entire development process, following best practices and improving quality of work.",
    tags: [
      "Solution Architecture",
      "CSS",
      "Software Development",
      "Best Practices",
    ],
  },
  {
    title: "Web Developer",
    company: "IT-Cover",
    dateRange: "Dec 2015 - Jun 2016",
    duration: "7 mos",
    location: "Sofia, Bulgaria",
    description:
      "IT-Cover is a web development company based in Sofia, Bulgaria. Built strong CRM systems, BackOffice tools, and B2C websites.",
    tags: [
      "Software Quality",
      "Team Collaboration",
      "CRM Development",
      "Web Development",
    ],
  },
  {
    title: "Web Developer",
    company: "Career Town",
    dateRange: "Jun 2015 - Dec 2015",
    duration: "7 mos",
    location: "Sofia, Bulgaria",
    description:
      "CareerTown is a start-up project, a job portal with extensive HR functionalities. Contributed to building a feature-rich recruitment platform.",
    tags: [
      "Software Quality",
      "Team Collaboration",
      "HR Tech",
      "Startup",
    ],
  },
  {
    title: "Web Developer",
    company: "BSBM",
    dateRange: "Jul 2014 - Jun 2015",
    duration: "1 yr",
    location: "Sofia, Bulgaria",
    description:
      "Supporting clients for Signature digital agency. Developing new web-based applications and maintaining existing applications. Used technologies: PHP, MySQL, PostgreSQL, nginx, Apache, extJS. BSBM later became CareerTown.",
    tags: [
      "PHP",
      "MySQL",
      "PostgreSQL",
      "nginx",
      "Apache",
      "extJS",
    ],
  },
];
