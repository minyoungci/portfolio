'use client'

import { useState, useEffect } from 'react'
import type { Piece } from '@/types'

const EMPTY = {
  title: '',
  date: new Date().toISOString().slice(0, 7),
  image: '',
  prompt: '',
}
type Form = typeof EMPTY

function fromPiece(p: Piece): Form {
  return { title: p.title ?? '', date: p.date, image: p.image, prompt: p.prompt }
}

function toPiece(form: Form, id: number): Piece {
  return {
    id,
    slug: form.title
      ? form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : `piece-${id}`,
    title: form.title || undefined,
    date: form.date,
    image: form.image,
    prompt: form.prompt,
  }
}

export default function AdminEditor() {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/save-content?type=pieces')
      .then(r => r.json())
      .then(setPieces)
      .catch(() => {})
  }, [])

  const set = (k: keyof Form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const selectPiece = (p: Piece) => { setSelectedId(p.id); setForm(fromPiece(p)) }
  const newPiece = () => { setSelectedId(-1); setForm(EMPTY) }

  const deletePiece = async () => {
    if (selectedId === null) return
    const next = pieces.filter(p => p.id !== selectedId)
    await fetch('/api/save-content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pieces', data: next }),
    })
    setPieces(next); setSelectedId(null); setForm(EMPTY)
  }

  const save = async () => {
    if (!form.image || !form.prompt) return
    setStatus('saving')
    const id = selectedId === -1 ? Date.now() : selectedId!
    const updated = toPiece(form, id)
    const next = pieces.some(p => p.id === id)
      ? pieces.map(p => p.id === id ? updated : p)
      : [...pieces, updated]
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pieces', data: next }),
      })
      if (!res.ok) throw new Error()
      setPieces(next); setSelectedId(id); setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 3000) }
  }

  return (
    <>
      {/* Sidebar */}
      <aside className="w-56 border-r border-black flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-black flex items-center justify-between">
          <span className="text-xs tracking-widest">PIECE</span>
          <button onClick={newPiece}
            className="text-xs border border-black px-2 py-0.5 hover:bg-black hover:text-white transition-colors">
            + New
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {pieces.map(p => (
            <li key={p.id}>
              <button onClick={() => selectPiece(p)}
                className={`w-full text-left px-3 py-2 border-b border-black hover:bg-black hover:text-white transition-colors ${selectedId === p.id ? 'bg-black text-white' : ''}`}>
                {/* Thumbnail preview */}
                {p.image && (
                  <div className="w-full aspect-video mb-1 overflow-hidden bg-gray-100">
                    <img src={p.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="text-xs truncate">{p.title || p.prompt.slice(0, 30) || '(untitled)'}</div>
                <div className="text-[10px] opacity-50 mt-0.5">{p.date}</div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedId !== null ? (
          <>
            <div className="border-b border-black px-6 py-3 flex items-center justify-between shrink-0">
              <span className="text-xs opacity-50">{selectedId === -1 ? 'New Piece' : `ID ${selectedId}`}</span>
              <div className="flex gap-2">
                {selectedId !== -1 && (
                  <button onClick={deletePiece}
                    className="text-xs border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors opacity-40 hover:opacity-100">
                    삭제
                  </button>
                )}
                <button onClick={save} disabled={status === 'saving' || !form.image || !form.prompt}
                  className="text-xs border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors disabled:opacity-30">
                  {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : status === 'error' ? 'Error ✗' : '저장'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex gap-6 px-6 py-6">
              {/* Form fields */}
              <div className="flex-1 max-w-lg space-y-5">
                <div>
                  <label className="text-xs opacity-50 block mb-1">Image URL <span className="text-red-400">*</span></label>
                  <input value={form.image} onChange={e => set('image', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-sm border-b border-black outline-none py-1 bg-transparent" />
                </div>
                <div>
                  <label className="text-xs opacity-50 block mb-1">Prompt / Description <span className="text-red-400">*</span></label>
                  <textarea value={form.prompt} onChange={e => set('prompt', e.target.value)}
                    rows={5} placeholder="A hyperrealistic photograph of..."
                    className="w-full text-sm border-b border-black outline-none py-1 bg-transparent resize-none leading-relaxed" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs opacity-50 block mb-1">Title (선택)</label>
                    <input value={form.title} onChange={e => set('title', e.target.value)}
                      className="w-full text-sm border-b border-black outline-none py-1 bg-transparent" />
                  </div>
                  <div>
                    <label className="text-xs opacity-50 block mb-1">Date</label>
                    <input value={form.date} onChange={e => set('date', e.target.value)}
                      placeholder="YYYY-MM"
                      className="w-full text-sm border-b border-black outline-none py-1 bg-transparent" />
                  </div>
                </div>
              </div>

              {/* Image preview */}
              {form.image && (
                <div className="w-64 shrink-0">
                  <p className="text-xs opacity-40 mb-2">Preview</p>
                  <img src={form.image} alt="preview"
                    className="w-full object-cover border border-black/10"
                    onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center opacity-30 text-sm">
            작품을 선택하거나 새로 만드세요
          </div>
        )}
      </div>
    </>
  )
}
