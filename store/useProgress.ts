import { create } from "zustand";
import type { Progress } from "@/lib/schema";
import {
  awardReview,
  completeLesson,
  defaultProgress,
  gainHeart,
  loadProgress,
  loseHeart,
  saveProgress,
  setCurrentLesson,
  todayKey,
} from "@/lib/progress";
import { applyReview, scheduleWrong } from "@/lib/review";

/* Zustand 진도 스토어.
   순수 로직은 lib/progress.ts·lib/review.ts에 두고, 여기선 상태 보관 + 변경 시 localStorage 저장만 한다.
   SSR 하이드레이션 불일치를 피하려고 초기값은 기본값으로 두고,
   클라이언트 마운트 후 hydrate()로 실제 저장값을 불러온다. */

type ProgressState = {
  progress: Progress;
  hydrated: boolean;
  hydrate: () => void;
  complete: (lessonId: string, xp?: number) => void;
  setCurrent: (lessonId: string | null) => void;
  /** 틀린 문제를 복습 대기열에 넣는다(박스 0). */
  markWrong: (questionId: string) => void;
  /** 복습/퀴즈에서 한 문제 채점 결과를 반영한다. */
  reviewAnswer: (questionId: string, correct: boolean) => void;
  /** 복습 세션 종료: 맞힌 개수만큼 XP + 스트릭 유지. */
  finishReview: (correctCount: number) => void;
  loseHeart: () => void;
  gainHeart: () => void;
  reset: () => void;
};

/** 변경된 진도를 저장하고 그대로 돌려준다. */
function persist(progress: Progress): Progress {
  saveProgress(progress);
  return progress;
}

export const useProgress = create<ProgressState>((set) => ({
  progress: defaultProgress(),
  hydrated: false,

  hydrate: () => set({ progress: loadProgress(), hydrated: true }),

  complete: (lessonId, xp) =>
    set((s) => ({ progress: persist(completeLesson(s.progress, lessonId, { xp })) })),

  setCurrent: (lessonId) =>
    set((s) => ({ progress: persist(setCurrentLesson(s.progress, lessonId)) })),

  markWrong: (questionId) =>
    set((s) => ({
      progress: persist({
        ...s.progress,
        reviewItems: scheduleWrong(s.progress.reviewItems, questionId, todayKey()),
      }),
    })),

  reviewAnswer: (questionId, correct) =>
    set((s) => ({
      progress: persist({
        ...s.progress,
        reviewItems: applyReview(
          s.progress.reviewItems,
          questionId,
          correct,
          todayKey(),
        ),
      }),
    })),

  finishReview: (correctCount) =>
    set((s) => ({ progress: persist(awardReview(s.progress, correctCount)) })),

  loseHeart: () => set((s) => ({ progress: persist(loseHeart(s.progress)) })),

  gainHeart: () => set((s) => ({ progress: persist(gainHeart(s.progress)) })),

  reset: () => set(() => ({ progress: persist(defaultProgress()) })),
}));
