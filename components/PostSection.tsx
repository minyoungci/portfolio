import Link from 'next/link'
import type { Post } from '@/types'
import SectionHeading from '@/components/SectionHeading'

interface Props {
  posts: Post[]
  number: string
}

export default function PostSection({ posts, number }: Props) {
  if (posts.length === 0) return null

  return (
    <section id="post" className="px-4 py-8 sm:px-6">
      <SectionHeading number={number} title="Post" />

      <div className="max-w-3xl divide-y divide-black/10 border-b border-black/10">
        {posts.map((post, index) => (
          <Link key={post.id} href={`/posts/${post.slug}`} className="group block py-5">
            <div className="flex items-baseline gap-4">
              <span className="w-8 shrink-0 tabular-nums text-[12px] text-black/60">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1 text-[15px] italic leading-snug transition-colors group-hover:text-black/60">
                {post.title}
              </span>
              <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.16em] text-black/60 sm:inline">
                {post.tags[0] ?? ''}
              </span>
              <span className="shrink-0 tabular-nums text-[12px] text-black/60">{post.date}</span>
            </div>
            <p className="mt-2 pl-12 text-[13px] leading-6 text-black/60">{post.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
