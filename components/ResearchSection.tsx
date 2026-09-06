'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ResearchItem } from '@/types'

interface Props {
  items: ResearchItem[]
}

export default function ResearchSection({ items }: Props) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (items.length === 0) return null

  return (
    <section id="research" className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Research</h2>

      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
        {items.map((item) => {
          const open = openId === item.id
          return (
            <div key={item.id} className="px-5 py-4 sm:px-6">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : item.id)}
                className="group flex w-full cursor-pointer items-start justify-between gap-4 border-0 bg-transparent p-0 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold tracking-tight">{item.title}</p>
                  {item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={`text-[11px] font-medium ${item.status === 'ongoing' ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.status === 'ongoing' ? '● ongoing' : '○ completed'}
                  </span>
                  <span className="text-muted-foreground" aria-hidden="true">{open ? '−' : '+'}</span>
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
                    <p className="mt-4 text-[13px] leading-6 text-muted-foreground">{item.description}</p>
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
