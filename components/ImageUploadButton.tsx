'use client'

import { useRef, useState } from 'react'

interface Props {
  onUpload: (url: string) => void
}

export default function ImageUploadButton({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) onUpload(data.url)
    } catch {
      alert('업로드 실패')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-xs border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors disabled:opacity-40 shrink-0"
      >
        {uploading ? '업로드 중…' : '파일 선택'}
      </button>
    </>
  )
}
