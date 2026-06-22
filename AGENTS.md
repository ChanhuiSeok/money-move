# 돈길 (donpath)

경제 문맹 퇴치 금융 학습 웹앱. 전체 로드맵·원칙은 `PROJECT.md`, 문구 톤은 `docs/tone-guide.md`를 따른다.

- **스택:** Next.js 16 (App Router) + TS + Tailwind v4 + Framer Motion + lucide-react + zustand + zod. MVP는 백엔드 없이 localStorage.
- **디자인 토큰:** `app/globals.css`의 `@theme inline` — 모던 핀테크 톤. 블루 `brand-*` + 스카이 `sky-*` 액센트, 표면(`background`/`surface`/`foreground`/`muted`/`border`/`subtle`)은 CSS 변수로 라이트(화이트)·다크(딥네이비) 자동 전환(`prefers-color-scheme`). 폰트 `font-sans`=Pretendard. 강조 배경은 반투명 틴트(`bg-brand-500/10`, `bg-success/10` 등)로 다크모드까지 대응. `rounded-card`/버튼 `rounded-xl`.
- **공용 UI:** `components/ui/{Button,Card}.tsx`, 클래스 조합은 `lib/utils.ts`의 `cn`.
- **불변 원칙:** 종목 추천·투자 조언 금지 / 세금·연금 수치는 `content/rates.ts`로 분리 / 계산기는 항상 "추정치" 안내.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
