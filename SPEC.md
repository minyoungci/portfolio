# SPEC.md — Minyoung KIM Portfolio Site

## 0. 메타 정보

| 항목 | 내용 |
|------|------|
| 프로젝트명 | minyoungkim.dev (포트폴리오 사이트) |
| 작성일 | 2026-02-25 |
| 작성자 | Minyoung KIM |
| 상태 | 구현 중 |
| 레퍼런스 | https://www.portikus.de/de/editions/ |
| 배포 | 커스텀 도메인 + Vercel |

---

## 1. 목표 (Objective)

### 1.1 한 줄 요약
Medical AI 연구자 Minyoung KIM의 개발 프로젝트를 portikus.de 스타일 미니멀 갤러리 형식으로 전시하는 포트폴리오 사이트.

### 1.2 상세 목표
- portikus.de의 아트 갤러리 미학(흑백, 번호형 목록, 타이포그래피 중심)을 개발 포트폴리오에 적용
- hover/transition/타이포그래피 디테일까지 완벽 재현
- Medical AI / Futurist라는 정체성이 디자인에서도 느껴지도록

### 1.3 성공 기준 (Definition of Done)
- [ ] portikus.de의 grid/list 레이아웃 구현 (번호형 프로젝트 목록)
- [ ] hover 시 이미지/정보 reveal 인터랙션 구현
- [ ] 모바일 완전 반응형
- [ ] minyoungkim.dev (또는 구매 도메인) Vercel 배포 완료
- [ ] Lighthouse 성능 점수 90 이상
- [ ] 프로젝트 6~10개 전시 가능한 구조

### 1.4 비목표 (Non-Goals)
- CMS/관리자 페이지 (정적 데이터로 충분)
- 블로그 기능 (별도 tistory/github pages 유지)
- 다크/라이트 모드 토글 (흑백 단일 팔레트 고정)
- 로그인/인증

---

## 2. 배경 (Context)

### 2.1 왜 이것을 하는가?
Medical AI 연구자로서 기술적 역량과 연구 결과물을 외부에 명확히 전달할 공간이 필요하다. 기존 GitHub Profile이나 이력서는 작업의 맥락과 임팩트를 보여주기 어렵다.

### 2.2 현재 상태
- `/mnt/d/portfolio` 빈 폴더만 존재
- minyoungci.github.io 도메인 보유
- 기술 블로그는 별도 운영 중

### 2.3 문제점
- 개발 프로젝트들이 GitHub repo 분산 상태, 통합 전시 공간 없음
- Medical AI 연구자라는 포지셔닝이 외부에서 잘 보이지 않음

---

## 3. 요구사항 (Requirements)

### 3.1 기능 요구사항 (Functional)

| ID | 요구사항 | 우선순위 | 상태 |
|----|----------|----------|------|
| F1 | 프로젝트 목록 페이지 — 번호형 grid/list 레이아웃 | 필수 | 미완 |
| F2 | 프로젝트 상세 페이지 — 설명, 스택, 링크, 이미지 | 필수 | 미완 |
| F3 | hover 인터랙션 — 이미지 reveal, 텍스트 오버레이 | 필수 | 미완 |
| F4 | About 페이지 — 이름, 직군, 소개, 연락처 | 필수 | 미완 |
| F5 | 반응형 레이아웃 (모바일/태블릿/데스크탑) | 필수 | 미완 |
| F6 | 페이지 전환 애니메이션 | 권장 | 미완 |
| F7 | 카테고리/태그 필터 (선택) | 선택 | 미완 |

### 3.2 비기능 요구사항 (Non-Functional)

| ID | 요구사항 | 기준 |
|----|----------|------|
| NF1 | 성능 | Lighthouse 90+, LCP < 2.5s |
| NF2 | 접근성 | WCAG AA 기준 |
| NF3 | 유지보수성 | 프로젝트 추가 시 데이터 파일만 수정 |

### 3.3 제약 조건 (Constraints)
- **기술적**: Vercel 배포 → static export 불필요, Next.js 기능 풀 활용 가능
- **디자인**: portikus.de 미학 기준, 흑백 팔레트, 최소한의 색상
- **환경**: Windows WSL/Ubuntu 개발 환경

---

## 4. 기술 설계 (Technical Design)

### 4.1 아키텍처 개요

