import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { putFile } from '@/lib/github'

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads')
const IS_PROD = !!process.env.VERCEL

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const buffer = Buffer.from(await file.arrayBuffer())

    if (IS_PROD) {
      // 프로덕션: GitHub API로 업로드
      const result = await putFile(
        `public/uploads/${filename}`,
        buffer,
        `[admin] upload image ${filename}`,
      )
      if (!result.ok) {
        return NextResponse.json({ error: result.error ?? 'Upload failed' }, { status: 500 })
      }
    } else {
      // 로컬: public/uploads 에 저장
      await mkdir(UPLOAD_DIR, { recursive: true })
      await writeFile(path.join(UPLOAD_DIR, filename), buffer)
    }

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
