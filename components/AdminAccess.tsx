import Link from 'next/link'

/** 홈 우하단의 옅은 admin 진입 링크. 인증은 /admin(서버)과 로그인 페이지가 담당한다. */
export default function AdminAccess() {
  return (
    <Link
      href="/admin"
      title="Admin"
      aria-label="Admin"
      className="fixed bottom-5 right-5 text-[11px] text-muted-foreground opacity-30 transition-opacity duration-300 hover:opacity-100"
    >
      ⌗
    </Link>
  )
}
