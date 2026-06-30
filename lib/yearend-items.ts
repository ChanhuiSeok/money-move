import {
  cardDeduction,
  donationCredit,
  educationCredit,
  housingSavingsDeduction,
  insurancePremiumCredit,
  medicalCredit,
  rentCredit,
} from "@/content/rates";
import { estimatePensionCredit } from "@/lib/pension";

/* 연말정산 항목별 입력 → 소득공제/세액공제 금액 계산. 모두 순수 함수.
   ⚠️ 단순화한 추정치 — 실제 한도·문턱·예외는 더 다양함(국세청 확인 필요).
   세액공제 금액은 모두 '소득세' 기준으로 돌려준다. 지방세 10% 혜택은
   simulateYearEnd가 결정세액에 자동으로 얹으므로 여기서 더하지 않는다. */

/** 소득공제 항목 입력값(연, 원). */
export type DeductionInputs = {
  /** 신용카드 사용액 */
  cardCredit: number;
  /** 체크카드·현금영수증 사용액 */
  cardCheckCash: number;
  /** 전통시장·대중교통 사용액 */
  cardMarketTransit: number;
  /** 주택청약종합저축 납입액 */
  housingSavings: number;
};

/** 세액공제 항목 입력값(연, 원). */
export type CreditInputs = {
  /** 연금저축 납입액 */
  pension: number;
  /** IRP(퇴직연금) 납입액 */
  irp: number;
  /** 의료비 지출 */
  medical: number;
  /** 보장성보험료 납입액 */
  insurancePremium: number;
  /** 교육비 지출 */
  education: number;
  /** 기부금 */
  donation: number;
  /** 월세 지급액 */
  rent: number;
};

export const emptyDeductionInputs: DeductionInputs = {
  cardCredit: 0,
  cardCheckCash: 0,
  cardMarketTransit: 0,
  housingSavings: 0,
};

export const emptyCreditInputs: CreditInputs = {
  pension: 0,
  irp: 0,
  medical: 0,
  insurancePremium: 0,
  education: 0,
  donation: 0,
  rent: 0,
};

const nn = (n: number) => Math.max(0, n || 0);

/** 신용카드 등 사용금액 소득공제(단순화).
   문턱(총급여 25%)을 공제율 낮은 카드부터 차감하고, 남은 사용분에 결제수단별 공제율 적용. */
export function cardDeductionAmount(
  inputs: Pick<
    DeductionInputs,
    "cardCredit" | "cardCheckCash" | "cardMarketTransit"
  >,
  totalSalary: number,
): number {
  const credit = nn(inputs.cardCredit);
  const checkCash = nn(inputs.cardCheckCash);
  const marketTransit = nn(inputs.cardMarketTransit);

  let threshold = nn(totalSalary) * cardDeduction.thresholdRate;
  const creditUsed = Math.max(0, credit - threshold);
  threshold = Math.max(0, threshold - credit);
  const checkUsed = Math.max(0, checkCash - threshold);
  threshold = Math.max(0, threshold - checkCash);
  const marketUsed = Math.max(0, marketTransit - threshold);

  const raw =
    creditUsed * cardDeduction.creditRate +
    checkUsed * cardDeduction.checkCashRate +
    marketUsed * cardDeduction.marketTransitRate;

  const cap =
    nn(totalSalary) <= cardDeduction.capSalaryCeiling
      ? cardDeduction.capHigh
      : cardDeduction.capLow;
  return Math.round(Math.min(raw, cap));
}

/** 주택청약종합저축 소득공제(단순화). 총급여 7천만 초과면 0. */
export function housingDeductionAmount(
  payment: number,
  totalSalary: number,
): number {
  if (nn(totalSalary) > housingSavingsDeduction.salaryCeiling) return 0;
  const eligible = Math.min(nn(payment), housingSavingsDeduction.paymentCap);
  return Math.round(eligible * housingSavingsDeduction.rate);
}

/** 의료비 세액공제(소득세 기준, 단순화). 총급여 3% 초과분의 15%. */
export function medicalCreditAmount(
  spending: number,
  totalSalary: number,
): number {
  const over = nn(spending) - nn(totalSalary) * medicalCredit.thresholdRate;
  return Math.round(Math.max(0, over) * medicalCredit.rate);
}

/** 보장성보험료 세액공제(소득세 기준). 납입액(100만 한도)의 12%. */
export function insurancePremiumCreditAmount(payment: number): number {
  const eligible = Math.min(nn(payment), insurancePremiumCredit.paymentCap);
  return Math.round(eligible * insurancePremiumCredit.rate);
}

/** 교육비 세액공제(소득세 기준, 단순화). 지출액의 15%. */
export function educationCreditAmount(spending: number): number {
  return Math.round(nn(spending) * educationCredit.rate);
}

/** 기부금 세액공제(소득세 기준). 1천만 이하 15%, 초과분 30%. */
export function donationCreditAmount(donation: number): number {
  const d = nn(donation);
  const low = Math.min(d, donationCredit.threshold);
  const high = Math.max(0, d - donationCredit.threshold);
  return Math.round(low * donationCredit.rateLow + high * donationCredit.rateHigh);
}

/** 월세 세액공제(소득세 기준, 단순화). 총급여 8천만 초과면 0. */
export function rentCreditAmount(payment: number, totalSalary: number): number {
  if (nn(totalSalary) > rentCredit.salaryCeiling) return 0;
  const eligible = Math.min(nn(payment), rentCredit.paymentCap);
  const rate =
    nn(totalSalary) <= rentCredit.higherRateSalaryCeiling
      ? rentCredit.rateHigh
      : rentCredit.rateLow;
  return Math.round(eligible * rate);
}

/** 소득공제 항목 합산 결과. */
export type DeductionBreakdown = {
  card: number;
  housing: number;
  total: number;
};

/** 세액공제 항목 합산 결과(모두 소득세 기준). */
export type CreditBreakdown = {
  pension: number;
  medical: number;
  insurancePremium: number;
  education: number;
  donation: number;
  rent: number;
  total: number;
};

export function computeDeductions(
  inputs: DeductionInputs,
  totalSalary: number,
): DeductionBreakdown {
  const card = cardDeductionAmount(inputs, totalSalary);
  const housing = housingDeductionAmount(inputs.housingSavings, totalSalary);
  return { card, housing, total: card + housing };
}

export function computeCredits(
  inputs: CreditInputs,
  totalSalary: number,
): CreditBreakdown {
  // 연금/IRP는 소득세 절감액(incomeTaxSaved)만 사용 — 지방세는 시뮬레이터가 따로 얹음.
  const pension = estimatePensionCredit({
    pension: inputs.pension,
    irp: inputs.irp,
    totalSalary,
  }).incomeTaxSaved;
  const medical = medicalCreditAmount(inputs.medical, totalSalary);
  const insurancePremium = insurancePremiumCreditAmount(inputs.insurancePremium);
  const education = educationCreditAmount(inputs.education);
  const donation = donationCreditAmount(inputs.donation);
  const rent = rentCreditAmount(inputs.rent, totalSalary);
  return {
    pension,
    medical,
    insurancePremium,
    education,
    donation,
    rent,
    total:
      pension + medical + insurancePremium + education + donation + rent,
  };
}
