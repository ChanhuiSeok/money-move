---
name: differentiation-my-numbers
description: 돈길의 차별화 전략 — "내 숫자로 돌아가는 앱" (개인화된 금융 학습)
metadata:
  type: project
---

돈길의 핵심 차별화 방향으로 **"내 숫자로 돌아가는 앱"**을 선택했다(2026-07-06). 강좌형 듀오링고 클론에서 벗어나, 가입 없이 프로필(월급/가족)을 한 번 넣으면 레슨·예시·계산기가 전부 "내 얘기"로 바뀌게 하는 게 제품 정체성.

**Why:** 강좌형은 흔하고 리텐션이 약함. 프로필 인프라(localStorage, 계산기·홈·시나리오 연동)는 이미 있었고, 유일하게 비어있던 조각이 "레슨 본문이 내 숫자로 말하기"였음.

**How to apply:** 레슨 콘텐츠에서 예시 금액은 `[예시값](my:토큰id)` 마크업으로 쓴다. 지원 토큰은 `lib/personalize.ts`의 `MY_TOKENS`(takehome, gross-month, gross-year, deduction, pension). 파서는 `lib/richtext.ts`, 렌더는 `components/glossary/MyNumberChip.tsx`(프로필 있으면 브랜드 틴트로 내 숫자, 없으면 /profile로 유도하는 넛지). 값은 항상 `lib/profile.ts` 재사용 → 홈·계산기·레슨이 같은 숫자를 말함. 첫 적용 레슨은 payslip-basics. 앞으로 다른 레슨들도 이 토큰으로 개인화 확대할 것.

대안으로 검토했던 방향: 생애 시나리오 진입, What-if 인생 시뮬레이터.
