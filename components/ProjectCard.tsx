import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index: number // 배열 순서. 번호는 여기서 파생한다 (id는 timestamp라 쓰지 않음).
}

const isVideo = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src)

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="mb-3 flex items-baseline justify-between text-[11px] uppercase tracking-[0.18em] text-black/60">
        <span className="tabular-nums">{number}</span>
        <span>{project.category[0] ?? 'Project'}</span>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-gray">
        {project.thumbnail ? (
          isVideo(project.thumbnail) ? (
            <video
              src={project.thumbnail}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-all duration-300 group-hover:scale-[1.02] group-hover:opacity-90"
            />
          )
        ) : (
          <div className="flex h-full w-full items-end p-4">
            <span className="font-serif text-4xl font-light text-black/30">{number}</span>
          </div>
        )}
      </div>

      <p className="mt-3 text-[15px] italic leading-snug">{project.title}</p>
      {project.subtitle && (
        <p className="mt-1 text-[13px] leading-5 text-black/60">{project.subtitle}</p>
      )}
      <p className="mt-1 text-[12px] tabular-nums text-black/60">{project.year}</p>
    </Link>
  )
}
