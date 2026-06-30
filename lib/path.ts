/** 학습 경로 노드 상태 계산 (순수). 소프트 언락:
   모든 레슨은 언제든 열 수 있고, 상태는 '진행 안내'용일 뿐 막지 않는다.
   (잠금은 시각 표시일 뿐이고 /learn/[id]·시나리오는 이미 자유 접근이라 일관성을 맞춘다.) */

export type NodeState = "completed" | "current" | "upcoming";

/** 학습 순서대로 각 레슨의 노드 상태를 매긴다.
   - 완료한 레슨 → "completed"
   - 완료하지 않은 첫 레슨 → "current" (지금 추천 — 강조)
   - 그 뒤의 미완료 레슨 → "upcoming" (아직 안 함, 하지만 열 수 있음) */
export function computeNodeStates(
  orderedIds: string[],
  completedIds: string[],
): Record<string, NodeState> {
  const completed = new Set(completedIds);
  const result: Record<string, NodeState> = {};
  let currentAssigned = false;

  for (const id of orderedIds) {
    if (completed.has(id)) {
      result[id] = "completed";
    } else if (!currentAssigned) {
      result[id] = "current";
      currentAssigned = true;
    } else {
      result[id] = "upcoming";
    }
  }
  return result;
}

/** 이어서 풀 레슨(완료하지 않은 첫 레슨). 전부 끝냈으면 null. */
export function firstIncompleteLessonId(
  orderedIds: string[],
  completedIds: string[],
): string | null {
  const completed = new Set(completedIds);
  return orderedIds.find((id) => !completed.has(id)) ?? null;
}
