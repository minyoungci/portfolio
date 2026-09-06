'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ResearchItem } from '@/types'
import SectionHeading from '@/components/SectionHeading'

interface Props {
  items: ResearchItem[]
  number: string
}

export default function ResearchSection({ items, number }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (items.length === 0) return null

  return (
    <section id="research" className="px-4 py-8 sm:px-6">
      <SectionHeading number={number} title="Research" />

      <div className="max-w-3xl divide-y divide-black/10 border-b border-black/10">
        {items.map((item, index) => {
          const open = openId === item.id
          return (
            <div key={item.id} className="py-5">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : item.id)}
                className="group w-full cursor-pointer border-0 bg-transparent p-0 text-left"
              >
                <div className="flex items-baseline gap-4">
                  <span className="w-8 shrink-0 tabular-nums text-[12px] text-black/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] italic leading-snug transition-colors group-hover:text-black/60">
                      {item.title}
                    </p>
                    {item.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="border border-black px-2 py-0.5 text-[11px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-baseline gap-4">
                    <span className={`text-[11px] uppercase tracking-[0.16em] ${item.status === 'ongoing' ? 'text-black' : 'text-black/60'}`}>
                      {item.status === 'ongoing' ? '● ongoing' : '○ completed'}
                    </span>
                    <span className="text-sm text-black/60" aria-hidden="true">
                      {open ? '−' : '+'}
                    </span>
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="desc"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 max-w-2xl pl-12 text-[13px] leading-6 text-black/80">{item.description}</p>
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
