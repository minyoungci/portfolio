import Link from 'next/link'
import type { FeaturedSlide } from '@/lib/featured'

interface FeaturedRowProps {
  slides: FeaturedSlide[]
}

/** 대표작이 3개 미만일 때 코버플로우 대신 쓰는 정적 나열. */
export default function FeaturedRow({ slides }: FeaturedRowProps) {
  if (slides.length === 0) return null

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {slides.map((slide, index) => (
        <Link key={`${slide.kind}-${slide.href}`} href={slide.href} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden border border-black/10 bg-gray">
            {slide.src ? (
              slide.media === 'video' ? (
                <video
                  src={slide.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={slide.src}
                  alt={slide.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[1.02] group-hover:opacity-90"
                />
              )
            ) : (
              <div className="flex h-full w-full items-end p-4">
                <span className="font-serif text-4xl font-light text-black/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4 text-[13px]">
            <span className="truncate italic">{slide.title}</span>
            <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-black/60">
              {slide.kind} · {slide.year}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
