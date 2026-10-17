'use client'

import { useEffect, useRef, useState } from 'react'
import GlassButton from '@/components/GlassButton'

interface Props {
  src: string
  poster?: string
  title: string
}

export default function ProjectVideo({ src, poster, title }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const userPaused = useRef(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    let inView = false
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if (inView && !document.hidden && !preference.matches && !userPaused.current) {
        video.play().catch(() => {})
      } else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    }, { threshold: 0.25 })
    observer.observe(video)
    preference.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      video.pause()
    }
  }, [src])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    userPaused.current = !video.paused
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <div className="w-full">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata"
        aria-label={`${title} 앱 소개 영상`}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}
        className="block aspect-square w-full object-contain" />
      <div className="flex justify-end border-t border-border p-3">
        {failed ? <p role="status" className="rounded-xl bg-card px-4 py-2 text-sm text-foreground">영상을 불러올 수 없습니다.</p> : (
          <GlassButton onClick={toggle} aria-label={playing ? '앱 영상 일시정지' : '앱 영상 재생'} aria-pressed={playing}>
            {playing ? 'Pause video' : 'Play video'}
          </GlassButton>
        )}
      </div>
    </div>
  )
}
