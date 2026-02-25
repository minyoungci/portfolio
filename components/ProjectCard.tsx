'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      {/* Image container */}
      <div className="overflow-hidden bg-[#F5F5F5] aspect-[4/3] relative mb-3">
        <motion.div
          className="w-full h-full relative"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F5F5F5]" />
          )}
        </motion.div>
      </div>
      {/* Meta */}
      <p className="text-xs uppercase tracking-wider text-black/50 mb-1">
        {project.category[0]}
      </p>
      <p className="italic">{project.title}</p>
      <p className="text-xs text-black/40">{project.year}</p>
    </Link>
  )
}
