'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { HomeSection } from '@/lib/sections'
import { profile } from '@/data/profile'
import { cn } from '@/lib/utils'

interface NavigationProps {
  sections: HomeSection[]
}

/** 화면 상단에 떠 있는 알약형 내비게이션. 홈에서는 보고 있는 섹션이 강조된다. */
export default function Navigation({ sections }: NavigationProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [activeId, setActiveId] = useState<string | null>(null)
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
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3">
      <nav
        aria-label="Primary"
        className="scrollbar-none pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-background/70 p-1.5 shadow-card backdrop-blur-md"
      >
        <Link
          href="/"
          className="hidden shrink-0 rounded-full px-3 py-1.5 text-[13px] font-semibold tracking-tight transition-colors hover:bg-muted sm:block"
        >
          {profile.name}
        </Link>
        {sections.map(({ id, label }) => (
          <Link
            key={id}
            href={`/#${id}`}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
              shownActive === id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
