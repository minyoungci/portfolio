'use client'

import { useCallback, useEffect, useState } from 'react'

const NAME_LETTERS = ['M', 'I', 'N', 'Y', 'O', 'U', 'N', 'G', 'K', 'I', 'M']

const SECTIONS = [
  { label: 'Projects', id: 'projects' },
  { label: 'Papers',   id: 'papers' },
  { label: 'Research', id: 'research' },
  { label: 'Piece',    id: 'piece' },
  { label: 'Contact',  id: 'contact' },
]

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>('projects')

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Row 1: Name letters spread across full width */}
      <div className="flex justify-between px-4 py-2 border-b border-black">
        {NAME_LETTERS.map((letter, i) => (
          <span key={i} className="text-base sm:text-2xl font-bold">
            {letter}
          </span>
        ))}
      </div>
      {/* Row 2: Section anchor links */}
      <nav className="flex justify-between px-4 py-2 border-b border-black">
        {SECTIONS.map(({ label, id }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`text-sm sm:text-2xl transition-all duration-200 bg-transparent border-0 cursor-pointer ${
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
