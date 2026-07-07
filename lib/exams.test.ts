import { describe, expect, it } from "vitest";
import {
  flattenQuestions,
  gradeExam,
  sectionOffsets,
  toScore,
  totalQuestions,
  withBestResult,
} from "@/lib/exams";
import type { Exam, ExamResult } from "@/lib/schema";

const fakeExam: Exam = {
  id: "t",
  order: 1,
  title: "테스트",
  subtitle: "",
  sections: [
    {
      levelId: "l-a",
      questions: [
        {
          type: "choice",
          prompt: "1+1?",
          options: ["1", "2", "3", "4"],
          answerIndex: 1,
          explanation: "",
        },
        { type: "fill", prompt: "수도?", answer: ["서울"], explanation: "" },
      ],
    },
    {
      levelId: "l-b",
      questions: [
        {
          type: "choice",
          prompt: "2+2?",
          options: ["3", "4", "5", "6"],
          answerIndex: 1,
          explanation: "",
        },
      ],
    },
  ],
};

describe("평탄화/오프셋", () => {
  it("totalQuestions는 전체 문항 수", () => {
    expect(totalQuestions(fakeExam)).toBe(3);
  });
  it("flattenQuestions는 섹션 순서대로 levelId를 함께 편다", () => {
    expect(flattenQuestions(fakeExam).map((f) => f.levelId)).toEqual([
      "l-a",
      "l-a",
      "l-b",
    ]);
  });
  it("sectionOffsets는 각 섹션 시작 인덱스", () => {
    expect(sectionOffsets(fakeExam)).toEqual([0, 2]);
  });
});

describe("gradeExam", () => {
  it("전부 맞히면 만점 + 합격", () => {
    const g = gradeExam(fakeExam, [1, "서울", 1]);
    expect(g.correct).toBe(3);
    expect(g.total).toBe(3);
    expect(g.passed).toBe(true);
    expect(g.perQuestion).toEqual([true, true, true]);
    expect(g.sections).toEqual([
      { levelId: "l-a", correct: 2, total: 2 },
      { levelId: "l-b", correct: 1, total: 1 },
    ]);
  });

  it("단답형은 공백·대소문자 무시하고 채점", () => {
    const g = gradeExam(fakeExam, [null, "  서울 ", null]);
    expect(g.perQuestion[1]).toBe(true);
    expect(g.correct).toBe(1);
  });

  it("답이 모자라면(undefined) 오답 처리하고 크래시하지 않는다", () => {
    const g = gradeExam(fakeExam, [1]); // 2·3번 답 없음
    expect(g.correct).toBe(1);
    expect(g.perQuestion).toEqual([true, false, false]);
  });

  it("정답률이 합격선(60%) 미만이면 불합격", () => {
    const g = gradeExam(fakeExam, [0, "부산", 0]); // 0/3
    expect(g.passed).toBe(false);
  });
});

describe("toScore", () => {
  it("100점 만점 환산(반올림)", () => {
    expect(toScore(3, 3)).toBe(100);
    expect(toScore(2, 3)).toBe(67);
    expect(toScore(0, 0)).toBe(0);
  });
});

describe("withBestResult", () => {
  const base: Record<string, ExamResult> = {};
  it("첫 기록은 그대로 저장", () => {
    const next = withBestResult(base, "exam-1", {
      correct: 8,
      total: 15,
      takenAt: "2026-07-06",
    });
    expect(next["exam-1"].correct).toBe(8);
  });

  it("더 낮은 점수는 최고점을 유지하되 응시일만 갱신", () => {
    const prev = { "exam-1": { correct: 12, total: 15, takenAt: "2026-07-01" } };
    const next = withBestResult(prev, "exam-1", {
      correct: 5,
      total: 15,
      takenAt: "2026-07-06",
    });
    expect(next["exam-1"].correct).toBe(12); // 최고점 유지
    expect(next["exam-1"].takenAt).toBe("2026-07-06"); // 응시일은 최신
  });

  it("더 높은 점수는 갱신", () => {
    const prev = { "exam-1": { correct: 8, total: 15, takenAt: "2026-07-01" } };
    const next = withBestResult(prev, "exam-1", {
      correct: 14,
      total: 15,
      takenAt: "2026-07-06",
    });
    expect(next["exam-1"].correct).toBe(14);
  });

  it("다른 회차 결과는 건드리지 않는다", () => {
    const prev = { "exam-1": { correct: 8, total: 15, takenAt: "2026-07-01" } };
    const next = withBestResult(prev, "exam-2", {
      correct: 10,
      total: 15,
      takenAt: "2026-07-06",
    });
    expect(next["exam-1"].correct).toBe(8);
    expect(next["exam-2"].correct).toBe(10);
  });
});
