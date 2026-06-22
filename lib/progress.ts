import { progressSchema, type Progress, type Streak } from "@/lib/schema";

/* 진도/스트릭/하트 로직 (localStorage 기반).
   핵심 계산 함수는 모두 순수 함수 — 입력 진도를 바꾸지 않고 새 객체를 돌려준다.
   날짜에 의존하는 함수는 today를 인자로 받아 테스트 가능하게 한다. */

export const STORAGE_KEY = "donpath:progress:v1";
export const MAX_HEARTS = 5;
export const XP_PER_LESSON = 10;

export function defaultProgress(): Progress {
  return {
    completedLessonIds: [],
    currentLessonId: null,
    xp: 0,
    streak: { count: 0, lastDate: "" },
    hearts: MAX_HEARTS,
    wrongQuestionIds: [],
  };
}

/* ── 날짜 헬퍼 ─────────────────────────────────────────── */

/** 로컬 기준 오늘 날짜를 YYYY-MM-DD로. */
export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** a → b 사이의 일수 차이 (b가 더 미래면 양수). */
export function dayDiff(a: string, b: string): number {
  const ms = Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/* ── 순수 진도 계산 ────────────────────────────────────── */

/** 오늘 활동을 반영해 스트릭을 갱신한다.
   - 같은 날 또 하면 그대로(중복 안 셈)
   - 첫 활동이면 1
   - 어제 → 오늘이면 +1
   - 하루 이상 비면(또는 이상값) 1로 리셋 */
export function bumpStreak(streak: Streak, today: string): Streak {
  if (streak.lastDate === today) return streak;
  if (streak.lastDate === "") return { count: 1, lastDate: today };
  const diff = dayDiff(streak.lastDate, today);
  if (diff === 1) return { count: streak.count + 1, lastDate: today };
  return { count: 1, lastDate: today };
}

/** 레슨 완료 처리: 완료 목록 추가(중복 방지) + XP 적립 + 스트릭 갱신.
   이미 완료한 레슨을 다시 풀면 XP는 더하지 않지만 오늘 활동으로 스트릭은 이어진다. */
export function completeLesson(
  progress: Progress,
  lessonId: string,
  opts: { xp?: number; today?: string } = {},
): Progress {
  const xp = opts.xp ?? XP_PER_LESSON;
  const today = opts.today ?? todayKey();
  const already = progress.completedLessonIds.includes(lessonId);
  return {
    ...progress,
    completedLessonIds: already
      ? progress.completedLessonIds
      : [...progress.completedLessonIds, lessonId],
    xp: progress.xp + (already ? 0 : xp),
    streak: bumpStreak(progress.streak, today),
  };
}

/** 이어서 풀 레슨 지정. */
export function setCurrentLesson(
  progress: Progress,
  lessonId: string | null,
): Progress {
  return { ...progress, currentLessonId: lessonId };
}

/** 틀린 문제 기록(복습용, 중복 방지). */
export function markWrong(progress: Progress, questionId: string): Progress {
  if (progress.wrongQuestionIds.includes(questionId)) return progress;
  return {
    ...progress,
    wrongQuestionIds: [...progress.wrongQuestionIds, questionId],
  };
}

/** 복습 완료한 문제 제거. */
export function clearWrong(progress: Progress, questionId: string): Progress {
  return {
    ...progress,
    wrongQuestionIds: progress.wrongQuestionIds.filter(
      (id) => id !== questionId,
    ),
  };
}

export function loseHeart(progress: Progress): Progress {
  return { ...progress, hearts: Math.max(0, progress.hearts - 1) };
}

export function gainHeart(progress: Progress): Progress {
  return { ...progress, hearts: Math.min(MAX_HEARTS, progress.hearts + 1) };
}

export function isLessonCompleted(
  progress: Progress,
  lessonId: string,
): boolean {
  return progress.completedLessonIds.includes(lessonId);
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

/** localStorage에서 진도를 읽어 검증한다. 없거나 깨졌으면 기본값. */
export function loadProgress(): Progress {
  const storage = getStorage();
  if (!storage) return defaultProgress();
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return defaultProgress();
  try {
    const parsed = progressSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : defaultProgress();
  } catch {
    return defaultProgress();
  }
}

/** 진도를 localStorage에 저장한다(서버/비가용 환경에선 무시). */
export function saveProgress(progress: Progress): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* 용량 초과 등은 조용히 무시 */
  }
}
