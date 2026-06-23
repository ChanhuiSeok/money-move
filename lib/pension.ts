import { pensionSavings } from "@/content/rates";
import { localIncomeTaxRate } from "@/content/rates";

/** 연금저축·IRP 세액공제 추정 — 순수 함수. ⚠️ 추정치(국세청 확인 필요). */

export type PensionCredit = {
  /** 세액공제 대상으로 인정되는 납입액(한도 적용 후) */
  creditable: number;
  /** 적용 공제율(소득세 기준): 0.15 또는 0.12 */
  rate: number;
  /** 소득세 절감액 */
  incomeTaxSaved: number;
  /** 지방소득세 절감액(소득세 절감액의 10%) */
  localTaxSaved: number;
  /** 총 절감액(소득세 + 지방소득세) = 체감 환급 */
  totalSaved: number;
  /** 한도를 넘겨 공제받지 못한 납입액 */
  excess: number;
};

/** 총급여로 공제율을 정한다(이하면 높은 율). */
export function pensionCreditRate(totalSalary: number): number {
  return totalSalary <= pensionSavings.higherRateSalaryCeiling
    ? pensionSavings.higherRate
    : pensionSavings.lowerRate;
}

/** 세액공제 대상 납입액을 한도에 맞춰 구한다.
   연금저축은 단독 600만 한도, IRP를 합치면 900만까지. */
export function creditablePayment(pension: number, irp: number): number {
  const p = Math.max(0, pension);
  const i = Math.max(0, irp);
  const pensionEligible = Math.min(p, pensionSavings.pensionOnlyCap);
  return Math.min(pensionEligible + i, pensionSavings.combinedCap);
}

/** 연금저축·IRP 납입액과 총급여로 세액공제(절세) 금액을 추정한다. */
export function estimatePensionCredit(opts: {
  pension: number;
  irp?: number;
  totalSalary: number;
}): PensionCredit {
  const pension = Math.max(0, opts.pension);
  const irp = Math.max(0, opts.irp ?? 0);
  const creditable = creditablePayment(pension, irp);
  const rate = pensionCreditRate(Math.max(0, opts.totalSalary));

  const incomeTaxSaved = Math.round(creditable * rate);
  const localTaxSaved = Math.round(incomeTaxSaved * localIncomeTaxRate);

  return {
    creditable,
    rate,
    incomeTaxSaved,
    localTaxSaved,
    totalSaved: incomeTaxSaved + localTaxSaved,
    excess: Math.max(0, pension + irp - creditable),
  };
}
