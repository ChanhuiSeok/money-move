import { describe, expect, it } from "vitest";
import {
  childTaxCredit,
  earnedIncomeTaxCredit,
  estimateTakeHome,
  progressiveTax,
} from "@/lib/takehome";

/** 소득세법 제59조 근로소득세액공제 — 구현과 같아야 한다. */
function officialCredit(computedTax: number, gross: number): number {
  const raw =
    computedTax <= 1_300_000
      ? computedTax * 0.55
      : 715_000 + (computedTax - 1_300_000) * 0.3;
  let limit: number;
  if (gross <= 33_000_000) limit = 740_000;
  else if (gross <= 70_000_000)
    limit = Math.max(660_000, 740_000 - (gross - 33_000_000) * (8 / 1000));
  else if (gross <= 120_000_000)
    limit = Math.max(500_000, 660_000 - (gross - 70_000_000) * (1 / 2));
  else limit = Math.max(200_000, 500_000 - (gross - 120_000_000) * (1 / 2));
  return Math.min(raw, limit);
}

/** 국세청 종합소득세 표(기준액 + 초과분×세율) — progressiveTax와 같아야 한다.
   https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=6594&cntntsId=7873 */
function officialTax(base: number): number {
  if (base <= 0) return 0;
  if (base <= 14_000_000) return base * 0.06;
  if (base <= 50_000_000) return 840_000 + (base - 14_000_000) * 0.15;
  if (base <= 88_000_000) return 6_240_000 + (base - 50_000_000) * 0.24;
  if (base <= 150_000_000) return 15_360_000 + (base - 88_000_000) * 0.35;
  if (base <= 300_000_000) return 37_060_000 + (base - 150_000_000) * 0.38;
  if (base <= 500_000_000) return 94_060_000 + (base - 300_000_000) * 0.4;
  if (base <= 1_000_000_000) return 174_060_000 + (base - 500_000_000) * 0.42;
  return 384_060_000 + (base - 1_000_000_000) * 0.45;
}

describe("progressiveTax (국세청 누진세율표와 일치)", () => {
  const samples = [
    0, 10_000_000, 14_000_000, 30_000_000, 50_000_000, 60_000_000,
    88_000_000, 120_000_000, 150_000_000, 200_000_000, 300_000_000,
    400_000_000, 500_000_000, 700_000_000, 1_000_000_000, 1_200_000_000,
  ];
  it.each(samples)("과세표준 %i 원에서 공식 표와 같다", (base) => {
    expect(progressiveTax(base)).toBe(officialTax(base));
  });

  it("구간 경계값에서도 정확", () => {
    expect(progressiveTax(14_000_000)).toBe(840_000); // 14M × 6%
    expect(progressiveTax(50_000_000)).toBe(6_240_000); // 84만 + 36M×15%
    expect(progressiveTax(88_000_000)).toBe(15_360_000);
    expect(progressiveTax(1_000_000_000)).toBe(384_060_000);
  });
});

describe("earnedIncomeTaxCredit (소득세법 제59조와 일치)", () => {
  it("산출세액별 공제율(55% / 71.5만+30%)", () => {
    // 한도가 큰 저총급여로 raw가 그대로 드러나게
    expect(earnedIncomeTaxCredit(1_000_000, 20_000_000)).toBe(550_000); // 100만×55%
    // 산출세액 200만 → 71.5만 + 70만×30% = 92.5만, 한도 74만에 막힘
    expect(earnedIncomeTaxCredit(2_000_000, 20_000_000)).toBe(740_000);
  });

  it("총급여 구간별 한도", () => {
    const big = 99_999_999; // raw가 한도를 넘도록 큰 산출세액
    expect(earnedIncomeTaxCredit(big, 30_000_000)).toBe(740_000);
    expect(earnedIncomeTaxCredit(big, 50_000_000)).toBe(660_000); // 하한 적용
    expect(earnedIncomeTaxCredit(big, 80_000_000)).toBe(500_000); // 하한 적용
    expect(earnedIncomeTaxCredit(big, 130_000_000)).toBe(200_000); // 하한 적용
  });

  const taxes = [500_000, 1_300_000, 2_000_000, 5_000_000, 30_000_000];
  const grosses = [
    20_000_000, 33_000_000, 40_000_000, 70_000_000, 70_500_000, 90_000_000,
    120_000_000, 150_000_000,
  ];
  it.each(
    taxes.flatMap((t) => grosses.map((g) => [t, g] as const)),
  )("산출세액 %i·총급여 %i 에서 공식과 일치", (tax, gross) => {
    expect(earnedIncomeTaxCredit(tax, gross)).toBe(officialCredit(tax, gross));
  });
});

describe("childTaxCredit (8~20세 자녀 세액공제, 연)", () => {
  it("자녀 수별 공제액 (2025년 귀속 기준)", () => {
    expect(childTaxCredit(0)).toBe(0);
    expect(childTaxCredit(1)).toBe(250_000);
    expect(childTaxCredit(2)).toBe(550_000);
    expect(childTaxCredit(3)).toBe(950_000); // 55만 + 40만
    expect(childTaxCredit(4)).toBe(1_350_000); // 55만 + 80만
  });
});

