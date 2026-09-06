# 디자인 감사 — 현재 상태 베이스라인 (2026-09-06)

> 목적: (1) 현재 사이트의 구성·디자인 시스템을 한 곳에 기록하고, (2) 검토 결과를 우선순위별로 정리하고,
> (3) 이후 레퍼런스가 들어왔을 때 **무엇을 기준으로 비교·검증할지** 프레임을 미리 정해 둔다.
> 검토 환경: 로컬 dev 서버(`npm run dev -p 3005`), 1440 / 768 / 375px 뷰포트 캡처 + 코드 리딩.

---

## 1. 현재 구성 인벤토리 (베이스라인)

### 1-1. 페이지 맵

| 경로 | 역할 | 상태 |
|------|------|------|
| `/` | 홈. 데스크톱 `<main>`과 `MobileHome`이 767px 기준으로 **완전히 다른 컴포넌트** | 콘텐츠 거의 비어 있음 |
| `/projects/[slug]` | 프로젝트 상세 (번호—연도, serif 제목, 스택 칩, 설명, 링크, prev/next) | 테스트 데이터 1건 |
| `/posts/[slug]` | Medium 스타일 아티클 (`.article-body`, `content/posts/*.md`) | 2건, 가장 완성도 높음 |
| `/about` | bio + 링크 | 플레이스홀더 |
| `/admin` | 자체 CMS (Projects/Papers/Research/Piece) → GitHub 커밋 → Vercel 재배포 | 동작함, 인증 없음 |

### 1-2. 섹션 순서 (데스크톱 vs 모바일)

| # | 데스크톱 (`app/page.tsx`) | 모바일 (`components/mobile/MobileHome.tsx`) |
|---|---|---|
| hero | 없음 (nav가 마스트헤드 역할) | 라벨 + serif 64px 이름 + 태그라인 + CTA 2개 |
| 01 | Projects (2→6열 썸네일 그리드) | Posts (검정 배경, 카드 2개) |
| 02 | Papers (아코디언) | Projects (번호 리스트) |
| 03 | Research (아코디언) | Papers (회색 배경) |
| 04 | Piece (마소너리 + 라이트박스) | Research (보더 카드) |
| 05 | Post (커밋 로그 리스트) | Piece (검정 배경, 2열 정사각) |
| 06 | Contact (라벨/링크 행) | Contact ("Work Together" serif) |

nav(`components/Navigation.tsx`)의 라벨 순서는 데스크톱 기준. 모바일에서는 번호와 순서가 nav와 어긋남.

### 1-3. 디자인 토큰 (코드에만 존재, 문서 없음)

| 항목 | 값 | 비고 |
|------|----|------|
| 팔레트 | `#000` / `#fff` / `#F5F5F5` | 위계는 전부 opacity (0.2~0.6) |
| 산세리프 | Inter 400/700 + italic | `next/font`, latin subset만 |
| 세리프 | Cormorant Garamond 300/400 | latin subset만. **한글 글리프 없음** |
| 모노 | 토큰 없음 → 시스템 폴백 | Windows Consolas / mac Menlo로 OS마다 다름 |
| 한글 | 로드된 서체 없음 | Windows Malgun/Batang, iOS Apple SD Gothic으로 OS마다 다름 |
| 기본 크기 | body 13px | 메타 10~11px, 섹션 헤딩 20px, serif 제목 36~48px |
| 헤딩 모티프 | `01 PROJECTS` 번호 + uppercase + `tracking 0.2em` + 상단 1px 검정 보더 | 번호는 opacity 0.5 |
| 강조 | italic = 활성(nav) / 제목 | |
| 모션 | 페이지 페이드인 0.4s, hover scale 1.02, 아코디언 0.25s | 절제됨 |
| 여백 | 섹션 `py-8 px-4 sm:px-6`, **max-width 없음** | 1440px에서도 좌우 24px |
| 반응형 | 767px에서 데스크톱/모바일 컴포넌트 교체 | 768px = 데스크톱 최소폭 |

---

## 2. 검토 결과

### 2-1. 구조 수준 (레퍼런스 결정 전에 알아야 할 것)

