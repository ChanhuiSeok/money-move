"use client";

import { useEffect } from "react";
import { Check, Flame, Sparkles, Zap } from "lucide-react";
import { StreakCalendar } from "@/components/achievements/StreakCalendar";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { allLessons } from "@/content/lessons";
import { completedLevelCount } from "@/content/levels";
import { BADGES, earnedBadgeIds } from "@/lib/achievements";
import { learnedTermIds } from "@/lib/glossary";
import { cn } from "@/lib/utils";
import { useProgress } from "@/store/useProgress";

export function AchievementsView() {
  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const progress = useProgress((s) => s.progress);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const stats = {
    completedCount: progress.completedLessonIds.length,
    xp: progress.xp,
    bestStreak: progress.bestStreak,
    levelsCompleted: completedLevelCount(progress.completedLessonIds),
    termsLearned: learnedTermIds(progress.completedLessonIds, allLessons).size,
  };
  const earned = hydrated ? earnedBadgeIds(stats) : new Set<string>();
  const earnedCount = earned.size;

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6">
      <BackLink className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">성취</h1>
      <p className="mt-1 text-sm text-muted">
        {hydrated
          ? `배지 ${earnedCount}/${BADGES.length} · ${progress.activeDays.length}일 학습했어요.`
          : " "}
      </p>

      {/* 핵심 지표 */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Metric
          icon={<Flame className="size-4" />}
          value={hydrated ? progress.bestStreak : 0}
          label="최고 연속"
          accent="flame"
        />
        <Metric
          icon={<Zap className="size-4" />}
          value={hydrated ? progress.xp : 0}
          label="XP"
          accent="brand"
        />
        <Metric
          icon={<Sparkles className="size-4" />}
          value={hydrated ? earnedCount : 0}
          label="배지"
          accent="brand"
        />
      </div>

      {/* 학습 잔디 */}
      <Card padding="md" className="mt-4">
        <p className="text-sm font-bold">학습 기록</p>
        <p className="mt-0.5 text-xs text-muted">최근 14주 · 칠해진 날이 학습한 날</p>
        <div className="mt-3">
          {hydrated && <StreakCalendar activeDays={progress.activeDays} />}
        </div>
      </Card>

      {/* 배지 */}
      <h2 className="mt-6 text-sm font-bold">배지</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {BADGES.map((b) => {
          const got = earned.has(b.id);
          return (
            <Card
              key={b.id}
              padding="md"
              highlight={got}
              className={cn(
                "flex items-center gap-3 transition-colors",
                got ? "bg-brand-500/5" : "opacity-70",
              )}
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full text-2xl",
                  got
                    ? "bg-brand-500/15 shadow-sm"
                    : "bg-subtle opacity-60 grayscale",
                )}
              >
                {b.emoji}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-sm font-bold",
                    got ? "text-foreground" : "text-muted",
                  )}
                >
                  {b.title}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex items-center gap-1 text-xs",
                    got ? "font-semibold text-brand-600" : "text-muted",
                  )}
                >
                  {got ? (
                    <>
                      <Check className="size-3" /> 획득!
                    </>
                  ) : (
                    b.desc
                  )}
                </span>
              </span>
            </Card>
          );
        })}
      </div>
    </main>
  );
}

function Metric({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  accent: "flame" | "brand";
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-card border border-border bg-surface p-3">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-full",
          accent === "flame"
            ? "bg-orange-500/10 text-orange-500"
            : "bg-brand-500/10 text-brand-600",
        )}
      >
        {icon}
      </span>
      <span className="text-lg font-bold leading-none tabular-nums">{value}</span>
      <span className="text-[11px] text-muted">{label}</span>
    </div>
  );
}
