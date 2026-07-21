import { describe, expect, it } from "vitest";
import { MY_TOKENS, resolveMyToken } from "@/lib/personalize";
import { defaultProfile } from "@/lib/profile";
import type { Profile } from "@/lib/schema";

const setProfile: Profile = {
  ...defaultProfile(),
  period: "month",
  amount: 3_000_000,
  monthlyNontax: 200_000,
  dependents: 1,
  children: 0,
};

describe("resolveMyToken", () => {
  it("프로필 미설정(amount 0)이면 null — 예시값 fallback으로 남긴다", () => {
    expect(resolveMyToken("takehome", defaultProfile())).toBeNull();
  });

  it("모르는 토큰이면 null", () => {
    expect(resolveMyToken("nope", setProfile)).toBeNull();
  });

  it("프로필이 있으면 만원 단위 문자열 + 라벨로 해석", () => {
    const r = resolveMyToken("takehome", setProfile);
    expect(r).not.toBeNull();
    expect(r?.text).toMatch(/^[\d,]+만원$/);
    expect(r?.label).toBe(MY_TOKENS.takehome.label);
  });

  it("세전 연봉은 월급×12 (비과세 무관)", () => {
    // 월 300만 → 연 3,600만 → "3,600만원"
    expect(resolveMyToken("gross-year", setProfile)?.text).toBe("3,600만원");
  });

  it("실수령액은 세전 월급보다 작다(공제가 빠지므로)", () => {
    const net = resolveMyToken("takehome", setProfile);
    const gross = resolveMyToken("gross-month", setProfile);
    const toNum = (s?: string) => Number(s?.replace(/[^\d]/g, ""));
    expect(toNum(net?.text)).toBeLessThan(toNum(gross?.text));
  });
});
