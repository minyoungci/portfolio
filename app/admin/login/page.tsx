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
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-card"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>

        <label htmlFor="password" className="mt-8 block text-[12px] font-medium text-muted-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-[15px] outline-none transition-colors focus:border-foreground"
        />

        {message && (
          <p role="alert" className="mt-3 text-[13px] text-muted-foreground">
            {message}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={status === 'loading' || !password}
            className="rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>
          <Link href="/" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            ← Home
          </Link>
        </div>
      </form>
    </main>
  )
}
