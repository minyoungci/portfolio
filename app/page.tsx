import { projects } from '@/data/projects'
import { papers } from '@/data/papers'
import { researchItems } from '@/data/research'
import { posts } from '@/data/posts'
import { pieces } from '@/data/pieces'
import { getHomeSections } from '@/lib/sections'
import { postSlides, projectSlides } from '@/lib/shelves'
import Hero from '@/components/Hero'
import Shelf from '@/components/Shelf'
import PieceShelf from '@/components/PieceShelf'
import ResearchSection from '@/components/ResearchSection'
import PapersSection from '@/components/PapersSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import AdminAccess from '@/components/AdminAccess'
import PageTransition from '@/components/PageTransition'

export default function HomePage() {
  // 섹션 순서·표시 여부의 정본은 lib/sections.ts. 렌더 순서는 아래 JSX 순서이므로 ORDER를 바꾸면 여기도 옮긴다.
  const sections = getHomeSections()
  const visible = (id: string) => sections.some((s) => s.id === id)

  return (
    <PageTransition>
      <main className="min-h-screen">
        <Hero />

        {visible('projects') && (
          <Shelf
            id="projects"
            title="Projects"
            description="만들고 있는 것. 카드를 누르면 상세로 이동합니다."
            slides={projectSlides(projects)}
          />
        )}

        {visible('post') && (
          <Shelf
            id="post"
            title="Post"
            description="연구 노트와 가이드."
            slides={postSlides(posts)}
          />
        )}

        {visible('piece') && <PieceShelf pieces={pieces} />}

        {visible('research') && <ResearchSection items={researchItems} />}

        {visible('papers') && <PapersSection papers={papers} />}

        <AboutSection />

        <ContactSection />
      </main>

      {/* 우하단 admin 진입 링크 */}
      <AdminAccess />
    </PageTransition>
  )
}
