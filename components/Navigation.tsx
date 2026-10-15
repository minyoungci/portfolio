'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const shownActive = isHome ? activeId : null

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

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
    <header className="site-navigation">
      <div className="nav-shell">
        <Link
          href="/"
          aria-label={`${profile.name} — Home`}
          className="nav-brand"
          onClick={() => setMenuOpen(false)}
        >
          <span aria-hidden="true">mk<span className="text-accent">.</span></span>
        </Link>
        <button ref={menuButton} type="button" className="nav-menu-button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'} <span aria-hidden="true">{menuOpen ? '−' : '+'}</span></button>
        <nav id="primary-navigation" aria-label="Primary" className={cn('nav-links scrollbar-none', menuOpen && 'is-open')}>
        {sections.map(({ id, label }) => (
          <Link
            key={id}
            href={`/#${id}`}
            aria-current={shownActive === id ? 'location' : undefined}
            onClick={() => setMenuOpen(false)}
            className={cn(
              'nav-link',
              shownActive === id && 'is-active',
            )}
          >
            {label}
          </Link>
        ))}
        </nav>
      </div>
    </header>
  )
}
