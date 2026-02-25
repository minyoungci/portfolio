const LINKS = [
  { label: 'Email',    href: 'mailto:dbssus123@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/minyoung-kim-327a5b223/' },
  { label: 'Blog',     href: 'https://minyoungxi.tistory.com/' },
  { label: 'GitHub',   href: 'https://github.com/minyoungci' },
]

export default function ContactSection() {
  return (
    <section id="contact" className="py-8 px-6 pb-24">
      <h2 className="text-base tracking-[0.25em] font-normal uppercase mt-0 mb-6 pt-3 border-t border-black flex items-baseline gap-3">
        <span className="opacity-50">05</span>
        <span>Contact</span>
      </h2>
      <div className="space-y-4 mb-12">
        {LINKS.map(({ label, href }) => (
          <div key={label} className="flex items-center gap-8">
            <span className="text-xs opacity-40 w-20">{label}</span>
            <a
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="text-[13px] underline opacity-60 hover:opacity-100 transition-opacity"
            >
              {href.replace('mailto:', '')}
            </a>
          </div>
        ))}
      </div>
      <p className="text-[10px] tracking-[0.2em] opacity-20 uppercase">
        © {new Date().getFullYear()} Minyoung KIM
      </p>
    </section>
  )
}
