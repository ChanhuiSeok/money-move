// "올해 기준" 세금·연금 수치. 매년 바뀌므로 콘텐츠에 하드코딩하지 말고 여기서 관리한다.
// ⚠️ 참고·추정용입니다. 정확한 금액은 국세청/회사/4대 보험 기관 확인이 필요해요. (Task 1.8 계산기에서 사용)
//
// 2026년 기준 (2026-06 확인). 출처:
// - 국민연금 9.5%(연금개혁, 2026년부터 매년 0.5%p↑ → 2033년 13%) — 보건복지부/NPS
// - 건강보험 7.19%, 장기요양 소득대비 0.9448%(= 건강보험료의 약 13.14%) — 보건복지부 보도자료
// - 고용보험(실업급여) 근로자 0.9% — 2022.7 이후 동결
// - 국민연금 기준소득월액 상한 637만원(2025.7~2026.6) — 보건복지부 고시
// - 소득세 누진구간: 2023년 개편 체계 유지(국세청)
// 매년 7월(국민연금 상한)·연초(요율) 재확인 필요.

export const RATE_YEAR = 2026;

/** 근로자 부담 4대 보험 요율. 회사도 같은(또는 비슷한) 몫을 함께 부담해요. */
export const insuranceRates = {
  /** 국민연금: 전체 9.5% 중 근로자 절반 */
  nationalPension: 0.0475,
  /** 건강보험: 전체 7.19% 중 근로자 절반 */
  healthInsurance: 0.03595,
  /** 장기요양보험: 건강보험료 대비 비율(소득대비 0.9448% ÷ 건강보험 7.19%) */
  longTermCareOfHealth: 0.1314,
  /** 고용보험(실업급여분) 근로자 부담 */
  employment: 0.009,
} as const;

/** 산재보험은 전액 사업주 부담(근로자 부담 0). */
export const workersCompEmployeeRate = 0;

/** 국민연금은 기준소득월액 상한까지만 부과. 이 금액을 넘는 월급은 상한 기준으로 계산.(2025.7~2026.6) */
export const nationalPensionMonthlyCapBase = 6_370_000;

/** 소득세 추정용 데이터 ───────────────────────────── */
export const basicDeductionPerPerson = 1_500_000; // 기본공제 1인당(본인·부양가족)
export const localIncomeTaxRate = 0.1; // 지방소득세 = 소득세의 10%
export const earnedIncomeDeductionCap = 20_000_000; // 근로소득공제 한도

/** 근로소득공제: 해당 구간에서 base + (총급여 - over) × rate, 한도 적용. */
export const earnedIncomeDeductionBrackets = [
  { ceiling: 5_000_000, base: 0, rate: 0.7, over: 0 },
  { ceiling: 15_000_000, base: 3_500_000, rate: 0.4, over: 5_000_000 },
  { ceiling: 45_000_000, base: 7_500_000, rate: 0.15, over: 15_000_000 },
  { ceiling: 100_000_000, base: 12_000_000, rate: 0.05, over: 45_000_000 },
  { ceiling: Infinity, base: 14_750_000, rate: 0.02, over: 100_000_000 },
] as const;

/** 연금저축·IRP 세액공제 (조특법 제59조의3). 2023년 개편 이후 기준.
   - 세액공제 대상 납입 한도: 연금저축 600만원, 퇴직연금(IRP) 합산 시 900만원.
   - 공제율(소득세): 총급여 5,500만원(종합소득금액 4,500만원) 이하 15%, 초과 12%.
   - 지방소득세 10%를 더하면 체감 16.5% / 13.2%. */
export const pensionSavings = {
  /** 연금저축 단독 세액공제 대상 한도(연) */
  pensionOnlyCap: 6_000_000,
  /** 연금저축 + IRP 합산 세액공제 대상 한도(연) */
  combinedCap: 9_000_000,
  /** 높은 공제율 적용 총급여 상한(이하면 15%) */
  higherRateSalaryCeiling: 55_000_000,
  /** 소득세 공제율 */
  higherRate: 0.15,
  lowerRate: 0.12,
} as const;

/** 연말정산 항목별 공제 규칙(단순화) ─────────────────────────────
   ⚠️ 모두 교육용 추정치. 실제 한도·문턱·예외는 훨씬 다양하니 국세청 확인 필요.
   세액공제율은 모두 '소득세' 기준(지방세 10%는 계산기가 따로 얹는다). */

/** 신용카드 등 사용금액 소득공제(조특법 §126의2, 단순화).
   총급여의 25%를 넘는 사용분만 공제 대상. 결제수단별 공제율이 다르고,
   문턱(25%)은 공제율이 낮은 신용카드 사용분부터 차감한다(납세자 유리). */
export const cardDeduction = {
  thresholdRate: 0.25, // 총급여의 25% 초과분만 공제
  creditRate: 0.15, // 신용카드
  checkCashRate: 0.3, // 체크카드·현금영수증
  marketTransitRate: 0.4, // 전통시장·대중교통
  capHigh: 3_000_000, // 공제 한도(총급여 7천만 이하)
  capLow: 2_500_000, // 공제 한도(총급여 7천만 초과)
  capSalaryCeiling: 70_000_000,
} as const;

/** 주택청약종합저축 소득공제(조특법 §87, 단순화).
   무주택 세대주·총급여 7천만 이하. 납입액(연 300만 한도)의 40%를 공제. */
export const housingSavingsDeduction = {
  rate: 0.4,
  paymentCap: 3_000_000,
  salaryCeiling: 70_000_000,
} as const;

/** 의료비 세액공제(단순화). 총급여의 3%를 넘는 지출분의 15%. */
export const medicalCredit = {
  thresholdRate: 0.03,
  rate: 0.15,
} as const;

/** 보장성보험료 세액공제(단순화). 납입액(연 100만 한도)의 12%. */
export const insurancePremiumCredit = {
  rate: 0.12,
  paymentCap: 1_000_000,
} as const;

/** 교육비 세액공제(단순화). 지출액의 15%. (본인은 한도 없음, 자녀는 1인 300만 등 — 여기선 한도 생략) */
export const educationCredit = {
  rate: 0.15,
} as const;

/** 기부금 세액공제(단순화). 1천만 이하 15%, 초과분 30%. */
export const donationCredit = {
  rateLow: 0.15,
  rateHigh: 0.3,
  threshold: 10_000_000,
} as const;

/** 월세 세액공제(단순화). 총급여 5,500만 이하 17%, 8천만 이하 15%. 납입액 연 1,000만 한도. */
export const rentCredit = {
  rateHigh: 0.17,
  rateLow: 0.15,
  higherRateSalaryCeiling: 55_000_000,
  salaryCeiling: 80_000_000,
  paymentCap: 10_000_000,
} as const;

/** 종합소득세 누진세율: 과세표준 × rate − deduction(누진공제). */
export const incomeTaxBrackets = [
  { ceiling: 14_000_000, rate: 0.06, deduction: 0 },
  { ceiling: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { ceiling: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { ceiling: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { ceiling: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { ceiling: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { ceiling: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { ceiling: Infinity, rate: 0.45, deduction: 65_940_000 },
] as const;
