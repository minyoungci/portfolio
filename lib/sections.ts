import { projects } from '@/data/projects'
import { posts } from '@/data/posts'
import { pieces } from '@/data/pieces'
import { papers } from '@/data/papers'
import { researchItems } from '@/data/research'

export interface HomeSection {
  id: string
  label: string
  number: string // "01", "02" — 보이는 순서에서 파생
}

/** 홈 섹션의 정본 순서. 비어 있는 섹션은 숨기고 번호를 다시 매긴다. nav와 페이지가 같은 목록을 쓴다. */
const ORDER: { id: string; label: string; visible: () => boolean }[] = [
  { id: 'about', label: 'About', visible: () => true },
  { id: 'projects', label: 'Projects', visible: () => projects.length > 0 },
  { id: 'post', label: 'Post', visible: () => posts.length > 0 },
  { id: 'piece', label: 'Piece', visible: () => pieces.length > 0 },
  { id: 'research', label: 'Research', visible: () => researchItems.length > 0 },
  { id: 'papers', label: 'Papers', visible: () => papers.length > 0 },
  { id: 'contact', label: 'Contact', visible: () => true },
]

export function getHomeSections(): HomeSection[] {
  return ORDER.filter((s) => s.visible()).map((s, i) => ({
    id: s.id,
    label: s.label,
    number: String(i + 1).padStart(2, '0'),
  }))
}
