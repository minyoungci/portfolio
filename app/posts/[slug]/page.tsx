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
      <main className="min-h-screen">
        <article className="mx-auto max-w-[720px] px-6 pt-28 pb-24 sm:pt-32">
          <Link href="/#post" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            ← Post
          </Link>

          <header className="mt-8 mb-10">
            <p className="text-[12px] text-muted-foreground">
              {post.date}
              {post.tags.length > 0 && <span> · {post.tags.join(', ')}</span>}
            </p>
            <h1 className="mt-4 text-[clamp(1.9rem,5vw,2.75rem)] font-semibold leading-[1.15] tracking-tight">
              {post.title}
            </h1>
            <p className="mt-5 text-[16px] leading-7 text-muted-foreground">{post.summary}</p>
          </header>

          {post.cover && (
            <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-muted shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover} alt="" className="block w-full" />
            </div>
          )}

          <MarkdownArticle content={content} />

          <nav className="mt-16 flex justify-between gap-4 border-t border-border pt-8 text-[13px]">
            {prev ? (
              <Link href={`/posts/${prev.slug}`} className="text-muted-foreground transition-colors hover:text-foreground">
                ← {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/posts/${next.slug}`} className="text-right text-muted-foreground transition-colors hover:text-foreground">
                {next.title} →
              </Link>
            ) : <span />}
          </nav>
        </article>
      </main>
    </PageTransition>
  )
}
