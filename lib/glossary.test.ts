import { describe, expect, it } from "vitest";
import type { GlossaryTerm } from "@/lib/schema";
import { filterTerms, learnedTermIds, normalizeQuery } from "@/lib/glossary";

const lessons = [
  { id: "welcome", glossary: ["fixed-expense", "emergency-fund"] },
  { id: "income-expense", glossary: ["fixed-expense", "variable-expense"] },
  { id: "budget-basics", glossary: ["budget"] },
];

describe("learnedTermIds", () => {
  it("완료한 레슨들의 용어 합집합(중복 제거)", () => {
    const ids = learnedTermIds(["welcome", "income-expense"], lessons);
    expect([...ids].sort()).toEqual([
      "emergency-fund",
      "fixed-expense",
      "variable-expense",
    ]);
  });
  it("완료 레슨이 없으면 빈 집합", () => {
    expect(learnedTermIds([], lessons).size).toBe(0);
  });
  it("미완료 레슨의 용어는 포함하지 않음", () => {
    const ids = learnedTermIds(["budget-basics"], lessons);
    expect([...ids]).toEqual(["budget"]);
  });
});

const terms: GlossaryTerm[] = [
  { id: "income-tax", term: "소득세", short: "번 돈에 매겨지는 세금." },
  { id: "tax-credit", term: "세액공제", short: "세금에서 직접 빼주는 것.", full: "산출세액에서 차감." },
  { id: "budget", term: "예산", short: "쓸 돈을 미리 정하는 계획." },
];

describe("normalizeQuery", () => {
  it("공백/대소문자 정리", () => {
    expect(normalizeQuery("  Hello   World ")).toBe("hello world");
  });
});

describe("filterTerms", () => {
  it("빈 검색어면 전부 통과", () => {
    expect(filterTerms(terms, "   ")).toHaveLength(3);
  });
  it("용어명으로 검색", () => {
    expect(filterTerms(terms, "세액").map((t) => t.id)).toEqual(["tax-credit"]);
  });
  it("짧은 설명으로도 검색", () => {
    expect(filterTerms(terms, "세금").map((t) => t.id)).toEqual([
      "income-tax",
      "tax-credit",
    ]);
  });
  it("full 설명으로도 검색", () => {
    expect(filterTerms(terms, "산출세액").map((t) => t.id)).toEqual(["tax-credit"]);
  });
  it("없는 단어면 빈 배열", () => {
    expect(filterTerms(terms, "주식")).toEqual([]);
  });
});
