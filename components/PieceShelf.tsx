'use client'

import { useEffect, useState } from 'react'
import type { Piece } from '@/types'
import { pieceSlides } from '@/lib/shelves'
import { isVideoSrc } from '@/lib/site'
import Shelf from '@/components/Shelf'
import CopyButton from '@/components/CopyButton'

interface PieceShelfProps {
  pieces: Piece[]
}

/** Piece 선반. 가운데 카드를 누르면 라이트박스로 원본과 프롬프트를 보여준다. ←/→로 이동, Esc로 닫기. */
export default function PieceShelf({ pieces }: PieceShelfProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const open = openIndex === null ? null : pieces[openIndex] ?? null
  const count = pieces.length

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
      else if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? null : (i + 1) % count))
      else if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? null : (i - 1 + count) % count))
    }
    window.addEventListener('keydown', onKey)
    // 라이트박스가 열린 동안 뒤 페이지 스크롤을 막는다
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [openIndex, count])

  return (
    <>
      <Shelf
        id="piece"
        title="Piece"
        description="AI 생성 이미지와 영상. 카드를 누르면 프롬프트를 볼 수 있습니다."
        slides={pieceSlides(pieces)}
        onActivate={(index) => setOpenIndex(index)}
      />

      {open && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title ?? 'Piece'}
          className="fade-in fixed inset-0 z-[300] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm motion-reduce:animate-none md:p-10"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="relative flex w-full max-w-5xl flex-col items-start gap-6 md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-1 items-center justify-center">
              {isVideoSrc(open.image) ? (
                <video
                  key={open.id}
                  src={open.image}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="max-h-[80vh] w-auto rounded-2xl shadow-2xl"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={open.id}
                  src={open.image}
                  alt={open.title ?? open.prompt.slice(0, 60)}
                  className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
                />
              )}
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 text-white md:w-72">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[15px] font-semibold tracking-tight">{open.title ?? 'Untitled'}</h3>
                <span className="text-[11px] tabular-nums text-white/50">
                  {openIndex + 1} / {count}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-white/60">{open.date}</p>
              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">Prompt</p>
              <p className="mt-2 max-h-[38vh] overflow-y-auto text-[13px] leading-6 text-white/85">{open.prompt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <CopyButton
                  text={open.prompt}
                  label="Copy prompt"
                  className="border-white/15 bg-white/10 text-white shadow-none hover:bg-white/20"
                />
                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenIndex((openIndex - 1 + count) % count)}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[13px] text-white transition-colors hover:bg-white/20"
                      aria-label="Previous piece"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenIndex((openIndex + 1) % count)}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[13px] text-white transition-colors hover:bg-white/20"
                      aria-label="Next piece"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
              className="absolute -top-3 right-0 rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/80 transition-colors hover:bg-white/20 md:-top-10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
