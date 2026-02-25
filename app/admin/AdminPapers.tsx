'use client'

import { useState, useEffect } from 'react'
import type { Paper } from '@/types'

const EMPTY = {
  title: '', authors: '', journal: '', year: new Date().getFullYear(),
  abstract: '', arxiv: '', pdf: '', doi: '',
}
type Form = typeof EMPTY

function toPaper(form: Form, id: number): Paper {
  return {
    id, title: form.title, authors: form.authors,
    journal: form.journal, year: Number(form.year),
    abstract: form.abstract || undefined,
    links: {
      ...(form.arxiv && { arxiv: form.arxiv }),
      ...(form.pdf && { pdf: form.pdf }),
      ...(form.doi && { doi: form.doi }),
    },
  }
}

function fromPaper(p: Paper): Form {
  return {
    title: p.title, authors: p.authors, journal: p.journal, year: p.year,
    abstract: p.abstract ?? '',
    arxiv: p.links.arxiv ?? '', pdf: p.links.pdf ?? '', doi: p.links.doi ?? '',
  }
}

export default function AdminPapers() {
  const [items, setItems] = useState<Paper[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/save-content?type=papers').then(r => r.json()).then(setItems).catch(() => {})
  }, [])

  const set = (k: keyof Form, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }))

  const selectItem = (p: Paper) => { setSelectedId(p.id); setForm(fromPaper(p)) }
  const newItem = () => { setSelectedId(-1); setForm(EMPTY) }

  const deleteItem = async () => {
    if (selectedId === null) return
    const next = items.filter(p => p.id !== selectedId)
    await fetch('/api/save-content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'papers', data: next }),
    })
    setItems(next); setSelectedId(null); setForm(EMPTY)
  }

  const save = async () => {
    setStatus('saving')
    const id = selectedId === -1 ? Date.now() : selectedId!
    const updated = toPaper(form, id)
    const next = items.some(p => p.id === id)
      ? items.map(p => p.id === id ? updated : p)
      : [...items, updated]
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'papers', data: next }),
      })
      if (!res.ok) throw new Error()
      setItems(next); setSelectedId(id); setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 3000) }
  }

  const F = ({ label, k, type = 'text', placeholder = '' }: {
    label: string; k: keyof Form; type?: string; placeholder?: string
  }) => (
    <div className="mb-4">
      <label className="text-xs opacity-50 block mb-1">{label}</label>
      <input type={type} value={String(form[k])}
        onChange={e => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm border-b border-black outline-none py-1 bg-transparent" />
    </div>
  )

  return (
    <>
      <aside className="w-56 border-r border-black flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-black flex items-center justify-between">
          <span className="text-xs tracking-widest">PAPERS</span>
          <button onClick={newItem}
            className="text-xs border border-black px-2 py-0.5 hover:bg-black hover:text-white transition-colors">
            + New
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {items.map(p => (
            <li key={p.id}>
              <button onClick={() => selectItem(p)}
                className={`w-full text-left px-4 py-3 text-xs border-b border-black hover:bg-black hover:text-white transition-colors ${selectedId === p.id ? 'bg-black text-white' : ''}`}>
                <div className="truncate italic">{p.title || '(untitled)'}</div>
                <div className="opacity-50 mt-0.5">{p.journal}, {p.year}</div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedId !== null ? (
          <>
            <div className="border-b border-black px-6 py-3 flex items-center justify-between">
              <span className="text-xs opacity-50">{selectedId === -1 ? 'New Paper' : `ID ${selectedId}`}</span>
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
                <F label="Title" k="title" />
                <F label="Authors" k="authors" placeholder="Kim M., Lee S., ..." />
                <div className="grid grid-cols-2 gap-4">
                  <F label="Journal / Venue" k="journal" placeholder="Nature Medicine" />
                  <F label="Year" k="year" type="number" />
                </div>
                <div className="mb-4">
                  <label className="text-xs opacity-50 block mb-1">Abstract</label>
                  <textarea value={form.abstract}
                    onChange={e => set('abstract', e.target.value)}
                    rows={6}
                    className="w-full text-sm border-b border-black outline-none py-1 bg-transparent resize-none leading-relaxed" />
                </div>
                <div className="mt-2 pt-4 border-t border-black">
                  <p className="text-xs opacity-50 mb-3">Links</p>
                  <F label="arXiv" k="arxiv" placeholder="https://arxiv.org/abs/..." />
                  <F label="PDF" k="pdf" placeholder="https://..." />
                  <F label="DOI" k="doi" placeholder="https://doi.org/..." />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center opacity-30 text-sm">
            논문을 선택하거나 새로 만드세요
          </div>
        )}
      </div>
    </>
  )
}
