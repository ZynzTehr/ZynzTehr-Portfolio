import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USERNAME = "ZynzTehr";
// This portfolio and the GitHub profile README are not projects. The profile
// hub (ZynzTehr-Profile, jorgebucio.com) is, and is listed like any other.
const EXCLUDED_REPOS = ["ZynzTehr-Portfolio", "ZynzTehr"];

/**
 * A project's media lives in its own repo root: portfolio.webp (the still) and,
 * when present, portfolio.mp4 (the motion clip). The clip is detected per repo,
 * so adding or replacing it in the project repo is all it takes; nothing here
 * lists which repos have one. Raw file checks do not count against the API
 * rate limit.
 */
async function rootFileExists(repoName, branch, file) {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${branch}/${file}`,
      { method: "HEAD", signal: AbortSignal.timeout(8000) },
    );
    return res.ok;
  } catch {
    return false;
  }
}

const KNOWN_HOMEPAGES = {
  "tic-tac-toe-withAi": "https://zynztehr.github.io/tic-tac-toe-withAi/",
  "new-age-chess": "https://zynztehr.github.io/new-age-chess/",
  "countdown-timer": "https://zynztehr.github.io/countdown-timer/",
};

const DISABLED_HOMEPAGES = new Set(["MusicPort"]);

/**
 * Media that lives in this repo (client/public/media/<id>/) instead of the
 * project repo root. Used for screens authored in Google Flow for projects with
 * no web UI, and for recaptures that replace a broken root snapshot. Applied on
 * every sync, including the offline fallback, so an override is never lost.
 */
const MEDIA_OVERRIDES = {
  "school-directory": { previewImage: "/media/school-directory/portfolio.webp" },
  // The owner's real Motion Lab recording from the extension's README (static/demos/motion-lab.mp4).
  "vscode-fx": {
    previewImage: "/media/vscode-fx/portfolio.webp",
    videoUrl: "/media/vscode-fx/portfolio.mp4",
  },
  // The repo ships no portfolio.webp: a capture of the live site, and a short
  // recording of its opening act.
  "zynztehr-profile": {
    previewImage: "/media/zynztehr-profile/portfolio.webp",
    videoUrl: "/media/zynztehr-profile/portfolio.mp4",
  },
  "super-quiz": { previewImage: "/media/super-quiz/portfolio.webp" },
};

/** Only point at override files that actually exist, so a missing file never ships a 404. */
function applyMediaOverrides(projects) {
  const publicDir = path.resolve(__dirname, "../public");
  return projects.map((project) => {
    const override = MEDIA_OVERRIDES[project.id];
    if (!override) return project;
    const next = { ...project };
    for (const [key, url] of Object.entries(override)) {
      if (url && fs.existsSync(path.join(publicDir, url))) next[key] = url;
    }
    if (next.previewImage !== project.previewImage) next.mediaUrl = next.previewImage;
    if (next.videoUrl) next.mediaType = "video";
    return next;
  });
}

const TITLE_OVERRIDES = {
  "zynztehr-profile": "Profile Hub",
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

const DESCRIPTION_OVERRIDES = {
  "zynztehr-profile":
    "Profile Hub (jorgebucio.com) is a six-act interactive engineering folio in React 19 and TypeScript: scroll-pinned card choreography in GSAP and Motion, custom Three.js GLSL shaders, live tool-pairing splines, automated GitHub build sync, a serverless SVG API, and Playwright plus Axe quality gates.",
  "torque-line":
    "TorqueLine is a commercial fleet maintenance platform built with Next.js and TypeScript for DOT and OEM PM-A, PM-B, and PM-C inspection schedules, unit-based engine rebuild tracking across chassis, multi-device sync, and probable-cause diagnostics.",
};

const BASELINE_MILESTONE_DATES = {
  musicport: "2026-11-11T23:17:04Z",
  "vscode-fx": "2026-11-05T22:47:32Z",
  anibeam: "2026-11-04T01:45:55Z",
  jobseance: "2026-10-30T15:51:52Z",
  "torque-line": "2026-10-27T18:08:54Z",
  "campfire-of-the-damned": "2026-10-23T04:13:13Z",
  "fleet-pulse": "2026-10-02T02:54:35Z",
  "countdown-timer": "2026-09-20T20:50:22Z",
  "next-chapter-week-one": "2026-09-18T20:11:01Z",
  "new-age-chess": "2026-09-11T17:17:52Z",
  "super-quiz": "2026-08-25T22:07:57Z",
  "testimonial-layout": "2026-08-25T19:51:10Z",
  loancalculator: "2026-08-22T22:21:36Z",
  "capstone-project": "2026-08-22T17:48:13Z",
  "tic-tac-toe-withai": "2026-08-21T17:54:09Z",
  "match-maker": "2026-08-20T20:07:19Z",
  "soda-diner": "2026-08-20T20:06:57Z",
  "school-directory": "2026-08-19T19:43:01Z",
  "auralist-web": "2026-04-17T21:38:32Z",
  "tic-tac-toe": "2026-03-11T18:55:02Z",
  "tlm-website-redesign": "2026-03-11T18:23:00Z",
  "rock-paper-scissors-spock": "2026-03-11T17:19:33Z",
  "advanced-rock-paper-scissors": "2026-03-11T17:19:00Z",
  "basic-rock-paper-scissors": "2026-03-11T17:18:03Z",
  nextchapter: "2026-03-11T17:10:18Z",
  "python-rock-paper-scissors": "2026-03-10T02:11:13Z",
};

const CURATED_REPO_METADATA = {
  "zynztehr-profile": {
    category: "3D & Creative UI",
    techStack: ["React", "TypeScript", "Three.js", "GSAP"],
    topics: ["portfolio", "glsl", "scroll-choreography", "github-sync", "playwright"],
  },
  musicport: {
    category: "Full-Stack",
    techStack: ["React", "TypeScript", "Express", "PostgreSQL"],
    topics: ["live-music", "geolocation", "marketplace"],
  },
  "vscode-fx": {
    category: "3D & Creative UI",
    techStack: ["TypeScript", "VS Code API", "CSS3"],
    topics: ["vscode-extension", "cursor-fx", "editor-motion"],
  },
  anibeam: {
    category: "Full-Stack",
    techStack: ["React", "TypeScript", "AniList GraphQL", "WebSockets"],
    topics: ["anime-discovery", "device-sync", "live-chat"],
  },
  jobseance: {
    category: "Full-Stack",
    techStack: ["Next.js", "TypeScript", "OAuth", "Risk Heuristics"],
    topics: ["ghost-job-audit", "scam-detection", "career-safety"],
  },
  "torque-line": {
    category: "Full-Stack",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Cloud Sync"],
    topics: ["fleet-ops", "dot-inspections", "diagnostics"],
  },
  "campfire-of-the-damned": {
    category: "Full-Stack",
    techStack: ["TypeScript", "React", "Neon Postgres", "AI Guardrails"],
    topics: ["generative-fiction", "budget-locks", "css-fire"],
  },
  "fleet-pulse": {
    category: "Web Application",
    techStack: ["React", "JavaScript", "IndexedDB", "OCR Scan"],
    topics: ["preventive-maintenance", "offline-first", "logistics"],
  },
  "countdown-timer": {
    category: "3D & Creative UI",
    techStack: ["JavaScript", "CSS 3D", "Web Audio", "Canvas"],
    topics: ["split-flip-clock", "particles", "timekeeping"],
  },
  "next-chapter-week-one": {
    category: "Frontend",
    techStack: ["HTML5", "CSS3", "Vanilla JS", "WCAG 2.1 AA"],
    topics: ["price-estimator", "accessibility", "zero-deps"],
  },
  "new-age-chess": {
    category: "3D & Creative UI",
    techStack: ["React 19", "TypeScript", "Vite", "Neural Engine"],
    topics: ["chess-ai", "threat-heatmap", "eco-openings"],
  },
  "super-quiz": {
    category: "3D & Creative UI",
    techStack: ["JavaScript", "Anime.js", "HTML5", "Web Storage"],
    topics: ["stagger-grid", "trivia-engine", "custom-deck"],
  },
  "testimonial-layout": {
    category: "Frontend",
    techStack: ["HTML5", "CSS Grid", "Flexbox", "Custom Type"],
    topics: ["bento-cards", "social-proof", "responsive-ui"],
  },
  loancalculator: {
    category: "Full-Stack",
    techStack: ["JavaScript", "HTML5", "CSS3", "Print PDF"],
    topics: ["amortization", "fintech-math", "payoff-planner"],
  },
  "capstone-project": {
    category: "Web Application",
    techStack: ["JavaScript", "jQuery", "Bootstrap", "HTML5"],
    topics: ["word-game", "cart-checkout", "profile-chat"],
  },
  "tic-tac-toe-withai": {
    category: "Frontend",
    techStack: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
    topics: ["minimax-ai", "game-theory", "difficulty-tiers"],
  },
  "match-maker": {
    category: "Full-Stack",
    techStack: ["Node.js", "Express", "EJS", "REST API"],
    topics: ["compatibility-score", "survey-routing", "ssr"],
  },
  "soda-diner": {
    category: "Full-Stack",
    techStack: ["Node.js", "Express", "MongoDB", "Mocha & Chai"],
    topics: ["crud-catalog", "relational-mapping", "api-tests"],
  },
  "school-directory": {
    category: "Frontend",
    techStack: ["TypeScript", "OOP Classes", "Node.js FS", "CLI"],
    topics: ["inheritance-tree", "data-parser", "academic-records"],
  },
  "auralist-web": {
    category: "Frontend",
    techStack: ["HTML5", "CSS3", "Static Docs"],
    topics: ["ios-companion", "privacy-policy", "app-support"],
  },
  "tic-tac-toe": {
    category: "Frontend",
    techStack: ["React", "JavaScript", "CSS3"],
    topics: ["two-player", "win-matrix", "scoreboard"],
  },
  "tlm-website-redesign": {
    category: "Frontend",
    techStack: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
    topics: ["brand-redesign", "editorial-layout", "custom-cursor"],
  },
  "rock-paper-scissors-spock": {
    category: "Frontend",
    techStack: ["JavaScript", "CSS3", "SVG", "LocalStorage"],
    topics: ["pentagon-arena", "five-way-rules", "micro-motion"],
  },
  "advanced-rock-paper-scissors": {
    category: "Frontend",
    techStack: ["JavaScript", "CSS3", "SVG", "LocalStorage"],
    topics: ["arcade-ui", "persistent-score", "vector-art"],
  },
  "basic-rock-paper-scissors": {
    category: "Frontend",
    techStack: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
    topics: ["classic-arcade", "score-tracker", "gradients"],
  },
  nextchapter: {
    category: "Frontend",
    techStack: ["HTML5", "CSS3", "JavaScript"],
    topics: ["glassmorphism", "media-gallery", "bootcamp-entry"],
  },
  "python-rock-paper-scissors": {
    category: "Full-Stack",
    techStack: ["Python 3", "CLI", "Dict Dispatch", "Random"],
    topics: ["terminal-game", "control-flow", "score-loop"],
  },
};

function resolveGitHubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execSync("gh auth token", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function formatToTitleCase(str) {
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
  const acronyms = {
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
      if (acronyms[lower]) return acronyms[lower];
      if (index > 0 && smallWords.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

async function resolveMilestoneDate(repo, id, headers) {
  const baseline = BASELINE_MILESTONE_DATES[id];
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=6`,
      { headers },
    );
    if (res.ok) {
      const commits = await res.json();
      const codeCommit = commits.find((entry) => {
        const msg = (entry?.commit?.message || "").trim();
        return !msg.startsWith("Add portfolio.webp") && !msg.startsWith("Add portfolio.mp4");
      });
      const commitDate = codeCommit?.commit?.committer?.date || codeCommit?.commit?.author?.date;
      if (commitDate) {
        if (!baseline) return commitDate;
        return new Date(commitDate).getTime() > new Date(baseline).getTime()
          ? commitDate
          : baseline;
      }
    }
  } catch {
    // Fall back to baseline milestone date when offline or rate-limited
  }
  return baseline || repo.updated_at;
}

