import { create } from "zustand";
import type { ExamResult } from "@/lib/schema";
import {
  loadExamResults,
  saveExamResults,
  withBestResult,
} from "@/lib/exams";

/* 모의고사 성적 스토어(회차별 최고점). useProfile과 같은 패턴:
   순수 로직은 lib/exams.ts, 여기선 상태 보관 + localStorage 저장만.
   학습 진도(useProgress)와는 완전히 분리 — 시험 성적이 XP·스트릭을 건드리지 않는다. */

type ExamsState = {
  results: Record<string, ExamResult>;
  hydrated: boolean;
  hydrate: () => void;
  /** 응시 결과를 기록한다(기존 최고점보다 좋을 때만 점수 갱신). */
  record: (examId: string, result: ExamResult) => void;
  reset: () => void;
};

export const useExams = create<ExamsState>((set) => ({
  results: {},
  hydrated: false,

  hydrate: () => set({ results: loadExamResults(), hydrated: true }),

  record: (examId, result) =>
    set((s) => {
      const next = withBestResult(s.results, examId, result);
      saveExamResults(next);
      return { results: next };
    }),

  reset: () => {
    saveExamResults({});
    set({ results: {} });
  },
}));
