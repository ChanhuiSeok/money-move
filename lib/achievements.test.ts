import { describe, expect, it } from "vitest";
import type { AchievementStats } from "@/lib/achievements";
import { BADGES, earnedBadgeIds, newlyEarnedBadges } from "@/lib/achievements";

const ZERO: AchievementStats = {
  completedCount: 0,
  xp: 0,
  bestStreak: 0,
  levelsCompleted: 0,
  termsLearned: 0,
};

describe("earnedBadgeIds", () => {
  it("아무것도 안 했으면 빈 집합", () => {
    expect(earnedBadgeIds(ZERO).size).toBe(0);
  });
  it("첫 레슨이면 first-step 획득", () => {
    const ids = earnedBadgeIds({ ...ZERO, completedCount: 1 });
    expect(ids.has("first-step")).toBe(true);
    expect(ids.has("streak-3")).toBe(false);
  });
  it("최고 스트릭 7이면 3·7 둘 다", () => {
    const ids = earnedBadgeIds({ ...ZERO, bestStreak: 7 });
    expect(ids.has("streak-3")).toBe(true);
    expect(ids.has("streak-7")).toBe(true);
  });
  it("모든 조건 충족이면 전 배지", () => {
    const all: AchievementStats = {
      completedCount: 8,
      xp: 200,
      bestStreak: 10,
      levelsCompleted: 2,
      termsLearned: 15,
    };
    expect(earnedBadgeIds(all).size).toBe(BADGES.length);
  });
});

describe("newlyEarnedBadges", () => {
  it("before에 없고 after에 생긴 배지만", () => {
    const before = { ...ZERO, completedCount: 1 }; // first-step 보유
    const after = { ...before, bestStreak: 3 }; // streak-3 새로
    const fresh = newlyEarnedBadges(before, after);
    expect(fresh.map((b) => b.id)).toEqual(["streak-3"]);
  });
  it("새로 얻은 게 없으면 빈 배열", () => {
    const s = { ...ZERO, completedCount: 1 };
    expect(newlyEarnedBadges(s, s)).toEqual([]);
  });
});
