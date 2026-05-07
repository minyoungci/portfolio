import Link from 'next/link'
import type React from 'react'
import type { Paper, Piece, Post, Project, ResearchItem } from '@/types'

interface MobileHomeProps {
  projects: Project[]
  papers: Paper[]
  researchItems: ResearchItem[]
  pieces: Piece[]
  posts: Post[]
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center justify-between border-t border-black pt-3 mb-4">
      <h2 className="text-[11px] uppercase tracking-[0.28em] font-bold">
        <span className="opacity-35 mr-2">{index}</span>
        {title}
      </h2>
      <span className="text-[10px] opacity-25">MINYOUNG KIM</span>
    </div>
  )
}

function MiniMeta({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-black/35">{children}</p>
}

export default function MobileHome({ projects, papers, researchItems, pieces, posts }: MobileHomeProps) {
  const featuredProjects = projects.slice(0, 4)
  const featuredPapers = papers.slice(0, 3)
  const featuredResearch = researchItems.slice(0, 3)
  const featuredPieces = pieces.slice(0, 6)
  const featuredPosts = posts.slice(0, 2)

  return (
    <main className="min-h-screen bg-white md:hidden">
      <section className="px-4 pt-8 pb-10">
        <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Medical AI / Futurist</p>
        <h1 className="mt-5 font-serif text-[4rem] leading-[0.78] tracking-[-0.08em]">
          Minyoung<br />Kim
        </h1>
        <p className="mt-6 max-w-[20rem] text-[13px] leading-6 text-black/62">
          Research-oriented portfolio for medical AI, structural MRI, GBD analytics, and visual knowledge work.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.18em]">
          <a href="#mobile-post" className="border border-black px-3 py-3">Latest posts</a>
          <a href="#mobile-projects" className="border border-black px-3 py-3">Projects</a>
        </div>
      </section>

      <section id="mobile-post" className="px-4 py-8 bg-black text-white">
        <div className="flex items-center justify-between border-t border-white/35 pt-3 mb-4">
          <h2 className="text-[11px] uppercase tracking-[0.28em] font-bold">
            <span className="opacity-45 mr-2">01</span>
            Posts
          </h2>
          <span className="text-[10px] opacity-35">READ</span>
        </div>
        <div className="space-y-3">
          {featuredPosts.map((post, index) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="block border border-white/25 p-4 active:bg-white active:text-black transition-colors">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[10px] text-white/40">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[10px] text-white/40">{post.date.slice(0, 4)}</span>
              </div>
              <h3 className="mt-4 font-serif text-[1.55rem] leading-none tracking-[-0.04em]">{post.title}</h3>
              <p className="mt-3 text-[12px] leading-5 text-white/62 line-clamp-3">{post.summary}</p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-white/45">Open article →</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="mobile-projects" className="px-4 py-8">
        <SectionLabel index="02" title="Projects" />
        <div className="divide-y divide-black/12 border-b border-black/12">
          {featuredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="block py-4">
              <div className="flex items-start gap-3">
                <span className="font-mono text-[10px] text-black/30 w-8 shrink-0">{String(project.id).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[14px] italic leading-snug">{project.title}</h3>
                  <p className="mt-1 text-[11px] leading-5 text-black/45 line-clamp-2">{project.subtitle}</p>
                  <MiniMeta>{project.category[0] ?? 'Project'} · {project.year}</MiniMeta>
                </div>
                <span className="text-black/35">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="mobile-papers" className="px-4 py-8 bg-[#f5f5f5]">
        <SectionLabel index="03" title="Papers" />
        <div className="space-y-4">
          {featuredPapers.map((paper) => (
            <article key={paper.id} className="border-t border-black/12 pt-4">
              <h3 className="text-[13px] leading-snug font-bold">{paper.title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-black/50">{paper.journal} · {paper.year}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="mobile-research" className="px-4 py-8">
        <SectionLabel index="04" title="Research" />
        <div className="space-y-3">
          {featuredResearch.map((item) => (
            <article key={item.id} className="border border-black/12 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[13px] leading-snug">{item.title}</h3>
                <span className="text-[10px] text-black/35 shrink-0">{item.status}</span>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-black/55 line-clamp-3">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="mobile-piece" className="px-4 py-8 bg-black text-white">
        <div className="flex items-center justify-between border-t border-white/35 pt-3 mb-4">
          <h2 className="text-[11px] uppercase tracking-[0.28em] font-bold">
            <span className="opacity-45 mr-2">05</span>
            Piece
          </h2>
          <span className="text-[10px] opacity-35">VISUAL</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {featuredPieces.map((piece) => (
            <div key={piece.id} className="overflow-hidden bg-white/5">
              {/\.(mp4|webm|mov)$/i.test(piece.image) ? (
                <video src={piece.image} autoPlay muted loop playsInline className="aspect-square w-full object-cover" />
              ) : (
                <img src={piece.image} alt={piece.title ?? piece.prompt.slice(0, 60)} loading="lazy" className="aspect-square w-full object-cover" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="mobile-contact" className="px-4 py-10">
        <SectionLabel index="06" title="Contact" />
        <a href="mailto:dbssus123@gmail.com" className="block font-serif text-[2.6rem] leading-none tracking-[-0.06em]">
          Work<br />Together
        </a>
        <p className="mt-5 text-[12px] leading-6 text-black/50">
          For research collaboration, medical AI projects, and knowledge architecture.
        </p>
      </section>
    </main>
  )
}
