import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  MAX_HEARTS,
  STORAGE_KEY,
  XP_PER_LESSON,
  bumpStreak,
  completeLesson,
  dayDiff,
  defaultProgress,
  gainHeart,
  loadProgress,
  loseHeart,
  markWrong,
  saveProgress,
  todayKey,
} from "@/lib/progress";
import { progressSchema } from "@/lib/schema";

describe("defaultProgress", () => {
  it("기본값은 스키마를 통과한다", () => {
    expect(progressSchema.safeParse(defaultProgress()).success).toBe(true);
  });
  it("하트는 가득, XP·스트릭은 0에서 시작", () => {
    const p = defaultProgress();
    expect(p.hearts).toBe(MAX_HEARTS);
    expect(p.xp).toBe(0);
    expect(p.streak).toEqual({ count: 0, lastDate: "" });
  });
});

describe("날짜 헬퍼", () => {
  it("dayDiff: 연속/간격/역방향", () => {
    expect(dayDiff("2026-06-21", "2026-06-22")).toBe(1);
    expect(dayDiff("2026-06-20", "2026-06-22")).toBe(2);
    expect(dayDiff("2026-06-22", "2026-06-22")).toBe(0);
    expect(dayDiff("2026-06-23", "2026-06-22")).toBe(-1);
  });
  it("dayDiff: 월 경계를 넘어도 정확", () => {
    expect(dayDiff("2026-01-31", "2026-02-01")).toBe(1);
  });
  it("todayKey: 주어진 날짜를 YYYY-MM-DD로", () => {
    expect(todayKey(new Date(2026, 5, 9))).toBe("2026-06-09");
  });
});

describe("bumpStreak", () => {
  it("첫 활동이면 1", () => {
    expect(bumpStreak({ count: 0, lastDate: "" }, "2026-06-22")).toEqual({
      count: 1,
      lastDate: "2026-06-22",
    });
  });
  it("같은 날 다시 하면 그대로", () => {
    const s = { count: 3, lastDate: "2026-06-22" };
    expect(bumpStreak(s, "2026-06-22")).toBe(s);
  });
  it("어제→오늘이면 +1", () => {
    expect(bumpStreak({ count: 3, lastDate: "2026-06-21" }, "2026-06-22")).toEqual({
      count: 4,
      lastDate: "2026-06-22",
    });
  });
  it("하루 이상 비면 1로 리셋", () => {
    expect(bumpStreak({ count: 9, lastDate: "2026-06-19" }, "2026-06-22")).toEqual({
      count: 1,
      lastDate: "2026-06-22",
    });
  });
});

describe("completeLesson", () => {
  it("완료 추가 + XP 적립 + 스트릭 시작", () => {
    const p = completeLesson(defaultProgress(), "L1", { today: "2026-06-22" });
    expect(p.completedLessonIds).toEqual(["L1"]);
    expect(p.xp).toBe(XP_PER_LESSON);
    expect(p.streak).toEqual({ count: 1, lastDate: "2026-06-22" });
  });
  it("같은 레슨 재완료는 중복 추가·XP 없음, 입력은 불변", () => {
    const base = completeLesson(defaultProgress(), "L1", { today: "2026-06-22" });
    const again = completeLesson(base, "L1", { today: "2026-06-22" });
    expect(again.completedLessonIds).toEqual(["L1"]);
    expect(again.xp).toBe(XP_PER_LESSON);
    expect(base.completedLessonIds).toEqual(["L1"]); // 원본 불변
  });
  it("xp 오버라이드 가능", () => {
    const p = completeLesson(defaultProgress(), "L1", { xp: 25, today: "2026-06-22" });
    expect(p.xp).toBe(25);
  });
});

describe("하트", () => {
  it("loseHeart는 0 밑으로 안 내려감", () => {
    let p = { ...defaultProgress(), hearts: 1 };
    p = loseHeart(p);
    expect(p.hearts).toBe(0);
    expect(loseHeart(p).hearts).toBe(0);
  });
  it("gainHeart는 MAX를 안 넘음", () => {
    const full = defaultProgress();
    expect(gainHeart(full).hearts).toBe(MAX_HEARTS);
  });
});

describe("markWrong", () => {
  it("중복 없이 추가", () => {
    let p = markWrong(defaultProgress(), "q1");
    p = markWrong(p, "q1");
    p = markWrong(p, "q2");
    expect(p.wrongQuestionIds).toEqual(["q1", "q2"]);
  });
});

describe("저장/로드 (localStorage 목)", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    // @ts-expect-error 테스트용 최소 목
    globalThis.localStorage = {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
      key: () => null,
      length: 0,
    };
  });
  afterEach(() => {
    // @ts-expect-error 테스트 후 목 정리
    delete globalThis.localStorage;
  });

  it("저장 후 로드하면 동일", () => {
    const p = completeLesson(defaultProgress(), "L1", { today: "2026-06-22" });
    saveProgress(p);
    expect(loadProgress()).toEqual(p);
  });
  it("저장값이 없으면 기본값", () => {
    expect(loadProgress()).toEqual(defaultProgress());
  });
  it("깨진 JSON이면 기본값으로 복구", () => {
    globalThis.localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadProgress()).toEqual(defaultProgress());
  });
  it("스키마에 안 맞으면 기본값으로 복구", () => {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify({ xp: "많음" }));
    expect(loadProgress()).toEqual(defaultProgress());
  });
});
