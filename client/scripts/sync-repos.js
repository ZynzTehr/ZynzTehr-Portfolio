import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USERNAME = 'ZynzTehr';
const EXCLUDED_REPOS = ['ZynzTehr-Portfolio', 'ZynzTehr']; // Exclude portfolio itself & profile README repo

const KNOWN_HOMEPAGES = {
  'tic-tac-toe-withAi': 'https://zynztehr.github.io/tic-tac-toe-withAi/',
};

const TITLE_OVERRIDES = {
  'super-quiz': 'Super Quiz',
  'soda-diner': 'Soda Diner',
  'match-maker': 'Match Maker',
  'zynztehr-profile': 'ZynzTehr Profile',
  'school-directory': 'School Directory',
  'loancalculator': 'Loan Calculator',
  'auralist-web': 'Auralist Web',
  'tic-tac-toe-withai': 'Tic Tac Toe with AI',
  'tic-tac-toe': 'Tic Tac Toe',
  'tlm-website-redesign': 'TLM Website Redesign',
  'rock-paper-scissors-spock': 'Rock Paper Scissors Spock',
  'advanced-rock-paper-scissors': 'Advanced Rock Paper Scissors',
  'basic-rock-paper-scissors': 'Basic Rock Paper Scissors',
  'testimonial-layout': 'Testimonial Layout',
  'nextchapter': 'Next Chapter',
  'python-rock-paper-scissors': 'Python Rock Paper Scissors',
};

function formatToTitleCase(str) {
  const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'the', 'to', 'with']);
  const acronyms = {
    ai: 'AI',
    ui: 'UI',
    tlm: 'TLM',
    web3: 'Web3',
    icp: 'ICP',
    api: 'API',
  };

  const words = str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .trim()
    .split(/\s+/);

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (acronyms[lower]) return acronyms[lower];
      if (index > 0 && smallWords.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

const CUSTOM_MEDIA_MAP = {};

async function syncRepositories() {
  console.log(`📡 Fetching repositories for GitHub user: ${GITHUB_USERNAME}...`);
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
      headers: {
        'User-Agent': 'Node.js-Sync-Script',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    console.log(`Found ${repos.length} repositories.`);

    const projects = [];

    for (const repo of repos) {
      if (repo.fork || EXCLUDED_REPOS.includes(repo.name)) {
        continue;
      }

      const custom = CUSTOM_MEDIA_MAP[repo.name] || {};
      
      // Categorization heuristic
      let category = custom.category || 'Web Application';
      const topics = repo.topics || [];
      const language = repo.language || 'TypeScript';

      if (topics.includes('web3') || repo.description?.toLowerCase().includes('web3') || repo.description?.toLowerCase().includes('motoko') || repo.description?.toLowerCase().includes('icp')) {
        category = 'Web3 & Blockchain';
      } else if (topics.includes('fullstack') || topics.includes('full-stack') || (repo.description && repo.description.toLowerCase().includes('full-stack'))) {
        category = 'Full-Stack';
      } else if (topics.includes('3d') || topics.includes('threejs') || topics.includes('creative')) {
        category = '3D & Creative UI';
      }

      // Check if preview gif/video is hosted in raw repo
      const rawPreviewGif = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${repo.default_branch || 'main'}/preview.gif`;
      const id = repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const title = TITLE_OVERRIDES[id] || formatToTitleCase(repo.name);

      const project = {
        id: id,
        name: title,
        rawName: repo.name,
        description: repo.description || 'Modern responsive software application engineered with clean code architecture.',
        category: category,
        language: language,
        topics: topics.length > 0 ? topics : [language, 'Vite', 'React'],
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || KNOWN_HOMEPAGES[repo.name] || null,
        mediaType: custom.mediaType || 'image',
        mediaUrl: custom.mediaUrl || rawPreviewGif,
        updatedAt: repo.updated_at
      };

      projects.push(project);
    }

    const outputPath = path.resolve(__dirname, '../src/data/projects.json');
    fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));
    console.log(`✅ Successfully synced ${projects.length} projects to: ${outputPath}`);

  } catch (error) {
    console.error('❌ Failed to sync repositories:', error);
  }
}

syncRepositories();
