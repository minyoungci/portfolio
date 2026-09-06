# CLAUDE.md — Minyoung KIM Portfolio

퍼스널 브랜딩·아카이브용 포트폴리오 사이트. 영문 골격(섹션명·메타·라벨) + 국문 본문.
이 문서의 독자는 둘이다. **포트폴리오 매니저**(콘텐츠를 넣는 사람)는 1·2절, **개발자**(코드를 바꾸는 사람)는 1·3절을 본다.
사실이 코드와 어긋나면 코드가 정본이고, 이 문서를 고친다. (마지막 대조: 2026-09-06)

---

## 1. 공통

### 1-1. 한눈에 보기

| 항목 | 값 |
|------|----|
| 스택 | Next.js 16 (App Router, dev·build 모두 Turbopack), React 19, TypeScript, Tailwind CSS v4 (`@theme` in CSS, config 파일 없음), framer-motion (Papers·Research 아코디언에만) |
| 폰트 | Inter + Cormorant Garamond (next/font, 라틴), Pretendard (jsDelivr CDN, 한글 산세리프), Noto Serif KR (next/font, 한글 세리프) |
| 데이터 | `data/*.json` + 얇은 `.ts` 래퍼(`raw as Type`). DB·런타임 검증 없음. **빌드 시 번들에 구워지므로 배포 후 바꾸려면 재배포** |
| 콘텐츠 편집 | JSON 직접 편집, 또는 `/admin` (Projects · Papers · Research · Piece 탭만) |
| 배포 | Vercel. `master` push → 프로덕션, 다른 브랜치 push → 프리뷰 URL. 정적 export 아님 |
| 로컬 | `npm run dev` (3000). 워크트리에서는 `.claude/launch.json`이 3005로 띄움(`.claude/`는 gitignore) |

### 1-2. 문서 지도

| 파일 | 역할 |
|------|------|
| `PROFILE-INTAKE.md` | 콘텐츠 입력 시트. 여기 답을 `data/*.json`으로 옮긴다. 12절이 확정된 정보 구조 |
| `docs/design-audit.md` | 1~4절은 **리빌드 전(2026-09-06 오전) 상태 기록**, 5절이 현재 반영 상태. 현재 수치는 5절과 코드만 믿는다 |
| `SPEC.md` | 최초 명세(2026-02). 비목표에 admin·static export·로그인/인증이 있으나 셋 다 뒤집힘. 참고용 |
| `DEPLOY.md` | Vercel 최초 연결·도메인 절차. 2026-09에 브랜치(`master`)·env·`next.config.ts`로 갱신 |
| `SCRATCHPAD.md` | 작업 로그. 세션 끝에 손으로 갱신. 2026-02 기록의 `.claude/commands/*`, `docs/design-system.md` 등은 현재 없다 |
| `README.md` | create-next-app 보일러플레이트 그대로 (정리 대상) |
| `SKILL.md` (루트) | 논문 첨삭용 개인 스킬 파일. 이 사이트와 무관하니 읽거나 고치지 않는다 |

### 1-3. 홈 구조 (한 번만 이해하면 되는 규칙)

- HERO: 이름 + 한 줄 정체성 + Selected work(코버플로우)
- 섹션 순서: 01 About → 02 Projects → 03 Post → 04 Piece → 05 Research → 06 Papers → 07 Contact
- **섹션 번호·표시 여부·nav 목록의 정본은 `lib/sections.ts`의 `ORDER`.** 데이터가 빈 섹션(Projects·Post·Piece·Research·Papers)은 페이지와 nav에서 함께 사라지고 번호가 다시 매겨진다. About·Contact는 항상 보인다.
- **항목 번호(프로젝트·포스트·논문·연구)는 각 JSON 배열의 순서에서 나온다.** 순서를 바꾸려면 항목을 옮긴다. `id`는 화면에 쓰지 않는다.
- Selected work 노출 규칙(`lib/featured.ts`): `featured: true` 프로젝트 전부 → `cover`가 있는 포스트 전부 → `featured: true` 피스 전부, 이 순서로 모두 올린다(상한 없음, 3~6개 권장). featured 프로젝트가 하나도 없으면 앞의 프로젝트 3개로 대체. 슬라이드가 3개 미만이면 코버플로우 대신 정적 그리드(`FeaturedRow`, 1→2→3열 반응형).
- 슬라이드 클릭: 프로젝트·포스트는 상세로, 피스는 상세가 없어 홈 Piece 섹션으로 스크롤. 썸네일 없는 프로젝트는 번호만 있는 회색 카드로 나온다.

