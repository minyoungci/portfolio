/**
 * admin 화면 전용 fetch 래퍼 (브라우저에서만 호출).
 * 401(세션 만료·로그아웃)이면 로그인 페이지로 보내고, 그 외 실패는 예외로 던져
 * 호출부가 상태를 잘못 갱신하지 않게 한다.
 */
export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init)
  if (res.status === 401) {
    if (typeof window !== 'undefined') window.location.assign('/admin/login')
    throw new UnauthorizedError()
  }
  return res
}

/** JSON 응답을 기대하는 요청. 실패 응답은 예외. */
export async function adminJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await adminFetch(input, init)
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return (await res.json()) as T
}

/** 목록 GET. 배열이 아니면 빈 배열로 취급한다. */
export async function adminList<T>(type: string): Promise<T[]> {
  const data = await adminJson<unknown>(`/api/save-content?type=${type}`)
  return Array.isArray(data) ? (data as T[]) : []
}

/** 목록 전체 저장. ok가 아니면 예외. */
export async function adminSave(type: string, data: unknown): Promise<void> {
  const res = await adminFetch('/api/save-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, data }),
  })
  if (!res.ok) throw new Error(`Save failed (${res.status})`)
}
