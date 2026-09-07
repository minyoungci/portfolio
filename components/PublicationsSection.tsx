'use client'

import { useState } from 'react'
import type { Award, AuthorRole, Paper } from '@/types'
import Collapse from '@/components/Collapse'

interface Props {
  papers: Paper[]
  awards: Award[]
}

const LINKS: { key: keyof Paper['links']; label: string }[] = [
  { key: 'doi', label: 'DOI' },
  { key: 'arxiv', label: 'arXiv' },
  { key: 'pdf', label: 'PDF' },
]

const ROLE_LABEL: Record<AuthorRole, string> = {
  first: '제1저자',
  'co-first': '공동제1저자',
  contributing: '공저자',
}

/** 기여 배지. 제1·공동제1저자만 강조하고 나머지는 조용히 둔다. */
function RoleBadge({ role }: { role?: AuthorRole }) {
  if (!role) return null
  const lead = role === 'first' || role === 'co-first'
  return (
    <span
      className={
        lead
          ? 'shrink-0 rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium text-background'
          : 'shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground'
      }
    >
      {ROLE_LABEL[role]}
    </span>
  )
}

/** 펼치면 핵심 결과와 링크가 나오는 논문 한 줄. 한 번에 하나만 열린다. */
function PaperRow({ paper, open, onToggle }: { paper: Paper; open: boolean; onToggle: () => void }) {
  const expandable = Boolean(paper.abstract) || LINKS.some(({ key }) => paper.links[key])

  return (
    <div className="px-5 py-4 sm:px-6">
      <button
        type="button"
        aria-expanded={expandable ? open : undefined}
        disabled={!expandable}
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-4 rounded-lg border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring enabled:cursor-pointer"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role={paper.role} />
            <p className="text-[15px] font-semibold leading-snug tracking-tight">{paper.title}</p>
          </div>
          {paper.titleKo && <p className="mt-1 text-[13px] text-muted-foreground">{paper.titleKo}</p>}
          <p className="mt-1.5 text-[12px] text-muted-foreground">
            {paper.authors && <span>{paper.authors} · </span>}
            <span className="font-medium text-foreground/70">{paper.journal}</span>
            {paper.note && <span> · {paper.note}</span>}
          </p>
        </div>
        {expandable && (
          <span className="shrink-0 text-muted-foreground" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        )}
      </button>

      {expandable && (
        <Collapse open={open}>
          {paper.abstract && <p className="mt-4 text-[13px] leading-6 text-muted-foreground">{paper.abstract}</p>}
          <div className="mt-3 flex flex-wrap gap-2 pb-1">
            {LINKS.map(({ key, label }) => {
              const href = paper.links[key]
              if (!href) return null
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={open ? 0 : -1}
                  className="rounded-full border border-border px-3 py-1 text-[12px] font-medium transition-colors hover:bg-muted"
                >
                  {label}
                </a>
              )
            })}
          </div>
        </Collapse>
      )}
    </div>
  )
}

export default function PublicationsSection({ papers, awards }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (papers.length === 0 && awards.length === 0) return null

  const published = papers.filter((p) => (p.status ?? 'published') !== 'under-review')
  const underReview = papers.filter((p) => p.status === 'under-review')
  // 게재분 안에서만 센다. 심사 중 원고까지 합치면 "제1저자 N편"이 게재 실적처럼 읽힌다.
  const lead = published.filter((p) => p.role === 'first' || p.role === 'co-first').length

  const counts = [
    published.length > 0 && (lead > 0 ? `게재 ${published.length}편 (제1·공동제1저자 ${lead}편)` : `게재 ${published.length}편`),
    underReview.length > 0 && `심사 중 ${underReview.length}편`,
    awards.length > 0 && `수상 ${awards.length}건`,
  ].filter((v): v is string => Boolean(v))

  return (
    <section id="publications" data-reveal className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Publications &amp; Awards</h2>
      {counts.length > 0 && (
        <p className="mt-3 text-center text-[13px] tabular-nums text-muted-foreground">{counts.join(' · ')}</p>
      )}

      {awards.length > 0 && (
        <>
          <h3 className="mt-12 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Awards</h3>
          <div className="mt-4 space-y-4">
            {awards.map((award) => (
              <article key={award.id} className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium text-background">
                    {award.prize}
                  </span>
                  <span className="text-[12px] tabular-nums text-muted-foreground">{award.year}</span>
                </div>

                <p className="mt-3 text-[15px] font-semibold leading-snug tracking-tight">{award.title}</p>
                {award.titleEn && <p className="mt-1 text-[13px] text-muted-foreground">{award.titleEn}</p>}

                <dl className="mt-5 space-y-2 text-[12px] sm:text-[13px]">
                  <div className="flex gap-3">
                    <dt className="w-20 shrink-0 text-muted-foreground">대회</dt>
                    <dd className="min-w-0 flex-1">{award.event}</dd>
                  </div>
                  {award.organizer && (
                    <div className="flex gap-3">
                      <dt className="w-20 shrink-0 text-muted-foreground">주최·주관</dt>
                      <dd className="min-w-0 flex-1">{award.organizer}</dd>
                    </div>
                  )}
                  {award.team && (
                    <div className="flex gap-3">
                      <dt className="w-20 shrink-0 text-muted-foreground">팀</dt>
                      <dd className="min-w-0 flex-1">{award.team}</dd>
                    </div>
                  )}
                  {award.role && (
                    <div className="flex gap-3">
                      <dt className="w-20 shrink-0 text-muted-foreground">역할</dt>
                      <dd className="min-w-0 flex-1">{award.role}</dd>
                    </div>
                  )}
                </dl>

                {award.description && (
                  <p className="mt-5 text-[13px] leading-6 text-muted-foreground">{award.description}</p>
                )}

                {award.metrics && award.metrics.length > 0 && (
                  <div className="mt-5 grid gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-2">
                    {award.metrics.map((m) => (
                      <div key={m.label} className="bg-card p-4">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{m.label}</p>
                        <p className="mt-1 text-[20px] font-semibold tabular-nums tracking-tight">{m.value}</p>
                        {m.note && <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">{m.note}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}

      {published.length > 0 && (
        <>
          <h3 className="mt-12 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Published
          </h3>
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
            {published.map((paper) => (
              <PaperRow
                key={paper.id}
                paper={paper}
                open={openId === paper.id}
                onToggle={() => setOpenId(openId === paper.id ? null : paper.id)}
              />
            ))}
          </div>
        </>
      )}

      {underReview.length > 0 && (
        <>
          <h3 className="mt-12 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Under review
          </h3>
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
            {underReview.map((paper) => (
              <PaperRow
                key={paper.id}
                paper={paper}
                open={openId === paper.id}
                onToggle={() => setOpenId(openId === paper.id ? null : paper.id)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
