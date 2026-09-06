import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'

/**
 * admin 세션 인증 (서버 전용).
 * - 비밀번호: ADMIN_PASSWORD(12자 이상)와 상수 시간 비교
 * - 세션: HMAC-SHA256으로 서명한 만료 토큰을 httpOnly 쿠키에 저장.
 *   서명 키는 ADMIN_SESSION_SECRET과 ADMIN_PASSWORD 둘에서 파생하므로
 *   비밀번호를 바꾸면(재배포 후) 기존 세션이 모두 무효가 된다.
 * - 설정이 빠지거나 짧으면 항상 거부한다 (fail closed)
 */

export const ADMIN_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 8 // 8시간 (초)
const MIN_PASSWORD_LENGTH = 12
const MIN_SECRET_LENGTH = 16
const MAX_TOKEN_LENGTH = 512

/** 설정 문제를 사람이 읽을 수 있는 문장으로. 정상이면 null. */
export function configurationError(): string | null {
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!password) return 'ADMIN_PASSWORD is not set.'
  if (password.length < MIN_PASSWORD_LENGTH) return `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`
  if (!secret) return 'ADMIN_SESSION_SECRET is not set.'
  if (secret.length < MIN_SECRET_LENGTH) return `ADMIN_SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters.`
  return null
}

export function isAdminConfigured(): boolean {
  return configurationError() === null
}

/** 서명 키 = HMAC(secret, password). 둘 중 하나만 바뀌어도 키가 바뀐다. */
function signingKey(): Buffer | null {
  if (!isAdminConfigured()) return null
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET as string)
    .update(process.env.ADMIN_PASSWORD as string)
    .digest()
}

const sign = (payload: string, key: Buffer) =>
  createHmac('sha256', key).update(payload).digest('base64url')

export function createSessionToken(): string | null {
  const key = signingKey()
  if (!key) return null
  const now = Date.now()
  const payload = Buffer.from(
    JSON.stringify({ iat: now, exp: now + SESSION_MAX_AGE * 1000, n: randomBytes(8).toString('hex') }),
  ).toString('base64url')
  return `${payload}.${sign(payload, key)}`
}

export function verifySessionToken(token: string | null | undefined): boolean {
  const key = signingKey()
  if (!key || !token || token.length > MAX_TOKEN_LENGTH) return false

  const dot = token.indexOf('.')
  if (dot <= 0) return false
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)

  const expected = Buffer.from(sign(payload, key))
  const given = Buffer.from(sig)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: unknown }
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !isAdminConfigured()) return false
  // 길이가 달라도 시간이 새지 않도록 해시끼리 비교
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

export function isAuthorized(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_MAX_AGE,
}
