'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * `[data-reveal]` 요소가 뷰포트에 들어오면 `is-visible`을 붙인다 (globals.css의 .reveal 규칙).
 * JS가 없으면 `html.js`가 없어 아무것도 숨기지 않으므로 서버 HTML은 항상 보인다.
 */
export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.classList.add('js')
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (targets.length === 0) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
