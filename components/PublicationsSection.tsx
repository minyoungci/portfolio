'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Award, Paper } from '@/types'
import { paperSlides } from '@/lib/shelves'
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel'

interface Props {
  papers: Paper[]
  awards: Award[]
}

export default function PublicationsSection({ papers, awards }: Props) {
  const router = useRouter()

  if (papers.length === 0 && awards.length === 0) return null

  const published = papers.filter((p) => (p.status ?? 'published') !== 'under-review')
  const underReview = papers.filter((p) => p.status === 'under-review')
  // 게재분 안에서만 센다. 심사 중 원고까지 합치면 "제1저자 N편"이 게재 실적처럼 읽힌다.
  const lead = published.filter((p) => p.role === 'first' || p.role === 'co-first').length

  const counts = [
    published.length > 0 &&
      (lead > 0 ? `게재 ${published.length}편 (제1·공동제1저자 ${lead}편)` : `게재 ${published.length}편`),
    underReview.length > 0 && `심사 중 ${underReview.length}편`,
    awards.length > 0 && `수상 ${awards.length}건`,
  ].filter((v): v is string => Boolean(v))

  const slides = paperSlides(papers)

  return (
    <section id="publications" data-reveal className="py-10 sm:py-14">
      <header className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Publications &amp; Awards</h2>
        {counts.length > 0 && (
          <p className="mt-2 text-[13px] tabular-nums text-muted-foreground">{counts.join(' · ')}</p>
        )}
      </header>

      {awards.length > 0 && (
        <div className="mx-auto mt-10 max-w-3xl px-6">
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
      )}

      {slides.length > 0 && (
        <>
          <p className="mx-auto mt-12 max-w-2xl px-6 text-center text-[13px] text-muted-foreground">
            논문. 카드를 누르면 연구 설명으로 이동합니다.
          </p>

          {slides.length >= 3 ? (
            <div className="mx-auto mt-2 max-w-7xl overflow-hidden">
              <CoverflowCarousel
                slides={slides}
                cardWidth="clamp(220px, 40vw, 480px)"
                cardClassName="ring-1 ring-border ring-inset"
                showCaption
                showPagination
                showNavigation
                autoAdvance={6000}
                label="Publications"
                onActivate={(index) => {
                  const href = slides[index]?.href
                  if (href) router.push(href)
                }}
              />
            </div>
          ) : (
            /* 3편 미만이면 코버플로우가 한쪽으로 쏠린다. 같은 정보를 목록으로 낸다. */
            <ul className="mx-auto mt-4 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card px-5 shadow-card sm:px-6">
              {papers.map((paper) => (
                <li key={paper.id} className="py-4">
                  <Link href={`/papers/${paper.slug}`} className="block">
                    <p className="text-[15px] font-semibold leading-snug tracking-tight">{paper.title}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">
                      {paper.journal} · {paper.year}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