```
포트폴리오 사이트 (정적)
├── 데이터 레이어: /data/projects.ts (TypeScript 객체 배열)
├── 페이지: Next.js App Router (정적 생성)
│   ├── / (홈 = 프로젝트 목록)
│   ├── /projects/[slug] (상세)
│   └── /about
└── 배포: GitHub Pages (next export)
```

### 4.2 핵심 컴포넌트

| 컴포넌트 | 역할 | 기술 |
|----------|------|------|
| ProjectGrid | 프로젝트 목록 (번호형) | React + Tailwind |
| ProjectCard | hover reveal 인터랙션 | Framer Motion |
| PageTransition | 페이지 전환 | Framer Motion |
| Navigation | 상단 내비게이션 | Next.js Link |
| ProjectDetail | 상세 페이지 레이아웃 | React |

### 4.3 데이터 구조

```typescript
interface Project {
  id: number;           // 01, 02, 03... (portikus 스타일 번호)
  slug: string;         // URL slug
  title: string;
  subtitle: string;     // 한 줄 설명
  year: number;
  category: string[];   // ['Medical AI', 'Vision', ...]
  stack: string[];
  description: string;  // 마크다운 가능
  thumbnail: string;    // /images/projects/...
  images: string[];
  links: {
    github?: string;
    demo?: string;
    paper?: string;
  };
  featured: boolean;
}
```

### 4.4 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 14 (App Router) | 정적 export + SEO |
| 스타일 | Tailwind CSS | 유틸리티 클래스 |
| 애니메이션 | Framer Motion | portikus 수준 transition |
| 언어 | TypeScript | 데이터 타입 안전성 |
| 배포 | Vercel | git push 자동 배포, Next.js 최적 궁합, 무료 |
| 패키지 매니저 | npm |  |

---

## 5. 페이지 구조 (Interface)

### 5.1 홈 (/)
- 이름 + 직군 타이포 (좌상단 고정 또는 첫 섹션)
- 프로젝트 목록: `01 — Project Title`, `02 — Project Title` 형식
- hover 시 썸네일 이미지 reveal
- 우측 상단: About 링크

### 5.2 프로젝트 상세 (/projects/[slug])
- 상단: 번호 + 제목 + 연도
- 프로젝트 설명 (긴 텍스트)
- 스택 리스트
- 이미지 갤러리
- 링크 (GitHub / Demo / Paper)
- 이전/다음 프로젝트 네비게이션

### 5.3 About (/about)
- 이름, 직군 (Medical AI / Futurist)
- 짧은 바이오
- 연락처 / SNS 링크

---

## 6. 구현 계획 (Implementation Plan)

### 6.1 단계별 계획

| 단계 | 작업 | 산출물 |
|------|------|--------|
| 1 | 프로젝트 초기화 + 기본 레이아웃 | Next.js 셋업, 라우팅 |
| 2 | 디자인 시스템 구축 | 타이포, 컬러, 간격 토큰 |
| 3 | ProjectGrid 컴포넌트 | 번호형 목록 + hover |
| 4 | 프로젝트 상세 페이지 | 레이아웃 + 데이터 연결 |
| 5 | About 페이지 | 정적 콘텐츠 |
| 6 | 애니메이션 / 페이지 전환 | Framer Motion 적용 |
| 7 | 반응형 보정 | 모바일 레이아웃 |
| 8 | 데이터 입력 | 실제 프로젝트 6~10개 |
| 9 | 배포 | GitHub Pages |

---

## 7. 리스크 및 트레이드오프

### 7.1 식별된 리스크

| 리스크 | 가능성 | 영향도 | 완화 방안 |
|--------|--------|--------|----------|
| Next.js static export에서 Framer Motion 일부 기능 제한 | 해소 | — | Vercel 배포로 제약 없음 |
| 도메인 구매 후 DNS 전파 시간 | 중 | 하 | 배포 전날 미리 구매 및 설정 |
| Vercel 무료 플랜 대역폭 한계 | 하 | 하 | 포트폴리오 트래픽 수준에서 초과 없음 |

### 7.2 기술적 트레이드오프

| 결정 사항 | 선택 | 이유 |
|-----------|------|------|
| CMS vs 정적 데이터 | 정적 TypeScript 파일 | 규모 작음, 배포 단순화 |
| Next.js vs Vite+React | Next.js | Vercel 궁합 최고, 향후 API Route 추가 가능 |
| Vercel vs GitHub Pages | Vercel | static export 제약 없음, 자동 배포, HTTPS 자동 |