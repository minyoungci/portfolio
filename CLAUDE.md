# CLAUDE.md — Portfolio Site (Minyoung KIM)

## 프로젝트 개요
Minyoung KIM (Medical AI / Futurist)의 개발 프로젝트 포트폴리오.
portikus.de 미학(미니멀, 흑백, 번호형, 타이포그래피 중심)을 개발 포트폴리오에 적용.

**레퍼런스**: https://www.portikus.de/de/editions/
**배포**: Vercel (커스텀 도메인 연결 예정)
**상세 명세**: SPEC.md 참조

---

## 기술 스택
- **프레임워크**: Next.js 14 (App Router, static export)
- **스타일**: Tailwind CSS
- **애니메이션**: Framer Motion
- **언어**: TypeScript
- **패키지 매니저**: npm
- **배포**: Vercel (git push → 자동 배포)

---

## 코딩 컨벤션

### 파일/폴더 네이밍
- 컴포넌트: `PascalCase` (예: `ProjectCard.tsx`)
- 훅: `camelCase`, `use` 접두사 (예: `useProjectFilter.ts`)
- 유틸: `camelCase` (예: `formatDate.ts`)
- 페이지: `page.tsx` (Next.js App Router 규칙)

### 컴포넌트 규칙
- 함수형 컴포넌트 + hooks만 사용 (클래스 컴포넌트 금지)
- props 타입은 반드시 interface로 정의
- Tailwind 유틸리티 클래스 우선, 커스텀 CSS는 최소화

### Import 순서
```typescript
// 1. React/Next.js
import { useState } from 'react'
import Link from 'next/link'
// 2. 외부 라이브러리
import { motion } from 'framer-motion'
// 3. 내부 컴포넌트
import ProjectCard from '@/components/ProjectCard'
// 4. 타입/데이터
import type { Project } from '@/types'
import { projects } from '@/data/projects'
```

---

## 프로젝트 구조
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 홈 (프로젝트 목록)
│   ├── projects/
│   │   └── [slug]/page.tsx # 프로젝트 상세
│   ├── about/page.tsx      # About
│   └── layout.tsx          # 루트 레이아웃
├── components/
│   ├── ProjectGrid.tsx     # 번호형 목록
│   ├── ProjectCard.tsx     # hover reveal 카드
│   ├── PageTransition.tsx  # Framer Motion 전환
│   └── Navigation.tsx      # 상단 네비
├── data/
│   └── projects.ts         # 프로젝트 데이터 (타입 포함)
├── types/
│   └── index.ts            # 공통 타입 정의
└── lib/
    └── utils.ts            # 유틸 함수
```

---

## 디자인 시스템 요약
상세: `docs/design-system.md` 참조

**핵심 원칙**: portikus.de 스타일
- 팔레트: 흑백 (`#000000`, `#FFFFFF`, `#F5F5F5`)
- 타이포: 세리프(제목) + 산세리프(본문) 혼용
- 번호형: `01 —`, `02 —` 형식
- hover: 이미지 reveal (opacity + scale)
- 여백: 넓게, 콘텐츠는 압축

---

## 중요 규칙

1. **데이터는 `/data/projects.ts`만 수정** — 프로젝트 추가/수정 시 이 파일만 건드림
2. **이미지 최적화** — `next/image` 사용 가능 (Vercel에서 자동 최적화)
4. **Framer Motion** — `'use client'` 디렉티브 없으면 서버 컴포넌트에서 사용 불가
5. **커밋**: `[FEAT]`, `[FIX]`, `[STYLE]`, `[DATA]`, `[DOCS]` 접두사 사용

---

## 작업 로그
- SCRATCHPAD.md 참조 (매 작업 후 `/daily` 명령어로 업데이트)

## 상세 가이드
- 디자인 시스템: `docs/design-system.md`
- 컴포넌트 가이드: `docs/components.md`
- 배포 절차: `docs/deploy.md`