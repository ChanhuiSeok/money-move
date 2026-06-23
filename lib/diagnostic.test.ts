import { describe, expect, it } from "vitest";
import { diagnosticItems } from "@/content/diagnostic";
import {
  gradeDiagnostic,
  placedOutLessonIds,
  skippedLevelCount,
  startLevel,
} from "@/lib/diagnostic";
import { defaultProgress, placeOutLessons } from "@/lib/progress";
import { lessonIdsOfLevel } from "@/content/levels";

/* 진단 문항은 l-basics 2개 + l-tax 2개(레벨 순서대로)라고 가정한다. */
const allRight = diagnosticItems.map(() => true);
const allWrong = diagnosticItems.map(() => false);

describe("gradeDiagnostic", () => {
  it("레벨별로 정답을 집계하고 레벨 순서대로 돌려준다", () => {
    const results = gradeDiagnostic(diagnosticItems, allRight);
    expect(results.map((r) => r.levelId)).toEqual(["l-basics", "l-tax"]);
    expect(results.every((r) => r.passed)).toBe(true);
    expect(results[0].correct).toBe(results[0].total);
  });

  it("한 문제라도 틀리면 그 레벨은 통과 못 한다(전부 맞혀야 통과)", () => {
    // 첫 문항(l-basics)만 틀림
    const mixed = diagnosticItems.map((_, i) => i !== 0);
    const results = gradeDiagnostic(diagnosticItems, mixed);
    expect(results[0].passed).toBe(false);
    expect(results[1].passed).toBe(true);
  });
});

describe("placedOutLessonIds — 선형 잠금", () => {
  it("전부 맞히면 모든 레벨의 레슨을 건너뛴다", () => {
    const results = gradeDiagnostic(diagnosticItems, allRight);
    const ids = placedOutLessonIds(results);
    expect(ids).toEqual([
      ...lessonIdsOfLevel("l-basics"),
      ...lessonIdsOfLevel("l-tax"),
    ]);
  });

  it("앞 레벨이 막히면 뒤 레벨을 맞혀도 건너뛰지 않는다", () => {
    // l-basics 첫 문항 틀림, l-tax는 다 맞힘
    const correctness = diagnosticItems.map((_, i) => i !== 0);
    const results = gradeDiagnostic(diagnosticItems, correctness);
    expect(placedOutLessonIds(results)).toEqual([]);
    expect(skippedLevelCount(results)).toBe(0);
    expect(startLevel(results)?.levelId).toBe("l-basics");
  });

  it("앞 레벨만 통과하면 그 레벨까지만 건너뛴다", () => {
    // l-basics 다 맞힘, l-tax 다 틀림
    const correctness = diagnosticItems.map(
      (item) => item.levelId === "l-basics",
    );
    const results = gradeDiagnostic(diagnosticItems, correctness);
    expect(placedOutLessonIds(results)).toEqual(lessonIdsOfLevel("l-basics"));
    expect(skippedLevelCount(results)).toBe(1);
    expect(startLevel(results)?.levelId).toBe("l-tax");
  });

  it("전부 틀리면 아무것도 건너뛰지 않고 첫 레벨부터", () => {
    const results = gradeDiagnostic(diagnosticItems, allWrong);
    expect(placedOutLessonIds(results)).toEqual([]);
    expect(startLevel(results)?.levelId).toBe("l-basics");
  });

  it("전부 통과면 시작할 레벨이 없다(null)", () => {
    const results = gradeDiagnostic(diagnosticItems, allRight);
    expect(startLevel(results)).toBeNull();
  });
});

describe("placeOutLessons", () => {
  it("건너뛴 레슨을 완료 처리하되 XP·스트릭은 주지 않는다", () => {
    const base = defaultProgress();
    const ids = lessonIdsOfLevel("l-basics");
    const next = placeOutLessons(base, ids);
    expect(next.completedLessonIds).toEqual(ids);
    expect(next.xp).toBe(0);
    expect(next.streak.count).toBe(0);
    expect(next.activeDays).toEqual([]);
  });

  it("이미 완료한 레슨은 중복으로 넣지 않는다", () => {
    const base = { ...defaultProgress(), completedLessonIds: ["welcome"] };
    const next = placeOutLessons(base, ["welcome", "income-expense"]);
    expect(next.completedLessonIds).toEqual(["welcome", "income-expense"]);
  });

  it("빈 목록이면 같은 객체를 그대로 돌려준다", () => {
    const base = defaultProgress();
    expect(placeOutLessons(base, [])).toBe(base);
  });
});
