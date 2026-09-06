import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { posts } from '@/data/posts'
import MarkdownArticle from '@/components/MarkdownArticle'
import PageTransition from '@/components/PageTransition'

interface Props {
  params: Promise<{ slug: string }>
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts')

function getPostContent(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf-8')
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((item) => item.slug === slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.summary,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = posts.find((item) => item.slug === slug)
  const content = getPostContent(slug)

  if (!post || !content) notFound()

  const currentIndex = posts.findIndex((item) => item.slug === slug)
  const prev = posts[currentIndex - 1] ?? null
  const next = posts[currentIndex + 1] ?? null

  return (
    <PageTransition>
      <main className="min-h-screen bg-white">
        <article className="mx-auto max-w-[760px] px-5 sm:px-8 pt-20 pb-24">
          <Link
            href="/#post"
            className="text-[11px] uppercase tracking-[0.22em] text-black/60 hover:text-black transition-colors"
          >
            ← Back to posts
          </Link>

          <header className="mt-12 mb-12 border-b border-black/10 pb-10">
            <div className="text-[11px] uppercase tracking-[0.22em] text-black/60">
              Post / {post.date} / {post.tags.join(', ')}
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,3.75rem)] leading-[0.95] tracking-[-0.03em] mt-5">
              {post.title}
            </h1>
            <p className="text-[17px] sm:text-[19px] leading-8 text-black/60 mt-7 font-serif">
              {post.summary}
            </p>
          </header>

          <MarkdownArticle content={content} />

          <nav className="mt-20 pt-8 border-t border-black/20 flex justify-between gap-6 text-[11px] uppercase tracking-[0.18em]">
            {prev ? (
              <Link href={`/posts/${prev.slug}`} className="hover:opacity-60 transition-opacity">
                ← {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/posts/${next.slug}`} className="text-right hover:opacity-60 transition-opacity">
                {next.title} →
              </Link>
            ) : <span />}
          </nav>
        </article>
      </main>
    </PageTransition>
  )
}
