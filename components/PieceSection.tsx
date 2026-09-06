'use client'

import { useState } from 'react'
import type { Piece } from '@/types'
import SectionHeading from '@/components/SectionHeading'

interface Props {
  pieces: Piece[]
  number: string
}

const isVideo = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src)

export default function PieceSection({ pieces, number }: Props) {
  const [lightbox, setLightbox] = useState<Piece | null>(null)

  if (pieces.length === 0) return null

  return (
    <section id="piece" className="px-4 py-8 sm:px-6">
      <SectionHeading number={number} title="Piece" aside={`${pieces.length} works`} />

      {/* CSS columns masonry — 이미지 비율에 따라 자연스럽게 다양한 높이 */}
      <div className="columns-2 gap-3 lg:columns-3">
        {pieces.map((piece) => (
          <button
            key={piece.id}
            type="button"
            onClick={() => setLightbox(piece)}
            aria-label={piece.title ?? 'Open piece'}
            className="group relative mb-3 block w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left break-inside-avoid"
          >
            {isVideo(piece.image) ? (
              <video
                src={piece.image}
                autoPlay
                muted
                loop
                playsInline
                className="block w-full transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={piece.image}
                alt={piece.title ?? piece.prompt.slice(0, 60)}
                loading="lazy"
                className="block w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
            <div className="absolute inset-0 flex translate-y-2 flex-col justify-end p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {piece.title && (
                <p className="mb-1 text-xs font-bold leading-snug text-white">{piece.title}</p>
              )}
              <p className="line-clamp-3 text-[11px] leading-relaxed text-white/80">{piece.prompt}</p>
              <p className="mt-1 text-[10px] text-white/60">{piece.date}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative flex w-full max-w-5xl flex-col items-start gap-6 md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-1 items-center justify-center">
              {isVideo(lightbox.image) ? (
                <video
                  src={lightbox.image}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="max-h-[80vh] w-auto"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={lightbox.image}
                  alt={lightbox.title ?? lightbox.prompt.slice(0, 60)}
                  className="max-h-[80vh] w-auto object-contain"
                />
              )}
            </div>

            <div className="shrink-0 text-white md:w-72">
              {lightbox.title && <h3 className="mb-2 font-serif text-2xl">{lightbox.title}</h3>}
              <p className="mb-4 text-xs text-white/60">{lightbox.date}</p>
              <div className="border-t border-white/20 pt-4">
                <p className="mb-2 text-[11px] uppercase tracking-widest text-white/60">Prompt</p>
                <p className="text-sm leading-relaxed text-white/80">{lightbox.prompt}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-0 top-0 text-2xl leading-none text-white/60 transition-colors hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
