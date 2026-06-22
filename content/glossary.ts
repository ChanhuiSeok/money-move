import type { GlossaryTerm } from "@/lib/schema";

/** 용어 사전. 본문에서 `[표시어](term:id)`로 참조하면 밑줄+말풍선으로 풀이된다.
   short는 한 입 설명(말풍선용), full은 사전 페이지(Task 2.3)용 상세. */
export const glossaryTerms: GlossaryTerm[] = [
  // ── 레벨 1: 돈의 기초 ──
  {
    id: "fixed-expense",
    term: "고정지출",
    short: "매달 정해진 날, 비슷한 금액으로 빠져나가는 지출. 월세·통신비·구독료처럼 예측할 수 있어요.",
  },
  {
    id: "variable-expense",
    term: "변동지출",
    short: "그때그때 달라지는 지출. 외식·쇼핑·여행처럼 내가 조절하기 쉬운 돈이에요.",
  },
  {
    id: "emergency-fund",
    term: "비상금",
    short: "갑작스러운 일(병원비·수리비 등)에 대비해 따로 모아두는 돈. 흔히 3~6개월치 생활비를 목표로 해요.",
  },
  {
    id: "budget",
    term: "예산",
    short: "쓸 돈을 미리 정해두는 계획. 들어올 돈 안에서 어디에 얼마 쓸지 나눠두는 거예요.",
  },

  // ── 레벨 2: 세금과 공제 ──
  {
    id: "take-home-pay",
    term: "실수령액",
    short: "세금과 4대 보험을 떼고 실제로 통장에 들어오는 돈이에요. '세후 월급'이라고도 해요.",
  },
  {
    id: "gross-pay",
    term: "세전 월급",
    short: "세금·보험료를 떼기 전, 받기로 한 원래 금액이에요. 명세서 맨 위에 적혀 있어요.",
  },
  {
    id: "withholding",
    term: "원천징수",
    short: "회사가 월급을 줄 때 세금을 미리 떼어 나라에 대신 내주는 것. 그래서 통장엔 세후 금액이 들어와요.",
  },
  {
    id: "four-major-insurance",
    term: "4대 보험",
    short: "국민연금·건강보험·고용보험·산재보험. 매달 월급에서 빠지지만, 노후·병원·실직을 대비하는 안전망이에요.",
  },
  {
    id: "national-pension",
    term: "국민연금",
    short: "노후에 매달 연금으로 돌려받기 위해 일하는 동안 쌓아두는 돈이에요.",
  },
  {
    id: "health-insurance",
    term: "건강보험",
    short: "아플 때 병원비 부담을 크게 줄여주는 보험. 모두가 함께 부담해 서로를 돕는 구조예요.",
  },
  {
    id: "employment-insurance",
    term: "고용보험",
    short: "실직했을 때 실업급여 등으로 다시 일어설 수 있게 도와주는 보험이에요.",
  },
  {
    id: "income-tax",
    term: "소득세",
    short: "번 돈에 매겨지는 세금. 많이 벌수록 더 높은 비율이 적용되는 구조예요.",
  },
  {
    id: "income-deduction",
    term: "소득공제",
    short: "세금을 매기는 '기준 소득'을 줄여주는 것. 기준이 줄면 세금도 줄어요.",
  },
  {
    id: "tax-credit",
    term: "세액공제",
    short: "이미 계산된 세금에서 직접 빼주는 것. 깎이는 효과가 더 직접적이에요.",
  },
  {
    id: "year-end-settlement",
    term: "연말정산",
    short: "1년간 떼인 세금과 실제 낼 세금을 비교해, 더 냈으면 돌려주고 덜 냈으면 더 걷는 정산이에요.",
  },
];

const byId = new Map(glossaryTerms.map((t) => [t.id, t]));

export function getTerm(id: string): GlossaryTerm | undefined {
  return byId.get(id);
}
