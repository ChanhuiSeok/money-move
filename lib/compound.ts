/** 적립 저축 계산 — 순수 함수. ⚠️ 추정치(세금·수수료·물가 미반영).
   매월 "초"에 적립한다고 가정(은행 적금과 같은 월초 납입).
   복리(이자가 이자를 낳음)와 단리(은행 적금식)를 함께 계산해 비교를 보여준다. */

export type SavingsBreakdown = {
  /** 만기 평가액(원금 + 이자) */
  futureValue: number;
  /** 불어난 이자 = futureValue − contributed */
  interest: number;
};

export type SavingsResult = {
  months: number;
  /** 실제로 넣은 돈 합계(초기 원금 + 매월 적립 × 개월) */
  contributed: number;
  /** 월복리 */
  compound: SavingsBreakdown;
  /** 단리(은행 적금식) */
  simple: SavingsBreakdown;
  /** 복리가 단리보다 더 번 금액(≥ 0) */
  compoundExtra: number;
};

export function estimateSavings(opts: {
  principal: number;
  monthly: number;
  annualRatePercent: number;
  years: number;
}): SavingsResult {
  const principal = Math.max(0, opts.principal);
  const monthly = Math.max(0, opts.monthly);
  const months = Math.max(0, Math.round(opts.years * 12));
  const r = Math.max(0, opts.annualRatePercent) / 100 / 12; // 월이율
  const contributed = principal + monthly * months;

  // 월복리 · 매월 초 적립(annuity due): 적립액의 미래가치에 (1+r)를 한 번 더 곱한다.
  const growth = Math.pow(1 + r, months);
  const compoundMonthly =
    r === 0 ? monthly * months : monthly * ((growth - 1) / r) * (1 + r);
  const compoundFV = Math.round(principal * growth + compoundMonthly);

  // 단리(은행 적금식) · 매월 초 적립: 각 납입금이 남은 개월만큼 단리.
  // 적립 이자 = 월납입 × 월이율 × n(n+1)/2,  원금 이자 = 원금 × 월이율 × n
  const simpleInterest = Math.round(
    principal * r * months + monthly * r * ((months * (months + 1)) / 2),
  );
  const simpleFV = contributed + simpleInterest;

  const compoundInterest = compoundFV - contributed;

  return {
    months,
    contributed,
    compound: { futureValue: compoundFV, interest: compoundInterest },
    simple: { futureValue: simpleFV, interest: simpleInterest },
    compoundExtra: Math.max(0, compoundInterest - simpleInterest),
  };
}
