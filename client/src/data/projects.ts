import rawProjects from './projects.json';

export interface Project {
  id: string;
  name: string;
  rawName: string;
  description: string;
  category: 'Full-Stack' | 'Frontend' | 'Web3 & Blockchain' | '3D & Creative UI' | 'Web Application';
  language: string;
  topics: string[];
  stars: number;
  forks: number;
  githubUrl: string;
  liveUrl?: string | null;
  mediaType: 'video' | 'gif' | 'image';
  mediaUrl: string;
  previewImage?: string;
  updatedAt?: string;
  featured?: boolean;
}

// Explicit curated title casing dictionary
const TITLE_OVERRIDES: Record<string, string> = {
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

// Generic Title Case converter fallback
export function formatToTitleCase(str: string): string {
  const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'the', 'to', 'with']);
  const acronyms: Record<string, string> = {
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
      if (acronyms[lower]) {
        return acronyms[lower];
      }
      if (index > 0 && smallWords.has(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

// Category mappings
const CATEGORY_MAP: Record<string, Project['category']> = {
  'super-quiz': '3D & Creative UI',
  'soda-diner': 'Full-Stack',
  'match-maker': 'Full-Stack',
  'zynztehr-profile': '3D & Creative UI',
  'school-directory': 'Frontend',
  'loancalculator': 'Full-Stack',
  'auralist-web': 'Frontend',
  'tic-tac-toe-withai': 'Frontend',
  'tic-tac-toe': 'Frontend',
  'tlm-website-redesign': 'Frontend',
  'rock-paper-scissors-spock': 'Frontend',
  'advanced-rock-paper-scissors': 'Frontend',
  'basic-rock-paper-scissors': 'Frontend',
  'testimonial-layout': 'Frontend',
  'nextchapter': 'Frontend',
  'python-rock-paper-scissors': 'Full-Stack',
};

export const projects: Project[] = (rawProjects as Project[]).map((p, index) => {
  const titleCasedName = TITLE_OVERRIDES[p.id] || formatToTitleCase(p.name || p.rawName);

  return {
    ...p,
    name: titleCasedName,
    category: CATEGORY_MAP[p.id] || (p.category as Project['category']) || 'Web Application',
    mediaType: 'image',
    featured: index < 6,
  };
});

export const categories = [
  'All',
  'Full-Stack',
  'Frontend',
  'Web3 & Blockchain',
  '3D & Creative UI',
] as const;
