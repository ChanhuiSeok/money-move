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
  {
    id: "l-invest",
    order: 3,
    title: "투자 첫걸음",
    description: "주식·증권계좌·매수매도, 그리고 ETF·채권 같은 자산 종류까지.",
    unitIds: ["u-invest-1", "u-invest-2", "u-invest-3"],
  },
  {
    id: "l-macro",
    order: 4,
    title: "투자, 한 걸음 더",
    description: "금리·환율·해외(미국) 투자와 시장을 흔드는 이벤트까지, 직관으로.",
    unitIds: ["u-macro-1", "u-macro-2"],
  },
  {
    id: "l-housing",
    order: 5,
    title: "전세·월세·내 집",
    description: "보증금 지키기부터 청약까지, 집 구할 때 꼭 아는 것들.",
    unitIds: ["u-housing-1"],
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
  {
    id: "u-invest-1",
    levelId: "l-invest",
    order: 1,
    title: "주식과 계좌",
    lessonIds: ["stock-basics", "brokerage-account"],
  },
  {
    id: "u-invest-2",
    levelId: "l-invest",
    order: 2,
    title: "사고팔기",
    lessonIds: ["buy-sell-order", "risk-diversification"],
  },
  {
    id: "u-invest-3",
    levelId: "l-invest",
    order: 3,
    title: "자산의 종류",
    lessonIds: ["etf-basics", "bond-basics"],
  },
  {
    id: "u-macro-1",
    levelId: "l-macro",
    order: 1,
    title: "큰 흐름 읽기",
    lessonIds: ["interest-rates", "inflation-rates", "exchange-rates"],
  },
  {
    id: "u-macro-2",
    levelId: "l-macro",
    order: 2,
    title: "넓게 투자하기",
    lessonIds: ["us-investing", "market-events"],
  },
  {
    id: "u-housing-1",
    levelId: "l-housing",
    order: 1,
    title: "집 구하기 기본",
    lessonIds: ["jeonse-wolse", "housing-subscription"],
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

/** 한 레벨에 속한 모든 레슨 id(유닛 순서대로). */
export function lessonIdsOfLevel(levelId: string): string[] {
  return unitsOfLevel(levelId).flatMap((u) => u.lessonIds);
}

/** 레슨이 속한 레벨. */
export function levelOfLesson(lessonId: string): Level | undefined {
  return levels.find((level) =>
    lessonIdsOfLevel(level.id).includes(lessonId),
  );
}

/** 레벨의 모든 레슨을 완료했는지. */
export function isLevelComplete(levelId: string, completedIds: string[]): boolean {
  const ids = lessonIdsOfLevel(levelId);
  const done = new Set(completedIds);
  return ids.length > 0 && ids.every((id) => done.has(id));
}

/** 완료한 레벨 수. */
export function completedLevelCount(completedIds: string[]): number {
  return levels.filter((l) => isLevelComplete(l.id, completedIds)).length;
}

/** 이 레슨을 완료해서 "막 완성된" 레벨(직전엔 미완성, 이번에 완성). 없으면 null.
   레벨업 팡파레용. */
export function levelJustCompleted(
  lessonId: string,
  completedAfter: string[],
): Level | null {
  const level = levelOfLesson(lessonId);
  if (!level) return null;
  if (!isLevelComplete(level.id, completedAfter)) return null;
  const before = completedAfter.filter((id) => id !== lessonId);
  return isLevelComplete(level.id, before) ? null : level;
}
