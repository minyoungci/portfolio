import PageTransition from '@/components/PageTransition'

export default function AboutPage() {
  return (
    <PageTransition>
      <main className="min-h-screen px-8 pt-32 pb-24 max-w-2xl mx-auto">
        <header className="mb-16">
          <p className="font-mono text-xs tracking-widest uppercase text-black/40 mb-3">
            About
          </p>
          <h1 className="font-serif text-4xl md:text-5xl">Minyoung KIM</h1>
          <p className="font-mono text-sm text-black/50 mt-3">Medical AI / Futurist</p>
        </header>

        {/* Bio — 실제 내용으로 교체 */}
        <section className="font-sans text-base leading-relaxed space-y-5 mb-16 text-black/80">
          <p>
            바이오를 여기에 작성해주세요.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-3 font-mono text-xs uppercase tracking-widest">
          <a
            href="mailto:your@email.com"
            className="block hover:opacity-40 transition-opacity duration-200"
          >
            Email ↗
          </a>
          <a
            href="https://github.com/minyoungci"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:opacity-40 transition-opacity duration-200"
          >
            GitHub ↗
          </a>
        </section>
      </main>
    </PageTransition>
  )
}
