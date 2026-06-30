import { describe, expect, it } from "vitest";
import { compareRentVsJeonse } from "@/lib/housing";

describe("compareRentVsJeonse", () => {
  it("대출 없는 전세: 자기자금 기회비용만큼이 월 실부담", () => {
    const r = compareRentVsJeonse({
      jeonseDeposit: 200_000_000,
      jeonseLoan: 0,
      jeonseLoanRate: 0.04,
      monthlyDeposit: 0,
      monthlyRent: 0,
      opportunityRate: 0.03,
    });
    // 2억 × 3% / 12 = 500,000
    expect(r.jeonseOppCost).toBe(500_000);
    expect(r.jeonseInterest).toBe(0);
    expect(r.jeonseMonthlyCost).toBe(500_000);
  });

  it("월세가 전세보다 월 실부담이 크면 전세가 저렴", () => {
    const r = compareRentVsJeonse({
      jeonseDeposit: 200_000_000,
      jeonseLoan: 0,
      jeonseLoanRate: 0.04,
      monthlyDeposit: 10_000_000,
      monthlyRent: 800_000,
      opportunityRate: 0.03,
    });
    // 전세: 500,000 / 월세: 800,000 + (1천만×3%/12=25,000) = 825,000
    expect(r.monthlyTotalCost).toBe(825_000);
    expect(r.cheaper).toBe("jeonse");
    expect(r.monthlyDiff).toBe(325_000);
    expect(r.yearlyDiff).toBe(325_000 * 12);
  });

  it("전세대출을 끼면 자기자금 기회비용 + 대출이자로 나뉜다", () => {
    const r = compareRentVsJeonse({
      jeonseDeposit: 200_000_000,
      jeonseLoan: 100_000_000,
      jeonseLoanRate: 0.048,
      monthlyDeposit: 0,
      monthlyRent: 0,
      opportunityRate: 0.03,
    });
    // 자기자금 1억×3%/12=250,000 + 대출 1억×4.8%/12=400,000
    expect(r.jeonseOppCost).toBe(250_000);
    expect(r.jeonseInterest).toBe(400_000);
    expect(r.jeonseMonthlyCost).toBe(650_000);
  });

  it("대출이 보증금을 넘으면 보증금까지로 제한", () => {
    const r = compareRentVsJeonse({
      jeonseDeposit: 100_000_000,
      jeonseLoan: 999_000_000,
      jeonseLoanRate: 0.04,
      monthlyDeposit: 0,
      monthlyRent: 0,
      opportunityRate: 0.03,
    });
    expect(r.jeonseOppCost).toBe(0); // 자기자금 0
    expect(r.jeonseInterest).toBe(Math.round(100_000_000 * 0.04 / 12));
  });
});
