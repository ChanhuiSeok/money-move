import { progressSchema, type Progress, type Streak } from "@/lib/schema";

/* 진도/스트릭/하트 로직 (localStorage 기반).
   핵심 계산 함수는 모두 순수 함수 — 입력 진도를 바꾸지 않고 새 객체를 돌려준다.
   날짜에 의존하는 함수는 today를 인자로 받아 테스트 가능하게 한다. */

export const STORAGE_KEY = "donpath:progress:v1";
export const MAX_HEARTS = 5;
export const XP_PER_LESSON = 10;
export const XP_PER_REVIEW = 2;

export function defaultProgress(): Progress {
  return {
    completedLessonIds: [],
    currentLessonId: null,
    xp: 0,
    streak: { count: 0, lastDate: "" },
    hearts: MAX_HEARTS,
    reviewItems: [],
    activeDays: [],
    bestStreak: 0,
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

/** YYYY-MM-DD에 n일을 더한 날짜를 YYYY-MM-DD로. (dayDiff와 같은 UTC 기준) */
export function addDays(key: string, n: number): string {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

/** 오늘 활동을 진도에 반영한다(스트릭 갱신 + 최고 스트릭 + 활동일 기록).
   레슨 완료·복습 등 "오늘 들어온 모든 활동"의 공통 처리. */
export function recordActivity(progress: Progress, today: string): Progress {
  const streak = bumpStreak(progress.streak, today);
  const activeDays = progress.activeDays.includes(today)
    ? progress.activeDays
    : [...progress.activeDays, today].sort();
  return {
    ...progress,
    streak,
    bestStreak: Math.max(progress.bestStreak, streak.count),
    activeDays,
  };
}

/** 레슨 완료 처리: 완료 목록 추가(중복 방지) + XP 적립 + 활동 반영.
   이미 완료한 레슨을 다시 풀면 XP는 더하지 않지만 오늘 활동으로 스트릭은 이어진다. */
export function completeLesson(
  progress: Progress,
  lessonId: string,
  opts: { xp?: number; today?: string } = {},
): Progress {
  const xp = opts.xp ?? XP_PER_LESSON;
  const today = opts.today ?? todayKey();
  const already = progress.completedLessonIds.includes(lessonId);
  const base = recordActivity(progress, today);
  return {
    ...base,
    completedLessonIds: already
      ? base.completedLessonIds
      : [...base.completedLessonIds, lessonId],
    xp: base.xp + (already ? 0 : xp),
  };
}

/** 진단 테스트로 이미 아는 레슨을 건너뛴다(완료 처리).
   건너뛰기는 '학습 활동'이 아니므로 XP·스트릭은 주지 않고 진도만 채운다.
   이미 완료한 레슨은 그대로 둔다. */
export function placeOutLessons(
  progress: Progress,
  lessonIds: string[],
): Progress {
  const have = new Set(progress.completedLessonIds);
  const added = lessonIds.filter((id) => !have.has(id));
  if (added.length === 0) return progress;
  return {
    ...progress,
    completedLessonIds: [...progress.completedLessonIds, ...added],
  };
}

/** 이어서 풀 레슨 지정. */
export function setCurrentLesson(
  progress: Progress,
  lessonId: string | null,
): Progress {
  return { ...progress, currentLessonId: lessonId };
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

/** 복습 세션 보상: 맞힌 개수만큼 XP 적립 + 오늘 활동으로 스트릭 유지.
   복습도 "오늘 들어온 것"이므로 스트릭이 이어진다. */
export function awardReview(
  progress: Progress,
  correctCount: number,
  opts: { xp?: number; today?: string } = {},
): Progress {
  const xpEach = opts.xp ?? XP_PER_REVIEW;
  const today = opts.today ?? todayKey();
  const base = recordActivity(progress, today);
  return {
    ...base,
    xp: base.xp + Math.max(0, correctCount) * xpEach,
  };
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

/** 구버전 저장값을 현재 스키마로 끌어올린다.
   - 초기형 wrongQuestionIds(평면 배열) → 박스 0, 지금 바로 복습으로 변환.
   - activeDays·bestStreak는 없으면 스트릭 정보로 최소 복원. */
function migrate(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const obj = { ...(raw as Record<string, unknown>) };

  if (!("reviewItems" in obj) && Array.isArray(obj.wrongQuestionIds)) {
    obj.reviewItems = (obj.wrongQuestionIds as unknown[])
      .filter((id): id is string => typeof id === "string")
      .map((id) => ({ id, due: "", box: 0 }));
    delete obj.wrongQuestionIds;
  }

  const streak =
    obj.streak && typeof obj.streak === "object"
      ? (obj.streak as Record<string, unknown>)
      : null;
  if (!("activeDays" in obj)) {
    const last = streak?.lastDate;
    obj.activeDays = typeof last === "string" && last ? [last] : [];
  }
  if (!("bestStreak" in obj)) {
    obj.bestStreak = typeof streak?.count === "number" ? streak.count : 0;
  }

  return obj;
}

/** localStorage에서 진도를 읽어 검증한다. 없거나 깨졌으면 기본값. */
export function loadProgress(): Progress {
  const storage = getStorage();
  if (!storage) return defaultProgress();
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return defaultProgress();
  try {
    const parsed = progressSchema.safeParse(migrate(JSON.parse(raw)));
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
