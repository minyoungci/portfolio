'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Piece } from '@/types'

interface Props {
  pieces: Piece[]
}

export default function PieceSection({ pieces }: Props) {
  const [lightbox, setLightbox] = useState<Piece | null>(null)

  return (
    <section id="piece" className="py-8 px-4 sm:px-6">
      <h2 className="text-base tracking-[0.25em] font-normal uppercase italic mt-0 mb-6 pt-3 border-t border-black flex items-baseline gap-3">
        <span className="opacity-50">04</span>
        <span>Piece</span>
      </h2>

      {pieces.length === 0 ? (
        <p className="text-xs opacity-20">No pieces yet.</p>
      ) : (
        /* CSS columns masonry — 이미지 비율에 따라 자연스럽게 다양한 높이 */
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2">
          {pieces.map((piece) => (
            <div
              key={piece.id}
              onClick={() => setLightbox(piece)}
              className="break-inside-avoid mb-2 relative group cursor-pointer overflow-hidden"
            >
              {/* Image or Video */}
              {/\.(mp4|webm|mov)$/i.test(piece.image) ? (
                <video
                  src={piece.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full block transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <img
                  src={piece.image}
                  alt={piece.title ?? piece.prompt.slice(0, 60)}
                  className="w-full block object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {piece.title && (
                  <p className="text-white text-xs font-bold mb-1 leading-snug">
                    {piece.title}
                  </p>
                )}
                <p className="text-white/80 text-[11px] leading-relaxed line-clamp-3">
                  {piece.prompt}
                </p>
                <p className="text-white/40 text-[10px] mt-1">{piece.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-10"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col md:flex-row gap-6 items-start"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={lightbox.image}
                alt={lightbox.title ?? lightbox.prompt.slice(0, 60)}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>

            {/* Info panel */}
            <div className="md:w-72 shrink-0 text-white">
              {lightbox.title && (
                <h3 className="text-lg font-serif mb-2">{lightbox.title}</h3>
              )}
              <p className="text-xs opacity-40 mb-4">{lightbox.date}</p>
              <div className="border-t border-white/20 pt-4">
                <p className="text-[11px] text-white/50 uppercase tracking-widest mb-2">Prompt</p>
                <p className="text-sm text-white/80 leading-relaxed">{lightbox.prompt}</p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-0 right-0 text-white/50 hover:text-white text-2xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
