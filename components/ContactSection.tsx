const LINKS = [
  { label: 'Email',    href: 'mailto:minyoung.kim@example.ac.kr' },
  { label: 'GitHub',   href: 'https://github.com/minyoungci' },
  { label: 'Scholar',  href: 'https://scholar.google.com' },
  { label: 'Twitter',  href: 'https://twitter.com/minyoungci' },
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
      <p className="text-xs opacity-30 max-w-sm leading-relaxed">
        Medical AI researcher interested in clinical deployment, safety, and the gap between benchmark performance and real-world utility.
      </p>
    </section>
  )
}
