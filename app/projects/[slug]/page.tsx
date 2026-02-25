import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { projects } from '@/data/projects'
import PageTransition from '@/components/PageTransition'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const prev = projects[currentIndex - 1] ?? null
  const next = projects[currentIndex + 1] ?? null

  return (
    <PageTransition>
      <main className="min-h-screen px-8 pt-32 pb-24 max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <span className="font-mono text-xs text-black/40">
            {String(project.id).padStart(2, '0')} — {project.year}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl mt-2">{project.title}</h1>
          <p className="font-sans text-base text-black/60 mt-3">{project.subtitle}</p>
        </header>

        {/* Thumbnail */}
        {project.thumbnail && (
          <div className="relative w-full aspect-video mb-12 overflow-hidden bg-gray">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Stack */}
        <div className="flex flex-wrap gap-2 mb-10">
          {project.stack.map((s) => (
            <span key={s} className="font-mono text-xs border border-black px-2 py-1">
              {s}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="font-sans text-base leading-relaxed whitespace-pre-wrap mb-16">
          {project.description}
        </div>

        {/* Links */}
        <div className="flex gap-8 mb-20 font-mono text-xs uppercase tracking-widest">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-40 transition-opacity duration-200"
            >
              GitHub ↗
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-40 transition-opacity duration-200"
            >
              Demo ↗
            </a>
          )}
          {project.links.paper && (
            <a
              href={project.links.paper}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-40 transition-opacity duration-200"
            >
              Paper ↗
            </a>
          )}
        </div>

        {/* Prev / Next */}
        <nav className="flex justify-between border-t border-black pt-8 font-mono text-xs">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="hover:opacity-40 transition-opacity duration-200"
            >
              ← {String(prev.id).padStart(2, '0')} {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="hover:opacity-40 transition-opacity duration-200"
            >
              {String(next.id).padStart(2, '0')} {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
    </PageTransition>
  )
}
