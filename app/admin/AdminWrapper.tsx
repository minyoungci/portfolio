'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const AdminProjects = dynamic(() => import('./AdminProjects'), { ssr: false })
const AdminPapers   = dynamic(() => import('./AdminPapers'),   { ssr: false })
const AdminResearch = dynamic(() => import('./AdminResearch'), { ssr: false })
const AdminEditor   = dynamic(() => import('./AdminEditor'),   { ssr: false })

const TABS = ['Projects', 'Papers', 'Research', 'Piece'] as const
type Tab = typeof TABS[number]

export default function AdminWrapper() {
  const [tab, setTab] = useState<Tab>('Projects')

  const isLive = typeof window !== 'undefined' && !window.location.hostname.includes('localhost')

  return (
    <div className="min-h-screen flex flex-col font-sans text-black bg-white">
      {/* Live 환경 경고 */}
      {isLive && (
        <div className="bg-black text-white text-xs px-4 py-2 text-center">
          저장 시 GitHub에 커밋 → Vercel 자동 재배포 (반영까지 약 1–2분 소요)
        </div>
      )}
      {/* Tab bar */}
      <div className="flex border-b border-black px-4 shrink-0">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs px-5 py-3 border-b-2 transition-colors ${
              tab === t
                ? 'border-black opacity-100'
                : 'border-transparent opacity-30 hover:opacity-70'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content area — sidebar + form/editor side by side */}
      <div className="flex flex-1 overflow-hidden">
        {tab === 'Projects'  && <AdminProjects />}
        {tab === 'Papers'    && <AdminPapers />}
        {tab === 'Research'  && <AdminResearch />}
        {tab === 'Piece'     && <AdminEditor />}
      </div>
    </div>
  )
}
