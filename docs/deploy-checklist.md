# 실서비스 배포 전 체크리스트

`AGENTS.md`/`PROJECT.md`와 별개로, "코드로 못 끝내고 사람이 계정·값을 채워야 하는" 항목만 모았다.
체크하면서 지워도 되고, 남겨두고 `[x]`만 바꿔도 된다.

## 🔴 배포 전 필수

- [ ] **실제 도메인 확정 → `NEXT_PUBLIC_SITE_URL` 환경변수에 반영**
      현재 코드 기본값은 `https://donpath.vercel.app`(`lib/seo.ts`). 커스텀 도메인이 정해지면
      배포 환경(Vercel 프로젝트 설정 → Environment Variables)에 `NEXT_PUBLIC_SITE_URL=https://<도메인>`을
      넣어야 `sitemap.xml`·`robots.txt`·OG 태그의 canonical URL이 전부 맞게 바뀐다.

- [ ] **네이버 검색 API 키 재발급 + 배포 환경에 등록**
      `app/api/news/route.ts`는 이제 NAVER API HUB(`https://naverapihub.apigw.ntruss.com`)를 쓴다 —
      키는 [네이버 개발자센터](https://developers.naver.com/apps)가 아니라
      [NAVER Cloud Platform 콘솔](https://console.ncloud.com)의 API Gateway/API Hub 상품에서 발급받은
      Client ID/Secret이어야 한다. `.env.local`의 `NAVER_SEARCH_CLIENT_ID`/`NAVER_SEARCH_CLIENT_SECRET`은
      로컬 전용(gitignore됨, 커밋된 적 없음)이지만 로컬에 평문으로 있던 이력이 있으니 배포 전 재발급 후,
      Vercel 프로젝트 Environment Variables에 새 키로 등록. `.env.local`은 절대 커밋하지 않는다.

- [ ] **저장소 정리**

  - [ ] `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — create-next-app 기본
        아이콘. 실제로 어디서도 안 쓰면 삭제, 쓰는 곳 있으면 브랜드 에셋으로 교체
  - [ ] `README.md` — 아직 create-next-app 기본 문구 그대로. 프로젝트 소개/실행법으로 교체
        (`PROJECT.md`/`AGENTS.md` 내용을 요약해서 넣으면 됨)

- [ ] **개인정보처리방침 · 이용약관 페이지**
      세금/연금 추정치를 다루는 국내 서비스라 최소한의 개인정보처리방침이 사실상 필수.
      수집 항목이 `localStorage`뿐이라도("서버로 전송되는 개인정보 없음") 명시해두는 게 안전하다.
      계산기의 "추정치" 고지는 이미 되어 있음(`components/tools/Disclaimer.tsx`).

## 🟠 강력 권장 (배포 직후라도)

- [ ] **Vercel Web Analytics 활성화**
      `@vercel/analytics`는 이미 코드에 붙어 있음(`app/layout.tsx`의 `<Analytics />`). Vercel
      프로젝트 대시보드 → Analytics 탭에서 켜야 실제로 수집 시작한다(코드만으로는 자동 활성화 안 됨).

- [ ] **에러 트래킹 서비스 연동(Sentry 등)**
      `app/error.tsx`, `app/global-error.tsx`에 `console.error(error)`만 있고 실제 리포팅처는
      없음. Sentry(또는 다른 APM) 계정 만들고 DSN 받아서 그 자리에 `Sentry.captureException(error)` 추가.

- [ ] **파비콘 / 앱 아이콘 교체**
      `app/favicon.ico`가 Next.js 기본 아이콘인지 확인. 픽셀아트 마스코트/로고(`components/mascot/assets`,
      `components/brand/assets/logo.png`) 기반으로 `app/icon.png`, `app/apple-icon.png` 만들어 교체 권장.
      필요하면 `app/manifest.ts`도 추가(PWA 설치 배너, 홈 화면 추가 지원).

- [ ] **`next.config.ts`에 보안 헤더 추가**
      현재 비어 있음. 최소 `X-Content-Type-Options`, `X-Frame-Options`(또는 CSP `frame-ancestors`),
      `Referrer-Policy` 정도는 배포 전에 넣는 걸 권장.

## 🟡 여유 있으면

- [ ] **Pretendard 폰트 셀프호스팅**
      현재 `app/layout.tsx`가 jsdelivr CDN에서 폰트를 받아온다(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/...">`).
      jsdelivr 장애 시 폰트 로딩이 막히고 렌더링이 지연될 수 있음. `next/font/local`로 바꾸면
      더 안정적이고 빠르다.

- [ ] **진도 백업 / 내보내기**
      진도가 `localStorage`에만 있어서(`store/`) 브라우저 데이터 삭제나 기기 변경 시 전부 유실됨.
      계정 없이도 JSON 내보내기/가져오기 버튼 정도는 붙여둘 만하다. (계정 자체는 `PROJECT.md` Phase 3 예정)

## 운영 중 계속 확인할 것

- [ ] **`content/rates.ts`의 `RATE_YEAR`와 각 세율/요율** — 국민연금 기준소득월액 상한은 매년 7월,
      나머지 요율은 연초에 정부 발표 나오면 갱신 필요. 파일 상단 주석에 출처가 적혀 있으니 그대로 따라가면 됨.
- [ ] **네이버 뉴스 API 사용량** — `app/api/news/route.ts`가 토픽별 120초 캐시 + IP당 분당 30회
      제한을 걸어놨지만, 실사용 트래픽 보고 무료 쿼터(25,000건/일)에 여유가 있는지 가끔 확인.

---

_이 파일은 배포 실행(도메인 연결, 계정 생성, 값 채워넣기)이 필요한 항목만 다룬다. 코드 품질/테스트/빌드는
이미 검증된 상태(`npm test`, `npm run lint`, `npm run build` 모두 통과)._
