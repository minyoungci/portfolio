export interface ProjectLinks {
  github?: string;
  demo?: string;
  paper?: string;
}

export interface Project {
  id: number;          // 고유 id (admin이 Date.now()로 생성). 화면의 번호는 배열 순서에서 파생한다.
  slug: string;        // URL slug (/projects/[slug])
  title: string;
  subtitle: string;    // 한 줄 설명
  year: number;
  category: string[];  // ['Medical AI', 'Vision', ...]
  stack: string[];
  description: string; // 일반 텍스트. 줄바꿈은 유지되지만 마크다운은 렌더되지 않는다
  thumbnail: string;   // /uploads/... 또는 영상 URL
  images: string[];
  links: ProjectLinks;
  featured: boolean;   // true면 hero "Selected work"에 노출
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
  title?: string | null;
  date: string;        // "2025-03"
  image: string;       // 이미지 또는 영상(mp4/webm/mov) URL
  prompt: string;      // AI prompt or description
  featured?: boolean;  // true면 hero "Selected work"에 노출
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;        // "2026-04-16"
  summary: string;     // one-line preview shown in list
  content: string;     // full body text (plain / newline-separated)
  tags: string[];
  cover?: string;      // 대표 이미지. 있으면 hero "Selected work"에 노출
}

export interface ProfileLink {
  label: string;       // "GitHub"
  handle: string;      // 화면에 보이는 짧은 표기 "minyoungci"
  href: string;
}

export interface Profile {
  name: string;          // "Minyoung KIM"
  nameLines: string[];   // hero 표기 ["Minyoung", "Kim"]
  nameKo?: string;
  tagline: string;       // "Medical AI / Futurist"
  identity: string;      // 한 줄 정체성 (국문)
  identityEn?: string;   // 영문 보조 문장
  affiliation?: string;
  location?: string;
  email: string;
  bio: string[];         // 문단 배열 (국문)
  bioEn?: string[];      // 영문 bio. /about에만 표시
  contactTitle?: string; // Contact 섹션 큰 글자
  contactLine?: string;  // Contact 섹션 한 줄
  links: ProfileLink[];
}

export type TimelineKind = 'career' | 'education' | 'award' | 'scholarship' | 'activity';

export interface TimelineEntry {
  year: string;          // "2024–", "2022–2024"
  title: string;
  org?: string;
  description?: string;
  kind: TimelineKind;
}
