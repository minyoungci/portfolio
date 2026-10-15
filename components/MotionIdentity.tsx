'use client'

import { useEffect, useRef, useState } from 'react'

const words = ['Research', 'Medical AI', 'Open source', 'Future', 'Build']
const actions = ['Research', 'Build', 'Share', 'Explore', 'Collaborate', 'Learn', 'Create']
const phrases = ['RESEARCH\nINTO REALITY', 'BUILD TOOLS.\nSHARE CODE.', 'MEDICAL AI.\nOPEN SOURCE.']

/** A single clock keeps the reel, ticker, outline and statements in sync. */
export default function MotionIdentity({ name }: { name: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elapsedRef = useRef(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!root || !canvas || !context) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = media.matches
    let intersecting = false
    let visible = false
    let disposed = false
    let frame = 0
    let elapsed = elapsedRef.current
    let previous = 0
    let width = 0
    let height = 0
    const ticker = root.querySelector<HTMLElement>('.motion-ticker-track')
    const tickerWords = root.querySelectorAll<HTMLElement>('.motion-ticker-track span')
    let ink = ''
    let font = ''
    const statements = root.querySelectorAll<HTMLElement>('.motion-statement')
    const outline = root.querySelector<SVGTextElement>('.motion-outline')
    const pulse = root.querySelector<HTMLElement>('.motion-name')
    const vectorPath = root.querySelector<SVGPathElement>('.motion-vector path')
    const resize = () => {
      const style = getComputedStyle(root)
      ink = style.getPropertyValue('--motion-ink')
      font = style.fontFamily
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      context.fillStyle = ink
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      const rowHeight = height * .255
      const radius = rowHeight * .5
      const phase = reduced ? 0 : (time / 2000) * Math.PI * 2 / words.length
      for (let row = 0; row < 3; row++) {
        for (let i = 0; i < words.length; i++) {
          const angle = ((i * Math.PI * 2 / words.length - phase + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI
          if (Math.abs(angle) >= Math.PI / 2) continue
          const text = words[i]
          let size = width * .21
          context.font = `400 ${size}px ${font}`
          size *= Math.min(1, width * .93 / context.measureText(text).width)
          context.font = `400 ${size}px ${font}`
          context.save()
          context.translate(width / 2, height * .115 + rowHeight * (row + .5) + Math.sin(angle) * radius)
          context.scale(1, Math.max(.015, Math.cos(angle)))
          context.fillText(text, 0, 0)
          context.restore()
        }
      }
      const step = reduced ? 0 : time / 1000
      const integer = Math.floor(step)
      const fraction = step - integer
      // Hold each word; spend the final 25% of its beat sliding to the next.
      const f = Math.max(0, (fraction - .75) / .25)
      const easing = f * f * (3 - 2 * f)
      if (ticker) ticker.style.transform = `translateY(${-((integer % actions.length) + easing) * 1.12}em)`
      tickerWords.forEach((element, index) => {
        const distance = Math.abs(index - ((integer % actions.length) + easing))
        element.style.opacity = String(.16 + .84 * Math.max(0, 1 - distance))
      })
      statements.forEach((element, index) => {
        const current = Math.floor(time / 2500) % phrases.length
        element.style.opacity = index === (reduced ? 0 : current) ? '1' : '0'
        element.style.transform = `translateY(${index === current || reduced ? 0 : 12}px)`
      })
      if (outline) outline.style.strokeDashoffset = String(reduced ? 0 : 180 * (1 - Math.min(1, (time % 5000) / 1800)))
      if (vectorPath) vectorPath.style.strokeDashoffset = String(reduced ? 0 : 900 * (1 - Math.min(1, (time % 5000) / 1800)))
      if (pulse) pulse.style.transform = `scale(${reduced ? 1 : .9 + .1 * Math.sin(Math.PI * Math.min(1, (time % 5000) / 2500))})`
    }
    const tick = (now: number) => {
      if (previous && visible && !paused && !reduced) elapsed += now - previous
      previous = now
      elapsedRef.current = elapsed
      draw(elapsed)
      if (visible && !paused && !reduced) frame = requestAnimationFrame(tick)
    }
    const start = () => { cancelAnimationFrame(frame); previous = 0; frame = requestAnimationFrame(tick) }
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; visible = intersecting && !document.hidden; start() })
    const resizeObserver = new ResizeObserver(() => { resize(); draw(elapsed) })
    const preference = () => { reduced = media.matches; start() }
    const visibility = () => { visible = intersecting && !document.hidden; start() }
    resize()
    observer.observe(root)
    resizeObserver.observe(canvas)
    media.addEventListener('change', preference)
    document.addEventListener('visibilitychange', visibility)
    document.fonts.ready.then(() => { if (!disposed) { resize(); draw(elapsed) } })
    start()
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect(); media.removeEventListener('change', preference); document.removeEventListener('visibilitychange', visibility) }
  }, [paused])

  return (
    <div className="motion-identity" ref={rootRef}>
      <div className="motion-board" aria-hidden="true">
        <div className="motion-panel motion-reel"><canvas ref={canvasRef} /></div>
        <div className="motion-panel motion-name-panel"><span className="motion-name">{name.split(' ')[0]}<br />{name.split(' ').slice(1).join(' ')}</span></div>
        <div className="motion-panel motion-vector-panel">
          <svg viewBox="0 0 600 300" className="motion-vector"><text className="motion-outline" x="300" y="190" textAnchor="middle">AI</text><path d="M0 230H105C160 230 160 70 220 70H370C435 70 435 230 490 230H600" /><g>{[[105,230],[220,70],[370,70],[490,230]].map(([x,y])=><circle key={x} cx={x} cy={y} r="5" />)}</g></svg>
        </div>
        <div className="motion-panel motion-statement-panel">{phrases.map((phrase)=><span className="motion-statement" key={phrase}>{phrase}</span>)}</div>
        <div className="motion-panel motion-ticker-panel"><span className="motion-ticker-label">Let’s</span><div className="motion-ticker-window"><div className="motion-ticker-track">{[...actions,...actions].map((word,index)=><span key={index}>{word}</span>)}</div></div></div>
      </div>
      <p className="sr-only">Medical AI research, open-source development, and building useful tools.</p>
      <button type="button" className="motion-control" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Play motion' : 'Pause motion'}</button>
    </div>
  )
}
