import type { Metadata } from 'next'
import PageTransition from '@/components/PageTransition'
import { KIND_LABEL, groupTimeline } from '@/components/AboutSection'
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
      <main className="min-h-screen px-4 pt-16 pb-24 sm:px-6">
        <div className="max-w-3xl">
          <header className="mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] text-black/60">{profile.tagline}</p>
            <h1 className="mt-4 font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-light leading-[0.95] tracking-[-0.02em]">
              {profile.name}
            </h1>
            {profile.nameKo && <p className="mt-2 text-[15px] text-black/60">{profile.nameKo}</p>}
            <p className="mt-6 text-[15px] leading-7 sm:text-[17px]">{profile.identity}</p>
            {profile.identityEn && (
              <p className="mt-2 text-[13px] leading-6 text-black/60">{profile.identityEn}</p>
            )}
            {meta.length > 0 && (
              <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-black/60">
                {meta.join(' · ')}
              </p>
            )}
          </header>

          <section className="mb-16 space-y-5 text-[15px] leading-7">
            {profile.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </section>

          {profile.bioEn && profile.bioEn.length > 0 && (
            <section className="mb-16">
              <p className="mb-3 border-t border-black pt-3 text-[11px] uppercase tracking-[0.22em]">In English</p>
              <div className="space-y-5 text-[14px] leading-7 text-black/80">
                {profile.bioEn.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {groups.length > 0 && (
            <section className="mb-16 space-y-10">
              {groups.map((group) => (
                <div key={group.kind}>
                  <p className="mb-3 border-t border-black pt-3 text-[11px] uppercase tracking-[0.22em]">
                    {KIND_LABEL[group.kind]}
                  </p>
                  <ul className="divide-y divide-black/10 border-b border-black/10">
                    {group.items.map((entry, i) => (
                      <li key={i} className="grid grid-cols-[7rem_1fr] gap-4 py-3 text-[13px]">
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
            </section>
          )}

          <section>
            <p className="mb-3 border-t border-black pt-3 text-[11px] uppercase tracking-[0.22em]">Links</p>
            <ul className="divide-y divide-black/10 border-b border-black/10">
              {profile.links.map((link) => (
                <li key={link.label} className="flex items-baseline gap-6 py-3 text-[13px]">
                  <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.18em] text-black/60">
                    {link.label}
                  </span>
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black"
                  >
                    {link.handle}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </PageTransition>
  )
}
