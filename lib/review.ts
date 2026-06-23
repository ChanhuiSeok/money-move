import { addDays } from "@/lib/progress";
import type { ReviewItem } from "@/lib/schema";

/* 간격 반복(라이트너 박스) 로직 — 순수 함수.
   틀린 문제를 박스 0에 넣고, 복습에서 맞힐 때마다 다음 박스로 올려
   점점 더 긴 간격 뒤에 다시 낸다. 마지막 박스를 넘기면 졸업(목록에서 제거).
   날짜에 의존하는 함수는 today를 인자로 받아 테스트 가능하게 한다. */

/** 박스 단계별 다음 복습까지의 간격(일). 박스 0→1일, 1→3일, 2→7일, 3→16일. */
export const REVIEW_INTERVALS = [1, 3, 7, 16] as const;

/** 데일리 퀴즈 기본 문제 수. */
export const DAILY_QUIZ_SIZE = 5;

/** 박스 단계에서 다음 복습 예정일을 구한다. 마지막 박스를 넘기면 null(=졸업). */
export function nextDue(box: number, today: string): string | null {
  if (box >= REVIEW_INTERVALS.length) return null;
  return addDays(today, REVIEW_INTERVALS[box]);
}

/** "lessonId:index" → {lessonId, index}. 형식이 깨졌으면 null. */
export function parseQuestionId(
  id: string,
): { lessonId: string; index: number } | null {
  const at = id.lastIndexOf(":");
  if (at <= 0 || at === id.length - 1) return null;
  const lessonId = id.slice(0, at);
  const index = Number(id.slice(at + 1));
  if (!Number.isInteger(index) || index < 0) return null;
  return { lessonId, index };
}

/** lessonId + 문제 인덱스 → 복습 항목 id. */
export function makeQuestionId(lessonId: string, index: number): string {
  return `${lessonId}:${index}`;
}

/** 오늘 복습할 차례인지. due가 ""(=지금 바로)거나 오늘 이하면 due. */
export function isDue(item: ReviewItem, today: string): boolean {
  return item.due === "" || item.due <= today;
}

/** 틀린 문제를 복습 대기열에 넣는다(중복이면 박스 0으로 리셋).
   레슨/퀴즈 어디서 틀리든 동일하게 "처음부터 다시"로 본다. */
export function scheduleWrong(
  items: ReviewItem[],
  id: string,
  today: string,
): ReviewItem[] {
  const due = nextDue(0, today) ?? today;
  const fresh: ReviewItem = { id, due, box: 0 };
  const exists = items.some((it) => it.id === id);
  if (!exists) return [...items, fresh];
  return items.map((it) => (it.id === id ? fresh : it));
}

/** 복습 결과 반영.
   - 정답: 다음 박스로 승급(간격 늘림). 마지막 박스를 넘기면 졸업(제거).
   - 오답: 박스 0으로 강등 후 다시 가까운 날짜로.
   대기열에 없던 id를 맞히면 아무 일도 일어나지 않는다(이미 충분히 안다고 봄). */
export function applyReview(
  items: ReviewItem[],
  id: string,
  correct: boolean,
  today: string,
): ReviewItem[] {
  if (!correct) return scheduleWrong(items, id, today);
  const target = items.find((it) => it.id === id);
  if (!target) return items;
  const box = target.box + 1;
  const due = nextDue(box, today);
  if (due === null) return items.filter((it) => it.id !== id); // 졸업
  return items.map((it) => (it.id === id ? { id, due, box } : it));
}

/** 오늘 복습 차례인 항목들(예정일 빠른 순). */
export function dueItems(items: ReviewItem[], today: string): ReviewItem[] {
  return items
    .filter((it) => isDue(it, today))
    .sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
}

/** 데일리 퀴즈 문제 id 목록을 만든다.
   오늘 복습 예정 문제를 먼저 채우고, 모자라면 풀(완료 레슨의 문제)에서
   중복 없이 채워 size개로 맞춘다. shuffle은 풀 섞기용(테스트에서 주입 가능). */
export function buildQuiz(opts: {
  dueIds: string[];
  poolIds: string[];
  size?: number;
  shuffle?: <T>(arr: T[]) => T[];
}): string[] {
  const size = opts.size ?? DAILY_QUIZ_SIZE;
  const shuffle = opts.shuffle ?? defaultShuffle;
  const picked: string[] = [];
  const seen = new Set<string>();
  const take = (id: string) => {
    if (seen.has(id) || picked.length >= size) return;
    seen.add(id);
    picked.push(id);
  };
  for (const id of opts.dueIds) take(id);
  for (const id of shuffle(opts.poolIds.filter((id) => !seen.has(id)))) take(id);
  return picked;
}

function defaultShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
