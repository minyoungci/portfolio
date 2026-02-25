const LINKS = [
  { label: 'Email',    href: 'mailto:dbssus123@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/minyoung-kim-327a5b223/' },
  { label: 'Blog',     href: 'https://minyoungxi.tistory.com/' },
  { label: 'GitHub',   href: 'https://github.com/minyoungci' },
]

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 px-4 pb-32">
      <h2 className="text-xs tracking-widest mb-8 pb-3 border-b border-black">
        05 — CONTACT
      </h2>
      <div className="space-y-4 mb-12">
        {LINKS.map(({ label, href }) => (
          <div key={label} className="flex items-center gap-8">
            <span className="text-xs opacity-40 w-20">{label}</span>
            <a
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="text-sm underline opacity-60 hover:opacity-100 transition-opacity"
            >
              {href.replace('mailto:', '')}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
