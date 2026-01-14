export interface Experience {
  title: string;
  company: string;
  dateRange: string;
  location?: string;
  description: string;
  highlights: string[];
  tags: string[];
}

export const experiences: Experience[] = [
  {
    title: "Software Engineering Manager",
    company: "DSK Bank",
    dateRange: "October 2025 - Present",
    location: "Sofia, Bulgaria",
    description:
      "Leading fully remote, cross-functional engineering teams, delivering technical leadership and strategic guidance for enterprise systems.",
    highlights: [
      "Led and mentored cross-functional engineering teams of 7-9 members",
      "Delivered daily technical leadership and strategic guidance",
      "Active participation in architecture reviews and pull request reviews",
      "Partnered with Product Owners to define requirements and shape roadmaps",
      "Oversaw end-to-end development lifecycle for enterprise systems",
      "Drove team expansion through technical interviews and mentorship programs",
    ],
    tags: [
      "Engineering Management",
      "Scrum",
      "Agile",
      "SAFe",
      "Microservices",
      "Coaching",
      "Code Review",
    ],
  },
  {
    title: "Delivery Manager",
    company: "MentorMate",
    dateRange: "November 2020 - October 2025",
    location: "Sofia, Bulgaria",
    description:
      "Led successful execution of large-scale software projects, combining technical expertise with strong client relationships and team dynamics.",
    highlights: [
      "Led large-scale software project delivery",
      "Trusted by clients for cross-functional team leadership",
      "Mentored team members and fostered collaboration",
      "Drove project success through strategic thinking",
      "Delivered high-quality solutions meeting business needs",
    ],
    tags: [
      "Delivery Management",
      "Solution Architecture",
      "Scrum",
      "Microservices",
      "Project Management",
      "Client Relations",
    ],
  },
  {
    title: "Senior Software Developer",
    company: "MentorMate",
    dateRange: "February 2018 - November 2020",
    location: "Sofia, Bulgaria",
    description:
      "Key technical expert for architectural decisions and hands-on development across diverse projects and technologies.",
    highlights: [
      "Defined application architectures and coding standards",
      "Established code review practices",
      "Guided teams and clients toward optimal technical solutions",
      "Bridged gap between business goals and engineering execution",
    ],
    tags: [
      "React.js",
      "JavaScript",
      "PHP",
      "AWS",
      "Solution Architecture",
      "Code Review",
      "NextJS",
    ],
  },
  {
    title: "Software Developer",
    company: "MentorMate",
    dateRange: "June 2016 - February 2018",
    location: "Sofia, Bulgaria",
    description:
      "Full ownership of features from concept to deployment, following best practices in coding, testing, and documentation.",
    highlights: [
      "Took full ownership of features from concept to deployment",
      "Followed industry best practices in coding and testing",
      "Collaborated with cross-functional teams",
      "Introduced process enhancements and automation",
    ],
    tags: ["PHP", "MySQL", "PostgreSQL", "React", "Angular", "Agile"],
  },
  {
    title: "Web Developer",
    company: "IT-Cover",
    dateRange: "December 2015 - June 2016",
    location: "Sofia, Bulgaria",
    description:
      "Contributed to CRM systems, internal back-office tools, and customer-facing B2C websites in a fast-paced environment.",
    highlights: [
      "Full stack development across multiple projects",
      "Built CRM systems and internal tools",
      "Delivered features under tight deadlines",
    ],
    tags: ["PHP", "MySQL", "PostgreSQL", "Zend Framework", "jQuery"],
  },
  {
    title: "Web Developer",
    company: "Career Town",
    dateRange: "June 2015 - December 2015",
    location: "Sofia, Bulgaria",
    description:
      "Core development team member for an innovative HR job portal startup, building scalable and user-friendly features.",
    highlights: [
      "Built scalable HR job portal features",
      "Full-stack development in agile environment",
      "Collaborated with product owners and designers",
    ],
    tags: ["PHP", "Laravel", "MySQL", "Angular", "JavaScript"],
  },
  {
    title: "Web Developer",
    company: "BSBM",
    dateRange: "July 2014 - June 2015",
    location: "Sofia, Bulgaria",
    description:
      "Backend and frontend development using PHP, MySQL, PostgreSQL for Signature Digital Agency clients.",
    highlights: [
      "Developed web applications for agency clients",
      "Backend and frontend development",
      "Project evolved into CareerTown",
    ],
    tags: ["PHP", "MySQL", "PostgreSQL", "nginx", "Apache", "extJS"],
  },
  {
    title: "Web Developer",
    company: "Interactive Share Ltd",
    dateRange: "July 2013 - February 2014",
    location: "Sofia, Bulgaria",
    description:
      "Web development projects and digital marketing campaign support, delivering high-quality maintainable code.",
    highlights: [
      "Delivered high-quality web solutions",
      "Supported digital marketing campaigns",
      "Worked with cross-functional teams",
    ],
    tags: ["PHP", "MySQL", "Marketing", "Web Development"],
  },
  {
    title: "Freelancer",
    company: "Self-Employed",
    dateRange: "2006 - 2015",
    location: "Sofia, Bulgaria",
    description:
      "Hands-on experience in full-stack development, working with different clients and delivering value through clean, maintainable code.",
    highlights: [
      "Full-stack development experience",
      "Diverse client projects",
      "Problem-solving and delivering value",
    ],
    tags: ["Full Stack", "PHP", "MySQL", "Problem Solving", "Client Relations"],
  },
];
