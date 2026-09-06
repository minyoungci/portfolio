'use client'

import dynamic from 'next/dynamic'

// admin UI는 전부 브라우저 전용이라 SSR을 끈다. 인증은 서버 컴포넌트 page.tsx가 먼저 한다.
const AdminWrapper = dynamic(() => import('./AdminWrapper'), { ssr: false })

export default function AdminClient() {
  return <AdminWrapper />
}
