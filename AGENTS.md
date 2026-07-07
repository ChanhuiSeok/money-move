# 머니무브 (money-move)

경제 문맹 퇴치 금융 학습 웹앱. 전체 로드맵·원칙은 `PROJECT.md`, 문구 톤은 `docs/tone-guide.md`를 따른다.

- **스택:** Next.js 16 (App Router) + TS + Tailwind v4 + Framer Motion + lucide-react + zustand + zod. MVP는 백엔드 없이 localStorage.
- **디자인 토큰·톤:** `app/globals.css`의 `@theme inline`. **청크(chunky) UI** — 픽셀아트 마스코트에 맞춘 도톰하고 촉각적인 톤이되 과하지 않고 성숙하게. 배경은 라이트=화이트/다크=딥네이비 유지(`prefers-color-scheme` + `data-theme`). 주역 `brand-*`(선명한 핀테크 블루), 보조 웜 레드 `accent-*`(인사 말풍선 등 소수 스팟), 스카이 `sky-*`. 표면(`background`/`surface`/`foreground`/`muted`/`border`/`subtle`)은 CSS 변수로 자동 전환. **입체 물성은 애니메이션 대신 '두께'로:** 솔리드 엣지 변수 `--edge-tile`/`--edge-brand`/`--edge-success`(라이트·다크 각각)와 부양 그림자 `--shadow-card`. 버튼(`buttonStyles.ts`)·타일(`tileStyles.ts`)·`Card interactive`는 아래 엣지를 갖고 누르면 내려앉는다(연속 애니메이션 없음, 100ms 눌림/포커스만). 라운드 `--radius-card:1.25rem`, 버튼 `rounded-xl`. 폰트 전부 Pretendard(`font-sans`), 제목은 globals의 `h1`(800)/`h2`(700) + `PageHeader`로 굵게. 강조 배경은 반투명 틴트(`bg-brand-500/10` 등)로 다크까지 대응.
- **레이아웃 폭:** 허브(그리드) `max-w-5xl`, 홈(대시보드+뉴스 aside) `max-w-6xl`, 목록/폼/읽기 페이지 `max-w-3xl`, 계산기 폼 `max-w-2xl`(2단은 tax-simulator `5xl`), 몰입형(레슨·시험지·진단) `max-w-md~2xl`. 상단 여백 `py-6 lg:py-10`. 데스크탑은 상단 헤더 내비(`AppShell`), 모바일은 하단 탭바.
- **마스코트:** 픽셀아트 소년 캐릭터가 정체성. `components/mascot/MascotImage.tsx` 포즈 `home`=인사·축하 / `study`=학습·계산기 / `exam`=모의고사(결과 신문) / `run`=학습 진행 게이지, `unoptimized`+pixelated. 추가 포즈 `book`=책+동전 더미(정답 보상, 캐릭터 아님 — 레슨 정답 피드백). 말풍선 `MascotBubble`(정적, 등장 애니메이션·`animate-bob` 제거됨). 로고는 `components/brand/Logo.tsx`, 카드 내 컬러 아이콘은 `components/icons/PixelIcon.tsx`(lucide 대신 픽셀 아이콘 — wallet/book/exam/house/money/news/pig/stock). **구 동전 SVG `Mascot.tsx`는 완전히 삭제됨** — 경로 노드·정답 피드백·loading·error·not-found까지 전부 픽셀 이미지로 교체.
- **공용 UI:** `components/ui/{Button,Card,PageHeader}.tsx`, 순수 스타일 헬퍼 `buttonStyles.ts`/`tileStyles.ts`(서버·클라 공용), 클래스 조합은 `lib/utils.ts`의 `cn`. 클릭 타일은 `tileVariants()`, 페이지 상단은 `PageHeader`로 통일.
- **불변 원칙:** 종목 추천·투자 조언 금지 / 세금·연금 수치는 `content/rates.ts`로 분리 / 계산기는 항상 "추정치" 안내.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
