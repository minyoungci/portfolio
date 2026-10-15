import { profile } from '@/data/profile'
import CopyButton from '@/components/CopyButton'
import GlassButton from '@/components/GlassButton'

export default function ContactSection() {
  return (
    <section id="contact" data-reveal className="contact-section site-container">
      <div className="contact-panel">
        <p className="eyebrow">Have something in mind?</p>
        <h2><a href={`mailto:${profile.email}`} className="contact-title">{profile.contactTitle ?? 'Say hello'}<span aria-hidden="true">↗</span></a></h2>
        {profile.contactLine && (
          <p className="mt-6 max-w-xl text-[15px] leading-7 sm:text-base">{profile.contactLine}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <GlassButton as="a" href={`mailto:${profile.email}`} variant="solid">{profile.email} <span aria-hidden="true">↗</span></GlassButton>
          <CopyButton text={profile.email} label="Copy email" copiedLabel="Copied ✓" />
        </div>
      </div>
      <footer className="site-footer">
        <p className="text-[13px] text-muted-foreground">© {new Date().getFullYear()} {profile.name}</p>
        <div className="flex flex-wrap gap-2">
          {profile.links.filter((link) => !link.href.startsWith('mailto')).map((link) => (
            <GlassButton
              key={link.label}
              as="a"
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              {link.label} <span aria-hidden="true">↗</span>
            </GlassButton>
          ))}
        </div>
      </footer>
    </section>
  )
}
