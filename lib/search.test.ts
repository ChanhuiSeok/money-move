import { describe, expect, it } from "vitest";
import { search } from "@/lib/search";

describe("search", () => {
  it("빈 질의는 빈 결과", () => {
    expect(search("")).toEqual([]);
    expect(search("   ")).toEqual([]);
  });

  it("매칭 없으면 빈 결과", () => {
    expect(search("zzqqxx없는단어")).toEqual([]);
  });

  it("'전세'는 주거 레슨과 전세 도구를 찾는다", () => {
    const hits = search("전세");
    expect(hits.some((h) => h.kind === "lesson" && h.href === "/learn/jeonse-wolse")).toBe(true);
    expect(hits.some((h) => h.kind === "tool" && h.href === "/tools/rent-vs-jeonse")).toBe(true);
  });

  it("'연말정산'은 도구와 상황을 가로질러 찾는다", () => {
    const hits = search("연말정산");
    expect(hits.some((h) => h.kind === "tool")).toBe(true);
    expect(hits.some((h) => h.kind === "scenario")).toBe(true);
  });

  it("결과는 레슨 → 도구 → 용어 → 상황 순으로 모인다", () => {
    const kinds = search("연금").map((h) => h.kind);
    // 같은 종류끼리 인접(레슨 블록 다음 도구 블록 …)
    const order = ["lesson", "tool", "term", "scenario"];
    const idx = kinds.map((k) => order.indexOf(k));
    const sorted = [...idx].sort((a, b) => a - b);
    expect(idx).toEqual(sorted);
  });

  it("키워드(동의어)로도 도구를 찾는다 — 'IRP'", () => {
    const hits = search("IRP");
    expect(hits.some((h) => h.kind === "tool")).toBe(true);
  });
});
