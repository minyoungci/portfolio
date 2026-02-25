'use client'

import { useState, useEffect } from 'react'
import type { ResearchItem } from '@/types'

const EMPTY = {
  title: '', description: '', status: 'ongoing' as 'ongoing' | 'completed', tagsStr: '',
}
type Form = typeof EMPTY

function toItem(form: Form, id: number): ResearchItem {
  return {
    id, title: form.title, description: form.description, status: form.status,
    tags: form.tagsStr.split(',').map(s => s.trim()).filter(Boolean),
  }
}

function fromItem(r: ResearchItem): Form {
  return { title: r.title, description: r.description, status: r.status, tagsStr: r.tags.join(', ') }
}

export default function AdminResearch() {
  const [items, setItems] = useState<ResearchItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/save-content?type=research').then(r => r.json()).then(setItems).catch(() => {})
  }, [])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => ({ ...f, [k]: v }))
  const selectItem = (r: ResearchItem) => { setSelectedId(r.id); setForm(fromItem(r)) }
  const newItem = () => { setSelectedId(-1); setForm(EMPTY) }

  const deleteItem = async () => {
    if (selectedId === null) return
    const next = items.filter(r => r.id !== selectedId)
    await fetch('/api/save-content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'research', data: next }),
    })
    setItems(next); setSelectedId(null); setForm(EMPTY)
  }

  const save = async () => {
    setStatus('saving')
    const id = selectedId === -1 ? Date.now() : selectedId!
    const updated = toItem(form, id)
    const next = items.some(r => r.id === id)
      ? items.map(r => r.id === id ? updated : r)
      : [...items, updated]
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'research', data: next }),
      })
      if (!res.ok) throw new Error()
      setItems(next); setSelectedId(id); setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 3000) }
  }

  return (
    <>
      <aside className="w-56 border-r border-black flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-black flex items-center justify-between">
          <span className="text-xs tracking-widest">RESEARCH</span>
          <button onClick={newItem}
            className="text-xs border border-black px-2 py-0.5 hover:bg-black hover:text-white transition-colors">
            + New
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {items.map(r => (
            <li key={r.id}>
              <button onClick={() => selectItem(r)}
                className={`w-full text-left px-4 py-3 text-xs border-b border-black hover:bg-black hover:text-white transition-colors ${selectedId === r.id ? 'bg-black text-white' : ''}`}>
                <div className="truncate">{r.title || '(untitled)'}</div>
                <div className="opacity-50 mt-0.5">
                  {r.status === 'ongoing' ? '● ongoing' : '○ completed'}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedId !== null ? (
          <>
            <div className="border-b border-black px-6 py-3 flex items-center justify-between">
              <span className="text-xs opacity-50">{selectedId === -1 ? 'New Research' : `ID ${selectedId}`}</span>
              <div className="flex gap-2">
                {selectedId !== -1 && (
                  <button onClick={deleteItem}
                    className="text-xs border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors opacity-40 hover:opacity-100">
                    삭제
                  </button>
                )}
                <button onClick={save} disabled={status === 'saving'}
                  className="text-xs border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors disabled:opacity-40">
                  {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : status === 'error' ? 'Error ✗' : '저장'}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="max-w-xl">
                <div className="mb-4">
                  <label className="text-xs opacity-50 block mb-1">Title</label>
                  <input value={form.title} onChange={e => set('title', e.target.value)}
                    className="w-full text-sm border-b border-black outline-none py-1 bg-transparent" />
                </div>
                <div className="mb-4">
                  <label className="text-xs opacity-50 block mb-1">Status</label>
                  <div className="flex gap-4 mt-1">
                    {(['ongoing', 'completed'] as const).map(s => (
                      <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" value={s} checked={form.status === s}
                          onChange={() => set('status', s)} />
                        {s === 'ongoing' ? '● ongoing' : '○ completed'}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-xs opacity-50 block mb-1">Description</label>
                  <textarea value={form.description}
                    onChange={e => set('description', e.target.value)}
                    rows={5}
                    className="w-full text-sm border-b border-black outline-none py-1 bg-transparent resize-none leading-relaxed" />
                </div>
                <div className="mb-4">
                  <label className="text-xs opacity-50 block mb-1">Tags (쉼표 구분)</label>
                  <input value={form.tagsStr} onChange={e => set('tagsStr', e.target.value)}
                    placeholder="Medical AI, Safety, Deployment"
                    className="w-full text-sm border-b border-black outline-none py-1 bg-transparent" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center opacity-30 text-sm">
            연구 항목을 선택하거나 새로 만드세요
          </div>
        )}
      </div>
    </>
  )
}
