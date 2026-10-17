# 하루두알 프로젝트 추가 — 2026-10-17

사용자 요청: `D:\하루두알 모바일`에서 개발 중인 하루두알을 Projects 맨 앞에 추가한다.

## 반영

- `data/projects.json` 첫 항목에 고유 ID `6`, slug `harudual`을 추가했다. 기존 5개 항목의 내용·순서·ID는 유지했다.
- 홈 첫 카드, 프로젝트 수 06, `/projects/harudual`, 이전/다음 상세 탐색과 sitemap은 기존 데이터 흐름을 이용한다.
- 연도 2026은 현재 개발 활동 기준이며 출시 연도 주장이 아니다. 소개 문구에 개발 중임을 표시했다.
- 사용자가 확인한 역할은 `풀스택 개발 및 기술 총괄`이며 홈 메타와 상세 Role에 표시한다.
- 사용자가 제공한 기업 선정 이력 3건을 Recognition에 표시한다: 예비창업패키지, 창업중심대학 실험실 창업 예비패키지, 벤처기업 혁신유형. 선정 연도·주관 기관·기여율은 추정하지 않았다.
- 선택 필드 `role`, `recognition`, `thumbnailPoster`, `mediaCaption`을 타입과 관리자 편집 폼에 연결했다.

## 확인한 소스

하루두알 원본은 읽기만 했다. 메인 클론이 별도 문서 브랜치에 있어 앱/서버 기능은 로컬에 저장된 `origin/develop`도 대조했다. 원격 fetch나 운영 DB 접근은 하지 않았다.

- RN `030ce5d` (2026-10-16): `src/api/surveyRepository.ts`, `intakeApi.ts`, `healthApi.ts`, `checkupApi.ts`, `nutrientEncyclopediaApi.ts`, `src/services/health/healthConnectProvider.ts`, `healthKitProvider.ts`, `src/navigation/MainTabsNavigator.tsx`.
- Backend `b8a832e` (2026-10-15): `surveys/urls.py`, `health/urls.py`, `config/urls.py`; Django REST Framework/PostgreSQL 스택은 의존성과 코드로 확인했다.
- 현재 로컬 앱의 `package.json`: React Native, TypeScript, TanStack Query, Zustand.
- 기능 설명은 코드 구현 범위다. 앱 실기기·스토어·운영 환경의 동작 검증 결과로 표현하지 않았다.

## 이미지·모션 출처

기존 프로젝트의 브랜드/서비스 소개 에셋을 사용했다. 사용자 계정에 로그인하거나 최신 앱 빌드 화면을 새로 캡처하지 않았다.

- `public/images/projects/harudual/brand.png` ← `harudual-app-reactnative/assets/bootsplash/logo@4x.png`.
- `public/images/projects/harudual/hbti-types.png` ← `harudual-web/assets/img/hbti.png`. 캡션에 서비스 소개용 캐릭터 일러스트라고 명시했다.
- `app-preview.mp4` ← `harudual-web/assets/img/건강_기록.gif`와 `영양소_정보.gif`. 소개용 스마트폰 화면 두 개를 병렬 배치한 무음 800×800 H.264 영상이다(8.13초, 382,861바이트, fast-start). 원본 약 14.29fps 모션을 30fps 타임라인으로 변환했으며 프레임 보간은 하지 않았다.
- `app-preview-poster.webp`는 영상 첫 프레임이다. 홈 카드와 상세에 대체 이미지로 사용한다. 상세 캡션에 서비스 소개용 앱 모션이라고 표시했다.
- `ProjectVideo`는 화면 안에서만 자동 재생하며 모션 축소·탭 비활성화·사용자 정지를 존중한다. 상세 영상은 정사각형으로 전체 화면을 보여주고 버튼을 별도 줄에 배치한다. 선반은 기존 재생/정지 제어를 이용한다.

## 검증

- 타입 생성, TypeScript, ESLint 통과.
- production build에서 `/projects/harudual` 정적 생성 확인. 샌드박스의 Google Fonts 연결 제한 후 네트워크 허용 빌드로 검증했다.
- 브라우저 1440px·375px에서 첫 카드와 상세 페이지를 시각 확인했다. 320px 상세에서도 가로 넘침 없음.
- 첫 카드 클릭 → 상세 페이지, 목록 복귀, 다음 프로젝트 링크, 이미지 로드, 제목/설명 메타 확인.
- 기존 5개 레코드 동일성, 고유 ID, 총 6개 확인.
- 최종 앱 모션/콘텐츠 QA: 1440px, 375px 모바일 에뮬레이션, 320px 모션 축소 환경에서 41/41 통과. 첫 카드, 상세 이동, 역할·선정 이력, 재생/정지, 화면 밖 정지, 모션 축소 후 명시 재생, 가로 넘침, MP4 Range 206 응답 확인. 런타임 예외 0건.
- 최초 QA의 데스크톱 재생 검사는 제어 버튼으로 자동 스크롤되어 영상이 화면 밖에 있는 상태였다. 영상이 다시 보이면 재생되는 것을 확인하고, 가시성을 반영한 검사를 통과했다.
- 증거: `C:\Users\dbssu\.codex\visualizations\2026\10\03\01a1015c-24a8-7671-a448-0c99c845891d\harudual-release`.

사용자가 이 콘텐츠·모션 추가 버전의 `minyoungxi.com` 배포를 명시적으로 승인했다. 배포 후 실제 도메인의 검증 결과와 커밋/에셋 해시는 위 증거 폴더에 기록한다. 모바일 검증은 브라우저 에뮬레이션이며 실제 휴대전화 검증은 포함하지 않는다.
