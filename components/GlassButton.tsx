import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type GlassVariant = 'glass' | 'solid'

/** 모양·크기·타이포는 Tailwind 유틸리티, 유리의 광학은 globals.css의 `.glass`가 맡는다. */
const SHAPE = 'glass rounded-full px-4 py-2 text-[13px] font-medium'
const SOLID = 'glass--solid font-semibold'

interface GlassOwn {
  /** `glass`(기본): 반투명 유리. `solid`: --foreground 슬래브, 스페큘러만 남는다. */
  variant?: GlassVariant
  className?: string
  children: ReactNode
}

type ButtonRest = Omit<ComponentProps<'button'>, 'className' | 'children'>
type AnchorRest = Omit<ComponentProps<'a'>, 'className' | 'children'>
type LinkRest = Omit<ComponentProps<typeof Link>, 'className' | 'children'>

/**
 * 유니온의 초과 속성 검사는 어느 한 멤버에만 있으면 통과한다. 그래서 `as` 없이(=button)
 * href를 넘겨도 컴파일되고, 런타임에는 <button href>가 되어 링크가 죽는다. 앵커 전용
 * 속성을 button 멤버에서 명시적으로 막아 그 구멍을 닫는다.
 */
type NoAnchorProps = { href?: never; target?: never; rel?: never; download?: never }

export type GlassButtonProps =
  | (GlassOwn & { as?: 'button' } & NoAnchorProps & ButtonRest)
  | (GlassOwn & { as: 'a' } & AnchorRest)
  | (GlassOwn & { as: 'link' } & LinkRest)

/**
 * 이 사이트의 알약 하나. `as`로 <button> · <a> · next/link 중 하나를 낸다.
 *
 * 'use client'가 없다 — 마크업은 정적이고, 포인터 추적은 레이아웃에 한 번 마운트된
 * GlassPointer가 위임 리스너 하나로 전부 처리한다. 그래서 Hero·Contact·About·404는
 * 이 버튼 때문에 클라이언트 JS를 한 줄도 받지 않는다.
 */
export default function GlassButton(props: GlassButtonProps) {
  const { as = 'button', variant = 'glass', className, children, ...rest } = props
  const cls = cn(SHAPE, variant === 'solid' && SOLID, className)
  const inner = (
    <>
      {variant === 'glass' && (
        <span aria-hidden="true" className="glass-motes">
          <span className="glass-mote" />
          <span className="glass-mote" />
          <span className="glass-mote" />
          <span className="glass-mote" />
        </span>
      )}
      <span className="glass-label">{children}</span>
    </>
  )

  if (as === 'link') {
    return (
      <Link {...(rest as LinkRest)} className={cls}>
        {inner}
      </Link>
    )
  }

  if (as === 'a') {
    return (
      <a {...(rest as AnchorRest)} className={cls}>
        {inner}
      </a>
    )
  }

  const buttonRest = rest as ButtonRest
  return (
    <button {...buttonRest} type={buttonRest.type ?? 'button'} className={cls}>
      {inner}
    </button>
  )
}
