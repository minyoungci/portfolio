'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // 외부 링크로 /admin에 들어오면 SameSite=Strict 쿠키가 첫 요청에 실리지 않아 여기로 온다.
  // 같은 출처 요청으로 세션을 확인해 유효하면 바로 /admin으로 보낸다.
  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/session', { method: 'GET' })
      .then((res) => {
        if (!cancelled && res.ok) router.replace('/admin')
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [router])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.replace('/admin')
        return
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      setMessage(data.error ?? `Login failed (${res.status})`)
      setStatus('error')
    } catch {
      setMessage('Network error')
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen px-4 pt-24 sm:px-6">
      <form onSubmit={submit} className="max-w-sm">
        <p className="text-[11px] uppercase tracking-[0.3em] text-black/60">Admin</p>
        <h1 className="mt-3 font-serif text-4xl font-light">Sign in</h1>

        <label htmlFor="password" className="mt-8 block text-[11px] uppercase tracking-[0.18em] text-black/60">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border-b border-black bg-transparent py-2 text-[15px] outline-none"
        />

        {message && (
          <p role="alert" className="mt-3 text-[13px] text-black/60">
            {message}
          </p>
        )}

        <div className="mt-8 flex items-center gap-5">
          <button
            type="submit"
            disabled={status === 'loading' || !password}
            className="border border-black px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-black hover:text-white disabled:opacity-40"
          >
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>
          <Link href="/" className="text-[11px] uppercase tracking-[0.18em] text-black/60 transition-colors hover:text-black">
            ← Home
          </Link>
        </div>
      </form>
    </main>
  )
}
