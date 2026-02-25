'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Paper } from '@/types'

interface Props {
  papers: Paper[]
}

export default function PapersSection({ papers }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <section id="papers" className="py-8 px-6">
      <h2 className="text-base tracking-[0.25em] font-normal uppercase italic mt-0 mb-6 pt-3 border-t border-black flex items-baseline gap-3">
        <span className="opacity-50">02</span>
        <span>Papers</span>
      </h2>
      <div className="divide-y divide-black">
        {papers.map((paper) => (
          <div key={paper.id} className="py-6">
            <button
              onClick={() => setOpenId(openId === paper.id ? null : paper.id)}
              className="w-full text-left group bg-transparent border-0 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] italic leading-snug group-hover:opacity-60 transition-opacity">
                    {paper.title}
                  </p>
                  <p className="text-[11px] mt-1 opacity-50">
                    {paper.authors} — {paper.journal}, {paper.year}
                  </p>
                </div>
                <span className="text-xs opacity-40 shrink-0 mt-0.5">
                  {openId === paper.id ? '−' : '+'}
                </span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {openId === paper.id && (
                <motion.div
                  key="abstract"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="text-sm leading-relaxed mt-4 opacity-70 max-w-2xl">
                    {paper.abstract}
                  </p>
                  <div className="flex gap-4 mt-3">
                    {paper.links.arxiv && (
                      <a
                        href={paper.links.arxiv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline opacity-50 hover:opacity-100 transition-opacity"
                      >
                        arXiv ↗
                      </a>
                    )}
                    {paper.links.pdf && (
                      <a
                        href={paper.links.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline opacity-50 hover:opacity-100 transition-opacity"
                      >
                        PDF ↗
                      </a>
                    )}
                    {paper.links.doi && (
                      <a
                        href={paper.links.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline opacity-50 hover:opacity-100 transition-opacity"
                      >
                        DOI ↗
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