**S1. 디자인이 두 벌이다.**
데스크톱은 portikus식 플랫 카탈로그(hero 없음, 13px, 전체 흰 배경), 모바일은 에디토리얼/브루탈리스트(64px serif, 흰→검→회 배경 반전). 같은 사이트로 안 보인다. 레퍼런스가 오면 첫 결정은 "어느 톤으로 통일하나".

**S2. 레이아웃이 콘텐츠 양과 안 맞는다.**
portikus의 6열 소형 썸네일·13px 본문은 수백 개 에디션을 전제한 밀도다. 여기는 프로젝트 3~8개, 논문 0~2편이다. 지금 구조로는 채워도 "작고 조용한" 인상이 유지되어 대표작이 대표작으로 안 보인다. 적은 항목을 깊게 보여주는 구조(2~3열, 큰 제목, 케이스 스터디)가 맞다.

**S3. 데스크톱 첫 화면에 정체성이 없다.**
1440×900 첫 폴드 = nav 2줄 + `01 PROJECTS` + 빈 회색 타일 + `02 PAPERS`(빈) + `03 RESEARCH`(빈). 이름은 nav 낱글자로만 존재하고 "무엇을 하는 사람인지"가 없다. 확정된 방향(이름 + 한 줄 정체성 + 대표작 3)이 그대로 해법이다.

**S4. 시각 무게가 Piece에 쏠린다.**
홈에서 이미지가 있는 블록이 Piece뿐이라 AI 생성 인물 이미지가 사이트의 첫인상을 결정한다. 정작 on-brand 이미지(MRI 단계별 몽타주 등)는 post 상세 안에 숨어 있다. hero/대표작이 이미지를 가져가야 Piece가 "부록"으로 자리 잡는다.

**S5. 번호 시스템이 깨져 있다.**
번호는 `id`에서 나오는데 admin이 `Date.now()`를 id로 준다. 모바일 프로젝트 행에 `1772094230064`가 번호로 찍히고, 프로젝트 상세 헤더·prev/next도 같은 값을 쓴다. Post의 커밋 해시도 id(1, 2)를 16진수로 바꾼 `0000001`이라 은유가 성립하지 않는다. → 번호는 **정렬 순서(index)** 에서 파생해야 한다.

### 2-2. 디자인 시스템 수준

**D1. 한글 타이포그래피가 준비되지 않았다.** (확정 방향 "국문 본문"과 직접 충돌)
Cormorant·Inter 모두 latin subset이라 한글은 OS 폴백으로 간다. 같은 제목 `T1w MRI 전처리 파이프라인 가이드`가 Windows에선 Cormorant + Batang(세리프), iPhone에선 Cormorant + Apple SD Gothic(산세리프)으로 렌더된다. 본문도 Inter + Malgun Gothic 혼합. 최소 산세리프 한 벌(Pretendard 계열)은 필수, serif 제목을 유지하려면 한글 세리프(Noto Serif KR 등)까지 페어링해야 한다. `<html lang="en">`도 `ko`로.

**D2. 세리프/산세리프 페어링이 데스크톱 홈에서 안 보인다.**
Cormorant는 상세 페이지 h1과 모바일 hero에만 쓰인다. 데스크톱 홈은 전부 Inter. "세리프 제목 + 산세리프 본문"이 시스템이라면 홈에서도 보여야 한다.

**D3. 대비가 WCAG AA 미달인 텍스트가 많다.** (SPEC NF2 = WCAG AA)

| 클래스 | 실제 회색 | 흰 배경 대비 | AA(4.5:1) |
|---|---|---|---|
| `text-black/60` | #666 | 5.7 : 1 | 통과 |
| `text-black/50`, `opacity-50` | #808080 | 3.9 : 1 | 미달 |
| `text-black/40`, `opacity-40` | #999 | 2.9 : 1 | 미달 |
| `text-black/35`, `/30` | #A6A6A6 ~ #B3B3B3 | 2.4 ~ 2.1 : 1 | 미달 |
| `opacity-20` (푸터) | #CCC | 1.6 : 1 | 미달 |

메타(연도·카테고리·해시·라벨)가 대부분 /30~/50에 10~11px이다. 위계를 opacity 하나로만 만든 대가다. 크기·굵기·자간·위치로 위계를 나누고 opacity는 보조로 써야 한다.

