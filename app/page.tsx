import { projects } from '@/data/projects'
import { papers } from '@/data/papers'
import { researchItems } from '@/data/research'
import piecesData from '@/data/pieces.json'
import ProjectGrid from '@/components/ProjectGrid'
import PapersSection from '@/components/PapersSection'
import ResearchSection from '@/components/ResearchSection'
import PieceSection from '@/components/PieceSection'
import ContactSection from '@/components/ContactSection'
import AdminAccess from '@/components/AdminAccess'
import PageTransition from '@/components/PageTransition'
import type { Piece } from '@/types'

const pieces = piecesData as Piece[]

export default function HomePage() {
  return (
    <PageTransition>
      <main className="min-h-screen">
        {/* 01 — PROJECTS */}
        <section id="projects" className="py-16 px-4">
          <h2 className="text-xs tracking-widest mb-8 pb-3 border-b border-black">
            01 — PROJECTS
          </h2>
          <ProjectGrid projects={projects} />
        </section>

        {/* 02 — PAPERS */}
        <PapersSection papers={papers} />

        {/* 03 — RESEARCH */}
        <ResearchSection items={researchItems} />

        {/* 04 — PIECE */}
        <PieceSection pieces={pieces} />

        {/* 05 — CONTACT */}
        <ContactSection />
      </main>

      {/* 우하단 admin 진입 버튼 (반투명) */}
      <AdminAccess />
    </PageTransition>
  )
}
