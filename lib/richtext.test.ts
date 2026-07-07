import { describe, expect, it } from "vitest";
import { parseRichText, richTextToPlain } from "@/lib/richtext";

describe("parseRichText", () => {
  it("용어 없는 평문은 통째로 text 한 조각", () => {
    expect(parseRichText("그냥 문장이에요.")).toEqual([
      { kind: "text", value: "그냥 문장이에요." },
    ]);
  });

  it("앞뒤 텍스트 사이의 용어를 분해", () => {
    expect(parseRichText("이건 [고정지출](term:fixed-expense)이에요.")).toEqual([
      { kind: "text", value: "이건 " },
      { kind: "term", label: "고정지출", id: "fixed-expense" },
      { kind: "text", value: "이에요." },
    ]);
  });

  it("용어가 여러 개여도 순서대로", () => {
    const segs = parseRichText(
      "[고정지출](term:fixed-expense)과 [변동지출](term:variable-expense)",
    );
    expect(segs).toEqual([
      { kind: "term", label: "고정지출", id: "fixed-expense" },
      { kind: "text", value: "과 " },
      { kind: "term", label: "변동지출", id: "variable-expense" },
    ]);
  });

  it("표시어와 id가 달라도 각각 보존(어미 표기 등)", () => {
    const segs = parseRichText("[비상금을](term:emergency-fund) 모아요");
    expect(segs[0]).toEqual({
      kind: "term",
      label: "비상금을",
      id: "emergency-fund",
    });
  });

  it("내 숫자 토큰은 my 조각으로(fallback 예시값 보존)", () => {
    expect(parseRichText("매달 약 [271만원](my:takehome)이에요")).toEqual([
      { kind: "text", value: "매달 약 " },
      { kind: "my", fallback: "271만원", id: "takehome" },
      { kind: "text", value: "이에요" },
    ]);
  });

  it("용어와 내 숫자 토큰이 섞여도 각각 구분", () => {
    const segs = parseRichText(
      "[실수령액](term:take-home-pay)은 [약 29만원](my:deduction)이 빠져요",
    );
    expect(segs).toEqual([
      { kind: "term", label: "실수령액", id: "take-home-pay" },
      { kind: "text", value: "은 " },
      { kind: "my", fallback: "약 29만원", id: "deduction" },
      { kind: "text", value: "이 빠져요" },
    ]);
  });

  it("빈 문자열은 빈 배열", () => {
    expect(parseRichText("")).toEqual([]);
  });
});

describe("richTextToPlain", () => {
  it("용어 마크업을 표시어만 남긴 평문으로", () => {
    expect(
      richTextToPlain("[전입신고](term:move-in-report)와 [확정일자](term:confirmed-date) 받기"),
    ).toBe("전입신고와 확정일자 받기");
  });

  it("용어 없는 평문은 그대로", () => {
    expect(richTextToPlain("그냥 문장")).toBe("그냥 문장");
  });

  it("내 숫자 토큰은 fallback 예시값으로 평문화", () => {
    expect(richTextToPlain("매달 약 [271만원](my:takehome)")).toBe(
      "매달 약 271만원",
    );
  });
});