**D4. 텍스트 섹션에 max-width가 없다.**
Post·Contact 행이 1440px 폭에서 좌우 24px 여백만 두고 펼쳐진다. 갤러리 그리드는 full-bleed가 맞지만 텍스트 행은 측정(measure) 제한이 필요하다. (Post summary만 `max-w-2xl`이 있다.)

**D5. 모노 폰트가 시스템 폴백이다.**
해시·번호·스택 칩·상세 페이지 메타가 `font-mono`인데 토큰이 없어 OS마다 다른 글꼴이 나온다. 쓸 거면 로드하고, 아니면 Inter tabular-nums로 대체.

### 2-3. 컴포넌트/상태 수준

| ID | 위치 | 내용 | 우선순위 |
|----|------|------|----------|
| C1 | `PapersSection`, `ResearchSection` | 빈 배열이면 헤딩만 남는다 (Post/Piece는 "No … yet" 처리됨). 비어 있으면 섹션 자체를 숨기는 게 맞다 | P1 |
| C2 | `Navigation` 모바일 | 6개 라벨이 가로 스크롤인데 스크롤바를 숨겨서 `CONTACT`가 잘린 채 힌트가 없다 | P1 |
| C3 | `Navigation` | 초기 active가 `projects` 고정 → 모바일 hero를 보는 동안 PROJECTS가 italic. 모바일 섹션 순서(Posts 먼저)와 nav 순서도 불일치 | P1 |
| C4 | `MobileHome` hero | `text-[4rem] leading-[0.78] tracking-[-0.08em]` — "Minyoung"의 y 디센더가 "Kim" 윗선과 충돌. Cormorant는 디센더가 길어 0.78은 과함 (0.85~0.9 권장) | P2 |
| C5 | `ContactSection` | 링크를 raw URL로 노출 (`https://www.linkedin.com/in/minyoung-kim-327a5b223/`). 핸들/라벨로 | P2 |
| C6 | 섹션 헤딩 공통 | `hover:italic` — 클릭 대상이 아닌 헤딩에 hover 반응이 있어 어포던스가 어긋남 | P3 |
| C7 | `PageTransition` | `initial opacity:0` 이 SSR HTML에 inline으로 나가 JS 실행 전까지 본문이 안 보임. LCP·크롤러 캡처에 불리 (SPEC NF1 Lighthouse 90) | P2 |
| C8 | `PieceSection`, `MobileHome` | `<img>` 직접 사용 (next/image 미사용), 영상은 모바일 그리드에서도 autoplay | P3 |
| C9 | `app/layout.tsx` | `metadata.title = "welcome"`, OG 이미지 없음. 공유 시 제목이 "welcome" | P1 |
| C10 | `public/` | `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` 보일러플레이트 잔재 | P3 |
| C11 | `AdminAccess`, `api/*` | 비밀번호가 클라이언트 번들에 상수로 존재, write API에 서버 인증 없음 (디자인 외, 별도 작업으로 분리) | P1 |

### 2-4. 잘 된 것 (유지할 것)

- `.article-body` 타이포 시스템 (`app/globals.css`) — serif h2 + 상단 보더, blockquote, figure 리듬. 사이트에서 가장 완성도 높은 부분. 리디자인해도 그대로 가져갈 것.
- 절제된 모션 (페이드·scale 1.02·아코디언) — portikus 방향과 일치.
- nav 활성 섹션 italic — 작지만 시스템다운 디테일.
- Piece hover 오버레이 + 라이트박스(프롬프트 패널) — 동작·구성 모두 무난.
- 파비콘 `app/icon.svg` (검정 바탕 serif M) — 이미 브랜드와 맞음.
- 콘솔 에러 0, 빌드 정상.

---

## 3. 레퍼런스 검증 프레임 (레퍼런스가 들어오면 이 표로 비교)

### 3-1. 받을 수 있는 입력

| 형태 | 가능 여부 | 얻을 수 있는 것 |
|------|-----------|-----------------|
| URL | 최선 | 브라우저 패널에서 직접 열어 섹션 순서·그리드 열 수·타이포 크기·여백·모션까지 측정 |
| 스크린샷/이미지 | 가능 | 레이아웃·타이포 성격·톤. 정확한 px 값은 추정 |
| Figma 링크 | 조건부 | Figma 연동이 이 세션에서 미인증. 연결하거나 PNG로 내보내면 됨 |
| 텍스트/무드 키워드 | 가능 | 방향 판정만. 구조 검증은 위 셋 중 하나가 필요 |

