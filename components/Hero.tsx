import { profile } from '@/data/profile'
import RobotExperience from '@/components/RobotExperience'
import GlassButton from '@/components/GlassButton'

export default function Hero() {
  const meta = [profile.affiliation, profile.location].filter((v): v is string => Boolean(v))

  return (
    <section id="hero" className="hero-section site-container">
      <div className="hero-stage">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Research. Build. Share.</p>
          <h1 className="hero-title" aria-label={profile.name}>{profile.name.split(' ').map((word, index, words) => <span className="hero-title-line" key={index}><span>{word}{index === words.length - 1 && <span className="hero-period" aria-hidden="true">.</span>}</span></span>)}</h1>
          <p className="hero-role">{profile.tagline}</p>
          <p className="hero-description">{profile.identity}</p>
          <div className="hero-actions">
            <GlassButton as="link" href="/#projects" variant="solid">Explore projects <span aria-hidden="true">↗</span></GlassButton>
            {profile.links.filter((link) => link.label === 'GitHub').map((link) => (
              <GlassButton key={link.label} as="a" href={link.href} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></GlassButton>
            ))}
          </div>
          {meta.length > 0 && <p className="hero-meta">{meta.join(' / ')}</p>}
        </div>
        <RobotExperience />
      </div>
      <div className="hero-footnote">
        <p>{profile.identityEn}</p>
        <a href="#projects" className="explore-link">Explore the archive <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  )
}
