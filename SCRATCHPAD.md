# SCRATCHPAD.md — Portfolio Site 작업 로그

> 세션 끝에 손으로 갱신한다 (`/daily` 같은 자동 명령은 없다). 최신 날짜가 상단에 위치.
> 2026-09-06 리빌드(히어로·섹션 정본·profile/timeline 데이터·한글 폰트)는 `docs/design-audit.md` §5에 기록됨.
> 아래 2026-02-25 기록 중 `.claude/commands/*`, `.claude/skills/*`, `docs/design-system.md` 등은 현재 저장소에 없다.

---

## 2026-02-25 (세션 3 — UI/UX 개선)

### ✅ 완료한 작업
- **Admin → 홈 버튼** (`AdminWrapper.tsx`)
  - 탭바 좌측에 `← 홈` Link 추가
- **Serif 폰트 추가** (`layout.tsx`, `globals.css`)
  - `Cormorant_Garamond` (300/400) 로드
  - CSS 변수 `--font-serif: var(--font-cormorant), Georgia, serif` 등록
- **Navigation sticky + active 섹션 하이라이트** (`Navigation.tsx`)
  - `<header>` → `sticky top-0 z-50 bg-white`
  - `IntersectionObserver` + `rootMargin: '-40% 0px -50% 0px'` 로 현재 섹션 감지
  - 활성 섹션 버튼 `opacity-100`, 나머지 `opacity-40`
- **섹션 헤딩 portikus 스타일** (5개 파일: page.tsx, Papers/Research/Piece/ContactSection)
  - `border-b` → `border-t` (상단 구분선)
  - `text-[10px] tracking-[0.25em] font-normal uppercase`
  - 숫자 `<span className="opacity-30">` 으로 muted 처리
- **Footer 추가** (`ContactSection.tsx`)
  - `© 2026 Minyoung KIM` 한 줄
- `npx tsc --noEmit` 통과, `npm run build` 성공 확인
- `git push origin master` 완료 (rebase merge 포함)

### 🔧 현재 이슈
- 배포 후 브라우저에서 변경사항 미반영 → 브라우저 캐시 문제 의심 (Ctrl+Shift+R 또는 시크릿창 확인 필요)
- Vercel 대시보드에서 최신 배포 `Ready` 상태 확인 필요

### 📋 다음 단계
- [ ] 브라우저 캐시 클리어 후 변경사항 확인
- [ ] Piece 섹션 카드 제목 `font-serif` (Cormorant) 적용 검토
- [ ] 모바일 반응형 확인 (sticky nav 높이, 섹션 헤딩 간격)

---

## 2026-02-25 (세션 3 — UI/UX 개선)

### ✅ 완료한 작업
- **Admin → 홈 버튼** (`AdminWrapper.tsx`)
  - 탭바 좌측에 `← 홈` Link 추가
- **Serif 폰트 추가** (`layout.tsx`, `globals.css`)
  - `Cormorant_Garamond` (300/400) 로드
  - CSS 변수 `--font-serif: var(--font-cormorant), Georgia, serif` 등록
- **Navigation sticky + active 섹션 하이라이트** (`Navigation.tsx`)
  - `<header>` → `sticky top-0 z-50 bg-white`
  - `IntersectionObserver` + `rootMargin: '-40% 0px -50% 0px'` 로 현재 섹션 감지
  - 활성 섹션 버튼 `opacity-100`, 나머지 `opacity-40`
- **섹션 헤딩 portikus 스타일** (5개 파일)
  - `border-b` → `border-t` (상단 구분선)
  - `text-[10px] tracking-[0.25em] font-normal uppercase`
  - 숫자 `<span className="opacity-30">` 으로 muted 처리
- **Footer 추가** (`ContactSection.tsx`)
  - `© 2026 Minyoung KIM` 한 줄
- `npx tsc --noEmit` + `npm run build` 성공
- `git push origin master` 완료

### 🔧 현재 이슈
- 배포 후 변경 미반영 → 브라우저 캐시 의심 (Ctrl+Shift+R 또는 시크릿창 확인 필요)
- Vercel 대시보드에서 최신 배포 `Ready` 상태 확인 필요