레퍼런스마다 **"무엇이 좋은가"** 한 줄이 필요하다 (전체 무드 / 특정 섹션 / 특정 인터랙션). 이게 없으면 전체를 복제하는 방향으로 비교하게 된다.

### 3-2. 비교 축 (레퍼런스 1개당 아래 표 1개)

| 축 | 레퍼런스 | 현재 | 판정 | 손대는 파일 |
|----|----------|------|------|-------------|
| 정보 구조 (섹션 순서, 페이지 수) | | 1-2절 | | `app/page.tsx`, `MobileHome.tsx`, `Navigation.tsx` |
| 첫 화면 (hero 유무, 구성 요소) | | 없음 / 모바일만 | | 신규 `Hero` |
| 그리드·밀도 (열 수, 썸네일 비율, 항목당 정보량) | | 6열 4:3, 3줄 메타 | | `ProjectGrid`, `ProjectCard` |
| 타이포 스케일 (서체 페어링, 크기 단계, 자간) | | 1-3절 | | `globals.css`, `layout.tsx` |
| 컬러·톤 (흑백 유지? 배경 반전? 악센트?) | | 흑백 + opacity | | `globals.css` |
| 모션 (진입, hover, 스크롤 연동) | | 페이드·scale | | `PageTransition`, 각 카드 |
| 네비게이션 (고정/스크롤, 앵커/페이지) | | sticky 2단, 앵커 버튼 | | `Navigation.tsx` |
| 반응형 전략 (단일 레이아웃 vs 이원화) | | 767px 이원화 | | 구조 결정 |
| **콘텐츠 전제** (레퍼런스가 가정하는 항목 수·이미지 수·글 길이) | | 프로젝트 ≤8, 이미지 부족 | | `PROFILE-INTAKE.md` |
| **데이터 모델 호환** (필요 필드가 `types/index.ts`에 있는가) | | 1-3절 + `types/index.ts` | | `types/index.ts`, `data/*.json` |

### 3-3. 판정 등급

- **A 그대로 적용** — 기존 컴포넌트의 클래스 조정으로 끝남
- **B 컴포넌트 수정** — 해당 컴포넌트 재작성, 데이터 모델 유지
- **C 구조 변경** — 섹션 순서·페이지 구조·데이터 모델까지 변경
- **X 부적합** — 콘텐츠 볼륨이나 정체성과 안 맞아 채택하지 않는 것을 권고 (이유 명시)

레퍼런스가 여러 개면 축별로 충돌하는 지점을 따로 표시한다 (예: A는 hero 대형 serif, B는 hero 없음).

### 3-4. 검증 후 산출물

1. 레퍼런스별 비교표 (3-2) + 등급
2. 채택안 1개로 합친 **목표 스펙** (토큰 값·섹션 순서·컴포넌트 목록)
3. 현재 → 목표 변경 목록 (파일 단위, 순서 포함)
4. 이 문서의 1절을 목표 스펙으로 갱신 → `docs/design-system.md`로 승격

---

## 4. 레퍼런스 검증 기록

### 4-1. 레퍼런스 #1 — Coverflow Carousel (React 컴포넌트, 2026-09-06)

- **입력 형태**: 컴포넌트 소스(`coverflow-carousel.tsx`) + 데모. shadcn 스타일 배포 프롬프트.
- **검증 방식**: 워크트리에 실제 통합 → `/lab/coverflow`에 3개 시나리오 렌더 (A 기본값 / B 플랫 오버라이드 / C 항목 3개) → 1440·375px 캡처, 드래그로 슬라이드 이동 확인, `tsc --noEmit`·`eslint` 통과.
- **결과**: 동작함. 컴포넌트 수정 0줄.

#### 기술 호환 (프로젝트에 추가한 것)

