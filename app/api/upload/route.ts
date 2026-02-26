import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { putFile } from '@/lib/github'
import { uploadToR2 } from '@/lib/r2'

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads')
const IS_PROD = !!process.env.VERCEL

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif']
const VIDEO_EXTS = ['mp4', 'webm', 'mov']

const MIME: Record<string, string> = {
  mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const isImage = IMAGE_EXTS.includes(ext)
    const isVideo = VIDEO_EXTS.includes(ext)

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const buffer = Buffer.from(await file.arrayBuffer())

    if (isVideo) {
      // 동영상 → Cloudflare R2
      const result = await uploadToR2(filename, buffer, MIME[ext] ?? 'video/mp4')
      if (!result.ok) {
        return NextResponse.json({ error: result.error ?? 'R2 upload failed' }, { status: 500 })
      }
      return NextResponse.json({ url: result.url })
    }

    // 이미지 → 기존 GitHub / 로컬 흐름
    if (IS_PROD) {
      const result = await putFile(
        `public/uploads/${filename}`,
        buffer,
        `[admin] upload image ${filename}`,
      )
      if (!result.ok) {
        return NextResponse.json({ error: result.error ?? 'Upload failed' }, { status: 500 })
      }
    } else {
      await mkdir(UPLOAD_DIR, { recursive: true })
      await writeFile(path.join(UPLOAD_DIR, filename), buffer)
    }

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
