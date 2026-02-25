'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ResearchItem } from '@/types'

interface Props {
  items: ResearchItem[]
}

export default function ResearchSection({ items }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <section id="research" className="py-8 px-6">
      <h2 className="text-base tracking-[0.25em] font-normal uppercase italic mt-0 mb-6 pt-3 border-t border-black flex items-baseline gap-3">
        <span className="opacity-50">03</span>
        <span>Research</span>
      </h2>
      <div className="divide-y divide-black">
        {items.map((item) => (
          <div key={item.id} className="py-6">
            <button
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full text-left group bg-transparent border-0 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[13px] leading-snug group-hover:opacity-60 transition-opacity">
                    {item.title}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[11px] border border-black px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 mt-0.5">
                  <span className={`text-xs ${item.status === 'ongoing' ? 'opacity-100' : 'opacity-30'}`}>
                    {item.status === 'ongoing' ? '● ongoing' : '○ completed'}
                  </span>
                  <span className="text-xs opacity-40">
                    {openId === item.id ? '−' : '+'}
                  </span>
                </div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {openId === item.id && (
                <motion.div
                  key="desc"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="text-sm leading-relaxed mt-4 opacity-70 max-w-2xl">
                    {item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
