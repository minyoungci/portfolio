'use client'

import { useState, useEffect } from 'react'
import type { Project } from '@/types'
import ImageUploadButton from '@/components/ImageUploadButton'

const EMPTY = {
  title: '', subtitle: '', year: new Date().getFullYear(),
  categoryStr: '', stackStr: '', description: '',
  thumbnail: '', github: '', demo: '', paper: '', featured: false,
}

type Form = typeof EMPTY

function toProject(form: Form, id: number): Project {
  return {
    id,
    slug: form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    title: form.title,
    subtitle: form.subtitle,
    year: Number(form.year),
    category: form.categoryStr.split(',').map(s => s.trim()).filter(Boolean),
    stack: form.stackStr.split(',').map(s => s.trim()).filter(Boolean),
    description: form.description,
    thumbnail: form.thumbnail,
    images: [],
    links: {
      ...(form.github && { github: form.github }),
      ...(form.demo && { demo: form.demo }),
      ...(form.paper && { paper: form.paper }),
    },
    featured: form.featured,
  }
}

function fromProject(p: Project): Form {
  return {
    title: p.title, subtitle: p.subtitle, year: p.year,
    categoryStr: p.category.join(', '), stackStr: p.stack.join(', '),
    description: p.description, thumbnail: p.thumbnail,
    github: p.links.github ?? '', demo: p.links.demo ?? '', paper: p.links.paper ?? '',
    featured: p.featured,
  }
}

export default function AdminProjects() {
  const [items, setItems] = useState<Project[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/save-content?type=projects').then(r => r.json()).then(setItems).catch(() => {})
  }, [])

  const set = (k: keyof Form, v: string | boolean | number) =>
    setForm(f => ({ ...f, [k]: v }))

  const selectItem = (p: Project) => { setSelectedId(p.id); setForm(fromProject(p)) }

  const newItem = () => {
    setSelectedId(-1)
    setForm(EMPTY)
  }

  const deleteItem = async () => {
    if (selectedId === null) return
    const next = items.filter(p => p.id !== selectedId)
    await fetch('/api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'projects', data: next }),
    })
    setItems(next); setSelectedId(null); setForm(EMPTY)
  }

  const save = async () => {
    setStatus('saving')
    const id = selectedId === -1 ? Date.now() : selectedId!
    const updated = toProject(form, id)
    const next = items.some(p => p.id === id)
      ? items.map(p => p.id === id ? updated : p)
      : [...items, updated]
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'projects', data: next }),
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
      <input
        type={type}
        value={String(form[k])}
        onChange={e => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm border-b border-black outline-none py-1 bg-transparent"
      />
    </div>
  )

  return (
    <>
      {/* Sidebar */}
      <aside className="w-56 border-r border-black flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-black flex items-center justify-between">
          <span className="text-xs tracking-widest">PROJECTS</span>
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
                <div className="truncate">{p.title || '(untitled)'}</div>
                <div className="opacity-50 mt-0.5">{p.year}</div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedId !== null ? (
          <>
            <div className="border-b border-black px-6 py-3 flex items-center justify-between">
              <span className="text-xs opacity-50">
                {selectedId === -1 ? 'New Project' : `ID ${selectedId}`}
              </span>
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
                <F label="Subtitle (한 줄 설명)" k="subtitle" />
                <div className="grid grid-cols-2 gap-4">
                  <F label="Year" k="year" type="number" />
                  <div className="mb-4">
                    <label className="text-xs opacity-50 block mb-1">Featured</label>
                    <input type="checkbox" checked={form.featured}
                      onChange={e => set('featured', e.target.checked)}
                      className="mt-1" />
                  </div>
                </div>
                <F label="Category (쉼표 구분, 예: Medical AI, Vision)" k="categoryStr" />
                <F label="Stack (쉼표 구분, 예: Python, PyTorch)" k="stackStr" />
                <div className="mb-4">
                  <label className="text-xs opacity-50 block mb-1">Description</label>
                  <textarea value={form.description}
                    onChange={e => set('description', e.target.value)}
                    rows={6}
                    className="w-full text-sm border-b border-black outline-none py-1 bg-transparent resize-none leading-relaxed"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs opacity-50 block mb-1">Thumbnail URL</label>
                  <div className="flex items-center gap-2">
                    <input value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)}
                      placeholder="https://... 또는 파일 선택"
                      className="flex-1 text-sm border-b border-black outline-none py-1 bg-transparent" />
                    <ImageUploadButton onUpload={(url) => set('thumbnail', url)} />
                  </div>
                </div>
                <div className="mt-2 pt-4 border-t border-black">
                  <p className="text-xs opacity-50 mb-3">Links</p>
                  <F label="GitHub" k="github" placeholder="https://github.com/..." />
                  <F label="Demo" k="demo" placeholder="https://..." />
                  <F label="Paper" k="paper" placeholder="https://arxiv.org/..." />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center opacity-30 text-sm">
            프로젝트를 선택하거나 새로 만드세요
          </div>
        )}
      </div>
    </>
  )
}
