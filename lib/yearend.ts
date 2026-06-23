import { basicDeductionPerPerson, localIncomeTaxRate } from "@/content/rates";
import {
  childTaxCredit,
  earnedIncomeDeduction,
  earnedIncomeTaxCredit,
  estimateTakeHome,
  progressiveTax,
} from "@/lib/takehome";

/** 연말정산 환급/추가납부 추정 — 순수 함수.
   ⚠️ 매우 단순화한 추정치다. 실제 결정세액은 신용카드·의료비·기부금 등 수많은 공제로 달라진다.
   "대략 이 방향" 정도로만 보고, 정확한 금액은 국세청 연말정산 간소화·회사 확인이 필요하다.

   모델:
   - 기납부세액(원천징수) ≈ 간이세액표 기준 매월 떼이는 소득세·지방세 × 12 (estimateTakeHome 재사용)
   - 결정세액 = 연말정산식으로 다시 계산한 소득세·지방세
     · 과세표준 = 근로소득금액 − (기본공제 + 4대보험료 + 추가 소득공제)
     · 세액 = 산출세액 − 근로소득세액공제 − 자녀세액공제 − 추가 세액공제
   - 환급액 = 기납부세액 − 결정세액  (양수면 환급, 음수면 추가 납부) */

export type YearEndResult = {
  /** 기납부세액 추정(소득세 + 지방세, 연) */
  withheld: number;
  /** 결정세액 추정(소득세 + 지방세, 연) */
  determined: number;
  /** 환급(+) 또는 추가납부(−) */
  refund: number;
  /* 결정세액 내역 */
  taxableBase: number;
  computedTax: number;
  taxCredits: number;
  incomeTaxDetermined: number;
  localTaxDetermined: number;
};

export function estimateYearEnd(opts: {
  annualGross: number;
  dependents?: number;
  children?: number;
  annualNontax?: number;
  /** 추가 소득공제(신용카드·주택청약 등 직접 입력, 연) */
  extraDeduction?: number;
  /** 추가 세액공제(연금저축·월세·기부 등 직접 입력, 연) */
  extraCredit?: number;
}): YearEndResult {
  const dependents = Math.max(1, opts.dependents ?? 1);
  const children = Math.max(0, opts.children ?? 0);
  const annual = Math.max(0, opts.annualGross);
  const nontax = Math.min(Math.max(0, opts.annualNontax ?? 0), annual);
  const extraDeduction = Math.max(0, opts.extraDeduction ?? 0);
  const extraCredit = Math.max(0, opts.extraCredit ?? 0);
  const taxableAnnual = annual - nontax; // 총급여

  // 기납부세액(원천징수) — 간이세액표 기준 매월 공제액 × 12
  const th = estimateTakeHome(annual, dependents, nontax, children);
  const withheld = (th.incomeTax + th.localIncomeTax) * 12;
  const annualInsurance =
    (th.nationalPension + th.healthInsurance + th.longTermCare + th.employment) *
    12;

  // 결정세액(연말정산식)
  const earnedIncome = taxableAnnual - earnedIncomeDeduction(taxableAnnual);
  const basicDeduction = dependents * basicDeductionPerPerson;
  const taxableBase = Math.max(
    0,
    earnedIncome - basicDeduction - annualInsurance - extraDeduction,
  );
  const computedTax = progressiveTax(taxableBase);

  // 자녀세액공제는 본인 제외 부양가족 수까지만
  const childCount = Math.min(children, Math.max(0, dependents - 1));
  const taxCredits =
    earnedIncomeTaxCredit(computedTax, taxableAnnual) +
    childTaxCredit(childCount) +
    extraCredit;

  const incomeTaxDetermined = Math.max(0, Math.round(computedTax - taxCredits));
  const localTaxDetermined = Math.round(incomeTaxDetermined * localIncomeTaxRate);
  const determined = incomeTaxDetermined + localTaxDetermined;

  return {
    withheld,
    determined,
    refund: withheld - determined,
    taxableBase,
    computedTax: Math.round(computedTax),
    taxCredits: Math.round(taxCredits),
    incomeTaxDetermined,
    localTaxDetermined,
  };
}
