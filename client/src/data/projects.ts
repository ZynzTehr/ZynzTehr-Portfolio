import rawProjects from "./projects.json";

export interface Project {
  id: string;
  name: string;
  rawName: string;
  description: string;
  category:
    | "Full-Stack"
    | "Frontend"
    | "Web3 & Blockchain"
    | "3D & Creative UI"
    | "Web Application";
  language: string;
  techStack: string[];
  topics: string[];
  stars: number;
  forks: number;
  githubUrl: string;
  liveUrl?: string | null;
  mediaType: "video" | "gif" | "image";
  mediaUrl: string;
  previewImage: string;
  videoUrl?: string | null;
  updatedAt?: string;
  featured?: boolean;
}

const TITLE_OVERRIDES: Record<string, string> = {
  musicport: "MusicPort",
  "vscode-fx": "VSCode FX",
  anibeam: "AniBeam",
  jobseance: "JobSeance",
  "torque-line": "TorqueLine",
  "campfire-of-the-damned": "Campfire of the Damned",
  "fleet-pulse": "Fleet Pulse",
  "countdown-timer": "Countdown Timer",
  "next-chapter-week-one": "Next Chapter Week One",
  "new-age-chess": "New Age Chess",
  "super-quiz": "Super Quiz",
  "soda-diner": "Soda Diner",
  "match-maker": "Match Maker",
  "school-directory": "School Directory",
  loancalculator: "Loan Calculator",
  "auralist-web": "AuraList Web",
  "tic-tac-toe-withai": "Tic Tac Toe with AI",
  "tic-tac-toe": "Tic Tac Toe",
  "tlm-website-redesign": "TLM Website Redesign",
  "rock-paper-scissors-spock": "Rock Paper Scissors Spock",
  "advanced-rock-paper-scissors": "Advanced Rock Paper Scissors",
  "basic-rock-paper-scissors": "Basic Rock Paper Scissors",
  "testimonial-layout": "Testimonial Layout",
  nextchapter: "Next Chapter",
  "python-rock-paper-scissors": "Python Rock Paper Scissors",
};

export function formatToTitleCase(str: string): string {
  const smallWords = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "in",
    "nor",
    "of",
    "on",
    "or",
    "the",
    "to",
    "with",
  ]);
  const acronyms: Record<string, string> = {
    ai: "AI",
    ui: "UI",
    tlm: "TLM",
    web3: "Web3",
    icp: "ICP",
    api: "API",
    fx: "FX",
  };

  const words = str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .trim()
    .split(/\s+/);

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (acronyms[lower]) {
        return acronyms[lower];
      }
      if (index > 0 && smallWords.has(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function formatProjectDate(isoDate?: string): string {
  if (!isoDate) return "2026";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "2026";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const CATEGORY_MAP: Record<string, Project["category"]> = {
  musicport: "Full-Stack",
  "vscode-fx": "3D & Creative UI",
  anibeam: "Full-Stack",
  jobseance: "Full-Stack",
  "torque-line": "Full-Stack",
  "campfire-of-the-damned": "Full-Stack",
  "fleet-pulse": "Web Application",
  "countdown-timer": "3D & Creative UI",
  "next-chapter-week-one": "Frontend",
  "new-age-chess": "3D & Creative UI",
  "super-quiz": "3D & Creative UI",
  "soda-diner": "Full-Stack",
  "match-maker": "Full-Stack",
  "school-directory": "Frontend",
  loancalculator: "Full-Stack",
  "auralist-web": "Frontend",
  "tic-tac-toe-withai": "Frontend",
  "tic-tac-toe": "Frontend",
  "tlm-website-redesign": "Frontend",
  "rock-paper-scissors-spock": "Frontend",
  "advanced-rock-paper-scissors": "Frontend",
  "basic-rock-paper-scissors": "Frontend",
  "testimonial-layout": "Frontend",
  nextchapter: "Frontend",
  "python-rock-paper-scissors": "Full-Stack",
};

type RawProjectRecord = Omit<Project, "previewImage" | "techStack"> & {
  previewImage?: string;
  techStack?: string[];
};

export const projects: Project[] = (rawProjects as RawProjectRecord[])
  .map((p, index) => {
    const titleCasedName = TITLE_OVERRIDES[p.id] || formatToTitleCase(p.name || p.rawName);
    const fallbackPreview = `https://raw.githubusercontent.com/ZynzTehr/${p.rawName}/main/portfolio.webp`;

    return {
      ...p,
      name: titleCasedName,
      category: CATEGORY_MAP[p.id] || p.category || "Web Application",
      techStack: p.techStack && p.techStack.length > 0 ? p.techStack : [p.language],
      previewImage: p.previewImage || fallbackPreview,
      videoUrl: p.videoUrl ?? null,
      mediaType: p.videoUrl ? ("video" as const) : ("image" as const),
      featured: index < 6,
    };
  })
  .sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });

export const categories = [
  "Recent",
  "Full-Stack",
  "Frontend",
  "3D & Creative UI",
  "Web Application",
] as const;
