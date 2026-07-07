import { examResultsSchema, type Exam, type ExamResult } from "@/lib/schema";
import { isAnswerCorrect, type Answer } from "@/lib/grade";

/* 모의고사 채점·저장 로직. 순수 함수는 입력을 바꾸지 않는다(lib/profile.ts와 같은 결).
   답안(answers)은 "섹션 순서대로 평탄화한 문항"의 인덱스(0..n-1)에 대응한다. */

export const EXAMS_STORAGE_KEY = "donpath:exams:v1";
/** 합격선(정답 비율). 결과 화면 메시지에만 쓰는 기준. */
export const PASS_RATIO = 0.6;

export type FlatQuestion = {
  levelId: string;
  question: Exam["sections"][number]["questions"][number];
  /** 섹션 안에서 몇 번째인지(1부터) — 표시는 전체 번호를 쓰므로 참고용. */
};

/** 시험지의 전체 문항을 섹션 순서대로 평탄화. */
export function flattenQuestions(exam: Exam): FlatQuestion[] {
  return exam.sections.flatMap((s) =>
    s.questions.map((question) => ({ levelId: s.levelId, question })),
  );
}

/** 총 문항 수. */
export function totalQuestions(exam: Exam): number {
  return exam.sections.reduce((n, s) => n + s.questions.length, 0);
}

/** 각 섹션이 평탄화 배열에서 시작하는 인덱스(문항 번호 매기기용). */
export function sectionOffsets(exam: Exam): number[] {
  const offsets: number[] = [];
  let running = 0;
  for (const s of exam.sections) {
    offsets.push(running);
    running += s.questions.length;
  }
  return offsets;
}

export type SectionScore = { levelId: string; correct: number; total: number };
export type ExamGrade = {
  correct: number;
  total: number;
  passed: boolean;
  sections: SectionScore[];
  /** 문항별 정오 — 평탄화 순서와 동일. */
  perQuestion: boolean[];
};

/** 답안을 채점한다. answers[i]는 평탄화 i번째 문항의 답. */
export function gradeExam(exam: Exam, answers: Answer[]): ExamGrade {
  const perQuestion: boolean[] = [];
  let idx = 0;
  const sections: SectionScore[] = exam.sections.map((s) => {
    let correct = 0;
    for (const q of s.questions) {
      const ok = isAnswerCorrect(q, answers[idx] ?? null);
      perQuestion.push(ok);
      if (ok) correct += 1;
      idx += 1;
    }
    return { levelId: s.levelId, correct, total: s.questions.length };
  });
  const correct = perQuestion.filter(Boolean).length;
  const total = perQuestion.length;
  return {
    correct,
    total,
    passed: total > 0 && correct / total >= PASS_RATIO,
    sections,
    perQuestion,
  };
}

/** 100점 만점 환산 점수(반올림). */
export function toScore(correct: number, total: number): number {
  return total <= 0 ? 0 : Math.round((correct / total) * 100);
}

/* ── 저장/로드 (localStorage) ──────────────────────────── */

function getStorage(): Storage | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

/** examId → 최고 성적 맵을 읽는다. 없거나 깨졌으면 빈 객체. */
export function loadExamResults(): Record<string, ExamResult> {
  const storage = getStorage();
  if (!storage) return {};
  const raw = storage.getItem(EXAMS_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = examResultsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

/** 결과 맵을 저장한다(비가용 환경에선 무시). */
export function saveExamResults(results: Record<string, ExamResult>): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(results));
  } catch {
    /* 용량 초과 등은 조용히 무시 */
  }
}

/** 새 성적을 기존 '최고점'과 비교해 더 좋을 때만 점수를 갱신한 맵을 돌려준다(순수).
   응시일(takenAt)은 항상 최신으로 갱신한다. */
export function withBestResult(
  results: Record<string, ExamResult>,
  examId: string,
  next: ExamResult,
): Record<string, ExamResult> {
  const prev = results[examId];
  const best =
    prev && prev.correct >= next.correct
      ? { ...prev, takenAt: next.takenAt }
      : next;
  return { ...results, [examId]: best };
}
