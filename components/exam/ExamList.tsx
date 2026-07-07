"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { PageHeader } from "@/components/ui/PageHeader";
import { orderedExams } from "@/content/exams";
import { toScore, totalQuestions } from "@/lib/exams";
import { useExams } from "@/store/useExams";
import { cn } from "@/lib/utils";

/** 모의고사 허브 — 3회차 목록. 회차별 최고 성적을 보여준다. */
export function ExamList() {
  const hydrate = useExams((s) => s.hydrate);
  const hydrated = useExams((s) => s.hydrated);
  const results = useExams((s) => s.results);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      <PageHeader
        title="모의고사"
        subtitle="학습 5개 영역을 아우르는 실전 시험지예요. 한 번에 풀고 제출하면 채점과 해설을 볼 수 있어요."
      />

      <MascotBubble
        variant="exam"
        message="레슨 문제보다 살짝 어려워요. 실력을 점검해봐요!"
        size="lg"
      />

      <ul className="mt-5 flex flex-col gap-3">
        {orderedExams.map((exam) => {
          const total = totalQuestions(exam);
          const result = hydrated ? results[exam.id] : undefined;
          const done = !!result;
          return (
            <li key={exam.id}>
              <Link
                href={`/exams/${exam.id}`}
                className={cn(
                  "group flex items-center gap-4 rounded-card border bg-surface p-5 shadow-[0_3px_0_0_var(--edge-tile)] transition-[transform,box-shadow,border-color,background-color] duration-100 hover:border-brand-400 hover:bg-brand-500/[0.04] active:translate-y-[2px] active:shadow-[0_1px_0_0_var(--edge-tile)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25",
                  done ? "border-border" : "border-brand-500/30",
                )}
              >
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full",
                    done
                      ? "bg-success/10 text-success"
                      : "bg-brand-500/10 text-brand-600",
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <FileText className="size-5" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold">{exam.title}</p>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {exam.subtitle}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-muted tabular-nums">
                    {total}문항 · 5개 영역
                    {result && (
                      <span className="text-brand-600">
                        {"  ·  "}최고 {result.correct}/{result.total} (
                        {toScore(result.correct, result.total)}점)
                      </span>
                    )}
                  </p>
                </div>

                <span className="shrink-0 text-xs font-bold text-brand-600">
                  {done ? "다시" : "응시"}
                  <ArrowRight className="ml-0.5 inline size-3.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
