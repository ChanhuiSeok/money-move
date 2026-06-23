import { describe, expect, it } from "vitest";
import type { ReviewItem } from "@/lib/schema";
import {
  REVIEW_INTERVALS,
  applyReview,
  buildQuiz,
  dueItems,
  isDue,
  makeQuestionId,
  nextDue,
  parseQuestionId,
  scheduleWrong,
} from "@/lib/review";

const TODAY = "2026-06-23";

describe("questionId 파싱", () => {
  it("makeQuestionId / parseQuestionId 왕복", () => {
    expect(makeQuestionId("welcome", 2)).toBe("welcome:2");
    expect(parseQuestionId("welcome:2")).toEqual({ lessonId: "welcome", index: 2 });
  });
  it("lessonId에 콜론이 있어도 마지막 콜론 기준으로 분리", () => {
    expect(parseQuestionId("a:b:3")).toEqual({ lessonId: "a:b", index: 3 });
  });
  it("깨진 형식은 null", () => {
    expect(parseQuestionId("welcome")).toBeNull();
    expect(parseQuestionId("welcome:")).toBeNull();
    expect(parseQuestionId(":2")).toBeNull();
    expect(parseQuestionId("welcome:x")).toBeNull();
    expect(parseQuestionId("welcome:-1")).toBeNull();
  });
});

describe("nextDue", () => {
  it("박스별 간격만큼 미뤄진다", () => {
    expect(nextDue(0, TODAY)).toBe("2026-06-24"); // +1
    expect(nextDue(1, TODAY)).toBe("2026-06-26"); // +3
    expect(nextDue(2, TODAY)).toBe("2026-06-30"); // +7
    expect(nextDue(3, TODAY)).toBe("2026-07-09"); // +16
  });
  it("마지막 박스를 넘기면 null(졸업)", () => {
    expect(nextDue(REVIEW_INTERVALS.length, TODAY)).toBeNull();
  });
});

describe("isDue", () => {
  it('due ""는 항상 지금 바로', () => {
    expect(isDue({ id: "a:0", due: "", box: 0 }, TODAY)).toBe(true);
  });
  it("예정일이 오늘 이하면 due, 미래면 아직", () => {
    expect(isDue({ id: "a:0", due: "2026-06-23", box: 1 }, TODAY)).toBe(true);
    expect(isDue({ id: "a:0", due: "2026-06-22", box: 1 }, TODAY)).toBe(true);
    expect(isDue({ id: "a:0", due: "2026-06-24", box: 1 }, TODAY)).toBe(false);
  });
});

describe("scheduleWrong", () => {
  it("새 문제는 박스 0, 내일 예정으로 추가", () => {
    const items = scheduleWrong([], "a:0", TODAY);
    expect(items).toEqual([{ id: "a:0", due: "2026-06-24", box: 0 }]);
  });
  it("이미 있던 문제는 박스 0으로 리셋(중복 추가 X)", () => {
    const base: ReviewItem[] = [{ id: "a:0", due: "2026-07-09", box: 3 }];
    const items = scheduleWrong(base, "a:0", TODAY);
    expect(items).toEqual([{ id: "a:0", due: "2026-06-24", box: 0 }]);
  });
});

describe("applyReview", () => {
  it("정답이면 다음 박스로 승급 + 간격 늘림", () => {
    const base: ReviewItem[] = [{ id: "a:0", due: TODAY, box: 0 }];
    const items = applyReview(base, "a:0", true, TODAY);
    expect(items).toEqual([{ id: "a:0", due: "2026-06-26", box: 1 }]);
  });
  it("마지막 박스에서 정답이면 졸업(제거)", () => {
    const last = REVIEW_INTERVALS.length - 1;
    const base: ReviewItem[] = [{ id: "a:0", due: TODAY, box: last }];
    expect(applyReview(base, "a:0", true, TODAY)).toEqual([]);
  });
  it("오답이면 박스 0으로 강등", () => {
    const base: ReviewItem[] = [{ id: "a:0", due: TODAY, box: 2 }];
    expect(applyReview(base, "a:0", false, TODAY)).toEqual([
      { id: "a:0", due: "2026-06-24", box: 0 },
    ]);
  });
  it("대기열에 없는 문제를 맞히면 변화 없음", () => {
    const base: ReviewItem[] = [{ id: "a:0", due: TODAY, box: 0 }];
    expect(applyReview(base, "b:1", true, TODAY)).toBe(base);
  });
  it("대기열에 없는 문제를 틀리면 새로 추가", () => {
    const items = applyReview([], "b:1", false, TODAY);
    expect(items).toEqual([{ id: "b:1", due: "2026-06-24", box: 0 }]);
  });
});

describe("dueItems", () => {
  it("due 항목만, 예정일 빠른 순으로", () => {
    const items: ReviewItem[] = [
      { id: "a:0", due: "2026-06-24", box: 1 }, // 미래 → 제외
      { id: "b:0", due: "2026-06-22", box: 0 },
      { id: "c:0", due: "", box: 0 },
      { id: "d:0", due: "2026-06-23", box: 0 },
    ];
    expect(dueItems(items, TODAY).map((i) => i.id)).toEqual(["c:0", "b:0", "d:0"]);
  });
});

describe("buildQuiz", () => {
  const noShuffle = <T,>(a: T[]) => a;
  it("복습 예정 문제를 먼저 채우고 풀로 보충해 size개", () => {
    const ids = buildQuiz({
      dueIds: ["a:0", "a:1"],
      poolIds: ["a:0", "b:0", "b:1", "c:0", "c:1"],
      size: 5,
      shuffle: noShuffle,
    });
    expect(ids).toEqual(["a:0", "a:1", "b:0", "b:1", "c:0"]);
  });
  it("중복 없이, size를 넘지 않게", () => {
    const ids = buildQuiz({
      dueIds: ["a:0", "a:0", "a:1"],
      poolIds: ["a:1", "b:0"],
      size: 3,
      shuffle: noShuffle,
    });
    expect(ids).toEqual(["a:0", "a:1", "b:0"]);
  });
  it("풀이 비고 복습만 있으면 복습만", () => {
    const ids = buildQuiz({ dueIds: ["a:0"], poolIds: [], shuffle: noShuffle });
    expect(ids).toEqual(["a:0"]);
  });
});
