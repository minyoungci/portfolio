'use client'

import { useRouter } from 'next/navigation'

// 비밀번호 변경: ADMIN_PASSWORD 값을 수정하세요
const ADMIN_PASSWORD = 'rlaalsdud12'

export default function AdminAccess() {
  const router = useRouter()

  const handleClick = () => {
    const pw = window.prompt('Password')
    if (pw === ADMIN_PASSWORD) {
      router.push('/admin')
    } else if (pw !== null) {
      // 틀렸을 때만 알림 (취소는 무시)
      window.alert('Incorrect password')
    }
  }

  return (
    <button
      onClick={handleClick}
      title="Admin"
      className="fixed bottom-5 right-5 text-[10px] opacity-10 hover:opacity-40 transition-opacity duration-300 bg-transparent border-0 cursor-pointer text-black"
    >
      ⌗
    </button>
  )
}
