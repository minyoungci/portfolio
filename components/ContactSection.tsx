import { profile } from '@/data/profile'
import CopyButton from '@/components/CopyButton'

export default function ContactSection() {
  return (
    <section id="contact" data-reveal className="mx-auto max-w-3xl px-6 py-14 text-center sm:py-20">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Contact</h2>

      <a
        href={`mailto:${profile.email}`}
        className="mt-8 inline-block text-[clamp(2rem,6vw,3.5rem)] font-semibold leading-none tracking-tight transition-opacity hover:opacity-70"
      >
        {profile.contactTitle ?? 'Say hello'}
      </a>
      {profile.contactLine && (
        <p className="mx-auto mt-4 max-w-md text-[14px] leading-6 text-muted-foreground">{profile.contactLine}</p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <CopyButton text={profile.email} label="Copy email" copiedLabel="Copied ✓" />
        {profile.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium shadow-card transition-colors hover:bg-muted"
          >
            <span className="text-muted-foreground">{link.label}</span>
            <span className="ml-2">{link.handle}</span>
          </a>
        ))}
      </div>

      <p className="mt-16 text-[12px] text-muted-foreground">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </section>
  )
}
