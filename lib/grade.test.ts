import { describe, expect, it } from "vitest";
import { hasAnswer, isAnswerCorrect, normalizeText } from "@/lib/grade";
import type {
  ChoiceQuestion,
  FillQuestion,
  OxQuestion,
} from "@/lib/schema";

const ox: OxQuestion = {
  type: "ox",
  prompt: "p",
  answer: true,
  explanation: "e",
};
const choice: ChoiceQuestion = {
  type: "choice",
  prompt: "p",
  options: ["가", "나", "다"],
  answerIndex: 1,
  explanation: "e",
};
const fill: FillQuestion = {
  type: "fill",
  prompt: "p",
  answer: ["고정", "고정지출"],
  explanation: "e",
};

describe("isAnswerCorrect", () => {
  it("ox", () => {
    expect(isAnswerCorrect(ox, true)).toBe(true);
    expect(isAnswerCorrect(ox, false)).toBe(false);
  });
  it("choice", () => {
    expect(isAnswerCorrect(choice, 1)).toBe(true);
    expect(isAnswerCorrect(choice, 0)).toBe(false);
  });
  it("fill: 후보 중 하나면 정답", () => {
    expect(isAnswerCorrect(fill, "고정")).toBe(true);
    expect(isAnswerCorrect(fill, "고정지출")).toBe(true);
    expect(isAnswerCorrect(fill, "변동")).toBe(false);
  });
  it("fill: 공백·대소문자 무시", () => {
    expect(isAnswerCorrect(fill, "  고정  ")).toBe(true);
    expect(isAnswerCorrect({ ...fill, answer: ["ETF"] }, "etf")).toBe(true);
  });
  it("fill: 빈 입력은 오답", () => {
    expect(isAnswerCorrect(fill, "")).toBe(false);
    expect(isAnswerCorrect(fill, null)).toBe(false);
  });
});

describe("normalizeText / hasAnswer", () => {
  it("normalizeText", () => {
    expect(normalizeText("  여러   칸 ")).toBe("여러 칸");
  });
  it("hasAnswer", () => {
    expect(hasAnswer(null)).toBe(false);
    expect(hasAnswer("")).toBe(false);
    expect(hasAnswer("  ")).toBe(false);
    expect(hasAnswer(false)).toBe(true); // OX의 X는 유효한 답
    expect(hasAnswer(0)).toBe(true); // 0번 선택지도 유효
  });
});