---

## 2. 포트폴리오 매니저 가이드

### 2-1. 무엇을 어디에

| 콘텐츠 | 파일 | 편집 | 반영되는 곳 |
|--------|------|------|-------------|
| 이름·태그라인·한 줄 정체성·bio·소속·링크·Contact 문구 | `data/profile.json` | JSON | hero, About, `/about`, Contact, 상단 워드마크, 페이지 제목·메타·OG |
| 학력·경력·수상·활동 | `data/timeline.json` | JSON | About(홈), `/about` |
| 프로젝트 | `data/projects.json` | admin 또는 JSON | 02 Projects, `/projects/[slug]`, hero |
| 글 | `data/posts.json` + `content/posts/<slug>.md` | JSON + md | 03 Post, `/posts/[slug]`, hero(`cover`) |
| 시각 작업 | `data/pieces.json` (+ 업로드) | admin 또는 JSON (`featured`는 JSON) | 04 Piece, hero(`featured`) |
| 연구 · 논문 | `data/research.json`, `data/papers.json` | admin 또는 JSON | 05 Research · 06 Papers |

필드 정의의 정본은 `types/index.ts`. JSON에 필드를 추가할 때는 타입부터 고친다. 위 번호는 모든 섹션이 찼을 때 기준이며, 비면 사라지고 밀린다(1-3).

### 2-2. 프로필 · 타임라인 (`profile.json`, `timeline.json`)

- `identity`: 직함이 아니라 하는 일. 10~15 단어(국문). `identityEn`은 보조 문장이면서 **검색·공유 미리보기 설명(meta/OG description)** 으로도 쓰인다. 비우면 화면에서 숨고 메타는 `identity`로 대체된다.
- `tagline`: hero 상단 라벨, 모든 페이지 `<title>`(`이름 — tagline`), OG 이미지. `nameLines`: hero 줄바꿈 단위 `["Minyoung", "Kim"]`. `name`에서 상단 워드마크(M I N Y O U N G K I M)가 자동 파생된다.
- **OG 이미지(`app/opengraph-image.tsx`)는 내장 라틴 폰트만 쓴다.** `tagline`·`nameLines`·`email`에 한글을 넣지 않는다. 한글 이름은 `nameKo`(`/about`에만 표시).
- `bio[]`: 국문 문단 배열. 3문단(지금 / 왜 / 어디로) 권장. 홈 About과 `/about`에 같은 전체가 나온다(요약본 없음). `bioEn[]`(선택)은 영문 bio로 `/about`의 "In English" 블록에만 표시.
- `links[]`: `label`은 서로 다르게 한두 단어(칸이 좁아 `Scholar`처럼 짧게), `handle`이 화면 표기(raw URL 노출 금지), `mailto:` 외 링크는 새 탭.
- `affiliation`·`location`: hero 우측과 `/about` 상단에 소문구로. `contactTitle`·`contactLine`: Contact 섹션.
- 타임라인 `kind`: `career` · `education` · `award` · `scholarship` · `activity`. 같은 kind끼리 묶여 이 순서로 나오고(라벨 Career / Education / Awards / Scholarships / Activities, 정본은 `components/AboutSection.tsx`), **kind 안에서는 연도로 정렬하지 않으니 최신 항목을 배열 앞에** 둔다. `year`는 문자열(`"2022–2024"`, `"2025–"`, 이 길이를 넘기지 않는다). `org`·`description` 선택.

