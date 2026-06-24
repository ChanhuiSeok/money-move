import {
  basicDeductionPerPerson,
  incomeTaxBrackets,
  localIncomeTaxRate,
} from "@/content/rates";
import {
  earnedIncomeDeduction,
  earnedIncomeTaxCredit,
  estimateTakeHome,
  progressiveTax,
} from "@/lib/takehome";

/* 종합소득세 누진세율 구간(과세표준 → 세율). rates.ts의 incomeTaxBrackets에 하한을 붙인 형태.
   산출세액 = 과세표준 × rate − deduction(누진공제). */
export type TaxBracket = {
  lower: number;
  upper: number;
  rate: number;
  deduction: number;
};

export const taxBrackets: TaxBracket[] = incomeTaxBrackets.map((b, i) => ({
  lower: i === 0 ? 0 : incomeTaxBrackets[i - 1].ceiling,
  upper: b.ceiling,
  rate: b.rate,
  deduction: b.deduction,
}));

/** 과세표준이 속한 세율 구간. 경계값은 '이하' 쪽 구간(progressiveTax와 동일 규칙). */
export function bracketOf(taxableBase: number): {
  index: number;
  bracket: TaxBracket;
} {
  const base = Math.max(0, taxableBase);
  const index = taxBrackets.findIndex((b) => base <= b.upper);
  const i = index === -1 ? taxBrackets.length - 1 : index;
  return { index: i, bracket: taxBrackets[i] };
}

/* 연말정산 흐름 시뮬레이션 — 순수 함수.
   교육용으로 '소득공제 → 산출세액 → 세액공제 → 결정세액' 흐름을 단계별 값으로 돌려준다.
   핵심: 세액공제는 산출세액을 0 밑으로 내리지 못한다(초과분은 '사라짐'). 본인 1인 기준 단순화.
   ⚠️ 추정치 — 신용카드·의료비 등 실제 공제는 사람마다 달라 정확한 금액은 국세청 확인 필요. */

export type TaxSimResult = {
  totalSalary: number; // 총급여
  earnedDeduction: number; // 근로소득공제
  earnedIncome: number; // 근로소득금액(총급여 − 근로소득공제)
  basicDeduction: number; // 기본(인적)공제
  insuranceDeduction: number; // 4대 보험료 소득공제(추정, 연)
  extraIncomeDeduction: number; // 추가 소득공제(입력)
  totalIncomeDeduction: number; // 소득공제 합계
  taxableBase: number; // 과세표준
  computedTax: number; // 산출세액(소득세)
  earnedTaxCredit: number; // 근로소득세액공제(자동)
  extraTaxCredit: number; // 추가 세액공제(입력)
  requestedCredit: number; // 세액공제 합계(요청)
  appliedCredit: number; // 실제 적용된 세액공제(= min(요청, 산출세액))
  wastedCredit: number; // 낼 세금이 없어 사라진 세액공제
  determinedIncomeTax: number; // 결정세액(소득세, 0 미만 불가)
  localTax: number; // 지방소득세(소득세의 10%)
  determinedTax: number; // 결정세액(소득세 + 지방세)
  withheld: number; // 기납부세액(원천징수 추정, 연)
  refund: number; // 환급(+) / 추가납부(−)
};

export function simulateYearEnd(opts: {
  totalSalary: number;
  extraIncomeDeduction?: number;
  extraTaxCredit?: number;
  dependents?: number;
}): TaxSimResult {
  const totalSalary = Math.max(0, opts.totalSalary);
  const dependents = Math.max(1, opts.dependents ?? 1);
  const extraIncomeDeduction = Math.max(0, opts.extraIncomeDeduction ?? 0);
  const extraTaxCredit = Math.max(0, opts.extraTaxCredit ?? 0);

  const earnedDeduction = earnedIncomeDeduction(totalSalary);
  const earnedIncome = Math.max(0, totalSalary - earnedDeduction);
  const basicDeduction = dependents * basicDeductionPerPerson;

  // 4대 보험료(연)·기납부세액은 실수령 계산기를 재사용해 추정(비과세 0 가정).
  const th = estimateTakeHome(totalSalary, dependents, 0, 0);
  const insuranceDeduction =
    (th.nationalPension + th.healthInsurance + th.longTermCare + th.employment) *
    12;
  const withheld = (th.incomeTax + th.localIncomeTax) * 12;

  const totalIncomeDeduction =
    basicDeduction + insuranceDeduction + extraIncomeDeduction;
  const taxableBase = Math.max(0, earnedIncome - totalIncomeDeduction);
  const computedTax = progressiveTax(taxableBase);

  const earnedTaxCredit = earnedIncomeTaxCredit(computedTax, totalSalary);
  const requestedCredit = earnedTaxCredit + extraTaxCredit;
  // 핵심: 세액공제는 산출세액까지만 효과. 초과분은 사라진다.
  const appliedCredit = Math.min(requestedCredit, computedTax);

  // 반올림 후에도 적용분 + 사라진분 = 요청분이 정확히 맞도록 파생한다.
  const requestedRounded = Math.round(requestedCredit);
  const appliedRounded = Math.round(appliedCredit);
  const wastedRounded = requestedRounded - appliedRounded; // 단조 반올림이라 ≥ 0

  const determinedIncomeTax = Math.max(0, Math.round(computedTax - appliedCredit));
  const localTax = Math.round(determinedIncomeTax * localIncomeTaxRate);
  const determinedTax = determinedIncomeTax + localTax;

  return {
    totalSalary,
    earnedDeduction: Math.round(earnedDeduction),
    earnedIncome: Math.round(earnedIncome),
    basicDeduction,
    insuranceDeduction: Math.round(insuranceDeduction),
    extraIncomeDeduction,
    totalIncomeDeduction: Math.round(totalIncomeDeduction),
    taxableBase: Math.round(taxableBase),
    computedTax: Math.round(computedTax),
    earnedTaxCredit: Math.round(earnedTaxCredit),
    extraTaxCredit,
    requestedCredit: requestedRounded,
    appliedCredit: appliedRounded,
    wastedCredit: wastedRounded,
    determinedIncomeTax,
    localTax,
    determinedTax,
    withheld: Math.round(withheld),
    refund: Math.round(withheld - determinedTax),
  };
}
