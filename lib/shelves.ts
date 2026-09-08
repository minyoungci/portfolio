import type { Paper, Piece, Post, Project } from '@/types'

/** 코버플로우 선반의 슬라이드. CoverflowSlide와 호환되고 링크를 더한 형태. */
export interface ShelfSlide {
  src?: string
  media?: 'image' | 'video'
  alt: string
  title: string
  /** 썸네일이 없을 때 카드 위에 찍히는 짧은 라벨 (카테고리 등). 없으면 subtitle */
  kicker?: string
  subtitle?: string
  meta?: { label: string; value: string }[]
  href?: string
}

const isVideo = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src)

export function projectSlides(projects: Project[]): ShelfSlide[] {
  return projects.map((p) => ({
    src: p.thumbnail || undefined,
    media: p.thumbnail && isVideo(p.thumbnail) ? 'video' : 'image',
    alt: p.title,
    title: p.title,
    kicker: p.category[0] ?? 'Project',
    subtitle: p.subtitle || p.category[0],
    meta: [
      { label: 'Year', value: String(p.year) },
      ...(p.category.length ? [{ label: 'Category', value: p.category.slice(0, 2).join(', ') }] : []),
      ...(p.stack.length ? [{ label: 'Stack', value: p.stack.slice(0, 3).join(', ') }] : []),
    ],
    href: `/projects/${p.slug}`,
  }))
}

export function postSlides(posts: Post[]): ShelfSlide[] {
  return posts.map((p) => ({
    src: p.cover,
    media: 'image',
    alt: p.title,
    title: p.title,
    subtitle: p.tags[0],
    meta: [
      { label: 'Date', value: p.date },
      ...(p.tags.length ? [{ label: 'Tags', value: p.tags.slice(0, 3).join(', ') }] : []),
    ],
    href: `/posts/${p.slug}`,
  }))
}

export function pieceSlides(pieces: Piece[]): ShelfSlide[] {
  return pieces.map((p) => ({
    src: p.image,
    media: isVideo(p.image) ? 'video' : 'image',
    alt: p.title ?? p.prompt.slice(0, 60),
    title: p.title ?? 'Untitled',
    subtitle: isVideo(p.image) ? 'Video' : 'Image',
    meta: [{ label: 'Date', value: p.date }],
  }))
}

const PAPER_ROLE: Record<string, string> = {
  first: '제1저자',
  'co-first': '공동제1저자',
  contributing: '공저자',
}

/** 논문 선반. 썸네일이 없으므로 카드는 기여 배지 + 제목의 타이포 카드로 나온다. */
export function paperSlides(papers: Paper[]): ShelfSlide[] {
  return papers.map((p) => {
    const underReview = p.status === 'under-review'
    return {
      src: p.thumbnail || undefined,
      media: 'image' as const,
      alt: `${p.title} 첫 면`,
      title: p.title,
      kicker: p.role ? PAPER_ROLE[p.role] ?? p.journal : p.journal,
      subtitle: p.titleKo ?? p.journal,
      meta: [
        { label: underReview ? 'Submitted' : 'Journal', value: p.journal },
        { label: 'Year', value: String(p.year) },
        ...(p.role ? [{ label: 'Role', value: PAPER_ROLE[p.role] ?? p.role }] : []),
      ],
      href: `/papers/${p.slug}`,
    }
  })
}