### 📋 다음 단계
- [ ] 브라우저 캐시 클리어 후 변경사항 시각 확인
- [ ] Piece 카드 제목에 `font-serif` (Cormorant) 적용 검토
- [ ] 모바일 반응형 확인 (sticky nav, 섹션 헤딩 간격)

---

## 2026-02-25 (세션 1–2)

### ✅ 완료한 작업
- 프로젝트 명세 확정 (SPEC.md)
- Claude Code 설정 파일 구성 완료
- **[세션 2] Next.js 앱 초기화 + 디자인 시스템 설정**
  - Next.js 16.1.6 + Tailwind CSS v4 + TypeScript 설치
  - `framer-motion` 설치 완료
  - `app/globals.css` — Tailwind v4 `@theme` 방식으로 디자인 토큰 설정
    - Colors: `--color-black`, `--color-white`, `--color-gray`
    - Fonts: `--font-serif` (Playfair Display), `--font-sans` (Inter), `--font-mono` (DM Mono)
  - `app/layout.tsx` — next/font/google으로 3종 폰트 로드, 메타데이터 설정
  - `npm run build` 통과 확인 (TypeScript 에러 없음, 정적 페이지 생성 성공)

### 🔧 현재 이슈
- 실제 프로젝트 데이터 미입력
- **주의**: Tailwind v4 사용 중 (`tailwind.config.ts` 없음, `@theme` in CSS로 대체)
- **주의**: Next.js 16 사용 중 (CLAUDE.md에 14로 명시되어 있으나 최신 버전으로 설치됨)

### 📋 다음 단계
- [x] `types/index.ts` — Project interface 정의 완료
- [x] `data/projects.ts` — 플레이스홀더 데이터 완료
- [x] `components/Navigation.tsx` — 완료
- [x] `components/ProjectGrid.tsx` — 번호형 목록 완료
- [x] `components/ProjectCard.tsx` — Framer Motion hover reveal 완료
- [x] `components/PageTransition.tsx` — 페이드인 전환 완료
- [x] `app/page.tsx` — 홈 (프로젝트 목록) 완료
- [x] `app/projects/[slug]/page.tsx` — 상세 페이지 완료
- [x] `app/about/page.tsx` — About 페이지 완료
- [ ] **실제 프로젝트 데이터 입력** — `data/projects.ts` 수정
- [ ] `/public/images/projects/` 에 썸네일 이미지 추가
- [ ] 반응형 보정 (모바일 확인)
- [ ] Vercel 배포

### 💡 중요 결정 사항
- **스택**: Next.js 14 + Tailwind + Framer Motion 확정
  - 이유: Vercel 궁합 최고, portikus 수준 transition 구현 가능
- **배포**: Vercel + 커스텀 도메인 확정 (minyoungci.github.io는 기존 용도 유지)
  - 이유: static export 제약 없음, next/image 풀 사용, git push 자동 배포
  - 도메인 구매 필요: minyoungkim.dev 또는 minyoungkim.com 추천 (Namecheap/Cloudflare)
- **SCRATCHPAD 업데이트**: `/daily` 수동 명령어 방식
  - 이유: Hook은 디버깅 어렵고 초기 세팅에 비용 큼
- **데이터 관리**: 정적 TypeScript 파일 (`/data/projects.ts`)
  - 이유: CMS 불필요한 규모, 배포 단순화

### 📁 생성된 파일
- `SPEC.md` — 프로젝트 전체 명세
- `CLAUDE.md` — Claude Code 프로젝트 지침
- `.claude/commands/daily.md` — 일일 로그 명령어
- `.claude/commands/commit.md` — 커밋 명령어
- `.claude/commands/new-project.md` — 프로젝트 추가 명령어
- `.claude/commands/handover.md` — 세션 인수인계 명령어
- `.claude/skills/portfolio-conventions.md` — 디자인/코드 컨벤션 스킬
- `.claude/skills/animation-patterns.md` — Framer Motion 패턴 스킬
- `docs/design-system.md` — 디자인 시스템 문서
- `docs/components.md` — 컴포넌트 문서
- `docs/deploy.md` — 배포 가이드

---