'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

const NAME_LETTERS = ['M', 'I', 'N', 'Y', 'O', 'U', 'N', 'G', 'K', 'I', 'M']

const SECTIONS = [
  { label: 'Projects', id: 'projects', mobileId: 'mobile-projects' },
  { label: 'Papers',   id: 'papers', mobileId: 'mobile-papers' },
  { label: 'Research', id: 'research', mobileId: 'mobile-research' },
  { label: 'Piece',    id: 'piece', mobileId: 'mobile-piece' },
  { label: 'Post',     id: 'post', mobileId: 'mobile-post' },
  { label: 'Contact',  id: 'contact', mobileId: 'mobile-contact' },
]

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>('projects')

  const scrollTo = useCallback((id: string) => {
    const section = SECTIONS.find((item) => item.id === id)
    const targetId = window.matchMedia('(max-width: 767px)').matches
      ? section?.mobileId ?? id
      : id
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id, mobileId }) => {
      const elements = [document.getElementById(id), document.getElementById(mobileId)].filter(
        (el): el is HTMLElement => Boolean(el)
      )

      elements.forEach((el) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveSection(id)
          },
          { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
        )
        observer.observe(el)
        observers.push(observer)
      })
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Row 1: Name letters spread across full width */}
      <Link href="/" className="flex justify-center gap-1.5 px-4 py-2 border-b border-black hover:opacity-60 transition-opacity duration-200 sm:gap-3 sm:py-2">
        {NAME_LETTERS.map((letter, i) => (
          <span key={i} className="text-[13px] font-bold leading-none sm:text-2xl">
            {letter}
          </span>
        ))}
      </Link>
      {/* Row 2: Section anchor links */}
      <nav className="mobile-scrollbar-hidden flex gap-5 overflow-x-auto whitespace-nowrap border-b border-black px-4 py-2 sm:justify-between sm:gap-0">
        {SECTIONS.map(({ label, id }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`shrink-0 bg-transparent border-0 cursor-pointer text-[11px] uppercase tracking-[0.14em] transition-all duration-200 sm:text-2xl sm:normal-case sm:tracking-normal ${
              activeSection === id ? 'italic' : 'not-italic opacity-60 hover:opacity-100'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  )
}
