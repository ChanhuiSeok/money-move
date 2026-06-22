import type { Level, Unit } from "@/lib/schema";

/** 레벨/유닛/레슨 메타. Task 1.7에서 레벨 1~2를 더 채운다.
   레슨 본문은 content/lessons/* 에 있고, 여기서는 순서·묶음만 정의한다. */

export const levels: Level[] = [
  {
    id: "l-basics",
    order: 1,
    title: "돈의 기초",
    description: "내 돈이 어디로 가는지부터, 예산과 비상금까지.",
    unitIds: ["u-basics-1", "u-basics-2"],
  },
  {
    id: "l-tax",
    order: 2,
    title: "세금과 공제",
    description: "월급명세서·4대 보험·연말정산을 한 입씩.",
    unitIds: ["u-tax-1", "u-tax-2"],
  },
];

export const units: Unit[] = [
  {
    id: "u-basics-1",
    levelId: "l-basics",
    order: 1,
    title: "돈 들여다보기",
    lessonIds: ["welcome", "income-expense"],
  },
  {
    id: "u-basics-2",
    levelId: "l-basics",
    order: 2,
    title: "굳히기",
    lessonIds: ["budget-basics", "emergency-saving"],
  },
  {
    id: "u-tax-1",
    levelId: "l-tax",
    order: 1,
    title: "월급의 진실",
    lessonIds: ["payslip-basics", "four-insurances"],
  },
  {
    id: "u-tax-2",
    levelId: "l-tax",
    order: 2,
    title: "공제 첫걸음",
    lessonIds: ["deduction-vs-credit", "year-end-tax"],
  },
];

const sortByOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/** 레벨 → 유닛 순서대로 정렬된 유닛 목록. */
export function unitsOfLevel(levelId: string): Unit[] {
  return units.filter((u) => u.levelId === levelId).sort(sortByOrder);
}

/** 전체 레슨 id를 학습 순서(유닛 순서 → 유닛 내 lessonIds 순서)대로 평탄화. */
export const orderedLessonIds: string[] = [...levels]
  .sort(sortByOrder)
  .flatMap((level) =>
    unitsOfLevel(level.id).flatMap((unit) => unit.lessonIds),
  );
