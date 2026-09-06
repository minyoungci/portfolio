import type { ReactNode } from 'react'

interface CollapseProps {
  open: boolean
  children: ReactNode
}

/** CSS grid-rows 전환으로 높이를 여닫는 아코디언 본문. 라이브러리 없이 동작하고 reduced-motion을 존중한다. */
export default function Collapse({ open, children }: CollapseProps) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      aria-hidden={!open}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}
