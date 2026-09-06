import type { Metadata } from 'next'
import PageTransition from '@/components/PageTransition'
import { TimelineGroup, groupTimeline } from '@/components/AboutSection'
import { profile } from '@/data/profile'

export const metadata: Metadata = {
  title: 'About',
  description: profile.identityEn || profile.identity,
}

export default function AboutPage() {
  const groups = groupTimeline()
  const meta = [profile.affiliation, profile.location].filter((v): v is string => Boolean(v))

  return (
    <PageTransition>
      <main className="mx-auto min-h-screen max-w-3xl px-6 pt-32 pb-24 sm:pt-40">
        <header className="text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{profile.tagline}</p>
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-[1.05] tracking-tight">
            {profile.name}
          </h1>
          {profile.nameKo && <p className="mt-2 text-[15px] text-muted-foreground">{profile.nameKo}</p>}
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-7 text-muted-foreground">{profile.identity}</p>
          {meta.length > 0 && <p className="mt-4 text-[12px] text-muted-foreground">{meta.join(' · ')}</p>}
        </header>

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-10">
          <div className="space-y-4 text-[15px] leading-7">
            {profile.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {profile.bioEn && profile.bioEn.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">In English</p>
              <div className="mt-3 space-y-4 text-[14px] leading-7 text-muted-foreground">
                {profile.bioEn.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {groups.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-10">
            <div className="grid gap-8 sm:grid-cols-2">
              {groups.map((group) => (
                <TimelineGroup key={group.kind} {...group} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Links</p>
          <dl className="mt-3 divide-y divide-border">
            {profile.links.map((link) => (
              <div key={link.label} className="flex items-baseline justify-between gap-4 py-3 text-[13px]">
                <dt className="text-muted-foreground">{link.label}</dt>
                <dd>
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="font-medium underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    {link.handle}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </PageTransition>
  )
}
