import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { papers } from '@/data/papers'
import type { AuthorRole, Paper } from '@/types'
import PageTransition from '@/components/PageTransition'

export function generateStaticParams() {
  return papers.map((p) => ({ slug: p.slug }))
}

const ROLE_LABEL: Record<AuthorRole, string> = {
  first: '제1저자',
  'co-first': '공동제1저자',
  contributing: '공저자',
}

const STATUS_LABEL: Record<string, string> = {
  published: '게재',
  preprint: '프리프린트',
  'under-review': '심사 중',
}

const LINKS: { key: keyof Paper['links']; label: string }[] = [
  { key: 'doi', label: 'DOI' },
  { key: 'arxiv', label: 'arXiv' },
  { key: 'pdf', label: 'PDF' },
]

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const paper = papers.find((p) => p.slug === slug)
  if (!paper) return {}
  return {
    title: paper.title,
    description: paper.abstract ?? `${paper.journal}, ${paper.year}`,
  }
}

export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const index = papers.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  const paper = papers[index]
  const prev = papers[index - 1]
  const next = papers[index + 1]
  const status = paper.status ?? 'published'
  const lead = paper.role === 'first' || paper.role === 'co-first'

  return (
    <PageTransition>
      <main className="mx-auto max-w-2xl px-6 pt-28 pb-24 sm:pt-36">
        <Link href="/#publications" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          ← Publications &amp; Awards
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {paper.role && (
            <span
              className={
                lead
                  ? 'rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium text-background'
                  : 'rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground'
              }
            >
              {ROLE_LABEL[paper.role]}
            </span>
          )}
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {STATUS_LABEL[status] ?? status}
          </span>
        </div>

        <h1 className="mt-4 text-[clamp(1.5rem,4vw,2.1rem)] font-semibold leading-tight tracking-tight">
          {paper.title}
        </h1>
        {paper.titleKo && <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{paper.titleKo}</p>}

        <dl className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card px-5 shadow-card sm:px-6">
          <div className="flex gap-4 py-3.5 text-[13px]">
            <dt className="w-24 shrink-0 text-muted-foreground">
              {status === 'under-review' ? '투고처' : '학술지'}
            </dt>
            <dd className="min-w-0 flex-1 font-medium">{paper.journal}</dd>
          </div>
          <div className="flex gap-4 py-3.5 text-[13px]">
            <dt className="w-24 shrink-0 text-muted-foreground">연도</dt>
            <dd className="min-w-0 flex-1 font-medium tabular-nums">{paper.year}</dd>
          </div>
          {paper.note && (
            <div className="flex gap-4 py-3.5 text-[13px]">
              <dt className="w-24 shrink-0 text-muted-foreground">서지</dt>
              <dd className="min-w-0 flex-1">{paper.note}</dd>
            </div>
          )}
          {paper.authors && (
            <div className="flex gap-4 py-3.5 text-[13px]">
              <dt className="w-24 shrink-0 text-muted-foreground">저자</dt>
              <dd className="min-w-0 flex-1 leading-6">{paper.authors}</dd>
            </div>
          )}
        </dl>

        {paper.abstract && (
          <section className="mt-10">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {status === 'under-review' ? 'Summary' : 'Key findings'}
            </h2>
            <p className="mt-3 text-[15px] leading-7">{paper.abstract}</p>
          </section>
        )}

        {LINKS.some(({ key }) => paper.links[key]) && (
          <div className="mt-10 flex flex-wrap gap-2">
            {LINKS.map(({ key, label }) => {
              const href = paper.links[key]
              if (!href) return null
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium shadow-card transition-colors hover:bg-muted"
                >
                  {label}
                </a>
              )
            })}
          </div>
        )}

        <nav className="mt-16 flex justify-between gap-4 border-t border-border pt-8 text-[13px]">
          {prev ? (
            <Link href={`/papers/${prev.slug}`} className="text-muted-foreground transition-colors hover:text-foreground">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/papers/${next.slug}`}
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
