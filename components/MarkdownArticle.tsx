import React from 'react'

interface Props {
  content: string
}

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; lines: string[] }
  | { type: 'quote'; lines: string[] }
  | { type: 'list'; items: string[] }
  | { type: 'olist'; items: string[] }
  | { type: 'image'; alt: string; src: string }
  | { type: 'hr' }

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    const token = match[0]
    const key = `${match.index}-${token}`

    if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>)
    } else if (match[2] && match[3]) {
      nodes.push(
        <a key={key} href={match[3]} target={match[3].startsWith('http') ? '_blank' : undefined} rel="noreferrer">
          {match[2]}
        </a>
      )
    }
    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function parseMarkdown(content: string): Block[] {
  const blocks: Block[] = []
  const lines = content.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i += 1
      continue
    }

    if (/^-{3,}$/.test(trimmed)) {
      blocks.push({ type: 'hr' })
      i += 1
      continue
    }

    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (image) {
      blocks.push({ type: 'image', alt: image[1], src: image[2] })
      i += 1
      continue
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] })
      i += 1
      continue
    }

    if (trimmed.startsWith('>')) {
      const quote: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quote.push(lines[i].trim().replace(/^>\s?/, ''))
        i += 1
      }
      blocks.push({ type: 'quote', lines: quote })
      continue
    }

    if (/^-\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^-\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^-\s+/, ''))
        i += 1
      }
      blocks.push({ type: 'list', items })
      continue
    }

    // 번호 목록: "1. " / "1) " — 번호는 버리고 순서대로 <ol>에 넣는다
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''))
        i += 1
      }
      blocks.push({ type: 'olist', items })
      continue
    }

    const paragraph: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3})\s+/.test(lines[i].trim()) &&
      !/^-{3,}$/.test(lines[i].trim()) &&
      !/^!\[([^\]]*)\]\(([^)]+)\)$/.test(lines[i].trim()) &&
      !/^>/.test(lines[i].trim()) &&
      !/^-\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim())
    ) {
      paragraph.push(lines[i].trim())
      i += 1
    }
    blocks.push({ type: 'paragraph', lines: paragraph })
  }

  return blocks
}

export default function MarkdownArticle({ content }: Props) {
  const blocks = parseMarkdown(content)

  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const id = block.text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, '')
          if (block.level === 1) {
            return <h2 id={id} key={index}>{renderInline(block.text)}</h2>
          }
          if (block.level === 2) {
            return <h3 id={id} key={index}>{renderInline(block.text)}</h3>
          }
          return <h4 id={id} key={index}>{renderInline(block.text)}</h4>
        }

        if (block.type === 'paragraph') {
          return <p key={index}>{renderInline(block.lines.join(' '))}</p>
        }

        if (block.type === 'quote') {
          return <blockquote key={index}>{block.lines.map((line, i) => <p key={i}>{renderInline(line)}</p>)}</blockquote>
        }

        if (block.type === 'list') {
          return <ul key={index}>{block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ul>
        }

        if (block.type === 'olist') {
          return <ol key={index}>{block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ol>
        }

        if (block.type === 'image') {
          return (
            <figure key={index}>
              {/* eslint-disable-next-line @next/next/no-img-element -- 본문 이미지는 크기를 미리 알 수 없어 <img> 사용 */}
              <img src={block.src} alt={block.alt} loading="lazy" />
              {block.alt && <figcaption>{block.alt}</figcaption>}
            </figure>
          )
        }

        return <hr key={index} />
      })}
    </div>
  )
}