### 2-3. 프로젝트 추가 (`projects.json`)

1. admin → Projects → `+ New`. 제목, 한 줄(subtitle), 연도(숫자, 비우면 0이 저장되니 항상 채운다), 카테고리(쉼표 구분), 스택(쉼표 구분), 설명, 썸네일, 링크(GitHub/Demo/Paper), featured.
2. **slug는 최초 저장 때 제목에서 만들어지며 영문 소문자·숫자·하이픈만 남는다.** 한글 제목만 쓰면 slug가 비거나(`한글제목` → `""`) 하이픈만 남아(`한글 제목` → `-`) 링크가 깨지고 다른 항목과 겹친다. 영문 제목을 쓰거나 저장 후 JSON에서 `slug`를 직접 넣는다. 한 번 정해진 slug는 이후 admin 저장에서도 유지된다(제목을 바꿔도 URL이 안 끊긴다).
3. 썸네일: admin의 `파일 선택`으로 올린다. 이미지는 `public/uploads/`(경로 `/uploads/...`), 영상(mp4/webm/mov)은 R2로 올라가 URL이 들어간다. 직접 URL을 넣을 때 외부 이미지는 `next.config.ts`의 `images.remotePatterns`에 있는 호스트(unsplash, picsum, `*.r2.dev`)만 된다. 그 밖의 호스트는 페이지가 죽는다.
4. 같은 썸네일이 목록 카드 4:3, 상세 상단 16:9, hero 코버플로우 1:1로 각각 잘린다. **가로 이미지에 핵심을 중앙 정사각 안에** 두면 셋 다 안전하다.
5. `description`은 마크다운이 아니라 **줄바꿈이 유지되는 일반 텍스트**. `category[0]`이 카드·hero의 대표 분류이고 상세에서는 전체가 쉼표로 이어진다. `subtitle`은 상세 페이지의 meta description으로도 쓰이니 한 문장으로. `images[]`는 아직 화면에 쓰이지 않는다(`[]`로 둔다).
6. 테스트 항목 `ddaaa`는 실제 프로젝트를 넣을 때 삭제한다.

### 2-4. 글(Post) 추가 (`posts.json` + `content/posts/*.md`)

