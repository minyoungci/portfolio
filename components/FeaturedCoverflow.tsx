'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel'
import type { FeaturedSlide } from '@/lib/featured'

interface FeaturedCoverflowProps {
  slides: FeaturedSlide[]
}

/** hero의 코버플로우. 캡션은 컴포넌트 기본 캡션 대신 사이트 타이포로 직접 그린다. */
export default function FeaturedCoverflow({ slides }: FeaturedCoverflowProps) {
  const router = useRouter()
  const [active, setActive] = useState(0)
  const current = slides[active]

  return (
    <div>
      <CoverflowCarousel
        slides={slides}
        cardClassName="rounded-none border border-black/10 bg-gray shadow-none"
        cardWidth="clamp(160px, 24vw, 320px)"
        rotate={40}
        depth={0.5}
        fade={0.12}
        showNavigation
        label="Selected work"
        onChange={setActive}
        onActivate={(index) => router.push(slides[index].href)}
      />

      {current && (
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-black/10 pt-3 text-[13px]">
          <div className="flex min-w-0 items-baseline gap-3">
            <span className="tabular-nums text-black/60">{String(active + 1).padStart(2, '0')}</span>
            <Link href={current.href} className="truncate italic transition-colors hover:text-black/60">
              {current.title}
            </Link>
          </div>
          <span className="text-[11px] uppercase tracking-[0.18em] text-black/60">
            {[current.kind, current.subtitle !== current.kind ? current.subtitle : null, current.year]
              .filter(Boolean)
              .join(' · ')}
          </span>
        </div>
      )}
    </div>
  )
}
