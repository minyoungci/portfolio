import { profile } from '@/data/profile'
import HeroGlow from '@/components/HeroGlow'

/** 이름 · 한 줄 정체성 · 소속 · 링크. 중앙 정렬, 작게. 대표작은 아래 선반이 맡는다. */
export default function Hero() {
  const meta = [profile.affiliation, profile.location].filter((v): v is string => Boolean(v))

  return (
    <section id="hero" className="relative overflow-hidden">
      <HeroGlow />
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-2 text-center sm:pt-36 sm:pb-4">
        <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{profile.tagline}</p>
        <h1 className="mt-5 text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[1.02] tracking-tight">
          {profile.name}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[16px] leading-7 text-muted-foreground sm:text-[17px]">
          {profile.identity}
        </p>
        {profile.identityEn && (
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-6 text-muted-foreground/80">{profile.identityEn}</p>
        )}
        {meta.length > 0 && <p className="mt-6 text-[12px] text-muted-foreground">{meta.join(' · ')}</p>}

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {profile.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium shadow-card transition-all hover:-translate-y-0.5 hover:bg-muted motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