| 요구 | 현재 | 조치 |
|------|------|------|
| shadcn 구조 (`components/ui`, `lib/utils`의 `cn`) | 없음 | `lib/utils.ts`, `components/ui/` 생성. shadcn CLI는 돌리지 않음 (globals.css를 oklch 토큰 세트로 덮어쓰므로) |
| Tailwind CSS | v4 | `@theme`에 별칭 5개 추가: `background` `foreground` `muted` `muted-foreground` `ring` → 흑백 팔레트에 매핑 |
| TypeScript, `@/*` alias | 있음 | 변경 없음 |
| `lucide-react` (화살표 아이콘) | 없음 | 설치 |
| `clsx`, `tailwind-merge` (`cn`) | 없음 | 설치 |
| `animate-in fade-in` (캡션 전환) | 없음 | `tw-animate-css` 설치 + `@import` |
| 이미지 | `<img>` 직접 사용 | next.config 변경 불필요. **영상은 렌더 불가** (Piece의 mp4 1건) |

#### 비교 축 판정 (3-2 표 적용)

| 축 | 레퍼런스 | 현재 | 판정 |
|----|----------|------|------|
| 정보 구조 | 단일 섹션용 컴포넌트 | 섹션형 홈 | A — 섹션 하나에 삽입 |
| 첫 화면 | 이미지 중심 + 캡션/메타 | hero 없음 | B — hero "대표작"으로 쓰면 S3(정체성 부재) 해결 가능 |
| 그리드·밀도 | 포커스 1 + 양옆 4~5장 | 6열 소형 그리드 | B — Projects 목록 대체는 아님 (목록성 정보 상실). hero/Piece용 |
| 타이포 | Inter 15/13/12, semibold, 중앙 정렬 | 13px, italic 제목, 좌정렬 | A — className 오버라이드로 사이트 스케일에 맞춤 |
| 컬러·톤 | `rounded-2xl` `shadow-xl`, 회색 muted | 흑백 플랫, 라운드 0 | A — `cardClassName="rounded-none shadow-none"` 로 해소됨 (시나리오 B 확인) |
| 모션 | 드래그/플릭 + rAF ease-out + 3D rake | 페이드·scale 1.02 | B — 사이트에서 가장 큰 모션이 됨. 한 곳에만 허용 |
| 네비게이션 | 드래그·키보드·화살표·점 | 앵커 nav | A — 화살표+점 켜기 권장. 드래그만으로는 발견성 낮음 |
| 반응형 | `clamp(148px, 22vw, 260px)` 자동 | 767px 이원화 | A — 375px에서 3장 노출·캡션 정상 확인 |
| **콘텐츠 전제** | 8~12장, 정사각 이미지 | 프로젝트 1, Piece 이미지 3 | **C** — 최소 5~6장 필요. 정사각 크롭이라 4:3 썸네일·가로형 figure는 잘림 |
| 데이터 모델 | `src alt title? subtitle? meta[]` | Project/Piece 필드로 매핑 가능 | A — 어댑터 함수 1개 (`Project → CoverflowSlide`) |

#### 종합: **B — 컴포넌트 수정 없이 채택 가능, 단 콘텐츠가 조건**

- **적합 위치**: hero의 대표작(featured projects 또는 연구 이미지), 또는 Piece 섹션. Projects 그리드 대체로는 부적합.
- **채택 조건**: 슬라이드 6장 이상, 정사각에 맞게 준비한 이미지, 영상은 제외하거나 `<video>` 분기 5줄 패치.
- **적용 시 손댈 것**: `cardClassName` 플랫 처리, 캡션 타이포를 사이트 스케일(italic 제목, 11px 메타)로, 페이지네이션 점 8px → 터치 타깃 확대(최소 24px 히트 영역), `showNavigation` 켜기.
- **주의**: 절제된 모션 문법의 유일한 예외가 되므로 페이지당 1개만. 데스크톱 `PageTransition` 페이드와 겹치면 진입 시 두 겹 모션이 된다.
- **랩 파일**: `app/lab/coverflow/page.tsx` (nav 미연결). 채택 결정 후 삭제하거나 정식 섹션으로 이동.

---

## 5. 리빌드 반영 (2026-09-06)

결정: 톤 = 하이브리드(에디토리얼 히어로 + 플랫 섹션, 반전 블록 없음) / 히어로 대표작 = 코버플로우 / 순서 = About → Projects → Post → Piece → Research → Papers → Contact.

