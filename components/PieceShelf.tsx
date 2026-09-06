'use client'

import { useEffect, useState } from 'react'
import type { Piece } from '@/types'
import { pieceSlides } from '@/lib/shelves'
import Shelf from '@/components/Shelf'

interface PieceShelfProps {
  pieces: Piece[]
}

const isVideo = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src)

/** Piece 선반. 가운데 카드를 누르면 라이트박스로 원본과 프롬프트를 보여준다. */
export default function PieceShelf({ pieces }: PieceShelfProps) {
  const [open, setOpen] = useState<Piece | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <Shelf
        id="piece"
        title="Piece"
        description="AI 생성 이미지와 영상. 카드를 누르면 프롬프트를 볼 수 있습니다."
        slides={pieceSlides(pieces)}
        onActivate={(index) => setOpen(pieces[index] ?? null)}
      />

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title ?? 'Piece'}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative flex w-full max-w-5xl flex-col items-start gap-6 md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-1 items-center justify-center">
              {isVideo(open.image) ? (
                <video
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
                  src={open.image}
                  alt={open.title ?? open.prompt.slice(0, 60)}
                  className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
                />
              )}
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 text-white md:w-72">
              <h3 className="text-[15px] font-semibold tracking-tight">{open.title ?? 'Untitled'}</h3>
              <p className="mt-1 text-[12px] text-white/60">{open.date}</p>
              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">Prompt</p>
              <p className="mt-2 text-[13px] leading-6 text-white/85">{open.prompt}</p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(null)}
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
