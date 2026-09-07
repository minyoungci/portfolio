'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel'
import type { ShelfSlide } from '@/lib/shelves'
import { isOptimizableImage } from '@/lib/site'

interface ShelfProps {
  id: string
  title: string
  description?: string
  slides: ShelfSlide[]
  /** 가운데 카드를 눌렀을 때. 없으면 슬라이드의 href로 이동한다. */
  onActivate?: (index: number) => void
  /** ms. 보이는 동안 자동으로 한 장씩 넘긴다. 사용자가 만지면 멈춘다. 0이면 끔. */
  autoAdvance?: number
}

/**
 * 홈의 한 섹션 = 코버플로우 선반. 슬라이드가 3개 미만이면 코버플로우가 한쪽으로 쏠리므로
 * 같은 카드 스타일의 정적 나열로 대체한다.
 */
export default function Shelf({ id, title, description, slides, onActivate, autoAdvance = 6000 }: ShelfProps) {
  const router = useRouter()

  const activate = (index: number) => {
    if (onActivate) {
      onActivate(index)
      return
    }
    const href = slides[index]?.href
    if (href) router.push(href)
  }

  return (
    <section id={id} data-reveal className="py-10 sm:py-14">
      <header className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-[13px] text-muted-foreground">{description}</p>}
      </header>

      <div className="mx-auto mt-2 max-w-7xl overflow-hidden">
        {slides.length >= 3 ? (
          <CoverflowCarousel
            slides={slides}
            cardWidth="clamp(220px, 40vw, 480px)"
            cardClassName="ring-1 ring-border ring-inset"
            showCaption
            showPagination
            showNavigation
            autoAdvance={autoAdvance}
            label={title}
            onActivate={activate}
          />
        ) : (
          <ShelfRow slides={slides} onActivate={activate} />
        )}
      </div>
    </section>
  )
}

function ShelfRow({ slides, onActivate }: { slides: ShelfSlide[]; onActivate: (index: number) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-10 px-6 py-10">
      {slides.map((slide, index) => (
        <button
          key={`${slide.title}-${index}`}
          type="button"
          onClick={() => onActivate(index)}
          className="group w-[clamp(220px,40vw,480px)] cursor-pointer rounded-2xl text-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-xl ring-1 ring-inset ring-border transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none">
            {slide.src ? (
              slide.media === 'video' ? (
                <video
                  src={slide.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : isOptimizableImage(slide.src) ? (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 640px) 70vw, 480px"
                  className="object-cover"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={slide.src} alt={slide.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              )
            ) : (
              <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-muted-foreground/30 via-muted to-muted p-5 text-left">
                <span className="line-clamp-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {slide.kicker ?? slide.subtitle}
                </span>
                <span className="mt-2 line-clamp-3 text-[15px] font-semibold leading-tight tracking-tight sm:text-[17px]">
                  {slide.title}
                </span>
              </div>
            )}
          </div>
          <p className="mt-4 text-[17px] font-semibold tracking-tight">{slide.title}</p>
          {slide.subtitle && <p className="mt-1 text-[13px] text-muted-foreground">{slide.subtitle}</p>}
          {slide.meta && slide.meta.length > 0 && (
            <dl className="mx-auto mt-6 w-full max-w-[280px] text-[12px] sm:text-[13px]">
              {slide.meta.map((row) => (
                <div key={row.label} className="flex justify-between gap-4 py-[5px]">
                  <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
                  <dd className="truncate font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </button>
      ))}
    </div>
  )
}
