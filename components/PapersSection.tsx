'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Paper } from '@/types'
import SectionHeading from '@/components/SectionHeading'

interface Props {
  papers: Paper[]
  number: string
}

const LINKS: { key: keyof Paper['links']; label: string }[] = [
  { key: 'arxiv', label: 'arXiv' },
  { key: 'pdf', label: 'PDF' },
  { key: 'doi', label: 'DOI' },
]

export default function PapersSection({ papers, number }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (papers.length === 0) return null

  return (
    <section id="papers" className="px-4 py-8 sm:px-6">
      <SectionHeading number={number} title="Papers" />

      <div className="max-w-3xl divide-y divide-black/10 border-b border-black/10">
        {papers.map((paper, index) => {
          const open = openId === paper.id
          return (
            <div key={paper.id} className="py-5">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : paper.id)}
                className="group w-full cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                <div className="flex items-baseline gap-4">
                  <span className="w-8 shrink-0 tabular-nums text-[12px] text-black/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] italic leading-snug transition-colors group-hover:text-black/60">
                      {paper.title}
                    </p>
                    <p className="mt-1 text-[12px] text-black/60">
                      {paper.authors} · {paper.journal}, {paper.year}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-black/60" aria-hidden="true">
                    {open ? '−' : '+'}
                  </span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="abstract"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pl-12">
                      {paper.abstract && (
                        <p className="mt-4 max-w-2xl text-[13px] leading-6 text-black/80">{paper.abstract}</p>
                      )}
                      <div className="mt-3 flex gap-5">
                        {LINKS.map(({ key, label }) => {
                          const href = paper.links[key]
                          if (!href) return null
                          return (
                            <a
                              key={key}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] uppercase tracking-[0.16em] underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black"
                            >
                              {label} ↗
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
