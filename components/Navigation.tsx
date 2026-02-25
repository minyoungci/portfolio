'use client'

import { useCallback } from 'react'

const NAME_LETTERS = ['M', 'I', 'N', 'Y', 'O', 'U', 'N', 'G', 'K', 'I', 'M']

const SECTIONS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Papers',   href: '#papers' },
  { label: 'Research', href: '#research' },
  { label: 'Piece',    href: '#piece' },
  { label: 'Contact',  href: '#contact' },
]

export default function Navigation() {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <header>
      {/* Row 1: Name letters spread across full width */}
      <div className="flex justify-between px-4 py-2 border-b border-black">
        {NAME_LETTERS.map((letter, i) => (
          <span key={i} className="text-sm font-bold">
            {letter}
          </span>
        ))}
      </div>
      {/* Row 2: Section anchor links */}
      <nav className="flex justify-between px-4 py-2 border-b border-black">
        {SECTIONS.map(({ label, href }) => (
          <button
            key={href}
            onClick={() => scrollTo(href.replace('#', ''))}
            className="text-sm opacity-40 hover:opacity-100 transition-opacity duration-200 bg-transparent border-0 cursor-pointer"
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  )
}
