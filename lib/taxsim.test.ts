import { describe, expect, it } from "vitest";
import { bracketOf, simulateYearEnd, taxBrackets } from "@/lib/taxsim";

describe("bracketOf — 과세표준의 세율 구간", () => {
  it("경계값은 '이하' 쪽 구간에 들어간다(progressiveTax와 동일)", () => {
    expect(bracketOf(0).bracket.rate).toBe(0.06);
    expect(bracketOf(10_000_000).bracket.rate).toBe(0.06);
    expect(bracketOf(14_000_000).bracket.rate).toBe(0.06); // 1,400만 이하
    expect(bracketOf(14_000_001).bracket.rate).toBe(0.15); // 초과 → 다음 구간
    expect(bracketOf(60_000_000).bracket.rate).toBe(0.24);
  });

  it("구간은 0부터 끊김 없이 이어진다", () => {
    expect(taxBrackets[0].lower).toBe(0);
    for (let i = 1; i < taxBrackets.length; i++) {
      expect(taxBrackets[i].lower).toBe(taxBrackets[i - 1].upper);
    }
    expect(taxBrackets[taxBrackets.length - 1].upper).toBe(Infinity);
  });

  it("과세표준 × 세율 − 누진공제 가 산출세액과 일치한다(표시 계산식 근거)", () => {
    for (const salary of [28_000_000, 40_000_000, 60_000_000, 90_000_000]) {
      const r = simulateYearEnd({ totalSalary: salary });
      const { bracket } = bracketOf(r.taxableBase);
      const byFormula = r.taxableBase * bracket.rate - bracket.deduction;
      expect(Math.abs(Math.round(byFormula) - r.computedTax)).toBeLessThanOrEqual(1);
    }
  });
});

describe("simulateYearEnd — 세액공제 한도(결정세액 0 floor)", () => {
  it("세액공제 합계는 적용분 + 사라진분으로 정확히 나뉜다", () => {
    const r = simulateYearEnd({
      totalSalary: 28_000_000,
      extraTaxCredit: 1_485_000,
    });
    expect(r.appliedCredit + r.wastedCredit).toBe(r.requestedCredit);
    expect(r.determinedIncomeTax).toBeGreaterThanOrEqual(0);
  });

  it("산출세액보다 세액공제가 크면, 초과분은 사라지고 결정세액은 0", () => {
    // 저소득(총급여 2,800만)이라 산출세액 < 연금 세액공제(148.5만)
    const maxed = simulateYearEnd({
      totalSalary: 28_000_000,
      extraTaxCredit: 1_485_000,
    });
    expect(maxed.determinedIncomeTax).toBe(0);
    expect(maxed.wastedCredit).toBeGreaterThan(0);
  });

  it("결정세액이 0이 된 뒤엔 세액공제를 더 넣어도 환급이 늘지 않는다(한도)", () => {
    const maxed = simulateYearEnd({
      totalSalary: 28_000_000,
      extraTaxCredit: 1_485_000,
    });
    const over = simulateYearEnd({
      totalSalary: 28_000_000,
      extraTaxCredit: 3_000_000,
    });
    expect(over.refund).toBe(maxed.refund);
    expect(over.wastedCredit).toBeGreaterThan(maxed.wastedCredit);
  });
});

describe("추가 소득공제 한도(과세표준 0 지점)", () => {
  it("올림한 한도만큼 빼면 과세표준이 정확히 0이 된다(슬라이더 끝 = 과표 0)", () => {
    for (const salary of [25, 40, 70, 150, 300].map((m) => m * 1_000_000)) {
      const base = simulateYearEnd({ totalSalary: salary });
      // page.tsx와 동일: step(10만)에 맞춰 올림
      const deductionMax = Math.ceil(base.taxableBase / 100_000) * 100_000;
      const atMax = simulateYearEnd({
        totalSalary: salary,
        extraIncomeDeduction: deductionMax,
      });
      expect(atMax.taxableBase).toBe(0);
      expect(atMax.computedTax).toBe(0);
    }
  });
});

describe("simulateYearEnd — 충분히 세금을 내는 경우", () => {
  it("세액공제가 산출세액 안이면 사라지는 분 없이 세금을 그대로 깎는다", () => {
    const base = simulateYearEnd({ totalSalary: 60_000_000 });
    const credited = simulateYearEnd({
      totalSalary: 60_000_000,
      extraTaxCredit: 1_485_000,
    });
    expect(credited.wastedCredit).toBe(0);
    // 세액공제 148.5만 → 결정세액(소득세)이 그만큼 줄어든다(반올림 오차 ±1)
    expect(base.determinedIncomeTax - credited.determinedIncomeTax).toBeGreaterThanOrEqual(
      1_485_000 - 1,
    );
    expect(base.determinedIncomeTax - credited.determinedIncomeTax).toBeLessThanOrEqual(
      1_485_000 + 1,
    );
  });

  it("소득공제는 과세표준을 줄여 세금을 간접적으로 낮춘다", () => {
    const base = simulateYearEnd({ totalSalary: 60_000_000 });
    const deducted = simulateYearEnd({
      totalSalary: 60_000_000,
      extraIncomeDeduction: 3_000_000,
    });
    expect(deducted.taxableBase).toBe(base.taxableBase - 3_000_000);
    // 같은 100만 원이라도 소득공제는 '세율만큼'만 깎여 세액공제보다 효과가 작다
    const byDeduction = base.determinedTax - deducted.determinedTax;
    expect(byDeduction).toBeGreaterThan(0);
    expect(byDeduction).toBeLessThan(3_000_000);
  });
});
