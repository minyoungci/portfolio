interface SectionHeadingProps {
  title: string
  label: string
  description?: string
  count?: number
}

export default function SectionHeading({ title, label, description, count }: SectionHeadingProps) {
  return (
    <header className="section-heading site-container">
      <div>
        <p className="eyebrow">{label}</p>
        <h2 className="section-title">{title}{count !== undefined && <span className="section-count">{String(count).padStart(2, '0')}</span>}</h2>
      </div>
      {description && <p className="section-description">{description}</p>}
    </header>
  )
}
