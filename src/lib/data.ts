/**
 * Single source of truth for every word on the site.
 *
 * Source: Alur_Taher_Basha_Full_Stack_Ai_Engineer_Resume.pdf (text + embedded links).
 * Items tagged `ownerSupplied: true` (or commented "owner-supplied") were provided
 * directly by Taher while this site was being built, and are not in that PDF yet.
 * Nothing else is invented.
 */

export type Family =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "AI & ML"
  | "Databases"
  | "Cloud & Tools"
  | "Concepts";

export interface Skill {
  n: number;
  symbol: string;
  name: string;
  family: Family;
  /** key into the TechLogo BRAND / CONCEPT maps */
  logo: string;
  detail?: string;
  ownerSupplied?: boolean;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  kicker: string;
  period: string;
  description: string;
  features: string[];
  tech: string[];
  live?: string;
  github?: string;
}

export interface TimelineItem {
  kind: "education" | "experience";
  year: string;
  period: string;
  title: string;
  place: string;
  detail: string[];
  /** for chronological sorting: YYYY-MM */
  start: string;
}

export interface Achievement {
  id: string;
  logo: string;
  label: string;
  caption: string;
  detail: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  href?: string;
  ownerSupplied?: boolean;
}

export const PROFILE = {
  name: "Alur Taher Basha",
  firstName: "Taher",
  initials: "AT",
  role: "Full Stack Developer",
  roles: ["Full Stack Developer", "AI Integration", "Backend Engineer"],
  email: "taherbasha295@gmail.com",
  phone: "8499089094",
  phoneHref: "tel:+918499089094",
  location: "Bangalore",
  github: "https://github.com/alurtaher/",
  linkedin: "https://www.linkedin.com/in/alur-taher-basha-857937233/",
  leetcode: "https://leetcode.com/u/Alur_Taher_Basha/",
  resume: "/Alur_Taher_Basha_Resume.pdf",
  resumeSummary:
    "Full Stack Developer with deployed AI-powered applications using React.js, Node.js, and MongoDB. Built production systems integrating Claude API, Gemini AI, and LangChain RAG pipelines. Strong in REST API design, JWT auth, AWS deployment, and real-time architectures. Mentored 200+ students in DSA and backend development. M.Tech CSE | 8.5 CGPA",
  /** second line in About: drawn from the ZRUTAM LLP entry */
  aboutLine:
    "Right now I'm at ZRUTAM LLP, building full-stack features with React.js and Node.js, plus LangChain and RAG-based AI features for production workflows.",
  /** paraphrase of the summary's own wording */
  quote: "Strong in REST API design, auth, deployment and real-time architectures, and I ship it all end to end.",
  degree: "M.Tech, Computer Science & Engineering",
  school: "Bheema Institute of Technology and Science, Adoni",
  cgpa: "8.5 / 10",
  graduation: "2026",
  currentRole: "Full Stack Developer at ZRUTAM LLP",
} as const;

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

/** Section index for the "03 — Selected work" tags, in page order. */
export const SECTION_INDEX: Record<string, string> = Object.fromEntries(
  NAV.map((n, i) => [n.id, String(i + 1).padStart(2, "0")]),
);

export const FAMILIES: Family[] = [
  "Languages",
  "Frontend",
  "Backend",
  "AI & ML",
  "Databases",
  "Cloud & Tools",
  "Concepts",
];

