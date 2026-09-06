import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { projects } from '@/data/projects'
import PageTransition from '@/components/PageTransition'

interface Props {
  params: Promise<{ slug: string }>
}

const pad = (index: number) => String(index + 1).padStart(2, '0')
const isVideo = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src)

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return { title: project.title, description: project.subtitle }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const project = projects[currentIndex]
  if (!project) notFound()

  const prev = projects[currentIndex - 1] ?? null
  const next = projects[currentIndex + 1] ?? null

  const links = [
    { label: 'GitHub', href: project.links.github },
    { label: 'Demo', href: project.links.demo },
    { label: 'Paper', href: project.links.paper },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href))

  return (
    <PageTransition>
      <main className="min-h-screen px-4 pt-16 pb-24 sm:px-6">
        <div className="max-w-3xl">
          <Link
            href="/#projects"
            className="text-[11px] uppercase tracking-[0.22em] text-black/60 transition-colors hover:text-black"
          >
            ← Back to projects
          </Link>

          {/* Header */}
          <header className="mt-12 mb-12">
            <p className="text-[11px] uppercase tracking-[0.18em] text-black/60">
              <span className="tabular-nums">{pad(currentIndex)}</span>
              {' · '}
              {project.category.length > 0 ? project.category.join(', ') : 'Project'}
              {' · '}
              <span className="tabular-nums">{project.year}</span>
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[0.95] tracking-[-0.02em]">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-black/60 sm:text-[17px]">
                {project.subtitle}
              </p>
            )}
          </header>

          {/* Thumbnail */}
          {project.thumbnail && (
            <div className="relative mb-12 aspect-video w-full overflow-hidden bg-gray">
              {isVideo(project.thumbnail) ? (
                <video
                  src={project.thumbnail}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
              )}
            </div>
          )}

          {/* Stack */}
          {project.stack.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="border border-black px-2 py-1 text-[11px] tracking-[0.06em]">
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div className="mb-16 max-w-2xl whitespace-pre-wrap text-[15px] leading-7">
              {project.description}
            </div>
          )}

          {/* Links */}
          {links.length > 0 && (
            <div className="mb-20 flex gap-8 text-[11px] uppercase tracking-[0.18em]">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-60"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}

          {/* Prev / Next */}
          <nav className="flex justify-between gap-6 border-t border-black pt-8 text-[11px] uppercase tracking-[0.18em]">
            {prev ? (
              <Link href={`/projects/${prev.slug}`} className="transition-opacity hover:opacity-60">
                ← {pad(currentIndex - 1)} {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/projects/${next.slug}`} className="text-right transition-opacity hover:opacity-60">
                {pad(currentIndex + 1)} {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </main>
    </PageTransition>
  )
}
