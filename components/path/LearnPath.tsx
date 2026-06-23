"use client";

import { useEffect } from "react";
import { PathNode } from "@/components/path/PathNode";
import { BackLink } from "@/components/ui/BackLink";
import { getLessonTitle } from "@/content/lessons";
import { levels, orderedLessonIds, unitsOfLevel } from "@/content/levels";
import { computeNodeStates } from "@/lib/path";
import { cn } from "@/lib/utils";
import { useProgress } from "@/store/useProgress";

export function LearnPath() {
  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const completedIds = useProgress((s) => s.progress.completedLessonIds);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 하이드레이션 전에는 저장값을 모르므로 빈 진도로 계산(첫 레슨만 current).
  const states = computeNodeStates(orderedLessonIds, hydrated ? completedIds : []);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6 lg:py-8">
      <BackLink className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">학습 경로</h1>

      {levels.map((level) => (
        <section key={level.id} className="mt-6">
          <p className="text-sm font-semibold text-brand-600">{level.title}</p>
          <p className="mt-0.5 text-sm text-muted">{level.description}</p>

          <div className="mt-6 space-y-8">
            {unitsOfLevel(level.id).map((unit) => (
              <div key={unit.id}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs font-semibold tracking-wide text-muted">
                    {unit.title}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <div className="flex flex-col items-center">
                  {unit.lessonIds.map((id, i) => (
                    <div key={id} className="flex flex-col items-center">
                      {i > 0 && (
                        <span
                          className={cn(
                            "my-1 h-6 w-1 rounded-full",
                            states[unit.lessonIds[i - 1]] === "completed"
                              ? "bg-brand-600"
                              : "bg-border",
                          )}
                        />
                      )}
                      <PathNode
                        id={id}
                        title={getLessonTitle(id)}
                        state={states[id] ?? "locked"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
