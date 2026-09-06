'use client'

import { useEffect, useRef } from 'react'

/**
 * 히어로 뒤의 부드러운 빛. 마우스가 있으면 포인터를 따라가고, 터치 기기나
 * reduced-motion에서는 가운데에 고정된다. 부모는 relative여야 한다.
 */
export default function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let raf = 0
    let x = 50
    let y = 40

    const onMove = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect()
      x = ((event.clientX - rect.left) / rect.width) * 100
      y = ((event.clientY - rect.top) / rect.height) * 100
      if (raf) return
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--gx', `${x}%`)
        el.style.setProperty('--gy', `${y}%`)
        raf = 0
      })
    }

    parent.addEventListener('pointermove', onMove)
    return () => {
      parent.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10" />
}
