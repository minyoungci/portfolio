'use client'

import { useEffect } from 'react'

/** 빛의 기본 위치: 왼쪽 위. 정적 상단 하이라이트가 암시하는 광원과 같은 자리다. */
const REST_ANGLE = 315
const REST_X = 50
const REST_Y = 34
/** 안쪽 그라디언트가 따라가는 비율. 1보다 작아야 깊이로 읽힌다. */
const PARALLAX = 0.42
const ANGLE_EASE = 0.16
const POS_EASE = 0.12

/**
 * 액체 유리 알약의 포인터 컨트롤러. app/layout.tsx에 한 번만 마운트한다.
 *
 * HeroGlow와 같은 규약(rAF 합치기, 상태 없이 CSS 변수만 씀, reduced-motion·거친
 * 포인터에서는 아예 돌지 않음)이되, 알약마다 리스너를 달지 않는다. document에 위임한
 * pointerover 하나가 커서 아래의 알약을 찾고 그때만 pointermove를 건다.
 *
 * 이 컴포넌트가 없어도 알약은 완성된 유리로 보인다. 빛이 315도에 멈춰 있을 뿐이다.
 */
export default function GlassPointer() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    let pill: HTMLElement | null = null
    let raf = 0
    let leaving = false
    let angle = REST_ANGLE
    let x = REST_X
    let y = REST_Y
    let toAngle = REST_ANGLE
    let toX = REST_X
    let toY = REST_Y

    const write = (el: HTMLElement) => {
      el.style.setProperty('--g-angle', `${angle.toFixed(2)}deg`)
      el.style.setProperty('--g-px', `${x.toFixed(2)}%`)
      el.style.setProperty('--g-py', `${y.toFixed(2)}%`)
    }

    const step = () => {
      raf = 0
      const el = pill
      if (!el || !el.isConnected) {
        detach()
        return
      }
      // 원을 최단호로 돈다. <angle>에 CSS transition을 걸면 빛이 0도를 지날 때마다
      // 358도를 반대로 돌기 때문에, 이징이 여기 있어야 한다.
      const dA = ((toAngle - angle + 540) % 360) - 180
      const dX = toX - x
      const dY = toY - y

      if (Math.abs(dA) < 0.2 && Math.abs(dX) < 0.12 && Math.abs(dY) < 0.12) {
        // 정착: 정확히 목표에 놓고 루프를 끝낸다. 포인터가 멈춰 있는 동안에는
        // 아무것도 돌지 않는다.
        angle = toAngle
        x = toX
        y = toY
        write(el)
        if (leaving) detach()
        return
      }

      angle = (angle + dA * ANGLE_EASE + 360) % 360
      x += dX * POS_EASE
      y += dY * POS_EASE
      write(el)
      raf = requestAnimationFrame(step)
    }

    const run = () => {
      if (!raf) raf = requestAnimationFrame(step)
    }

    const onMove = (event: PointerEvent) => {
      const el = pill
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // atan2는 3시 방향이 0이고 화면 좌표에서 시계 방향으로 커진다. conic-gradient는
      // 12시가 0이므로 +90 (양수로 유지하려고 +360).
      toAngle = ((Math.atan2(event.clientY - cy, event.clientX - cx) * 180) / Math.PI + 450) % 360
      toX = 50 + (((event.clientX - rect.left) / rect.width) * 100 - 50) * PARALLAX
      toY = 50 + (((event.clientY - rect.top) / rect.height) * 100 - 50) * PARALLAX
      run()
    }

    const onLeave = () => {
      leaving = true
      toAngle = REST_ANGLE
      toX = REST_X
      toY = REST_Y
      run()
    }

    /** 추적을 끝내고 빛을 기본 위치에 놓는다. 인라인 값은 CSS 기본값과 같으므로 남겨둔다. */
    const detach = () => {
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      const el = pill
      pill = null
      leaving = false
      angle = REST_ANGLE
      x = REST_X
      y = REST_Y
      toAngle = REST_ANGLE
      toX = REST_X
      toY = REST_Y
      if (!el) return
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      if (el.isConnected) write(el)
    }

    const onOver = (event: PointerEvent) => {
      const target = event.target
      const next = target instanceof Element ? target.closest<HTMLElement>('.glass') : null
      if (next === pill) {
        leaving = false
        return
      }
      detach()
      if (!next) return
      pill = next
      next.addEventListener('pointermove', onMove)
      next.addEventListener('pointerleave', onLeave)
    }

    // reduced-motion은 CSS가 !important로 못 박지만, 세션 중간에 켜면 루프까지 멈춘다.
    const sync = () => {
      if (reduce.matches) {
        document.removeEventListener('pointerover', onOver)
        detach()
      } else {
        document.addEventListener('pointerover', onOver)
      }
    }

    sync()
    reduce.addEventListener('change', sync)
    return () => {
      reduce.removeEventListener('change', sync)
      document.removeEventListener('pointerover', onOver)
      detach()
    }
  }, [])

  return null
}