describe("estimateTakeHome", () => {
  it("자녀가 많을수록 소득세·지방세가 줄어든다", () => {
    const base = { gross: 60_000_000, dep: 3, nontax: 2_400_000 };
    const c0 = estimateTakeHome(base.gross, base.dep, base.nontax, 0);
    const c2 = estimateTakeHome(base.gross, base.dep, base.nontax, 2);
    expect(c2.incomeTax).toBeLessThan(c0.incomeTax);
    expect(c2.localIncomeTax).toBeLessThanOrEqual(c0.localIncomeTax);
    expect(c2.net).toBeGreaterThan(c0.net);
  });

  it("자녀 수는 (부양가족 수 − 1)로 상한", () => {
    // 부양가족 2명 → 자녀 최대 1명. children=5를 줘도 1명만 반영.
    const capped = estimateTakeHome(60_000_000, 2, 0, 5);
    const one = estimateTakeHome(60_000_000, 2, 0, 1);
    expect(capped.incomeTax).toBe(one.incomeTax);
  });

  it("0 또는 음수는 전부 0", () => {
    const r = estimateTakeHome(0);
    expect(r.net).toBe(0);
    expect(r.totalDeduction).toBe(0);
    expect(estimateTakeHome(-100).net).toBe(0);
  });

  it("월 300만(연 3,600만): 4대 보험 금액이 2026 요율대로", () => {
    const r = estimateTakeHome(36_000_000, 1);
    expect(r.monthlyGross).toBe(3_000_000);
    expect(r.nationalPension).toBe(142_500); // 3,000,000 × 4.75%
    expect(r.healthInsurance).toBe(107_850); // 3,000,000 × 3.595%
    expect(r.longTermCare).toBe(14_171); // 107,850 × 13.14%
    expect(r.employment).toBe(27_000); // 3,000,000 × 0.9%
    expect(r.incomeTax).toBeGreaterThan(0);
  });

  it("월 350만·1인 소득세는 간이세액(127,220원) 근방 — 4대보험·공제 반영", () => {
    // 4대 보험료 소득공제 + 간이세액 공제액을 반영해 과거 과다(~20만원) 대비 정상화.
    // 2026 요율(보험료↑) 기준이라 옛 간이세액표보다 약간 낮게 추정됨.
    const tax = estimateTakeHome(42_000_000, 1).incomeTax;
    expect(tax).toBeGreaterThan(100_000);
    expect(tax).toBeLessThan(135_000);
  });

  it("비과세(식대)는 4대 보험·소득세를 모두 줄여 실수령이 는다", () => {
    const without = estimateTakeHome(42_000_000, 1, 0);
    const withMeal = estimateTakeHome(42_000_000, 1, 2_400_000); // 월 20만
    // 세전 월급(통장 들어올 총액)은 동일
    expect(withMeal.monthlyGross).toBe(without.monthlyGross);
    // 과세 기준이 줄어 4대 보험·소득세 모두 감소
    expect(withMeal.nationalPension).toBeLessThan(without.nationalPension);
    expect(withMeal.healthInsurance).toBeLessThan(without.healthInsurance);
    expect(withMeal.incomeTax).toBeLessThan(without.incomeTax);
    // 결과적으로 실수령액 증가
    expect(withMeal.net).toBeGreaterThan(without.net);
  });

  it("비과세가 총급여를 넘으면 과세 0(공제 0)", () => {
    const r = estimateTakeHome(24_000_000, 1, 999_000_000);
    expect(r.incomeTax).toBe(0);
    expect(r.nationalPension).toBe(0);
    expect(r.net).toBe(r.monthlyGross);
  });

  it("실수령액 + 공제합 = 세전 월급(반올림)", () => {
    const r = estimateTakeHome(48_000_000, 1);
    expect(r.net + r.totalDeduction).toBe(r.monthlyGross);
    expect(r.net).toBeLessThan(r.monthlyGross);
  });

  it("연봉이 오르면 소득세도 오른다(단조 증가)", () => {
    const low = estimateTakeHome(30_000_000);
    const high = estimateTakeHome(80_000_000);
    expect(high.incomeTax).toBeGreaterThan(low.incomeTax);
  });

  it("부양가족이 많으면 세금이 줄어(또는 같다)든다", () => {
    const one = estimateTakeHome(50_000_000, 1);
    const four = estimateTakeHome(50_000_000, 4);
    expect(four.incomeTax).toBeLessThanOrEqual(one.incomeTax);
  });

  it("국민연금은 상한 기준까지만 부과", () => {
    const r = estimateTakeHome(120_000_000); // 월 1,000만 > 상한
    // 상한 6,370,000 × 4.75% = 302,575
    expect(r.nationalPension).toBe(302_575);
  });

  it("지방소득세는 소득세의 약 10%", () => {
    const r = estimateTakeHome(60_000_000);
    // ÷12와 ÷120을 따로 반올림하므로 1원 안팎 오차는 허용
    expect(Math.abs(r.localIncomeTax - r.incomeTax / 10)).toBeLessThan(2);
  });
});
