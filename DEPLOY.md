# 배포 가이드 — Vercel + 커스텀 도메인

## 왜 Vercel인가

- Next.js 만든 팀이라 궁합 최고
- git push → 자동 빌드/배포 (GitHub Actions 불필요)
- `next/image` 최적화 그대로 사용 가능 (static export 제약 없음)
- 무료 플랜으로 포트폴리오 트래픽 충분히 커버
- HTTPS 자동, 미리보기 URL 자동 생성

---

## next.config.js (Vercel 기준)

GitHub Pages와 달리 `output: 'export'` 불필요.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 아무 제약 없음 — 기본 설정으로 충분
};

module.exports = nextConfig;
```

`next/image`도 그대로 사용 가능:
```tsx
// ✅ Vercel에서는 그냥 사용
import Image from 'next/image';
<Image src={project.thumbnail} alt={...} fill className="object-cover" />
```

---

## 최초 배포 순서

### 1. GitHub repo 생성
```bash
git init
git remote add origin https://github.com/minyoungci/portfolio.git
git push -u origin main
```

### 2. Vercel 연결
1. vercel.com 접속 → GitHub 계정 연결
2. "New Project" → portfolio repo 선택
3. Framework: Next.js 자동 감지됨
4. "Deploy" 클릭 → 완료

이 시점에서 portfolio-xxxx.vercel.app 주소로 접근 가능.

### 3. 도메인 구매 및 연결

**도메인 추천 (포트폴리오용)**:
| 도메인 | 연 비용 | 추천도 |
|--------|---------|--------|
| minyoungkim.dev | ~$12 | 최추천 (개발자 느낌) |
| minyoungkim.com | ~$12 | 추천 |
| mkim.dev | ~$12 | 짧고 깔끔 |

**구매처**: Namecheap 또는 Cloudflare Registrar (가장 저렴)

**Vercel에서 도메인 연결**:
1. Vercel 프로젝트 → Settings → Domains
2. 구매한 도메인 입력
3. 안내에 따라 DNS 레코드 설정 (A record 또는 CNAME)
4. DNS 전파: 보통 5분~1시간 (최대 48시간)

---

## 이후 배포 (자동)

```bash
git add .
git commit -m "[FEAT] ..."
git push origin main
# → Vercel이 자동으로 감지, 빌드, 배포
```

PR/브랜치 push 시 미리보기 URL도 자동 생성됨.

---

## 빌드 확인 (로컬)

```bash
npm run build    # 빌드 오류 사전 확인
npm run start    # 프로덕션 모드 로컬 실행
```

Vercel 배포 전에 npm run build가 로컬에서 통과하는지 확인하는 습관을 들일 것.

---

## 환경변수 (현재 불필요, 향후 참고)

현재 포트폴리오는 정적 데이터만 사용하므로 불필요.
contact form 등 추가 시: Vercel 프로젝트 → Settings → Environment Variables