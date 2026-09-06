import { projects } from '@/data/projects'
import { papers } from '@/data/papers'
import { researchItems } from '@/data/research'
import { posts } from '@/data/posts'
import { pieces } from '@/data/pieces'
import { getHomeSections } from '@/lib/sections'
import Hero from '@/components/Hero'
import AboutSection from '@/components/AboutSection'
import SectionHeading from '@/components/SectionHeading'
import ProjectGrid from '@/components/ProjectGrid'
import PostSection from '@/components/PostSection'
import PieceSection from '@/components/PieceSection'
import ResearchSection from '@/components/ResearchSection'
import PapersSection from '@/components/PapersSection'
import ContactSection from '@/components/ContactSection'
import AdminAccess from '@/components/AdminAccess'
import PageTransition from '@/components/PageTransition'

export default function HomePage() {
  // 섹션 순서·번호·표시 여부의 정본은 lib/sections.ts. nav도 같은 목록을 쓴다.
  // 렌더 순서는 아래 JSX 순서이므로 ORDER를 바꾸면 여기도 같이 옮긴다.
  const sections = getHomeSections()
  const numberOf = (id: string) => sections.find((s) => s.id === id)?.number ?? ''
  const visible = (id: string) => sections.some((s) => s.id === id)

  return (
    <PageTransition>
      <main className="min-h-screen">
        <Hero />

        <AboutSection number={numberOf('about')} />

        {visible('projects') && (
          <section id="projects" className="px-4 py-8 sm:px-6">
            <SectionHeading number={numberOf('projects')} title="Projects" />
            <ProjectGrid projects={projects} />
          </section>
        )}

        {visible('post') && <PostSection posts={posts} number={numberOf('post')} />}

        {visible('piece') && <PieceSection pieces={pieces} number={numberOf('piece')} />}

        {visible('research') && (
          <ResearchSection items={researchItems} number={numberOf('research')} />
        )}

        {visible('papers') && <PapersSection papers={papers} number={numberOf('papers')} />}

        <ContactSection number={numberOf('contact')} />
      </main>

      {/* 우하단 admin 진입 버튼 */}
      <AdminAccess />
    </PageTransition>
  )
}
