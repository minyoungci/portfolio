'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      {/* Image — natural aspect ratio */}
      <div className="overflow-hidden bg-[#F5F5F5] mb-2">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            width={0}
            height={0}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
            className="w-full h-auto block group-hover:opacity-90 transition-opacity duration-200"
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-[#F5F5F5]" />
        )}
      </div>
      {/* Meta */}
      <p className="text-[11px] uppercase tracking-wider text-black/50 mb-0.5">
        {project.category[0]}
      </p>
      <p className="text-[13px] italic">{project.title}</p>
      <p className="text-[11px] text-black/40">{project.year}</p>
    </Link>
  )
}
