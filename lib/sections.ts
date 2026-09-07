import { projects } from '@/data/projects'
import { posts } from '@/data/posts'
import { pieces } from '@/data/pieces'
import { papers } from '@/data/papers'
import { awards } from '@/data/awards'
import { researchItems } from '@/data/research'

export interface HomeSection {
  id: string
  label: string
}

/** 홈 섹션의 정본 순서. 비어 있는 섹션은 숨긴다. nav와 페이지(app/page.tsx)가 같은 목록을 쓴다. */
const ORDER: { id: string; label: string; visible: () => boolean }[] = [
  { id: 'projects', label: 'Projects', visible: () => projects.length > 0 },
  { id: 'post', label: 'Post', visible: () => posts.length > 0 },
  { id: 'piece', label: 'Piece', visible: () => pieces.length > 0 },
  { id: 'research', label: 'Research', visible: () => researchItems.length > 0 },
  { id: 'publications', label: 'Publications', visible: () => papers.length > 0 || awards.length > 0 },
  { id: 'about', label: 'About', visible: () => true },
  { id: 'contact', label: 'Contact', visible: () => true },
]

export function getHomeSections(): HomeSection[] {
  return ORDER.filter((s) => s.visible()).map(({ id, label }) => ({ id, label }))
}
