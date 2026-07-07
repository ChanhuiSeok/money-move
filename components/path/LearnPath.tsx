"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Flag, MapPin } from "lucide-react";
import { ExamIcon } from "@/components/icons/PixelIcon";
import { PathNode } from "@/components/path/PathNode";
import { ProgressTrack } from "@/components/path/ProgressTrack";
import { BackLink } from "@/components/ui/BackLink";
import { getLessonTitle } from "@/content/lessons";
import { levels, orderedLessonIds, unitsOfLevel } from "@/content/levels";
import { computeNodeStates } from "@/lib/path";
import { cn } from "@/lib/utils";
import { useProgress } from "@/store/useProgress";

/** 노드가 좌우로 굽이치는 폭(px). 길처럼 보이게 한 칸씩 번갈아 어긋난다. */
const SWAY = 38;
const nodeOffset = (i: number) => (i % 2 === 0 ? -SWAY : SWAY);

/** 두 노드를 잇는 점선 '길' — 가운데(SVG 폭 절반)를 기준으로 좌우 오프셋만큼 휜다. */
function RoadLink({
  from,
  to,
  active,
}: {
  from: number;
  to: number;
  active: boolean;
}) {
  const cx = 90; // viewBox 폭 180의 절반
  const h = 46;
  const x1 = cx + from;
  const x2 = cx + to;
  return (
    <svg
      width="180"
      height={h}
      viewBox={`0 0 180 ${h}`}
      className={cn("my-1 block", active ? "text-brand-600" : "text-border")}
      aria-hidden
    >
      <path
        d={`M${x1} 2 C ${x1} ${h * 0.55}, ${x2} ${h * 0.45}, ${x2} ${h - 2}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="0.5 9"
      />
    </svg>
  );
}

export function LearnPath() {
  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const completedIds = useProgress((s) => s.progress.completedLessonIds);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 하이드레이션 전에는 저장값을 모르므로 빈 진도로 계산(첫 레슨만 current).
  const states = computeNodeStates(orderedLessonIds, hydrated ? completedIds : []);
  const completedCount = hydrated
    ? completedIds.filter((id) => orderedLessonIds.includes(id)).length
    : 0;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      <BackLink className="mb-3" />
      <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-4xl">
        학습 경로
      </h1>

      <ProgressTrack
        completed={completedCount}
        total={orderedLessonIds.length}
        className="mt-4"
      />

      {/* 모의고사 진입 — 하단 탭바에 없어 여기서도 갈 수 있게(특히 모바일) */}
      <Link
        href="/exams"
        className="mt-4 flex items-center gap-3 rounded-card border border-border bg-surface p-4 shadow-[0_3px_0_0_var(--edge-tile)] transition-[transform,box-shadow,border-color,background-color] duration-100 hover:border-brand-400 hover:bg-brand-500/[0.04] active:translate-y-[2px] active:shadow-[0_1px_0_0_var(--edge-tile)]"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-500/10">
          <ExamIcon className="w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">모의고사 보기</span>
          <span className="block text-xs text-muted">
            5개 영역 실전 시험지 · 총 3회
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-brand-600" />
      </Link>

      {/* 출발점 — 길의 시작 */}
      <div className="mt-5 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-600">
          <MapPin className="size-3.5" /> 출발
        </span>
      </div>

      {levels.map((level) => (
        <section key={level.id} className="mt-4">
          {/* 레벨 이정표(표지판) */}
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
              <Flag className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-600">
                {level.title}
              </p>
              <p className="text-xs text-muted">{level.description}</p>
            </div>
          </div>

          <div className="mt-5 space-y-7">
            {unitsOfLevel(level.id).map((unit) => (
              <div key={unit.id}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs font-semibold tracking-wide text-muted">
                    {unit.title}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <div className="flex flex-col items-center">
                  {unit.lessonIds.map((id, i) => (
                    <div key={id} className="flex w-full flex-col items-center">
                      {i > 0 && (
                        <RoadLink
                          from={nodeOffset(i - 1)}
                          to={nodeOffset(i)}
                          active={
                            states[unit.lessonIds[i - 1]] === "completed"
                          }
                        />
                      )}
                      <div style={{ transform: `translateX(${nodeOffset(i)}px)` }}>
                        <PathNode
                          id={id}
                          title={getLessonTitle(id)}
                          state={states[id] ?? "upcoming"}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* 도착점 — 길의 끝(깃발) */}
      <div className="mt-8 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted">
          <Flag className="size-3.5" /> 결승
        </span>
      </div>
    </main>
  );
}
