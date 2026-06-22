import type { Question } from "@/lib/schema";

/** 문제 답안의 통합 타입. ox=boolean, choice=number(인덱스), fill=string. */
export type Answer = boolean | number | string | null;

/** 빈칸 채점용 정규화: 앞뒤 공백 제거, 내부 공백 1칸, 소문자. */
export function normalizeText(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** 답안이 정답인지 판정한다. */
export function isAnswerCorrect(question: Question, answer: Answer): boolean {
  switch (question.type) {
    case "ox":
      return answer === question.answer;
    case "choice":
      return answer === question.answerIndex;
    case "fill": {
      if (typeof answer !== "string") return false;
      const normalized = normalizeText(answer);
      if (normalized === "") return false;
      return question.answer.some(
        (candidate) => normalizeText(candidate) === normalized,
      );
    }
  }
}

/** 답안이 입력되었는지(채점 버튼 활성화 판단용). */
export function hasAnswer(answer: Answer): boolean {
  if (answer === null) return false;
  if (typeof answer === "string") return answer.trim() !== "";
  return true;
}
