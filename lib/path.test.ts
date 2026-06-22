import { describe, expect, it } from "vitest";
import { computeNodeStates, firstIncompleteLessonId } from "@/lib/path";

const order = ["a", "b", "c", "d"];

describe("computeNodeStates", () => {
  it("처음엔 첫 레슨이 current, 나머지는 locked", () => {
    expect(computeNodeStates(order, [])).toEqual({
      a: "current",
      b: "locked",
      c: "locked",
      d: "locked",
    });
  });

  it("앞 레슨을 깨면 다음이 열린다", () => {
    expect(computeNodeStates(order, ["a"])).toEqual({
      a: "completed",
      b: "current",
      c: "locked",
      d: "locked",
    });
  });

  it("중간까지 완료", () => {
    expect(computeNodeStates(order, ["a", "b"])).toEqual({
      a: "completed",
      b: "completed",
      c: "current",
      d: "locked",
    });
  });

  it("전부 완료하면 current 없음", () => {
    expect(computeNodeStates(order, ["a", "b", "c", "d"])).toEqual({
      a: "completed",
      b: "completed",
      c: "completed",
      d: "completed",
    });
  });

  it("완료 순서가 뒤섞여도 첫 미완료가 current", () => {
    // b만 완료된 비정상 상태라도: a가 첫 미완료 → current, c/d는 locked
    expect(computeNodeStates(order, ["b"])).toEqual({
      a: "current",
      b: "completed",
      c: "locked",
      d: "locked",
    });
  });
});

describe("firstIncompleteLessonId", () => {
  it("이어서 풀 레슨을 돌려준다", () => {
    expect(firstIncompleteLessonId(order, ["a"])).toBe("b");
  });
  it("전부 끝났으면 null", () => {
    expect(firstIncompleteLessonId(order, order)).toBeNull();
  });
  it("아무것도 안 했으면 첫 레슨", () => {
    expect(firstIncompleteLessonId(order, [])).toBe("a");
  });
});
