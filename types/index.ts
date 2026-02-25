export interface ProjectLinks {
  github?: string;
  demo?: string;
  paper?: string;
}

export interface Project {
  id: number;          // 01, 02, 03… portikus 스타일 번호
  slug: string;        // URL slug (/projects/[slug])
  title: string;
  subtitle: string;    // 한 줄 설명
  year: number;
  category: string[];  // ['Medical AI', 'Vision', ...]
  stack: string[];
  description: string; // 마크다운 가능
  thumbnail: string;   // /images/projects/...
  images: string[];
  links: ProjectLinks;
  featured: boolean;
}

export interface Paper {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract?: string;
  links: { arxiv?: string; pdf?: string; doi?: string };
}

export interface ResearchItem {
  id: number;
  title: string;
  description: string;
  status: 'ongoing' | 'completed';
  tags: string[];
}

export interface Piece {
  id: number;
  slug: string;
  title?: string;   // optional title
  date: string;     // "2025-03"
  image: string;    // artwork image URL
  prompt: string;   // AI prompt or description
}
