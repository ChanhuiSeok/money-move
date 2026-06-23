import { describe, expect, it } from "vitest";
import { estimateSavings } from "@/lib/compound";

describe("estimateSavings", () => {
  it("이율 0이면 복리·단리 모두 이자 없음", () => {
    const r = estimateSavings({ principal: 1_000_000, monthly: 100_000, annualRatePercent: 0, years: 1 });
    expect(r.months).toBe(12);
    expect(r.contributed).toBe(1_000_000 + 100_000 * 12);
    expect(r.compound.interest).toBe(0);
    expect(r.simple.interest).toBe(0);
    expect(r.compound.futureValue).toBe(r.contributed);
    expect(r.compoundExtra).toBe(0);
  });

  it("월 100만·연 4%·2년: 단리는 정확히 100만원, 복리는 그보다 많다", () => {
    const r = estimateSavings({ principal: 0, monthly: 1_000_000, annualRatePercent: 4, years: 2 });
    expect(r.contributed).toBe(24_000_000);
    // 적금 단리 공식: 월납입 × 월이율 × n(n+1)/2 = 1,000,000 × (0.04/12) × 300
    expect(r.simple.interest).toBe(1_000_000);
    // 월복리·월초 적립 ≈ 1,026,031원
    expect(r.compound.interest).toBeGreaterThan(r.simple.interest);
    expect(r.compound.interest).toBeGreaterThan(1_025_000);
    expect(r.compound.interest).toBeLessThan(1_027_000);
    expect(r.compoundExtra).toBe(r.compound.interest - r.simple.interest);
  });

  it("원금만 월복리 — 연 12%, 1년이면 (1.01)^12배", () => {
    const r = estimateSavings({ principal: 1_000_000, monthly: 0, annualRatePercent: 12, years: 1 });
    expect(r.compound.futureValue).toBe(Math.round(1_000_000 * Math.pow(1.01, 12)));
    expect(r.compound.interest).toBeGreaterThan(r.simple.interest); // 복리 > 단리
  });

  it("기간이 길수록 복리·단리 격차가 커진다", () => {
    const a = estimateSavings({ principal: 0, monthly: 100_000, annualRatePercent: 6, years: 10 });
    const b = estimateSavings({ principal: 0, monthly: 100_000, annualRatePercent: 6, years: 30 });
    expect(b.compoundExtra).toBeGreaterThan(a.compoundExtra);
  });

  it("음수 입력은 0으로 방어", () => {
    const r = estimateSavings({ principal: -100, monthly: -100, annualRatePercent: -5, years: -1 });
    expect(r.compound.futureValue).toBe(0);
    expect(r.simple.futureValue).toBe(0);
    expect(r.contributed).toBe(0);
    expect(r.months).toBe(0);
  });
});