const SKILL_LIST: Omit<Skill, "n">[] = [
  // Languages
  { symbol: "Js", name: "JavaScript", family: "Languages", logo: "javascript" },
  { symbol: "Py", name: "Python", family: "Languages", logo: "python" },
  { symbol: "Ja", name: "Java", family: "Languages", logo: "java" },
  // Frontend
  { symbol: "Re", name: "React.js", family: "Frontend", logo: "react" },
  { symbol: "Tw", name: "Tailwind CSS", family: "Frontend", logo: "tailwindcss" },
  { symbol: "Ws", name: "Web Speech API", family: "Frontend", logo: "speech" },
  { symbol: "Nx", name: "Next.js", family: "Frontend", logo: "nextjs", ownerSupplied: true },
  // Backend
  { symbol: "No", name: "Node.js", family: "Backend", logo: "nodejs" },
  { symbol: "Ex", name: "Express.js", family: "Backend", logo: "express" },
  { symbol: "Ra", name: "REST APIs", family: "Backend", logo: "rest" },
  { symbol: "Jw", name: "JWT", family: "Backend", logo: "jwt" },
  { symbol: "So", name: "Socket.IO", family: "Backend", logo: "socketio" },
  // AI & ML
  { symbol: "Cl", name: "Claude API", family: "AI & ML", logo: "claude" },
  { symbol: "Gm", name: "Gemini AI", family: "AI & ML", logo: "gemini" },
  { symbol: "Lc", name: "LangChain", family: "AI & ML", logo: "langchain" },
  { symbol: "Fa", name: "FAISS", family: "AI & ML", logo: "vector" },
  { symbol: "Rg", name: "RAG Pipelines", family: "AI & ML", logo: "rag" },
  { symbol: "Pe", name: "Prompt Engineering", family: "AI & ML", logo: "prompt" },
  // Databases
  { symbol: "Mg", name: "MongoDB", family: "Databases", logo: "mongodb" },
  { symbol: "My", name: "MySQL", family: "Databases", logo: "mysql" },
  // Cloud & Tools
  { symbol: "Aw", name: "AWS", family: "Cloud & Tools", logo: "aws", detail: "EC2, S3, RDS" },
  { symbol: "Ng", name: "Nginx", family: "Cloud & Tools", logo: "nginx" },
  { symbol: "Pm", name: "PM2", family: "Cloud & Tools", logo: "pm2" },
  { symbol: "Gt", name: "Git", family: "Cloud & Tools", logo: "git" },
  { symbol: "Pt", name: "Postman", family: "Cloud & Tools", logo: "postman" },
  { symbol: "Jk", name: "CI/CD", family: "Cloud & Tools", logo: "jenkins", detail: "Jenkins" },
  { symbol: "Bn", name: "Bunny CDN", family: "Cloud & Tools", logo: "bunny", ownerSupplied: true },
  // Concepts (from the mentoring + summary lines)
  { symbol: "Ds", name: "DSA", family: "Concepts", logo: "dsa" },
  { symbol: "Sq", name: "SQL", family: "Concepts", logo: "sql" },
];

export const SKILLS: Skill[] = SKILL_LIST.map((s, i) => ({ ...s, n: i + 1 }));

export const SKILL_GROUPS = FAMILIES.map((family) => ({
  family,
  skills: SKILLS.filter((s) => s.family === family),
}));

export const PROJECTS: Project[] = [
  {
    id: "roleplay",
    index: "01",
    title: "AI Roleplay Assessment Tool",
    kicker: "Voice-driven AI sales simulator",
    period: "Apr 2026 – Present",
    description:
      "Voice-driven AI sales simulator: users interact with an AI customer entirely through speech, with real-time speech-to-text and TTS responses.",
    features: [
      "Claude API scoring across 5+ criteria",
      "Tone, objection handling, empathy, closure rate",
      "Timestamped session transcripts",
      "Per-criteria performance breakdown",
      "Multi-turn conversation state",
      "Responsive UI with accessible controls",
    ],
    tech: ["React.js", "Node.js", "Claude API", "Web Speech API"],
    live: "https://ai-roleplay-1-nuc2.onrender.com/",
  },
  {
    id: "careerpilot",
    index: "02",
    title: "CareerPilot AI",
    kicker: "Full-stack AI career platform",
    period: "Jan 2026 – Mar 2026",
    description:
      "Full-stack AI career platform that parses uploaded resumes (PDF/DOCX), performs skill gap analysis, and generates personalized interview plans.",
    features: [
      "Resume parsing: PDF & DOCX",
      "Skill gap analysis",
      "AI match scoring vs. job descriptions",
      "Targeted interview questions (Gemini AI)",
      "JWT auth with logout token invalidation",
      "Automated PDF career-roadmap reports",
    ],
    tech: ["React.js", "Node.js", "MongoDB", "Gemini AI", "AWS", "JWT"],
    live: "https://careerpilot-ai-1-zs3k.onrender.com/",
  },
  {
    id: "rag",
    index: "03",
    title: "RAG Medical Assistant",
    kicker: "Final year project",
    period: "Nov 2025 – May 2026",
    description:
      "A medical Q&A Retrieval-Augmented Generation pipeline built with LangChain and a FAISS vector store.",
    features: [
      "Document ingestion & chunking",
      "Searchable FAISS index",
      "Fast semantic retrieval",
      "Ingestion → embedding → retrieval → generation",
      "Modular architecture",
      "Fewer hallucinations vs. vanilla prompting",
    ],
    tech: ["Python", "LangChain", "FAISS", "RAG Pipelines"],
  },
];

