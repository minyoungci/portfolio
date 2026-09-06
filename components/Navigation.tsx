'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { HomeSection } from '@/lib/sections'
import { profile } from '@/data/profile'

// 워드마크는 profile.name에서 파생 ("Minyoung KIM" → M I N Y O U N G K I M)
const NAME_LETTERS = profile.name.replace(/\s+/g, '').toUpperCase().split('')

interface NavigationProps {
  sections: HomeSection[]
}

export default function Navigation({ sections }: NavigationProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [activeId, setActiveId] = useState<string | null>(null)
  // 홈 밖에서는 활성 표시를 하지 않는다 (상태를 지우는 대신 파생값으로 처리).
  const shownActive = isHome ? activeId : null

  useEffect(() => {
    if (!isHome) return

    const options: IntersectionObserverInit = { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    const observers: IntersectionObserver[] = []

    const hero = document.getElementById('hero')
    if (hero) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveId(null)
      }, options)
      observer.observe(hero)
      observers.push(observer)
    }

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveId(id)
      }, options)
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [isHome, sections])

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Row 1: name letters spread across the width */}
      <Link
        href="/"
        aria-label="Home"
        className="flex justify-center gap-1.5 border-b border-black px-4 py-2.5 transition-opacity hover:opacity-60 sm:gap-2.5"
      >
        {NAME_LETTERS.map((letter, i) => (
          <span key={i} className="text-[12px] font-bold leading-none sm:text-[14px]">
            {letter}
          </span>
        ))}
      </Link>

      {/* Row 2: section anchors. Wraps instead of clipping on narrow screens. */}
      <nav
        aria-label="Sections"
        className="flex flex-wrap gap-x-5 gap-y-1 border-b border-black px-4 py-2 sm:justify-between sm:px-6"
      >
        {sections.map(({ id, label }) => (
          <Link
            key={id}
            href={`/#${id}`}
            className={`text-[11px] uppercase tracking-[0.18em] transition-colors sm:text-[12px] ${
              shownActive === id ? 'italic text-black' : 'text-black/60 hover:text-black'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
