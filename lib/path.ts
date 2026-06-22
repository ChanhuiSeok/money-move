/** 학습 경로 노드 상태 계산 (순수). 선형 잠금 해제:
   앞 레슨을 완료해야 다음이 열린다. */

export type NodeState = "completed" | "current" | "locked";

/** 학습 순서대로 각 레슨의 노드 상태를 매긴다.
   - 완료한 레슨 → "completed"
   - 완료하지 않은 첫 레슨 → "current" (열림, 진행할 곳)
   - 그 뒤의 미완료 레슨 → "locked" */
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
      result[id] = "locked";
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