| 항목 | 상태 | 어디서 |
|------|------|--------|
| S1 두 벌 디자인 | 해결 — `MobileHome` 삭제, 단일 반응형 레이아웃 | `app/page.tsx` |
| S2 밀도 | 해결 — Projects 1→2→3열, 본문 14px, 제목 15px | `ProjectGrid`, `ProjectCard`, `globals.css` |
| S3 히어로 부재 | 해결 — 이름 + 한 줄 정체성 + Selected work | `components/Hero.tsx` |
| S4 Piece 쏠림 | 해결 — 히어로가 on-brand 이미지(포스트 cover)를 가져감 | `lib/featured.ts` |
| S5 번호 = id | 해결 — 섹션·프로젝트·포스트 번호 모두 순서에서 파생 | `lib/sections.ts`, 각 섹션 |
| D1 한글 타이포 | 해결 — Pretendard(CDN) + Noto Serif KR(next/font), `lang="ko"` | `layout.tsx`, `globals.css` |
| D2 serif 페어링 | 해결 — 히어로·Contact·상세 제목에 Cormorant | 각 컴포넌트 |
| D3 대비 | 해결 — 텍스트 최소 `text-black/60` (5.7:1) | 전 컴포넌트 |
| D4 max-width | 해결 — 텍스트 섹션 `max-w-3xl` | Post/Papers/Research/Contact/About |
| D5 모노 폴백 | 해결 — `font-mono` 제거, `tabular-nums`로 대체 | 전 컴포넌트 |
| C1 빈 섹션 | 해결 — 비어 있으면 섹션·nav 항목 모두 숨김 | `lib/sections.ts` |
| C2 모바일 nav 잘림 | 해결 — `flex-wrap` | `Navigation.tsx` |
| C3 nav 순서·초기 active | 해결 — nav가 `getHomeSections()`를 그대로 사용, 히어로에서는 active 없음 | `Navigation.tsx` |
| C4 hero 디센더 충돌 | 해결 — `leading-[0.92]` | `Hero.tsx` |
| C5 raw URL | 해결 — handle 표기 (`profile.links[].handle`) | `ContactSection.tsx` |
| C6 헤딩 hover italic | 해결 — 제거 | `SectionHeading.tsx` |
| C7 SSR opacity 0 | 해결 — CSS 애니메이션으로 교체, reduced-motion 대응 | `PageTransition.tsx`, `globals.css` |
| C9 메타 title | 해결 — 제목 템플릿 + OG 이미지 (`app/opengraph-image.tsx`) | `layout.tsx` |
| C10 보일러플레이트 svg | 해결 — 삭제 | `public/` |
| C8 `<img>` 직접 사용 | 유지 — 원격(R2) 소스 때문에 의도적 | `PieceSection`, `FeaturedRow` |
| C11 admin 인증 | 해결 — env 비밀번호 + HMAC 서명 세션 쿠키, `/admin`·write API 서버 검증 | `lib/adminAuth.ts`, `app/api/admin/*` |

### 콘텐츠 슬롯 (채우면 바로 반영)

- `data/profile.json` — `identity`(한 줄 정체성), `bio[]`, `affiliation`, `location`, `nameKo`, `links[]`
- `data/timeline.json` — `{ year, title, org?, description?, kind: career|education|award|activity }`
- `data/projects.json` — `featured: true` 프로젝트가 히어로에 노출. 3개 미만이면 정적 나열로 자동 대체
- `data/posts.json` — `cover` 있는 글이 히어로에 노출
- `data/pieces.json` — `featured: true` 피스가 히어로에 노출 (영상 가능)
- Research / Papers — 항목이 생기면 섹션과 nav 항목이 자동으로 나타남
- 배포 후 `NEXT_PUBLIC_SITE_URL`(커스텀 도메인)을 Vercel 환경변수에 넣으면 OG 절대 URL이 고정됨

---

## 6. 레퍼런스 리디자인 (2026-09-06 오후)

5절의 하이브리드(흑백 편집형)는 사용자 피드백으로 폐기됐다. 레퍼런스(코버플로우 데모)는 "히어로에 넣을 부품"이 아니라 **사이트 전체의 디자인 언어**여야 했다.

결정: 섹션마다 코버플로우 선반 / 다크 기본 + 시스템 라이트 자동 / 산세리프 하나.

