import { profile } from '@/data/profile'
import { getFeaturedSlides } from '@/lib/featured'
import FeaturedCoverflow from '@/components/FeaturedCoverflow'
import FeaturedRow from '@/components/FeaturedRow'

export default function Hero() {
  const slides = getFeaturedSlides()
  const meta = [profile.affiliation, profile.location].filter((v): v is string => Boolean(v))

  return (
    <section id="hero" className="px-4 pt-12 pb-6 sm:px-6 sm:pt-16">
      <p className="text-[11px] uppercase tracking-[0.3em] text-black/60">{profile.tagline}</p>

      <h1 className="mt-4 font-serif text-[clamp(3.5rem,11vw,9.5rem)] font-light leading-[0.92] tracking-[-0.03em]">
        {profile.nameLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="max-w-2xl text-[15px] leading-7 sm:text-[17px]">{profile.identity}</p>
          {profile.identityEn && (
            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-black/60">{profile.identityEn}</p>
          )}
        </div>
        <div className="space-y-1 text-[12px] text-black/60 md:col-span-4 md:text-right">
          {meta.map((line) => (
            <p key={line} className="uppercase tracking-[0.18em]">
              {line}
            </p>
          ))}
          <a href={`mailto:${profile.email}`} className="block transition-colors hover:text-black">
            {profile.email}
          </a>
        </div>
      </div>

      {slides.length > 0 && (
        <div className="mt-14 sm:mt-20">
          <div className="flex items-baseline justify-between border-t border-black pt-3">
            <p className="text-[11px] uppercase tracking-[0.22em]">Selected work</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-black/60">
              Drag · Arrow keys
            </p>
          </div>
          {slides.length >= 3 ? <FeaturedCoverflow slides={slides} /> : <FeaturedRow slides={slides} />}
        </div>
      )}
    </section>
  )
}
