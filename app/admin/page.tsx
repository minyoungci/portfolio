import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminAuth'
import AdminClient from './AdminClient'

// 서버에서 세션 쿠키를 검증한다. 없거나 만료면 로그인 페이지로.
export default async function AdminPage() {
  const store = await cookies()
  if (!verifySessionToken(store.get(ADMIN_COOKIE)?.value)) {
    redirect('/admin/login')
  }
  return <AdminClient />
}
