import {
  earnedIncomeDeductionBrackets,
  earnedIncomeDeductionCap,
  incomeTaxBrackets,
  insuranceRates,
  localIncomeTaxRate,
  nationalPensionMonthlyCapBase,
} from "@/content/rates";

/** 실수령액 추정 결과(월 기준 금액들). ⚠️ 추정치 — 정확한 금액은 회사·국세청 확인 필요. */
export type TakeHome = {
  monthlyGross: number;
  annualGross: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employment: number;
  incomeTax: number;
  localIncomeTax: number;
  totalDeduction: number;
  net: number;
};

/** 근로소득공제(총급여 → 공제액), 한도 적용. */
export function earnedIncomeDeduction(annual: number): number {
  const b =
    earnedIncomeDeductionBrackets.find((x) => annual <= x.ceiling) ??
    earnedIncomeDeductionBrackets[earnedIncomeDeductionBrackets.length - 1];
  const deduction = b.base + (annual - b.over) * b.rate;
  return Math.min(deduction, earnedIncomeDeductionCap);
}

/** 과세표준 → 산출세액(누진세율). "과세표준 × 세율 − 누진공제" 형태. */
export function progressiveTax(base: number): number {
  if (base <= 0) return 0;
  const b =
    incomeTaxBrackets.find((x) => base <= x.ceiling) ??
    incomeTaxBrackets[incomeTaxBrackets.length - 1];
  return Math.max(0, base * b.rate - b.deduction);
}

/** 근로소득세액공제(소득세법 제59조). 산출세액별 공제 후 총급여 구간별 한도 적용. */
export function earnedIncomeTaxCredit(
  computedTax: number,
  annualGross: number
): number {
  const raw =
    computedTax <= 1_300_000
      ? computedTax * 0.55
      : 715_000 + (computedTax - 1_300_000) * 0.3;

  let limit: number;
  if (annualGross <= 33_000_000) {
    limit = 740_000;
  } else if (annualGross <= 70_000_000) {
    limit = Math.max(660_000, 740_000 - (annualGross - 33_000_000) * 0.008);
  } else if (annualGross <= 120_000_000) {
    limit = Math.max(500_000, 660_000 - (annualGross - 70_000_000) * 0.5);
  } else {
    limit = Math.max(200_000, 500_000 - (annualGross - 120_000_000) * 0.5);
  }
  return Math.min(raw, limit);
}

/** 근로소득 간이세액표의 공제대상가족 수별 공제액(국세청 간이세액표 계산방법).
   근로소득금액에서 추가로 빼는 종합소득공제 근사치. dependents는 본인 포함.
   https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=6583&cntntsId=7862 */
export function simplifiedFamilyDeduction(
  annualGross: number,
  dependents: number
): number {
  const g = Math.max(0, annualGross);
  const n = Math.max(1, dependents);
  let deduction: number;

  if (g <= 30_000_000) {
    deduction =
      n === 1
        ? 3_100_000 + g * 0.04
        : n === 2
          ? 3_600_000 + g * 0.04
          : 5_000_000 + g * 0.07;
  } else if (g <= 45_000_000) {
    const over = (g - 30_000_000) * 0.05; // 3천만 초과분 5% 차감
    deduction =
      n === 1
        ? 3_100_000 + g * 0.04 - over
        : n === 2
          ? 3_600_000 + g * 0.04 - over
          : 5_000_000 + g * 0.07 - over;
  } else if (g <= 70_000_000) {
    deduction =
      n === 1
        ? 3_100_000 + g * 0.015
        : n === 2
          ? 3_600_000 + g * 0.02
          : 5_000_000 + g * 0.05;
  } else {
    // 7,000만 초과(1.2억 이하 기준식, 그 이상도 동일 적용)
    deduction =
      n === 1
        ? 3_100_000 + g * 0.005
        : n === 2
          ? 3_600_000 + g * 0.01
          : 5_000_000 + g * 0.03;
  }

  // 공제대상가족 3명 이상: 총급여 4천만 초과분의 4% 추가 공제
  if (n >= 3) deduction += Math.max(0, g - 40_000_000) * 0.04;

  return Math.max(0, deduction);
}

/** 자녀세액공제(연). 산출세액에서 직접 차감. 소득세법 제59조의2.
   2025년 귀속(2026 연말정산)부터: 1명 25만, 2명 55만, 3명 이상 55만 + (자녀수−2)×40만. */
export function childTaxCredit(children: number): number {
  const c = Math.max(0, Math.floor(children));
  if (c <= 0) return 0;
  if (c === 1) return 250_000;
  return 550_000 + (c - 2) * 400_000;
}

/** 연봉(세전)·부양가족 수·비과세(연)·20세 이하 자녀 수로 월 실수령액을 추정한다. */
export function estimateTakeHome(
  annualGross: number,
  dependents = 1,
  annualNontax = 0,
  children = 0
): TakeHome {
  const annual = Math.max(0, annualGross);
  // 비과세(식대 등)는 총급여 이내. 4대 보험·소득세는 모두 '과세소득' 기준으로 계산한다.
  const nontax = Math.min(Math.max(0, annualNontax), annual);
  const taxableAnnual = annual - nontax;
  const taxableMonthly = taxableAnnual / 12; // 보험료·세금 산정 기준
  const monthlyGross = annual / 12; // 실수령 계산용 전체 월급(비과세 포함)

  // 4대 보험(근로자 부담, 월) — 과세소득(비과세 제외) 기준
  const npBase = Math.min(taxableMonthly, nationalPensionMonthlyCapBase);
  const nationalPension = Math.round(npBase * insuranceRates.nationalPension);
  const healthInsurance = Math.round(
    taxableMonthly * insuranceRates.healthInsurance
  );
  const longTermCare = Math.round(
    healthInsurance * insuranceRates.longTermCareOfHealth
  );
  const employment = Math.round(taxableMonthly * insuranceRates.employment);

  // 소득세(연 → 월) — 총급여(비과세 제외) 기준
  // 과세표준 = 근로소득금액(총급여 − 근로소득공제) − 간이세액 공제액 − 4대 보험료(소득공제)
  const annualInsurance =
    (nationalPension + healthInsurance + longTermCare + employment) * 12;
  const earnedIncome = taxableAnnual - earnedIncomeDeduction(taxableAnnual);
  const taxableBase = Math.max(
    0,
    earnedIncome -
      simplifiedFamilyDeduction(taxableAnnual, dependents) -
      annualInsurance
  );
  const computedTax = progressiveTax(taxableBase);
  // 자녀는 공제대상가족(본인 포함) 중 본인을 제외한 수를 넘지 못한다.
  const childCount = Math.min(
    Math.max(0, children),
    Math.max(0, Math.max(1, dependents) - 1)
  );
  const determinedTax = Math.max(
    0,
    computedTax -
      earnedIncomeTaxCredit(computedTax, taxableAnnual) -
      childTaxCredit(childCount)
  );
  const incomeTax = Math.round(determinedTax / 12);
  const localIncomeTax = Math.round((determinedTax * localIncomeTaxRate) / 12);

  const totalDeduction =
    nationalPension +
    healthInsurance +
    longTermCare +
    employment +
    incomeTax +
    localIncomeTax;

  const roundedMonthlyGross = Math.round(monthlyGross);

  return {
    monthlyGross: roundedMonthlyGross,
    annualGross: annual,
    nationalPension,
    healthInsurance,
    longTermCare,
    employment,
    incomeTax,
    localIncomeTax,
    totalDeduction,
    net: roundedMonthlyGross - totalDeduction,
  };
}
