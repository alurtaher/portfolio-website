/**
 * Brand logos are official devicon "original" SVGs (MIT) or simple-icons paths (CC0)
 * with their official colour, copied into /public/logos (licences alongside).
 * Concept skills get custom thin line icons drawn in the same 24px grid.
 */

export const BRAND: Record<string, { file: string; title: string; tint: string }> = {
  javascript: { file: "javascript.svg", title: "JavaScript", tint: "#F7DF1E" },
  python: { file: "python.svg", title: "Python", tint: "#3776AB" },
  java: { file: "java.svg", title: "Java", tint: "#E76F00" },
  react: { file: "react.svg", title: "React", tint: "#61DAFB" },
  tailwindcss: { file: "tailwindcss.svg", title: "Tailwind CSS", tint: "#06B6D4" },
  nextjs: { file: "nextjs.svg", title: "Next.js", tint: "#000000" },
  nodejs: { file: "nodejs.svg", title: "Node.js", tint: "#5FA04E" },
  express: { file: "express.svg", title: "Express", tint: "#000000" },
  jwt: { file: "jwt.svg", title: "JSON Web Tokens", tint: "#000000" },
  socketio: { file: "socketio.svg", title: "Socket.IO", tint: "#010101" },
  claude: { file: "claude.svg", title: "Claude", tint: "#D97757" },
  gemini: { file: "gemini.svg", title: "Google Gemini", tint: "#8E75B2" },
  langchain: { file: "langchain.svg", title: "LangChain", tint: "#7FC8FF" },
  mongodb: { file: "mongodb.svg", title: "MongoDB", tint: "#47A248" },
  mysql: { file: "mysql.svg", title: "MySQL", tint: "#4479A1" },
  aws: { file: "amazonwebservices.svg", title: "Amazon Web Services", tint: "#FF9900" },
  nginx: { file: "nginx.svg", title: "Nginx", tint: "#009639" },
  pm2: { file: "pm2.svg", title: "PM2", tint: "#2B037A" },
  git: { file: "git.svg", title: "Git", tint: "#F05032" },
  postman: { file: "postman.svg", title: "Postman", tint: "#FF6C37" },
  jenkins: { file: "jenkins.svg", title: "Jenkins", tint: "#D24939" },
  bunny: { file: "bunny.svg", title: "bunny.net", tint: "#FFAA49" },
  leetcode: { file: "leetcode.svg", title: "LeetCode", tint: "#FFA116" },
};

/** 24×24, stroke-only paths. */
export const CONCEPT: Record<string, { title: string; d: string[] }> = {
  speech: {
    title: "Microphone",
    d: ["M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z", "M5.5 11a6.5 6.5 0 0 0 13 0", "M12 17.5V21", "M8.5 21h7"],
  },
  rest: {
    title: "API endpoints",
    d: ["M8 7 3 12l5 5", "M16 7l5 5-5 5", "M13.5 4.5l-3 15"],
  },
  vector: {
    title: "Vector index",
    d: ["M4 20 20 4", "M4 20h16", "M4 20V4", "M4 20l9-4", "M4 20l4-9", "M13 16a1 1 0 1 0 0-.01", "M8 11a1 1 0 1 0 0-.01"],
  },
  rag: {
    title: "Retrieval pipeline",
    d: ["M4 5h6v5H4z", "M14 14h6v5h-6z", "M7 10v3.5a1.5 1.5 0 0 0 1.5 1.5H14", "M14 5h6", "M14 8h4", "M10 7.5h2"],
  },
  prompt: {
    title: "Prompt",
    d: ["M3.5 5.5h17v13h-17z", "M7 10l3 2-3 2", "M12 15h4"],
  },
  dsa: {
    title: "Tree data structure",
    d: ["M12 4.5a1.8 1.8 0 1 0 0 .01", "M6 18.5a1.8 1.8 0 1 0 0 .01", "M18 18.5a1.8 1.8 0 1 0 0 .01", "M12 12a1.8 1.8 0 1 0 0 .01", "M12 6.3v3.9", "M10.6 13.2l-3.4 3.7", "M13.4 13.2l3.4 3.7"],
  },
  sql: {
    title: "Database",
    d: ["M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3Z", "M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6", "M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"],
  },
  users: {
    title: "Users",
    d: ["M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z", "M2.5 20a6.5 6.5 0 0 1 13 0", "M16 4.3a3.5 3.5 0 0 1 0 6.4", "M18 14a6.5 6.5 0 0 1 3.5 6"],
  },
  products: {
    title: "Products",
    d: ["M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z", "M3.5 12 12 16.5 20.5 12", "M3.5 16.5 12 21l8.5-4.5"],
  },
  mentor: {
    title: "Mentoring",
    d: ["M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z", "M6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11", "M21.5 9v5"],
  },
  interview: {
    title: "Interview",
    d: ["M4 5h11v8H8l-4 3V5Z", "M15 9h5v9l-3-2.5h-6V13"],
  },
  degree: {
    title: "Degree",
    d: ["M5 3.5h14v17l-7-4-7 4v-17Z", "M9 9h6", "M9 12h4"],
  },
};

export function isBrand(key: string): boolean {
  return key in BRAND;
}

export function brandTint(key: string): string | undefined {
  return BRAND[key]?.tint;
}

interface Props {
  name: string;
  size?: number;
  className?: string;
  /** decorative (aria-hidden) when the name is already printed next to it */
  decorative?: boolean;
  strokeWidth?: number;
  eager?: boolean;
}

export default function TechLogo({ name, size = 24, className, decorative = false, strokeWidth = 1.4, eager }: Props) {
  const brand = BRAND[name];
  if (brand) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/logos/${brand.file}`}
        width={size}
        height={size}
        alt={decorative ? "" : `${brand.title} logo`}
        aria-hidden={decorative || undefined}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  const c = CONCEPT[name];
  if (!c) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : c.title}
      vectorEffect="non-scaling-stroke"
    >
      {c.d.map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
