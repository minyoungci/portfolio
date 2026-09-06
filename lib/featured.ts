import { projects } from '@/data/projects'
import { posts } from '@/data/posts'
import { pieces } from '@/data/pieces'

export type FeaturedKind = 'Project' | 'Post' | 'Piece'

/** hero "Selected work" 슬라이드. CoverflowSlide와 호환되는 형태에 링크·분류를 더한 것. */
export interface FeaturedSlide {
  src?: string
  media?: 'image' | 'video'
  alt: string
  title: string
  subtitle: string
  year: string
  kind: FeaturedKind
  href: string
}

const isVideo = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src)

/**
 * featured 프로젝트 → cover가 있는 포스트 → featured 피스 순.
 * featured 프로젝트가 하나도 없으면 앞의 프로젝트 3개로 대체해 자리가 비지 않게 한다.
 */
export function getFeaturedSlides(): FeaturedSlide[] {
  const featuredProjects = projects.filter((p) => p.featured)
  const projectSource = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3)

  const fromProjects: FeaturedSlide[] = projectSource.map((p) => ({
    src: p.thumbnail || undefined,
    media: p.thumbnail && isVideo(p.thumbnail) ? 'video' : 'image',
    alt: p.title,
    title: p.title,
    subtitle: p.category[0] ?? 'Project',
    year: String(p.year),
    kind: 'Project',
    href: `/projects/${p.slug}`,
  }))

  const fromPosts: FeaturedSlide[] = posts
    .filter((p) => Boolean(p.cover))
    .map((p) => ({
      src: p.cover,
      media: 'image',
      alt: p.title,
      title: p.title,
      subtitle: p.tags[0] ?? 'Post',
      year: p.date.slice(0, 4),
      kind: 'Post',
      href: `/posts/${p.slug}`,
    }))

  const fromPieces: FeaturedSlide[] = pieces
    .filter((p) => p.featured)
    .map((p) => ({
      src: p.image,
      media: isVideo(p.image) ? 'video' : 'image',
      alt: p.title ?? p.prompt.slice(0, 60),
      title: p.title ?? 'Untitled',
      subtitle: 'Piece',
      year: p.date.slice(0, 4),
      kind: 'Piece',
      href: '/#piece',
    }))

  return [...fromProjects, ...fromPosts, ...fromPieces]
}
