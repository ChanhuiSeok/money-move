import { levels, lessonIdsOfLevel } from "@/content/levels";
import type { DiagnosticItem } from "@/content/diagnostic";

/* 실력 진단(건너뛰기) 로직 — 순수 함수.
   레벨별로 진단 문항을 채점하고, 선형 잠금 해제 규칙에 맞춰
   "앞에서부터 연속으로 통과한 레벨"까지만 건너뛰기를 인정한다. */

/** 레벨별 진단 결과. */
export type LevelResult = {
  levelId: string;
  title: string;
  correct: number;
  total: number;
  passed: boolean;
};

/** 통과 기준: 레벨 문항을 모두 맞혀야 통과(보수적 — 애매하면 처음부터 배우게). */
export const PASS_RATIO = 1;

/** 문항별 정답 여부(items와 같은 순서)를 레벨별로 집계한다.
   레벨 order대로 결과를 돌려준다. items에 없는 레벨은 결과에서 빠진다. */
export function gradeDiagnostic(
  items: DiagnosticItem[],
  correctness: boolean[],
): LevelResult[] {
  const tally = new Map<string, { correct: number; total: number }>();
  items.forEach((item, i) => {
    const t = tally.get(item.levelId) ?? { correct: 0, total: 0 };
    t.total += 1;
    if (correctness[i]) t.correct += 1;
    tally.set(item.levelId, t);
  });
  return [...levels]
    .sort((a, b) => a.order - b.order)
    .filter((lv) => tally.has(lv.id))
    .map((lv) => {
      const t = tally.get(lv.id)!;
      return {
        levelId: lv.id,
        title: lv.title,
        correct: t.correct,
        total: t.total,
        passed: t.total > 0 && t.correct / t.total >= PASS_RATIO,
      };
    });
}

/** 건너뛸 레슨 id 목록.
   선형 잠금이라 앞에서부터 연속으로 통과한 레벨까지만 인정한다
   (레벨 1을 못 풀면 레벨 2를 맞혀도 건너뛰지 않는다). */
export function placedOutLessonIds(results: LevelResult[]): string[] {
  const ids: string[] = [];
  for (const r of results) {
    if (!r.passed) break;
    ids.push(...lessonIdsOfLevel(r.levelId));
  }
  return ids;
}

/** 진단 후 시작할 레벨(연속 통과가 끊긴 첫 레벨). 전부 통과면 null. */
export function startLevel(results: LevelResult[]): LevelResult | null {
  for (const r of results) {
    if (!r.passed) return r;
  }
  return null;
}

/** 통과한(건너뛴) 레벨 수 — 앞에서부터 연속 통과만 인정. */
export function skippedLevelCount(results: LevelResult[]): number {
  let n = 0;
  for (const r of results) {
    if (!r.passed) break;
    n += 1;
  }
  return n;
}
