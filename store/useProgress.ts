import { create } from "zustand";
import type { Progress } from "@/lib/schema";
import {
  addXp,
  completeLesson,
  defaultProgress,
  gainHeart,
  loadProgress,
  loseHeart,
  placeOutLessons,
  saveProgress,
  setCurrentLesson,
} from "@/lib/progress";

/* Zustand 진도 스토어.
   순수 로직은 lib/progress.ts에 두고, 여기선 상태 보관 + 변경 시 localStorage 저장만 한다.
   SSR 하이드레이션 불일치를 피하려고 초기값은 기본값으로 두고,
   클라이언트 마운트 후 hydrate()로 실제 저장값을 불러온다. */

type ProgressState = {
  progress: Progress;
  hydrated: boolean;
  hydrate: () => void;
  complete: (lessonId: string, xp?: number) => void;
  setCurrent: (lessonId: string | null) => void;
  /** 진단 테스트로 이미 아는 레슨들을 건너뛴다(완료 처리, 보상 없음). */
  placeOut: (lessonIds: string[]) => void;
  loseHeart: () => void;
  gainHeart: () => void;
  gainXp: (amount: number) => void;
  resetXp: () => void;
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

  placeOut: (lessonIds) =>
    set((s) => ({ progress: persist(placeOutLessons(s.progress, lessonIds)) })),

  loseHeart: () => set((s) => ({ progress: persist(loseHeart(s.progress)) })),

  gainHeart: () => set((s) => ({ progress: persist(gainHeart(s.progress)) })),

  gainXp: (amount) =>
    set((s) => ({ progress: persist(addXp(s.progress, amount)) })),

  resetXp: () =>
    set((s) => ({ progress: persist({ ...s.progress, xp: 0 }) })),

  reset: () => set(() => ({ progress: persist(defaultProgress()) })),
}));
