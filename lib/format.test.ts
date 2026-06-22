import { describe, expect, it } from "vitest";
import { formatPercent, formatWon, onlyDigits } from "@/lib/format";

describe("format", () => {
  it("onlyDigits: 숫자만 남긴다", () => {
    expect(onlyDigits("3,000,000원")).toBe("3000000");
    expect(onlyDigits("abc 12-34")).toBe("1234");
    expect(onlyDigits("")).toBe("");
  });

  it("formatWon: 끝에 원, 숫자 반올림", () => {
    expect(formatWon(0)).toBe("0원");
    expect(formatWon(1234.7)).toBe("1,235원");
  });

  it("formatPercent: 비율을 %로, 부동소수 오차 정리", () => {
    expect(formatPercent(0.045)).toBe("4.5%");
    expect(formatPercent(0.03545)).toBe("3.545%");
    expect(formatPercent(0.009)).toBe("0.9%");
    expect(formatPercent(0.1)).toBe("10%");
  });
});
