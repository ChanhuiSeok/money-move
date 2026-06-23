import { describe, expect, it } from "vitest";
import { estimateYearEnd } from "@/lib/yearend";

describe("estimateYearEnd", () => {
  it("추가 공제가 없으면 결정세액 ≈ 기납부세액(환급 작음)", () => {
    const r = estimateYearEnd({ annualGross: 45_000_000, dependents: 1, annualNontax: 2_400_000 });
    // 두 모델 차이로 약간의 환급/추납이 날 수 있으나 총급여의 1.5% 이내여야 한다.
    expect(Math.abs(r.refund)).toBeLessThan(45_000_000 * 0.015);
  });

  it("추가 세액공제(연금저축 등)를 넣으면 환급이 그만큼 늘어난다", () => {
    const base = estimateYearEnd({ annualGross: 60_000_000, dependents: 1 });
    const withCredit = estimateYearEnd({
      annualGross: 60_000_000,
      dependents: 1,
      extraCredit: 900_000,
    });
    // 결정세액이 충분히 양수인 구간이라 세액공제만큼 환급 증가
    expect(withCredit.refund - base.refund).toBeCloseTo(900_000 * 1.1, -1);
    expect(withCredit.determined).toBeLessThan(base.determined);
  });

  it("추가 소득공제는 과세표준을 줄여 결정세액을 낮춘다", () => {
    const base = estimateYearEnd({ annualGross: 60_000_000 });
    const withDeduction = estimateYearEnd({ annualGross: 60_000_000, extraDeduction: 3_000_000 });
    expect(withDeduction.determined).toBeLessThan(base.determined);
    expect(withDeduction.refund).toBeGreaterThan(base.refund);
  });

  it("결정세액은 0 밑으로 내려가지 않는다", () => {
    const r = estimateYearEnd({ annualGross: 20_000_000, extraCredit: 99_000_000 });
    expect(r.incomeTaxDetermined).toBe(0);
    expect(r.determined).toBe(0);
  });
});
