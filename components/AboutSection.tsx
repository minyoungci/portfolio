import { profile } from '@/data/profile'
import { timeline } from '@/data/timeline'
import type { TimelineKind } from '@/types'
import GlassButton from '@/components/GlassButton'

export const KIND_ORDER: TimelineKind[] = ['career', 'education', 'award', 'scholarship', 'activity']
export const KIND_LABEL: Record<TimelineKind, string> = {
  career: 'Career',
  education: 'Education',
  award: 'Awards',
  scholarship: 'Scholarships',
  activity: 'Activities',
}

export function groupTimeline() {
  return KIND_ORDER.map((kind) => ({
    kind,
    items: timeline.filter((entry) => entry.kind === kind),
  })).filter((group) => group.items.length > 0)
}

/** 타임라인 한 그룹. 레퍼런스 캡션의 dl(라벨 좌·값 우) 리듬을 따른다. */
export function TimelineGroup({ kind, items }: ReturnType<typeof groupTimeline>[number]) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{KIND_LABEL[kind]}</p>
      <dl className="mt-3 divide-y divide-border">
        {items.map((entry, i) => (
          <div key={i} className="flex gap-4 py-3 text-[13px]">
            <dt className="w-24 shrink-0 tabular-nums text-muted-foreground">{entry.year}</dt>
            <dd className="min-w-0 flex-1">
              <p className="font-medium">{entry.title}</p>
              {entry.org && <p className="text-muted-foreground">{entry.org}</p>}
              {entry.description && (
                <p className="mt-1 text-[12px] leading-5 text-muted-foreground">{entry.description}</p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function AboutSection() {
  const groups = groupTimeline()

  return (
    <section id="about" data-reveal className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">About</h2>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-10">
        <div className="space-y-4 text-[15px] leading-7">
          {profile.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {groups.length > 0 && (
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {groups.map((group) => (
              <TimelineGroup key={group.kind} {...group} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <GlassButton as="link" href="/about">
            Full profile
          </GlassButton>
        </div>
      </div>
    </section>
  )
}