| 항목 | 이전(5절) | 현재 |
|------|-----------|------|
| 톤 | 흑백 플랫 + serif 히어로, 1px 괘선 | 둥근 카드 + 그림자 + 중앙 정렬 + 알약 UI, 다크 기본 |
| 토큰 | `#000/#fff/#F5F5F5`, opacity 위계 | CSS 변수 `--background … --shadow-card` 다크/라이트 세트, `@theme inline` |
| 타이포 | Inter + Cormorant + Noto Serif KR, italic 제목, 번호 헤딩 | Inter + Pretendard 하나, semibold 제목, 번호 없음 |
| 홈 | hero 코버플로우 + 번호형 섹션 | 텍스트 hero + Projects/Post/Piece 코버플로우 선반 + About/Contact 카드 |
| nav | sticky 2단(낱글자 워드마크) | fixed 알약, backdrop-blur, 활성 pill |
| 상세 | 좌정렬, 괘선, 스택 칩 | 중앙 max-w-2xl, 커버 카드, dl 메타 카드 |
| 삭제 | `MobileHome`, `SectionHeading`, `ProjectGrid/Card`, `PostSection`, `PieceSection`, `FeaturedCoverflow/Row`, `lib/featured.ts` | → `Shelf`, `PieceShelf`, `lib/shelves.ts` |

남은 폴리시: reduced-motion(코버플로우·아코디언), 커스텀 404, 프로젝트 썸네일(현재 제목 카드), 슬라이드 3개 미만 섹션(Post)은 정적 나열.

---

## 7. 최적화 · 인터랙션 (2026-09-06 저녁)

### Lighthouse (프로덕션 빌드, 로컬 `next start`, 홈)

| | 데스크톱 | 모바일 (시뮬레이션 slow 4G, 4x CPU) |
|---|---|---|
| 이전 | 97 / 96 / 100 / 100, LCP 1.2s | **73** / 96 / 100 / 100, LCP 6.5s, 전송 2,020KB |
| 이후 | **100 / 100 / 100 / 100**, LCP 0.8s | **86 / 100 / 100 / 100**, LCP 3.9s, 전송 507KB |

(성능 / 접근성 / 모범사례 / SEO)

### 무엇을 바꿨나

- 선반 카드 이미지를 `next/image`(`fill` + `sizes`, 지연 로드, AVIF/WebP)로. 허용 소스 판정은 `lib/site.ts`.
- 화면 밖 영상은 `src` 없이 두었다가 선반이 보일 때 붙이고 재생(`preload="none"`). 초기 전송 1.4MB 감소.
- 한글 폰트를 jsDelivr Pretendard(렌더 차단 외부 CSS)에서 `next/font` Noto Sans KR로. Inter·Noto 모두 가변 폰트 하나로 → @font-face CSS 101KB → 38KB.
- framer-motion·tw-animate-css 제거. 아코디언은 CSS grid(`Collapse`), 페이드는 `.fade-in` 키프레임.
- 페이지네이션 점 터치 영역 24px(접근성 target-size), 전역 `:focus-visible` 링.
- `sitemap.xml`, `robots.txt`(admin·api 제외), 커스텀 404.

### 인터랙션

- 코버플로우 자동 회전: 선반이 절반 이상 보이고, 탭이 활성이고, 사용자가 만지기 전까지 6초마다 한 장. hover·포커스 중 일시정지. 만지면 그 선반은 멈춤.
- 스크롤 등장: `[data-reveal]` 섹션이 뷰포트에 들어올 때 페이드 업. `html.js`가 붙은 뒤에만 숨기므로 JS 없는 환경·크롤러는 그대로 본다.
- 히어로 포인터 글로우: 마우스 기기에서만, 포인터를 따라가는 라디얼 빛(`--glow` 토큰, 다크·라이트 각각).
- Piece 라이트박스: ←/→ 이동, Esc 닫기, 프롬프트 복사, 이전/다음 버튼, 열려 있는 동안 배경 스크롤 잠금.
- Contact에 이메일 복사 버튼.
- 모든 모션이 `prefers-reduced-motion`을 존중한다(코버플로우 즉시 이동, 자동 회전·등장·글로우 꺼짐).

남은 병목: 모바일 LCP는 한글 폰트 스왑 타이밍에 묶여 있다(`display: swap`). `optional`로 바꾸면 첫 방문에 시스템 한글 폰트가 보이는 대신 LCP가 2초대로 내려간다 — 타이포를 우선해 `swap` 유지.
