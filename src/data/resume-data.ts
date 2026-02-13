import type { ResumeData } from "./types";

export const resumeData: ResumeData = {
  name: "Preslav Panayotov",
  title: "Software Engineering Manager",

  contact: {
    email: "preslav.panayotov@gmail.com",
    phone: "+359 883 41 44 99",
    location: "Bulgaria, Sofia",
    website: "https://www.ppanayotov.com/",
    linkedIn: "https://www.linkedin.com/in/preslavpanayotov/",
  },

  profile:
    "Software Engineering Manager with 12+ years of progressive experience from backend development to leading cross-functional teams of up to 96 engineers across diverse technology stacks. Track record of scaling teams (from 3 to 21, from 40 to 96), rescuing failing projects, reducing client escalations to near-zero, and cutting cloud costs by 30%. Leverages a strong engineering foundation to bridge the gap between business vision and technical execution \u2014 ensuring realistic planning, measurable quality improvements, and predictable delivery in fast-paced, regulated environments.",

  competencies: [
    {
      label: "Core Skills",
      items: [
        "SAFe PI Planning & Execution",
        "Multi-team Delivery Management",
        "Client Escalation Management",
        "Team Scaling & Onboarding",
        "Cross-functional Collaboration",
        "Stakeholder Management",
        "CI/CD & Release Management",
        "Budget & Resource Allocation",
        "Technical Debt Reduction",
        "Sprint Predictability Optimization",
        "Contract Negotiation & Account Management",
        "Quality Assurance & Defect Management",
        "Multi-technology Team Coordination",
        "Delivery Feasibility Assessment",
        "Engineering Process Improvement",
      ],
    },
    {
      label: "AI Skills",
      items: [
        "Claude (Code / Agents / Workflows)",
        "Gemini (CLI / Stitch)",
        "Ollama",
        "n8n workflows",
        "Prompt engineering",
        "AI-augmented code review",
      ],
    },
    {
      label: "Soft Skills",
      items: [
        "Conflict Resolution",
        "Proactive Communication",
        "Mentoring & Coaching",
        "Team Building",
        "Relationship Building",
        "Adaptability",
      ],
    },
  ],

  education: [
    {
      degree: "Bachelor\u2019s Degree in Business Management and Entrepreneurship",
      institution: "New Bulgarian University",
      period: "10/2015 \u2013 05/2018",
    },
    {
      degree: "Bachelor\u2019s Degree in Mathematics and Informatics",
      institution: "Sofia University St. Kliment Ohridski",
      period: "09/2010 \u2013 05/2013",
    },
  ],

  languages: [
    { language: "Bulgarian", level: "Native speaker" },
    { language: "English", level: "C2 / Proficient" },
  ],

  techStack: [
    { category: "Languages", items: ["TypeScript", "JavaScript", "PHP", "Java"] },
    { category: "Frontend", items: ["React", "Next.js"] },
    { category: "Databases", items: ["PostgreSQL", "MSSQL"] },
    {
      category: "Backend",
      items: ["Node.js", "Strapi", "NestJS", "Laravel", "Zend Framework"],
    },
    {
      category: "Cloud & Infrastructure",
      items: ["AWS (EC2, Fargate)", "Docker", "Apache", "Nginx", "Varnish"],
    },
    {
      category: "Tools & Methodologies",
      items: [
        "Git",
        "Jira",
        "Azure DevOps",
        "Confluence",
        "SAFe",
        "Scrum",
        "Kanban",
        "Jenkins",
        "GitHub Actions",
      ],
    },
  ],

  workExperience: [
    {
      title: "Software Engineering Manager",
      company: "DSK Bank",
      period: "11/2025 \u2013 Present",
      location: "Sofia, Bulgaria",
      description:
        "Leading a cross-functional team of 8 engineers (Java backend, frontend, iOS, Android, QA automation, manual QA) and a System Business Analyst in a SAFe Agile environment, delivering banking software solutions.",
      bullets: [
        "Achieved 100% PI objective completion in the first full Program Increment under my leadership, establishing clear alignment between engineering capacity and business priorities",
        "Reduced backlog defects by 87.5% (from 40 to 5) within a single PI cycle through prioritized defect triage and improved quality practices",
        "Decreased technical debt by 30% by introducing structured tech debt reduction into sprint planning",
        "Cut sprint-to-sprint carry-over by 80%, significantly improving delivery predictability and sprint commitment accuracy",
        "Participated in 2 PI Planning events, bridging the gap between business stakeholders and engineering by translating business vision into realistic, achievable delivery plans",
        "Fostered a culture of direct collaboration between business stakeholders and engineering by establishing joint discovery sessions \u2014 enabling the team to assess technical feasibility before committing to scope, resulting in more realistic goals and fewer mid-sprint surprises",
        "Built strong cross-functional relationships across engineering and business units in a short tenure, becoming a trusted point of contact for delivery feasibility and planning",
      ],
    },
    {
      title: "Software Delivery Manager",
      company: "MentorMate",
      companyNote: "now Tieto",
      period: "06/2016 \u2013 11/2025",
      location: "Sofia, Bulgaria",
      description:
        "Progressed from Software Engineer to Senior Engineer to Delivery Manager within MentorMate, ultimately managing multiple cross-technology squads and owning the full client delivery lifecycle \u2014 from contract signing to team scaling, onboarding, and escalation management.",
      subRoles: [
        {
          client: "Augeo Marketing",
          roleTitle: "Delivery Manager",
          duration: "~2 years",
          bullets: [
            "Scaled the client engagement from ~40 to 96 engineers across PHP, Vue.js, .NET, Java, React, and MSSQL by leading squad formation, contract negotiations, onboarding, and offboarding",
            "Managed multiple squads of 8\u201312 engineers, serving as the primary point of contact for all delivery, escalations, and account management",
            "Reduced active client escalations by 50% within the first 4 months, then virtually eliminated them through proactive communication with teams and stakeholders",
            "Partnered with Cloud & DevOps to optimize CI/CD pipelines and infrastructure utilization, reducing the client\u2019s cloud costs by 30%",
            "Wore multiple hats simultaneously: engineering manager, scrum master, account manager, and occasional hands-on developer when critical needs arose",
          ],
        },
        {
          client: "Namu (Custom Vacations)",
          roleTitle: "Delivery Manager",
          bullets: [
            "Took over a failing project with 3 months remaining and no working product \u2014 grew the team from 3 to 21 engineers and delivered a fully functional booking platform and internal sales lead tracking portal",
            "Client extended the engagement by 1.5 years as a direct result of the successful turnaround",
            "Tech stack: Next.js, PostgreSQL, Strapi, AWS EC2, Fargate",
          ],
        },
        {
          client: "AstraZeneca",
          roleTitle: "Configuration Manager",
          duration: "~1 year",
          bullets: [
            "Managed build pipelines and release configurations for iOS and Android applications, handling app store submissions across platforms",
          ],
        },
        {
          client: "DTNPF",
          roleTitle: "Frontend Developer \u2192 Java Backend \u2192 Delivery Lead",
          bullets: [
            "Transitioned from frontend to backend development, then into a delivery leadership role managing a small team of 2 Java developers, 1 QA, and 1 business analyst",
          ],
        },
        {
          client: "QuestarAI (Online Assessment)",
          roleTitle: "Software Engineer \u2192 Senior Software Engineer",
          bullets: [
            "Developed backend systems for a K-12 online assessment platform enabling students to take standardized exams digitally",
            "Specialized in QTI test import/export processing with complex XML validation and transformation",
            "Part of a 10-person cross-functional team",
          ],
        },
      ],
    },
    {
      title: "Early Career \u2014 Software Engineer",
      company: "",
      period: "06/2013 \u2013 05/2016",
      location: "Sofia, Bulgaria",
      bullets: [
        "Managed delivery across 13 projects simultaneously at BSMB, one of which \u2014 Career Town \u2014 led the client to acquire the company based on the quality of the delivered product (Laravel, PostgreSQL, Varnish, Nginx)",
        "Improved system stability and resolved security vulnerabilities for a background checking platform at It Cover Ltd (PHP, Zend Framework)",
        "Developed social media games and promotional web applications for major brands including Wizz Air, Nescaf\u00e9, and Milka at Interactive-Share M",
      ],
    },
  ],
};
