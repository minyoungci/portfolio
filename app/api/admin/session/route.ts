import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/adminAuth'

/** 세션 확인. 로그인 페이지가 마운트 시 같은 출처로 호출해 유효한 세션이면 /admin으로 보낸다. */
export async function GET(req: NextRequest) {
  return isAuthorized(req)
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