async function syncRepositories() {
  console.log(`Fetching repositories for GitHub user: ${GITHUB_USERNAME}...`);
  const token = resolveGitHubToken();
  const headers = {
    "User-Agent": "ZynzTehr-Portfolio-Sync",
    Accept: "application/vnd.github.v3+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const repos = await response.json();
  const projects = [];

  for (const repo of repos) {
    if (repo.fork || EXCLUDED_REPOS.includes(repo.name)) {
      continue;
    }

    const id = repo.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const branch = repo.default_branch || "main";
    const curated = CURATED_REPO_METADATA[id] || {};
    const language = repo.language || "TypeScript";
    const ghTopics = Array.isArray(repo.topics) ? repo.topics : [];

    let category = curated.category || "Web Application";
    if (!curated.category) {
      if (ghTopics.includes("web3") || repo.description?.toLowerCase().includes("web3")) {
        category = "Web3 & Blockchain";
      } else if (
        ghTopics.includes("fullstack") ||
        ghTopics.includes("full-stack") ||
        repo.description?.toLowerCase().includes("full-stack")
      ) {
        category = "Full-Stack";
      } else if (
        ghTopics.includes("3d") ||
        ghTopics.includes("threejs") ||
        repo.description?.toLowerCase().includes("3d")
      ) {
        category = "3D & Creative UI";
      }
    }

    const previewImage = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/portfolio.webp`;
    const hasVideo = await rootFileExists(repo.name, branch, "portfolio.mp4");
    const videoUrl = hasVideo
      ? `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/portfolio.mp4`
      : null;

    const updatedAt = await resolveMilestoneDate(repo, id, headers);
    const rawHomepage = typeof repo.homepage === "string" ? repo.homepage.trim() : "";
    const liveUrl = DISABLED_HOMEPAGES.has(repo.name)
      ? null
      : rawHomepage || KNOWN_HOMEPAGES[repo.name] || null;

    projects.push({
      id,
      name: TITLE_OVERRIDES[id] || formatToTitleCase(repo.name),
      rawName: repo.name,
      description:
        DESCRIPTION_OVERRIDES[id] ||
        repo.description ||
        "Responsive software application built with modular architecture.",
      category,
      language,
      techStack: curated.techStack || [language],
      topics:
        curated.topics ||
        (ghTopics.length > 0 ? ghTopics : [language.toLowerCase(), "open-source"]),
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      githubUrl: repo.html_url,
      liveUrl,
      mediaType: hasVideo ? "video" : "image",
      mediaUrl: previewImage,
      previewImage,
      videoUrl,
      updatedAt,
    });
  }

  projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  writeProjects(applyMediaOverrides(projects));
}

const OUTPUT_PATH = path.resolve(__dirname, "../src/data/projects.json");

function writeProjects(projects) {
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(projects, null, 2)}\n`);
  console.log(`Successfully synced ${projects.length} projects to: ${OUTPUT_PATH}`);
}

/**
 * prebuild runs this script, so a GitHub outage or rate limit must not fail a
 * deploy. On any error, keep the checked-in projects.json (with overrides
 * re-applied) and continue.
 */
syncRepositories().catch((error) => {
  console.warn(`Sync skipped, keeping the checked-in projects.json: ${error.message || error}`);
  try {
    const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
    writeProjects(applyMediaOverrides(existing));
  } catch (readError) {
    console.error("No usable projects.json to fall back to:", readError);
    process.exit(1);
  }
});
