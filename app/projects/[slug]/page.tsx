import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { projects } from '@/data/projects'
import PageTransition from '@/components/PageTransition'

interface Props {
  params: Promise<{ slug: string }>
}

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

  const rows = [
    { label: 'Year', value: String(project.year) },
    ...(project.category.length ? [{ label: 'Category', value: project.category.join(', ') }] : []),
    ...(project.stack.length ? [{ label: 'Stack', value: project.stack.join(', ') }] : []),
  ]

  return (
    <PageTransition>
      <main className="mx-auto min-h-screen max-w-2xl px-6 pt-28 pb-24 sm:pt-32">
        <Link href="/#projects" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          ← Projects
        </Link>

        {/* Cover */}
        <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-card">
          {project.thumbnail ? (
            isVideo(project.thumbnail) ? (
              <video src={project.thumbnail} autoPlay muted loop playsInline className="h-full w-full object-cover" />
            ) : (
              <Image src={project.thumbnail} alt={project.title} fill className="object-cover" priority />
            )
          ) : (
            <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-muted to-card p-8">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {project.category[0] ?? 'Project'}
              </span>
              <span className="mt-2 text-2xl font-semibold tracking-tight">{project.title}</span>
            </div>
          )}
        </div>

        <header className="mt-8">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{project.title}</h1>
          {project.subtitle && <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{project.subtitle}</p>}
        </header>

        <dl className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card px-5 text-[13px] shadow-card">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-6 py-3">
              <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
              <dd className="text-right font-medium">{row.value}</dd>
            </div>
          ))}
          {links.length > 0 && (
            <div className="flex justify-between gap-6 py-3">
              <dt className="shrink-0 text-muted-foreground">Links</dt>
              <dd className="flex flex-wrap justify-end gap-2">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-3 py-0.5 text-[12px] font-medium transition-colors hover:bg-muted"
                  >
                    {l.label}
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>

        {project.description && (
          <div className="mt-10 whitespace-pre-wrap text-[15px] leading-7">{project.description}</div>
        )}

        {/* 화면 캡처 갤러리. 로컬 경로라 next/image가 최적화한다. */}
        {project.images.length > 0 && (
          <section className="mt-14">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Screens</h2>
            <div className="mt-4 space-y-8">
              {project.images.map((img) => (
                <figure key={img.src}>
                  <div className="overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
                    <Image
                      src={img.src}
                      alt={img.caption ?? project.title}
                      width={1280}
                      height={800}
                      sizes="(max-width: 672px) 100vw, 672px"
                      className="h-auto w-full"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="mt-2.5 text-[12px] leading-5 text-muted-foreground">{img.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        <nav className="mt-16 flex justify-between gap-4 border-t border-border pt-8 text-[13px]">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="text-muted-foreground transition-colors hover:text-foreground">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="text-right text-muted-foreground transition-colors hover:text-foreground"
            >
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
    </PageTransition>
  )
}
