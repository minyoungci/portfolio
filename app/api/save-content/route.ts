import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { putFile } from '@/lib/github'

const DATA_DIR = path.join(process.cwd(), 'data')
const ALLOWED = ['projects', 'papers', 'research', 'pieces'] as const
type DataType = typeof ALLOWED[number]

const IS_PROD = !!process.env.VERCEL

// GET ?type=...
export async function GET(req: NextRequest) {
  const type = (req.nextUrl.searchParams.get('type') ?? 'pieces') as DataType
  if (!ALLOWED.includes(type)) return NextResponse.json([], { status: 400 })
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, `${type}.json`), 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json([])
  }
}

// POST { type, data }
export async function POST(req: NextRequest) {
  try {
    const { type, data } = (await req.json()) as { type: DataType; data: unknown }
    if (!ALLOWED.includes(type)) {
      return NextResponse.json({ error: 'Unsupported type' }, { status: 400 })
    }

    const json = JSON.stringify(data, null, 2)

    if (IS_PROD) {
      // 프로덕션: GitHub API로 커밋
      const result = await putFile(`data/${type}.json`, json, `[admin] update ${type}`)
      if (!result.ok) {
        return NextResponse.json({ error: result.error ?? 'GitHub write failed' }, { status: 500 })
      }
    } else {
      // 로컬: 파일시스템 직접 쓰기
      fs.writeFileSync(path.join(DATA_DIR, `${type}.json`), json, 'utf-8')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Write failed' }, { status: 500 })
  }
}
