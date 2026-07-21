import { describe, expect, it } from "vitest";
import {
  annualGross,
  defaultProfile,
  hasProfile,
  normalizeProfile,
  profileTakeHome,
  taxableAnnual,
} from "@/lib/profile";
import { estimateTakeHome } from "@/lib/takehome";

describe("profile", () => {
  it("기본 프로필은 미설정 상태(amount 0)", () => {
    const p = defaultProfile();
    expect(hasProfile(p)).toBe(false);
    expect(p.dependents).toBe(1);
  });

  it("hasProfile은 급여를 넣었을 때만 true", () => {
    expect(hasProfile({ ...defaultProfile(), amount: 3_000_000 })).toBe(true);
  });

  it("annualGross는 기간에 따라 환산", () => {
    expect(annualGross({ ...defaultProfile(), period: "month", amount: 3_000_000 })).toBe(
      36_000_000,
    );
    expect(annualGross({ ...defaultProfile(), period: "year", amount: 36_000_000 })).toBe(
      36_000_000,
    );
  });

  it("normalizeProfile은 자녀 수를 본인 뺀 부양가족 이내로 클램프", () => {
    const p = normalizeProfile({
      ...defaultProfile(),
      period: "month",
      amount: -100,
      monthlyNontax: -1,
      dependents: 2,
      children: 5,
    });
    expect(p.amount).toBe(0);
    expect(p.monthlyNontax).toBe(0);
    expect(p.children).toBe(1); // dependents 2 → 본인 빼면 1명까지
  });

  it("taxableAnnual은 연봉에서 비과세(연)를 뺀 총급여", () => {
    const p = { ...defaultProfile(), amount: 3_000_000, monthlyNontax: 200_000 };
    expect(taxableAnnual(p)).toBe(36_000_000 - 2_400_000);
  });

  it("profileTakeHome은 실수령액 계산기와 같은 결과", () => {
    const p = {
      ...defaultProfile(),
      period: "month" as const,
      amount: 3_000_000,
      monthlyNontax: 200_000,
      dependents: 1,
      children: 0,
    };
    expect(profileTakeHome(p)).toEqual(
      estimateTakeHome(36_000_000, 1, 2_400_000, 0),
    );
  });
});
