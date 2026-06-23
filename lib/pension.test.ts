import { describe, expect, it } from "vitest";
import {
  creditablePayment,
  estimatePensionCredit,
  pensionCreditRate,
} from "@/lib/pension";

describe("pensionCreditRate", () => {
  it("총급여 5,500만 이하 15%, 초과 12%", () => {
    expect(pensionCreditRate(50_000_000)).toBe(0.15);
    expect(pensionCreditRate(55_000_000)).toBe(0.15);
    expect(pensionCreditRate(55_000_001)).toBe(0.12);
    expect(pensionCreditRate(80_000_000)).toBe(0.12);
  });
});

describe("creditablePayment", () => {
  it("연금저축은 단독 600만 한도", () => {
    expect(creditablePayment(8_000_000, 0)).toBe(6_000_000);
  });
  it("IRP 합산은 900만 한도", () => {
    expect(creditablePayment(6_000_000, 5_000_000)).toBe(9_000_000);
  });
  it("한도 안이면 그대로 합산", () => {
    expect(creditablePayment(4_000_000, 2_000_000)).toBe(6_000_000);
  });
});

describe("estimatePensionCredit", () => {
  it("총급여 5천만·연금저축 600만 → 15% 세액공제 + 지방세 10%", () => {
    const r = estimatePensionCredit({ pension: 6_000_000, totalSalary: 50_000_000 });
    expect(r.creditable).toBe(6_000_000);
    expect(r.rate).toBe(0.15);
    expect(r.incomeTaxSaved).toBe(900_000);
    expect(r.localTaxSaved).toBe(90_000);
    expect(r.totalSaved).toBe(990_000);
    expect(r.excess).toBe(0);
  });

  it("고소득(12%) + 한도 초과분은 excess로", () => {
    const r = estimatePensionCredit({ pension: 8_000_000, totalSalary: 90_000_000 });
    expect(r.creditable).toBe(6_000_000);
    expect(r.rate).toBe(0.12);
    expect(r.incomeTaxSaved).toBe(720_000);
    expect(r.excess).toBe(2_000_000);
  });
});
