import { profile } from '@/data/profile'
import SectionHeading from '@/components/SectionHeading'

interface ContactSectionProps {
  number: string
}

export default function ContactSection({ number }: ContactSectionProps) {
  return (
    <section id="contact" className="px-4 py-8 pb-24 sm:px-6">
      <SectionHeading number={number} title="Contact" />

      <div className="max-w-3xl">
        <a
          href={`mailto:${profile.email}`}
          className="block font-serif text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] tracking-[-0.02em] transition-colors hover:text-black/60"
        >
          {profile.contactTitle ?? 'Say hello'}
        </a>
        {profile.contactLine && (
          <p className="mt-4 max-w-xl text-[13px] leading-6 text-black/60">{profile.contactLine}</p>
        )}

        <ul className="mt-10 divide-y divide-black/10 border-y border-black/10">
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
      </div>

      <p className="mt-16 text-[10px] uppercase tracking-[0.2em] text-black/60">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </section>
  )
}
