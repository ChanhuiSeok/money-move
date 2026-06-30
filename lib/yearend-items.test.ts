import { describe, expect, it } from "vitest";
import {
  cardDeductionAmount,
  computeCredits,
  computeDeductions,
  donationCreditAmount,
  educationCreditAmount,
  housingDeductionAmount,
  insurancePremiumCreditAmount,
  medicalCreditAmount,
  rentCreditAmount,
} from "@/lib/yearend-items";

describe("cardDeductionAmount — 신용카드 등 소득공제", () => {
  it("총급여 25% 문턱 아래 사용액은 공제가 없다", () => {
    // 총급여 4천만 → 문턱 1천만. 신용카드 1천만은 전부 문턱에 흡수된다.
    expect(
      cardDeductionAmount(
        { cardCredit: 10_000_000, cardCheckCash: 0, cardMarketTransit: 0 },
        40_000_000,
      ),
    ).toBe(0);
  });

  it("문턱은 공제율 낮은 신용카드부터 차감해 체크/현금 사용분을 보존한다", () => {
    // 신용카드 1천만(=문턱)이 전부 흡수, 체크 500만 × 30% = 150만
    expect(
      cardDeductionAmount(
        { cardCredit: 10_000_000, cardCheckCash: 5_000_000, cardMarketTransit: 0 },
        40_000_000,
      ),
    ).toBe(1_500_000);
  });

  it("공제 한도(7천만 이하 300만)를 넘지 않는다", () => {
    expect(
      cardDeductionAmount(
        { cardCredit: 100_000_000, cardCheckCash: 0, cardMarketTransit: 0 },
        40_000_000,
      ),
    ).toBe(3_000_000);
  });

  it("총급여 7천만 초과면 한도가 250만으로 줄어든다", () => {
    expect(
      cardDeductionAmount(
        { cardCredit: 200_000_000, cardCheckCash: 0, cardMarketTransit: 0 },
        80_000_000,
      ),
    ).toBe(2_500_000);
  });
});

describe("housingDeductionAmount — 주택청약 소득공제", () => {
  it("납입액(300만 한도)의 40%를 공제한다", () => {
    expect(housingDeductionAmount(3_000_000, 40_000_000)).toBe(1_200_000);
    expect(housingDeductionAmount(5_000_000, 40_000_000)).toBe(1_200_000); // 한도
  });

  it("총급여 7천만 초과면 0", () => {
    expect(housingDeductionAmount(3_000_000, 80_000_000)).toBe(0);
  });
});

describe("세액공제 항목 — 소득세 기준 금액", () => {
  it("의료비: 총급여 3% 초과분의 15%", () => {
    // 총급여 4천만 → 문턱 120만. 220만 지출 → 초과 100만 × 15% = 15만
    expect(medicalCreditAmount(2_200_000, 40_000_000)).toBe(150_000);
    expect(medicalCreditAmount(1_000_000, 40_000_000)).toBe(0); // 문턱 이하
  });

  it("보장성보험료: 100만 한도의 12%", () => {
    expect(insurancePremiumCreditAmount(2_000_000)).toBe(120_000);
    expect(insurancePremiumCreditAmount(500_000)).toBe(60_000);
  });

  it("교육비: 지출의 15%", () => {
    expect(educationCreditAmount(1_000_000)).toBe(150_000);
  });

  it("기부금: 1천만 이하 15%, 초과분 30%", () => {
    expect(donationCreditAmount(12_000_000)).toBe(2_100_000); // 1천만×15% + 200만×30%
  });

  it("월세: 5,500만 이하 17%, 8천만 이하 15%, 초과 0", () => {
    expect(rentCreditAmount(6_000_000, 40_000_000)).toBe(1_020_000); // 17%
    expect(rentCreditAmount(6_000_000, 60_000_000)).toBe(900_000); // 15%
    expect(rentCreditAmount(15_000_000, 40_000_000)).toBe(1_700_000); // 1천만 한도×17%
    expect(rentCreditAmount(6_000_000, 90_000_000)).toBe(0); // 8천만 초과
  });
});

describe("computeDeductions / computeCredits — 합산", () => {
  it("소득공제 합계 = 카드 + 청약", () => {
    const r = computeDeductions(
      {
        cardCredit: 30_000_000,
        cardCheckCash: 0,
        cardMarketTransit: 0,
        housingSavings: 3_000_000,
      },
      40_000_000,
    );
    expect(r.card).toBe(3_000_000); // 한도
    expect(r.housing).toBe(1_200_000);
    expect(r.total).toBe(r.card + r.housing);
  });

  it("세액공제 합계에 연금/IRP의 소득세 몫이 포함된다", () => {
    const r = computeCredits(
      {
        pension: 6_000_000,
        irp: 3_000_000,
        medical: 0,
        insurancePremium: 0,
        education: 0,
        donation: 0,
        rent: 0,
      },
      40_000_000,
    );
    // 9백만 × 15%(소득세) = 135만
    expect(r.pension).toBe(1_350_000);
    expect(r.total).toBe(r.pension);
  });
});
