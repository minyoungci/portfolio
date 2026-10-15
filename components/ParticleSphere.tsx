'use client'

import { useEffect, useRef, useState } from 'react'
import type { ParticleSphereController } from '@/lib/particleSphere'
import GlassButton from '@/components/GlassButton'

// A deterministic, server-rendered silhouette remains visible until WebGL is ready.
const fallbackPoints = Array.from({ length: 420 }, (_, i) => {
  const y = 1 - (i / 419) * 2
  const radius = Math.sqrt(1 - y * y)
  const angle = i * Math.PI * (3 - Math.sqrt(5))
  return { x: (200 + Math.cos(angle) * radius * 148).toFixed(2), y: (200 + y * 148).toFixed(2), opacity: (.25 + (Math.sin(angle) + 1) * .3).toFixed(3) }
})

export default function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<ParticleSphereController | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    let disposed = false
    import('@/lib/particleSphere').then(({ createParticleSphere }) => {
      if (disposed || !canvasRef.current) return
      controllerRef.current = createParticleSphere(canvasRef.current, setStatus)
    }).catch(() => { if (!disposed) setStatus('fallback') })
    return () => {
      disposed = true
      controllerRef.current?.dispose()
      controllerRef.current = null
    }
  }, [])

  function toggleMotion() {
    const next = !paused
    controllerRef.current?.setPaused(next)
    setPaused(next)
  }

  return (
    <div className="particle-scene" data-status={status} data-paused={paused}>
      <div className="particle-art" aria-hidden="true">
        <div className="particle-halo" />
        <svg className="particle-fallback" viewBox="0 0 400 400" fill="currentColor">
          {fallbackPoints.map((point, i) => <circle key={i} cx={point.x} cy={point.y} r="1.1" opacity={point.opacity} />)}
          <ellipse cx="200" cy="200" rx="185" ry="57" fill="none" stroke="currentColor" strokeWidth=".4" transform="rotate(-25 200 200)" />
        </svg>
        <canvas ref={canvasRef} className="particle-canvas" />
      </div>
      <div className="particle-caption">
        <span className="particle-index" aria-hidden="true">↗</span>
        <span>Ideas in motion<span className="particle-hint">{paused ? 'Motion paused' : <><span className="pointer-hint">Move your cursor to explore</span><span className="touch-hint">Touch to explore</span></>}</span></span>
        {status === 'ready' && <GlassButton className="particle-control" onClick={toggleMotion} aria-label={paused ? 'Play sphere motion' : 'Pause sphere motion'}>{paused ? 'Play motion' : 'Pause motion'}</GlassButton>}
      </div>
    </div>
  )
}
