'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  label: string
  copiedLabel?: string
  className?: string
}

/** 클립보드 복사 버튼. 성공하면 잠시 라벨이 바뀐다. */
export default function CopyButton({ text, label, copiedLabel = 'Copied', className }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<number | null>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 1600)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={cn(
        'rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium shadow-card transition-colors hover:bg-muted',
        className,
      )}
    >
      {state === 'copied' ? copiedLabel : state === 'failed' ? 'Copy failed' : label}
    </button>
  )
}
