import type { Profile } from "@/lib/schema";
import { annualGross, hasProfile, profileTakeHome } from "@/lib/profile";
import { formatManwon } from "@/lib/format";

/* "내 숫자" 토큰 — 레슨 본문의 `[예시값](my:id)` 자리를 내 프로필 값으로 치환한다.
   값 계산은 실수령액 계산기와 같은 로직(lib/profile.ts)을 그대로 재사용해
   "홈·계산기·레슨"이 항상 같은 숫자를 말하게 한다. */

export type MyToken = {
  id: string;
  /** 이 숫자가 뭔지 한 줄 설명 — 툴팁/접근성 라벨용. */
  label: string;
  /** 프로필에서 값(원 단위)을 뽑는다. */
  value: (p: Profile) => number;
};

export const MY_TOKENS: Record<string, MyToken> = {
  takehome: {
    id: "takehome",
    label: "내 월 실수령액(추정)",
    value: (p) => profileTakeHome(p).net,
  },
  "gross-month": {
    id: "gross-month",
    label: "내 세전 월급",
    value: (p) => profileTakeHome(p).monthlyGross,
  },
  "gross-year": {
    id: "gross-year",
    label: "내 세전 연봉",
    value: (p) => annualGross(p),
  },
  deduction: {
    id: "deduction",
    label: "내 월 공제 합계(추정)",
    value: (p) => profileTakeHome(p).totalDeduction,
  },
  pension: {
    id: "pension",
    label: "내 국민연금(월, 추정)",
    value: (p) => profileTakeHome(p).nationalPension,
  },
};

export type MyResolved = { text: string; label: string };

/** 프로필이 설정돼 있고 지원하는 토큰이면 내 숫자 문자열로 해석한다.
   미설정이거나 모르는 토큰이면 null (호출부가 fallback 예시값을 쓰게). */
export function resolveMyToken(id: string, p: Profile): MyResolved | null {
  const token = MY_TOKENS[id];
  if (!token || !hasProfile(p)) return null;
  return { text: formatManwon(token.value(p)), label: token.label };
}
