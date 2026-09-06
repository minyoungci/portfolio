'use client'

import { useState } from 'react'
import type { Paper } from '@/types'
import Collapse from '@/components/Collapse'

interface Props {
  papers: Paper[]
}

const LINKS: { key: keyof Paper['links']; label: string }[] = [
  { key: 'arxiv', label: 'arXiv' },
  { key: 'pdf', label: 'PDF' },
  { key: 'doi', label: 'DOI' },
]

export default function PapersSection({ papers }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (papers.length === 0) return null

  return (
    <section id="papers" data-reveal className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Papers</h2>

      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
        {papers.map((paper) => {
          const open = openId === paper.id
          return (
            <div key={paper.id} className="px-5 py-4 sm:px-6">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : paper.id)}
                className="group flex w-full cursor-pointer items-start justify-between gap-4 rounded-lg border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold tracking-tight">{paper.title}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    {paper.authors} · {paper.journal}, {paper.year}
                  </p>
                </div>
                <span className="shrink-0 text-muted-foreground" aria-hidden="true">{open ? '−' : '+'}</span>
              </button>

              <Collapse open={open}>
                {paper.abstract && (
                  <p className="mt-4 text-[13px] leading-6 text-muted-foreground">{paper.abstract}</p>
                )}
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
            </div>
          )
        })}
      </div>
    </section>
  )
}
