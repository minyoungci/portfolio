interface PageTransitionProps {
  children: React.ReactNode
}

/**
 * 페이지 진입 페이드. CSS 애니메이션(globals.css의 .page-enter)이라
 * 서버 HTML이 하이드레이션 전에도 보이고, reduced-motion에서는 꺼진다.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  return <div className="page-enter">{children}</div>
}
