import type { ReactNode } from 'react'

interface SectionHeadingProps {
  number: string
  title: string
  aside?: ReactNode
}

/** 번호형 섹션 헤딩. 번호는 lib/sections.ts가 보이는 순서로 매긴 값을 받는다. */
export default function SectionHeading({ number, title, aside }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-6 border-t border-black pt-3">
      <h2 className="flex items-baseline gap-3 text-base font-medium uppercase tracking-[0.22em] sm:text-xl">
        <span className="tabular-nums text-black/60">{number}</span>
        <span>{title}</span>
      </h2>
      {aside && (
        <div className="text-[11px] uppercase tracking-[0.18em] text-black/60">{aside}</div>
      )}
    </div>
  )
}
