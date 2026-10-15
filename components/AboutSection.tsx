import { profile } from '@/data/profile'
import { timeline } from '@/data/timeline'
import type { TimelineKind } from '@/types'
import GlassButton from '@/components/GlassButton'
import SectionHeading from '@/components/SectionHeading'

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
      <h3 className="eyebrow">{KIND_LABEL[kind]}</h3>
      <dl className="mt-3 divide-y divide-border">
        {items.map((entry, i) => (
          <div key={i} className="flex gap-4 py-4 text-[14px]">
            <dt className="w-20 shrink-0 tabular-nums text-muted-foreground">{entry.year}</dt>
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
    <section id="about" data-reveal className="archive-section">
      <SectionHeading title="About" label="The person behind the work" description="연구와 코드 사이에서, 쓸모 있는 가능성을 찾습니다." />

      <div className="site-container">
        <div className="about-grid">
          <div className="about-bio">
            <p className="about-statement">Research into reality.<br /><span className="text-accent">Code in the open.</span></p>
            <div className="space-y-5 text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8">
              {profile.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <GlassButton as="link" href="/about" className="mt-8">Full profile <span aria-hidden="true">↗</span></GlassButton>
          </div>

          {groups.length > 0 && (
            <div className="about-timeline space-y-8">
              {groups.map((group) => (
                <TimelineGroup key={group.kind} {...group} />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
