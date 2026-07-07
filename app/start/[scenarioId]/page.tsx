"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { BackLink } from "@/components/ui/BackLink";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { getScenarioById } from "@/content/scenarios";
import { getLessonById, getLessonTitle } from "@/content/lessons";
import { firstIncompleteLessonId } from "@/lib/path";
import { cn } from "@/lib/utils";
import { useProgress } from "@/store/useProgress";

export default function ScenarioPage() {
  const params = useParams<{ scenarioId: string }>();
  const scenario = getScenarioById(params.scenarioId);

  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const completed = useProgress((s) => s.progress.completedLessonIds);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!scenario) notFound();

  const done = new Set(completed);
  const allDone = hydrated && scenario.lessonIds.every((id) => done.has(id));
  const startId =
    firstIncompleteLessonId(scenario.lessonIds, completed) ??
    scenario.lessonIds[0];
  const Icon = scenario.icon;

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6 lg:max-w-2xl lg:px-8 lg:py-8">
      <BackLink href="/" label="홈" className="mb-2" />

      <div className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10">
          <Icon className="w-7" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">{scenario.title}</h1>
      </div>

      <MascotBubble variant="study" message={scenario.intro} className="mt-4" />

      {/* 관련 레슨 */}
      <section className="mt-6">
        <h2 className="text-sm font-bold text-muted">이 상황에 필요한 레슨</h2>
        <div className="mt-3 flex flex-col gap-2">
          {scenario.lessonIds.map((id) => {
            const lesson = getLessonById(id);
            const isDone = hydrated && done.has(id);
            return (
              <Link
                key={id}
                href={`/learn/${id}`}
                className="flex items-center gap-3 rounded-card border border-border bg-surface p-4 transition-colors hover:border-brand-400 hover:bg-brand-500/5"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    isDone
                      ? "bg-success/15 text-success"
                      : "bg-brand-500/10 text-brand-600",
                  )}
                >
                  {isDone ? (
                    <Check className="size-4" />
                  ) : (
                    <span className="text-sm font-bold">
                      {scenario.lessonIds.indexOf(id) + 1}
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">
                    {getLessonTitle(id)}
                  </span>
                  {lesson && (
                    <span className="block text-xs text-muted">
                      {lesson.durationMin}분 · {lesson.questions.length}문제
                    </span>
                  )}
                </span>
                <ArrowRight className="size-4 text-muted" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* 바로 쓰는 도구 */}
      {scenario.tools.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold text-muted">바로 써먹는 도구</h2>
          <div className="mt-3 flex flex-col gap-2">
            {scenario.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-brand-400 hover:bg-brand-500/5"
              >
                <span>{tool.label}</span>
                <ArrowRight className="size-4 text-brand-600" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 시작/완료 CTA */}
      <Card highlight padding="md" className="mt-6">
        {allDone ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-success">
            <Check className="size-4" /> 이 코스의 레슨을 모두 끝냈어요! 🎉
          </p>
        ) : (
          <Link
            href={`/learn/${startId}`}
            className={buttonVariants({ size: "lg", fullWidth: true })}
          >
            {hydrated && completed.length > 0 ? "이어서 시작하기" : "이 코스 시작하기"}
            <ArrowRight className="size-5" />
          </Link>
        )}
      </Card>

      <p className="mt-4 text-xs text-muted">
        순서와 상관없이, 필요한 레슨부터 바로 열어봐도 좋아요.
      </p>
    </main>
  );
}
