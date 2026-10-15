'use client'

import { useEffect, useRef, useState } from 'react'
import type { RobotController, RobotMode, RobotAction } from '@/lib/robotScene'
import GlassButton from '@/components/GlassButton'

const modes: { id: RobotMode; label: string; title: string; description: string; href: string; link: string }[] = [
  { id: 'medical', label: 'Medical AI', title: 'Intelligence, with purpose.', description: '뇌 MRI와 파운데이션 모델. 의료 데이터를 이해하고 연구에 쓰이는 도구를 만듭니다.', href: '#projects', link: 'Explore projects' },
  { id: 'open', label: 'Open source', title: 'Built to be shared.', description: '아이디어를 누구나 살펴보고 함께 발전시킬 수 있는 오픈소스 도구로 구현합니다.', href: 'https://github.com/minyoungci', link: 'Explore GitHub' },
  { id: 'research', label: 'Research', title: 'Questions become discoveries.', description: '의료 AI와 건강 데이터에서 출발한 질문을 연구와 논문으로 이어갑니다.', href: '#publications', link: 'Explore publications' },
]

export default function RobotExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<RobotController | null>(null)
  const modeRef = useRef<RobotMode>('medical')
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [mode, setMode] = useState<RobotMode>('medical')
  const [paused, setPaused] = useState(false)
  const [notice, setNotice] = useState('')
  const current = modes.find(item => item.id === mode)!

  useEffect(() => {
    let disposed = false
    import('@/lib/robotScene').then(({ createRobotScene }) => {
      if (disposed || !canvasRef.current) return
      controllerRef.current = createRobotScene(canvasRef.current, setStatus)
      controllerRef.current.setMode(modeRef.current)
    }).catch(() => { if (!disposed) setStatus('fallback') })
    return () => {
      disposed = true
      controllerRef.current?.dispose()
      controllerRef.current = null
    }
  }, [])

  function act(action: RobotAction) {
    controllerRef.current?.act(action)
    setNotice(action === 'scan' ? 'AI 시각화 스캔' : action === 'wave' ? 'Hello, human.' : action === 'reset' ? '기본 시점으로 돌아왔습니다.' : '')
  }

  return (
    <div className="robot-experience" data-status={status} data-mode={mode} data-paused={paused}>
      <div className="robot-art">
        <div className="robot-backdrop" aria-hidden="true"><span>HUMAN<br />× AI</span></div>
        {/* The poster is rendered from this same licensed model, and survives a WebGL failure. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="robot-poster" src="/models/robot/poster.webp" alt="보라색 빛의 신경망과 은색 AI 휴머노이드 로봇" width="1000" height="1000" />
        <canvas ref={canvasRef} className="robot-canvas" tabIndex={status === 'ready' ? 0 : -1} aria-label="인터랙티브 AI 로봇. 좌우 방향키로 회전, 더하기와 빼기로 확대·축소, Home으로 초기화" aria-describedby="robot-instructions" />
        <div className="robot-scene-label" aria-hidden="true"><span className="robot-signal" />AI, made tangible.<span className="robot-scene-no">01 — EXPERIMENT</span></div>
        <div className="robot-view-tools" aria-label="로봇 시점 조작">
          <button disabled={status !== 'ready'} onClick={() => act('zoomIn')} aria-label="로봇 확대">+</button>
          <button disabled={status !== 'ready'} onClick={() => act('zoomOut')} aria-label="로봇 축소">−</button>
          <button disabled={status !== 'ready'} onClick={() => act('reset')} aria-label="로봇 시점 초기화">↺</button>
        </div>
        <p className="robot-instructions" id="robot-instructions">{status === 'loading' ? 'Loading the AI companion…' : status === 'fallback' ? 'AI companion · Still view' : <><span className="pointer-hint">Move to connect · Drag to turn</span><span className="touch-hint">Swipe to turn · Scroll to explore</span><span className="reduced-hint">Use the controls to explore</span></>}</p>
      </div>
      <div className="robot-console">
        <div className="robot-modes" role="group" aria-label="AI 테마 선택">
          {modes.map((item, index) => <button key={item.id} aria-pressed={mode === item.id} onClick={() => { modeRef.current = item.id; setMode(item.id); controllerRef.current?.setMode(item.id); setNotice('') }}><span aria-hidden="true">0{index + 1}</span>{item.label}</button>)}
        </div>
        <div className="robot-mode-copy" aria-live="polite" aria-atomic="true">
          <h2>{current.title}</h2>
          <p>{current.description}</p>
          <a href={current.href} {...(mode === 'open' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{current.link}<span aria-hidden="true">↗</span></a>
        </div>
        <div className="robot-actions" aria-label="로봇 인터랙션">
          <GlassButton disabled={status !== 'ready'} onClick={() => act('scan')}>AI scan <span aria-hidden="true">⌁</span></GlassButton>
          <GlassButton disabled={status !== 'ready'} onClick={() => act('wave')}>Say hello <span aria-hidden="true">✧</span></GlassButton>
          <GlassButton className="robot-motion-control" disabled={status !== 'ready'} aria-pressed={paused} aria-label={paused ? '로봇 모션 재생' : '로봇 모션 일시정지'} onClick={() => { const next = !paused; setPaused(next); controllerRef.current?.setPaused(next) }}>{paused ? 'Play' : 'Pause'}</GlassButton>
        </div>
        <span className="sr-only" role="status">{notice}</span>
        <div className="robot-credit"><span>Interactive visual study</span><a href="/models/robot/credits.txt" target="_blank" rel="noopener noreferrer">Model credits ↗</a></div>
      </div>
    </div>
  )
}