1. `content/posts/<slug>.md`를 쓴다. slug는 자동 생성이 없다. 영문 소문자·숫자·하이픈으로 직접 정하고 **md 파일명과 대소문자까지 똑같이** 맞춘다(Vercel은 Linux라 구분한다). md만 있으면 목록에 안 뜨고, JSON만 있으면 상세가 404다.
2. 이미지는 `public/images/articles/<폴더>/`에 넣고 `/images/articles/...`로 참조한다. 본문 이미지는 본문 폭(최대 760px)에 꽉 차고 높이 제한이 없으니 가로형(폭 1500px 안팎)을 쓴다.
3. `data/posts.json`에 메타를 추가한다: `id`(고유 숫자), `slug`, `title`, `date`(`YYYY-MM-DD`), `summary`(상세 헤더와 meta description에 쓰임, 한 문장), `tags[]`(`tags[0]`이 목록·hero의 대표 태그), `cover`(선택, hero 노출 전용·이미지만). `content`는 빈 문자열로 둔다(본문은 md에서 읽는다).
4. 렌더러는 자체 파서(`components/MarkdownArticle.tsx`)라 **지원 문법이 제한적**이다.
   - 제목: `#` → 대제목(h2, 상단 괘선), `##` → 소제목(h3), `###` → 라벨(h4). `####` 이상은 글자 그대로 보인다. 글 제목은 `posts.json`의 `title`이 h1로 나오므로 md 첫 줄에 다시 쓰지 않는다.
   - 블록: 문단, `> 인용`, `- 목록`, `1. 번호 목록`(`1)`도 가능), `---` 구분선, 한 줄 단독 `![캡션](src)`(alt가 캡션).
   - 인라인: `**굵게**`, `` `코드` ``, `[텍스트](url)`.
   - **미지원**: 코드 블록(```), 표, 중첩 목록, 기울임, `* ` 불릿, `***` 구분선, HTML 태그(글자로 노출). 문단 안의 줄바꿈은 공백으로 이어 붙으므로 문단을 나누려면 빈 줄을 넣는다.
5. admin에 Post 탭은 없다. 2-8의 순서로 커밋해서 배포한다.

### 2-5. Piece 추가 (`pieces.json`)

- admin → Piece → `+ New`: **이미지/영상 URL과 프롬프트가 둘 다 있어야 저장**된다(없으면 저장 버튼 비활성). `파일 선택`으로 이미지(→ `public/uploads/`)나 영상(→ R2)을 올리면 URL이 자동으로 채워진다. 제목 선택, 날짜는 `YYYY-MM`(검증 없음, 이번 달이 기본).
- 영상은 주소가 `.mp4`/`.webm`/`.mov`로 끝날 때만 영상으로 재생된다. 확장자가 없는 주소는 이미지로 취급돼 깨진다.
- hero에 올리려면 JSON에서 `featured: true`. admin Piece 폼에는 featured 칸이 없지만 저장 시 기존 값은 보존된다.

### 2-6. Papers · Research 추가 (`papers.json`, `research.json`)

- Papers: admin → Papers → `+ New`. `authors`는 한 줄 문자열(예: `Kim M., Lee S.`), `journal`, `year`(숫자), `abstract`(선택), 링크 arXiv/PDF/DOI(선택). 목록에는 제목과 `authors · journal, year`만 보이고 abstract·링크는 클릭해 펼친다(한 번에 하나).
- Research: admin → Research → `+ New`. `status`는 `ongoing` / `completed` 둘 중 하나(그 외 값은 completed로 표시). `tags[]`는 제목 아래 칩, `description`은 펼쳐야 보인다.
- 항목이 하나라도 생기면 섹션과 nav 항목이 자동으로 나타난다.

### 2-7. admin 사용

- 홈 우하단의 옅은 `⌗` 버튼 → `/admin` → 세션이 없으면 `/admin/login`으로 이동 → 비밀번호 입력. 탭: Projects · Papers · Research · Piece. 우측 `로그아웃`으로 세션 종료.
- 인증은 서버에서 한다(`lib/adminAuth.ts`). 비밀번호는 환경 변수 `ADMIN_PASSWORD`(12자 이상), 세션은 `ADMIN_SESSION_SECRET`(16자 이상, 32자 권장)과 비밀번호에서 파생한 키로 서명한 httpOnly 쿠키(8시간). `/admin` 페이지와 저장·업로드 API 모두 쿠키를 검증하고, **두 변수 중 하나라도 없거나 짧으면 로그인이 503으로 막힌다**(Vercel과 `.env.local` 양쪽에 넣어야 한다).
- **Vercel에서 환경 변수를 바꾸면 재배포해야 반영된다**(코드 수정은 불필요). 비밀번호를 바꾸고 재배포하면 이미 발급된 세션도 모두 무효가 된다. 로그아웃은 브라우저 쿠키만 지우므로, 세션이 새어 나갔다고 의심되면 비밀번호나 시크릿을 바꾸고 재배포한다. 외부 링크(메일·슬랙)로 `/admin`을 열면 로그인 화면이 잠깐 보였다가 유효한 세션이면 자동으로 들어간다.
- Vercel에 배포된 사이트에서 저장 = 목록 전체를 GitHub `master`에 커밋(`[admin] update <type>`) → 프로덕션 자동 재배포(1~2분). **프리뷰 URL에서 저장해도 `master`(프로덕션)가 바뀐다.** 실험은 로컬(`npm run dev`, `data/*.json`에 직접 씀)에서만 한다.
- 저장은 페이지를 연 시점의 목록 전체를 통째로 다시 쓴다. 재배포가 끝나기 전에 admin을 새로고침하면 이전 목록이 보이고, 그 상태에서 다시 저장하면 직전 변경이 덮어써진다. 연속 편집은 새로고침 없이 한 화면에서 끝내거나 저장마다 재배포를 기다린다. JSON을 직접 고쳐 push한 직후도 마찬가지.
- 삭제는 확인 창 없이 즉시 저장되고, 업로드 파일(`public/uploads/`, R2)은 남는다. 안 쓰는 파일은 직접 지운다.
- 업로드 규칙: 확장자로만 판별(jpg/jpeg/png/gif/webp/avif, mp4/webm/mov). 파일명은 `<타임스탬프>-원본명`이 되고 한글·공백은 `_`로 바뀌니 영문 파일명을 쓴다. 용량 검사는 없지만 프로덕션은 Vercel 함수 한도(약 4.5MB)를 넘으면 실패한다. 프로덕션 이미지 업로드는 별도 커밋이라 재배포 전에는 `/uploads/...`가 404다(정상). 로컬에서 올린 파일은 `public/uploads/`에만 생기므로 JSON과 함께 커밋해야 한다.
- 저장·업로드가 `Error ✗`로 끝나면 원인은 화면에 안 나온다. 프로덕션이면 Vercel 환경 변수(`GITHUB_TOKEN`, 영상이면 `R2_*`), 로컬이면 `.env.local`부터 확인한다.

### 2-8. JSON 직접 편집 순서 (프로필·타임라인·글·featured)

1. JSON/md 편집. 배열 필드(`category` `stack` `images` `tags` `bio` `links`)는 비어도 `[]`, 프로젝트 `links`는 `{}`. 프로젝트·논문 `year`는 숫자, 날짜류는 문자열.
2. `npm run dev`로 홈·`/about`·해당 상세를 실제로 연다. 래퍼가 타입 캐스트만 하므로 필드 오타·누락은 `tsc`도 빌드도 못 잡고 화면에서만 빠진다. JSON 문법 오류 하나는 빌드 전체를 막는다(배포 실패 시 이전 버전이 그대로 남는다).
3. 새 파일(업로드 이미지 포함)까지 `git add`해서 `[DATA] ...`로 커밋, `master`에 push. 먼저 보고 싶으면 다른 브랜치에 push해 프리뷰 URL로 확인.

### 2-9. 작성 원칙

- 섹션명·메타·라벨은 영문, 본문은 국문. 혼용 문장에서 라틴 문자는 Inter/Cormorant, 한글은 Pretendard/Noto Serif KR로 자동 페어링된다.
- 수치·연도는 있는 그대로. 없는 숫자를 만들지 않는다.
- 플레이스홀더는 `[대괄호]` 표기. 배포 전에 `[`가 남은 곳을 확인한다.

---

## 3. 개발자 가이드

### 3-1. 구조

```
app/
  layout.tsx             폰트 배선, 메타(title 템플릿, metadataBase), Navigation
  page.tsx               홈 조립. visible()/numberOf()는 lib/sections.ts에서, 렌더 순서는 이 파일의 JSX 순서
  about/page.tsx         프로필 상세 (profile + timeline, AboutSection의 groupTimeline 재사용)
  projects/[slug]/       프로젝트 상세. 번호는 배열 index. 썸네일은 이미지/영상 분기
  posts/[slug]/          Medium형 아티클. 본문은 fs로 content/posts/*.md 읽음
  admin/                 자체 CMS. page.tsx(서버, 쿠키 검증·리다이렉트) → AdminClient(client, ssr:false) → AdminWrapper. login/은 로그인 폼
  api/admin/login|logout 세션 쿠키 발급·삭제 (lib/adminAuth.ts)
  api/save-content/      GET/POST data/{projects,papers,research,pieces}.json (세션 필수. VERCEL: GitHub 커밋 / 로컬: 파일 쓰기)
  api/upload/            이미지 → public/uploads (VERCEL: GitHub 커밋 / 로컬: 파일 쓰기), 영상 → R2 (환경 무관). 세션 필수
  opengraph-image.tsx    OG 이미지 (next/og, 내장 라틴 폰트)
  globals.css            토큰(@theme), .article-body 타이포, .page-enter
components/
  Hero, FeaturedRow, SectionHeading, AboutSection(groupTimeline·KIND_LABEL export), ProjectGrid, ProjectCard,
  PostSection, ContactSection, PageTransition, MarkdownArticle, AdminAccess           ← 서버
  Navigation, FeaturedCoverflow, PieceSection, PapersSection, ResearchSection,
  ImageUploadButton, ui/coverflow-carousel, app/admin/*(page.tsx 제외)                 ← 'use client'
data/        *.json + 래퍼 .ts. export 이름: projects · posts · pieces · papers · researchItems(← research 아님) · profile · timeline
lib/         sections.ts(섹션 정본) featured.ts(hero 슬라이드) utils.ts(cn) github.ts r2.ts
types/index.ts   모든 데이터 타입 (Project Post Piece Paper ResearchItem Profile TimelineEntry)
content/posts/   글 본문 md          public/uploads/  admin 업로드 이미지          public/images/articles/  글 이미지
```

이름이 층마다 다르니 그대로 따른다: 섹션 id·앵커는 `about` `projects` `post` `piece` `research` `papers` `contact`(Post·Piece 단수), admin API `type`은 `projects` `papers` `research` `pieces`.

### 3-2. 데이터 흐름

- json → `data/*.ts`(`raw as Type`) → 서버 컴포넌트가 직접 import. 클라이언트 컴포넌트에는 직렬화 가능한 props만 넘긴다(`Navigation`은 `profile`을 직접 import하지만 정적 JSON이라 허용).
- JSON은 빌드 시 번들에 구워지고 `/projects/[slug]`·`/posts/[slug]`는 `generateStaticParams`로 정적 생성된다. 동적 라우트는 `/api/*`와 `/admin`뿐. 로컬 dev에서는 JSON 저장이 HMR로 즉시 반영된다.
- `lib/sections.ts`가 nav 목록·섹션 번호·표시 여부를, `lib/featured.ts`가 hero 슬라이드를 만든다. **홈 섹션을 추가·제거·재배열할 때는 세 곳을 함께 고친다**: ① `ORDER`(id·label·visible), ② `app/page.tsx`의 JSX 블록(순서 포함), ③ 섹션 컴포넌트의 `<section id="…">`(ORDER의 id와 같아야 nav 앵커·활성 표시·`scroll-margin`이 동작).
- 동적 라우트의 `params`는 Next 16에서 `Promise`다: `const { slug } = await params`. 시그니처가 틀리면 빌드의 타입 검증에서 실패한다.

### 3-3. 디자인 시스템 (요약. 근거는 `docs/design-audit.md` 5절)

- 톤: 하이브리드. 에디토리얼 히어로(큰 serif) + 플랫 섹션(흰 배경, 1px 검정 상단 괘선). 배경 반전 블록 없음. **단일 반응형 레이아웃** — 데스크톱/모바일 분기 컴포넌트를 만들지 않는다.
- 팔레트: `#000` · `#fff` · `#F5F5F5`(`bg-gray`). shadcn 별칭 `background / foreground / muted / ring`은 같은 값, `muted-foreground`는 `#666`. `bg-gray`(토큰)와 Tailwind 기본 `bg-gray-100`(oklch 스케일)은 다른 색이며 기본 스케일은 admin 화면에서만 쓴다.
- 타이포: body 14px(모바일 13px). 항목 제목 italic 15px, 메타 11~12px uppercase `tracking-[0.18em]`, serif 대제목은 `clamp()`. `--font-mono` 토큰이 없으므로 `font-mono`를 쓰지 않고 숫자는 `tabular-nums`.
- 대비: 텍스트는 `text-black/60`(#666, 5.7:1) 아래로 내리지 않는다. `/50` 이하는 괘선·장식에만.
- 섹션 헤딩은 `SectionHeading` 컴포넌트만 사용. 번호는 props로 받는다.
- 모션: 페이지 페이드(CSS `.page-enter`), hover scale 1.02, 아코디언 0.25s, 코버플로우(hero 한 곳만). 그 밖의 모션은 추가하지 않는다. `prefers-reduced-motion`은 현재 페이지 페이드와 smooth scroll에만 적용돼 있고 아코디언·코버플로우·hover는 미대응(모션을 만질 때 `useReducedMotion`/`matchMedia`/`motion-safe:`로 확장).
- 이미지: `next/image`는 프로젝트 썸네일(`ProjectCard`, `/projects/[slug]`)에만. Piece·hero 슬라이드·글 본문은 소스가 로컬이든 원격이든 `<img>` + `eslint-disable-next-line @next/next/no-img-element`. 영상은 `<video autoPlay muted loop playsInline>`.

### 3-4. 컨벤션

- 컴포넌트 파일 `PascalCase` + default export. 예외: shadcn식으로 들여온 `components/ui/*`는 kebab-case + named export. 훅 `use*`, 유틸 `camelCase`, 페이지 `page.tsx`. props 타입은 `interface`.
- import 순서: React/Next → 외부 라이브러리 → 타입/데이터(`@/types` `@/data` `@/lib`) → 내부 컴포넌트(`@/components`).
- 서버 컴포넌트가 기본. `'use client'`는 상태·이벤트·framer-motion이 필요할 때만(목록은 3-1). `AboutSection`은 헬퍼를 export하므로 서버로 둔다.
- 데이터 필드 추가 순서: `types/index.ts` → JSON → 사용처 → admin 탭의 `EMPTY`·`fromX`·`toX`. `toX`는 `...existing`을 먼저 펼쳐 폼에 없는 필드를 보존한다(이 규칙을 깨면 admin 저장이 필드를 지운다).
- `id`는 고유 식별자로만 쓴다(admin이 `Date.now()`로 생성). 화면 번호는 항상 index에서 파생.
- 폰트 추가는 3단계: `app/layout.tsx`에서 `next/font`로 로드 → `variable`을 `<html className>`에 → `globals.css` `@theme`의 `--font-*` 체인에 참조. 한글 폰트는 `subsets` 없이 `preload: false`(Noto Serif KR 방식).
- 코버플로우(`components/ui/coverflow-carousel.tsx`)는 외부 소스에 `media`/`onActivate`/`onChange`·플레이스홀더 카드만 더한 것이다. 스타일은 props(`cardClassName` 등)로 조정하고 파일은 최소한으로만 건드린다. `lucide-react` `clsx` `tailwind-merge` `tw-animate-css`는 이 컴포넌트 전용.
- 커밋 접두사: `[FEAT]` `[FIX]` `[STYLE]` `[DATA]` `[DOCS]`. admin의 자동 커밋은 `[admin]`.

### 3-5. 환경 변수

| 이름 | 용도 |
|------|------|
| `ADMIN_PASSWORD`(12자 이상), `ADMIN_SESSION_SECRET`(16자 이상, 32자 임의 문자열 권장) | admin 로그인과 세션 쿠키 서명. 없거나 짧으면 admin 전체가 잠긴다. 바꾸면 재배포 필요 |
| `GITHUB_TOKEN`, `GITHUB_OWNER`(기본 `minyoungci`), `GITHUB_REPO`(기본 `portfolio`) | admin 저장·이미지 업로드를 GitHub Contents API로 커밋 |
| `R2_ACCOUNT_ID` `R2_BUCKET_NAME` `R2_PUBLIC_URL` `R2_ACCESS_KEY_ID` `R2_SECRET_ACCESS_KEY` | 영상 업로드 (Cloudflare R2). 로컬에서도 영상은 R2로 가므로 시험하려면 `.env.local`에 필요 |
| `NEXT_PUBLIC_SITE_URL` | 커스텀 도메인 연결 후 OG 절대 URL. 없으면 `VERCEL_PROJECT_PRODUCTION_URL`, 그것도 없으면 localhost |

GitHub 커밋 경로 판정은 `process.env.VERCEL` 유무(코드 이름은 `IS_PROD`지만 **프리뷰 배포에도 설정**된다). `putFile`은 브랜치를 지정하지 않으므로 커밋은 항상 기본 브랜치 `master`로 간다. `.env*`는 gitignore 대상. 로컬 admin을 쓰려면 `.env.local`에 최소 `ADMIN_PASSWORD`와 `ADMIN_SESSION_SECRET`이 있어야 한다.

### 3-6. 검증

```bash
npx next typegen && npx tsc --noEmit && npm run lint && npm run build
```

- 새 클론·새 워크트리에서는 `next-env.d.ts`가 `.next/types`를 참조하므로 `typegen`(또는 dev/build 1회) 뒤에 `tsc`를 돌려야 한다.
- `next build`는 타입 검사는 하지만 **ESLint는 돌리지 않는다.** lint 오류가 있어도 Vercel 배포는 성공하므로 로컬에서 반드시 돌린다. error로 실패하는 규칙: `react-hooks/rules-of-hooks`, React Compiler 계열(`set-state-in-effect` `refs` `immutability` `purity` `static-components` 등), `@next/next/no-html-link-for-pages`(내부 경로는 `next/link`). `no-img-element`·`exhaustive-deps`는 warning.
- UI 변경은 1440px과 375px에서 실제로 보고 끝낸다(브라우저 패널). dev 산출물은 `.next/dev/`라 dev 서버를 띄운 채 `build`를 돌려도 된다.

### 3-7. 하지 말 것

- `npx shadcn@latest init/add` — `globals.css`의 `@theme` 토큰을 oklch 세트로 덮어쓴다. shadcn 계열은 소스를 `components/ui/`에 직접 붙이고 `cn`은 `lib/utils.ts`.
- `next.config.ts`에 `output: 'export'`나 `webpack` 설정 추가 — API 라우트·OG 이미지·fs 읽기가 있어 정적 export가 성립하지 않고, Turbopack이 기본이다.
- 생성 파일 편집: `next-env.d.ts`, `.next/`, `*.tsbuildinfo`. `package-lock.json`은 npm 명령으로만.
- 사용자 확인 없는 `git checkout .` / `git stash` / `git clean` / `git reset --hard`.
- 프리뷰 URL의 admin에서 저장·업로드(→ 프로덕션 데이터가 바뀐다).

### 3-8. 알려진 이슈 · 남은 작업

- admin 로그인 시도 제한은 인스턴스 메모리 카운터라 서버리스에서는 느슨하다. 비밀번호를 충분히 길게 둔다.
- admin에 Profile · Timeline · Post 탭이 없다 → JSON 직접 편집(2-8).
- 마크다운 파서: 코드 블록·표 미지원. `prefers-reduced-motion` 부분 대응(3-3).
- 커스텀 404 페이지 없음. Pretendard는 jsDelivr CDN 의존. `README.md` 보일러플레이트.
- `public/uploads/1772027226814-grok_2.jpg`는 어디에서도 참조되지 않는 고아 파일.
