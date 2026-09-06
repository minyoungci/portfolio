import Link from 'next/link'
import { profile } from '@/data/profile'
import { timeline } from '@/data/timeline'
import type { TimelineKind } from '@/types'
import SectionHeading from '@/components/SectionHeading'

export const KIND_ORDER: TimelineKind[] = ['career', 'education', 'award', 'activity']
export const KIND_LABEL: Record<TimelineKind, string> = {
  career: 'Career',
  education: 'Education',
  award: 'Awards',
  activity: 'Activities',
}

export function groupTimeline() {
  return KIND_ORDER.map((kind) => ({
    kind,
    items: timeline.filter((entry) => entry.kind === kind),
  })).filter((group) => group.items.length > 0)
}

interface AboutSectionProps {
  number: string
}

export default function AboutSection({ number }: AboutSectionProps) {
  const groups = groupTimeline()

  return (
    <section id="about" className="px-4 py-8 sm:px-6">
      <SectionHeading
        number={number}
        title="About"
        aside={
          <Link href="/about" className="transition-colors hover:text-black">
            Full profile →
          </Link>
        }
      />

      <div className="grid gap-10 md:grid-cols-12">
        <div className="max-w-2xl space-y-5 text-[15px] leading-7 md:col-span-7">
          {profile.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {groups.length > 0 && (
          <div className="space-y-8 md:col-span-5">
            {groups.map((group) => (
              <div key={group.kind}>
                <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-black/60">
                  {KIND_LABEL[group.kind]}
                </p>
                <ul className="divide-y divide-black/10 border-y border-black/10">
                  {group.items.map((entry, i) => (
                    <li key={i} className="grid grid-cols-[6rem_1fr] gap-4 py-3 text-[13px]">
                      <span className="tabular-nums text-black/60">{entry.year}</span>
                      <div>
                        <p className="italic">{entry.title}</p>
                        {entry.org && <p className="text-black/60">{entry.org}</p>}
                        {entry.description && (
                          <p className="mt-1 text-[12px] leading-5 text-black/60">{entry.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
