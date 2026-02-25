import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const ALLOWED = ['projects', 'papers', 'research', 'pieces'] as const
type DataType = typeof ALLOWED[number]

function filePath(type: DataType) {
  return path.join(DATA_DIR, `${type}.json`)
}

// GET ?type=projects|papers|research|pieces
export async function GET(req: NextRequest) {
  const type = (req.nextUrl.searchParams.get('type') ?? 'pieces') as DataType
  if (!ALLOWED.includes(type)) return NextResponse.json([], { status: 400 })
  try {
    const raw = fs.readFileSync(filePath(type), 'utf-8')
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
    fs.writeFileSync(filePath(type), JSON.stringify(data, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Write failed' }, { status: 500 })
  }
}
