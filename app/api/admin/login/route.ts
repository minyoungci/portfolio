import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  configurationError,
  createSessionToken,
  passwordMatches,
  sessionCookieOptions,
} from '@/lib/adminAuth'

// 실패 횟수 제한. 인스턴스 메모리라 서버리스에서는 인스턴스별로 따로 세는 보조 장치일 뿐이다.
// 실제 방어선은 긴 ADMIN_PASSWORD (lib/adminAuth.ts가 최소 길이를 강제).
const LIMIT = 10
const WINDOW_MS = 15 * 60 * 1000
const failures = new Map<string, { count: number; resetAt: number }>()

function prune(now: number) {
  if (failures.size < 500) return
  for (const [k, v] of failures) if (v.resetAt < now) failures.delete(k)
}

function isBlocked(ip: string): boolean {
  const rec = failures.get(ip)
  return Boolean(rec && rec.resetAt >= Date.now() && rec.count >= LIMIT)
}

function recordFailure(ip: string) {
  const now = Date.now()
  prune(now)
  const rec = failures.get(ip)
  if (!rec || rec.resetAt < now) failures.set(ip, { count: 1, resetAt: now + WINDOW_MS })
  else rec.count += 1
}

export async function POST(req: NextRequest) {
  const problem = configurationError()
  if (problem) {
    return NextResponse.json({ error: `Admin is not configured: ${problem}` }, { status: 503 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isBlocked(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  let password: unknown
  try {
    ;({ password } = (await req.json()) as { password?: unknown })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const ok =
    typeof password === 'string' && password.length > 0 && password.length <= 256 && passwordMatches(password)

  if (!ok) {
    recordFailure(ip)
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const token = createSessionToken()
  if (!token) {
    return NextResponse.json({ error: 'Session secret missing' }, { status: 503 })
  }

  failures.delete(ip)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions)
  return res
}
