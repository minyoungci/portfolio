import Link from 'next/link'
import type { Post } from '@/types'

interface Props {
  posts: Post[]
}

export default function PostSection({ posts }: Props) {
  return (
    <section id="post" className="py-8 px-4 sm:px-6">
      <h2 className="text-xl tracking-[0.2em] font-medium uppercase mt-0 mb-6 pt-3 border-t border-black flex items-baseline gap-3 hover:italic transition-all duration-200">
        <span className="opacity-50">05</span>
        <span>Post</span>
      </h2>

      {posts.length === 0 ? (
        <p className="text-xs opacity-20">No posts yet.</p>
      ) : (
        <div className="divide-y divide-black/10 border-b border-black/10">
          {posts.map((post) => {
            const hash = post.id.toString(16).padStart(7, '0').slice(0, 7)

            return (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group block py-5 px-1 hover:bg-black/[0.02] transition-colors"
              >
                <div className="flex items-baseline gap-3 sm:gap-5">
                  <span className="text-black/25 text-[10px] shrink-0">●</span>
                  <span className="font-mono text-[11px] text-black/30 shrink-0 w-14">{hash}</span>
                  <span className="text-[13px] italic flex-1 min-w-0 truncate group-hover:opacity-60 transition-opacity">
                    {post.title}
                  </span>
                  <span className="text-[11px] text-black/40 hidden sm:block shrink-0 w-32 truncate text-right">
                    {post.tags[0] ?? ''}
                  </span>
                  <span className="text-[11px] text-black/30 shrink-0">{post.date.slice(0, 4)}</span>
                  <span className="text-xs text-black/20 group-hover:text-black/70 transition-colors shrink-0">→</span>
                </div>
                <p className="mt-3 ml-[5.2rem] max-w-2xl text-sm leading-6 text-black/45 hidden sm:block">
                  {post.summary}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