export const EXPERIENCE: TimelineItem[] = [
  {
    kind: "experience",
    year: "2026",
    period: "May 2026 – Present",
    start: "2026-05",
    title: "Full Stack Developer",
    place: "ZRUTAM LLP · Remote",
    detail: [
      "Building full-stack features using React.js and Node.js; integrating real-time communication via Socket.IO for live collaboration.",
      "Developing LangChain and RAG-based AI features for production-grade enterprise workflows.",
      // owner-supplied
      "Built 3 products end to end, handling 10k+ users, on MERN, Next.js, Bunny CDN and AWS.",
    ],
  },
  {
    kind: "experience",
    year: "2025",
    period: "Sep 2025 – Mar 2026",
    start: "2025-09",
    title: "Technical Mentor (Part-Time)",
    place: "Sharpener Tech · Remote",
    detail: [
      "Mentored 200+ students in JavaScript, SQL, DSA, and Node.js/Express.js backend development across structured weekly sessions.",
      "Conducted 100+ mock interviews covering SQL query optimization and algorithmic problem-solving.",
    ],
  },
];

export const EDUCATION: TimelineItem[] = [
  {
    kind: "education",
    year: "2024",
    period: "Jul 2024 – Mar 2026",
    start: "2024-07",
    title: "M.Tech, Computer Science & Engineering",
    place: "Bheema Institute of Technology and Science, Adoni",
    detail: ["CGPA: 8.5 / 10", "Final year project: RAG Medical Assistant"],
  },
];

export const TIMELINE: TimelineItem[] = [...EDUCATION, ...EXPERIENCE].sort((a, b) =>
  a.start.localeCompare(b.start),
);

/** The résumé lists none, so the Certifications section is not rendered. */
export const CERTIFICATIONS: { title: string; issuer: string; href?: string }[] = [];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "leetcode",
    logo: "leetcode",
    label: "LeetCode",
    caption: "Problems solved",
    detail: "Alur_Taher_Basha on LeetCode",
    value: 200,
    suffix: "+",
    href: "https://leetcode.com/u/Alur_Taher_Basha/",
    ownerSupplied: true,
  },
  {
    id: "users",
    logo: "users",
    label: "ZRUTAM LLP",
    caption: "Users handled",
    detail: "MERN · Next.js · Bunny CDN · AWS",
    value: 10,
    suffix: "k+",
    ownerSupplied: true,
  },
  {
    id: "products",
    logo: "products",
    label: "ZRUTAM LLP",
    caption: "Products built end to end",
    detail: "Frontend, backend and AI integration",
    value: 3,
    ownerSupplied: true,
  },
  {
    id: "students",
    logo: "mentor",
    label: "Sharpener Tech",
    caption: "Students mentored",
    detail: "JavaScript, SQL, DSA, Node.js/Express.js",
    value: 200,
    suffix: "+",
  },
  {
    id: "interviews",
    logo: "interview",
    label: "Sharpener Tech",
    caption: "Mock interviews conducted",
    detail: "SQL optimization & algorithmic problem-solving",
    value: 100,
    suffix: "+",
  },
  {
    id: "cgpa",
    logo: "degree",
    label: "M.Tech CSE",
    caption: "CGPA out of 10",
    detail: "Bheema Institute of Technology and Science",
    value: 8.5,
    decimals: 1,
  },
];

/** Which projects / roles use a given skill name, for the Skills inspector. */
export function usedIn(skill: string): string[] {
  const out = PROJECTS.filter((p) => p.tech.includes(skill)).map((p) => p.title);
  const zrutam = ["React.js", "Node.js", "Socket.IO", "LangChain", "RAG Pipelines", "MongoDB", "Express.js", "Next.js", "Bunny CDN", "AWS"];
  const mentor = ["JavaScript", "SQL", "DSA", "Node.js", "Express.js"];
  if (zrutam.includes(skill)) out.push("ZRUTAM LLP");
  if (mentor.includes(skill)) out.push("Mentoring at Sharpener Tech");
  return out;
}
