import { ImageResponse } from 'next/og'
import { profile } from '@/data/profile'

export const alt = `${profile.name} — ${profile.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** 공유 썸네일. 흑백 타이포만 사용 (기본 내장 폰트라 라틴 문자만 안전). */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#000000',
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 8, textTransform: 'uppercase', opacity: 0.7 }}>
          {profile.tagline}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 132, lineHeight: 1, letterSpacing: -4 }}>
          {profile.nameLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, opacity: 0.7 }}>
          <span>{profile.email}</span>
          <span>Portfolio</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
