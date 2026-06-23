"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, BookOpen, Calculator, Flame, RotateCcw, Zap } from "lucide-react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { glossaryTerms } from "@/content/glossary";
import { getLessonTitle } from "@/content/lessons";
import { orderedLessonIds } from "@/content/levels";
import { greetingLines } from "@/content/messages";
import { firstIncompleteLessonId } from "@/lib/path";
import { todayKey } from "@/lib/progress";
import { dueItems } from "@/lib/review";
import { cn } from "@/lib/utils";
import { useProgress } from "@/store/useProgress";

/** 날짜 문자열을 시드로 한 안정적 인덱스(서버·클라이언트 동일 → 하이드레이션 안전). */
function dailyIndex(key: string, mod: number): number {
  if (mod <= 0) return 0;
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum % mod;
}

export function HomeDashboard() {
  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const progress = useProgress((s) => s.progress);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const today = todayKey();
  const term = glossaryTerms[dailyIndex(today, glossaryTerms.length)];
  const greeting = greetingLines[dailyIndex(today, greetingLines.length)];

  const nextId = firstIncompleteLessonId(
    orderedLessonIds,
    progress.completedLessonIds,
  );
  const started = progress.completedLessonIds.length > 0;
  const allDone = nextId === null;
  const dueCount = hydrated ? dueItems(progress.reviewItems, today).length : 0;
  const showReview = hydrated && started;
  // 스트릭이 있는데 오늘 아직 활동 안 함 → 끊길 위험 안내
  const streakAtRisk =
    hydrated && progress.streak.count > 0 && progress.streak.lastDate !== today;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 p-5">
      {/* 마스코트 인사 */}
      <MascotBubble mood="idle" message={greeting} className="pt-2" />

      {/* 스트릭 보호 안내 — 오늘 학습하면 연속이 이어져요 */}
      {streakAtRisk && (
        <Link
          href={allDone ? "/review" : `/learn/${nextId}`}
          className="flex items-center gap-3 rounded-card border border-orange-500/30 bg-orange-500/10 p-4"
        >
          <Flame className="size-5 shrink-0 text-orange-500" />
          <span className="min-w-0 flex-1 text-sm">
            <b>{progress.streak.count}일 연속</b>이 오늘까지예요. 한 문제만 풀어도 이어져요!
          </span>
          <ArrowRight className="size-4 text-orange-500" />
        </Link>
      )}

      {/* 스트릭 + XP — 탭하면 성취 */}
      <Link href="/achievements" className="grid grid-cols-2 gap-3">
        <Stat
          icon={<Flame className="size-5" />}
          value={hydrated ? progress.streak.count : 0}
          unit="일 연속"
          accent="flame"
        />
        <Stat
          icon={<Zap className="size-5" />}
          value={hydrated ? progress.xp : 0}
          unit="XP"
          accent="brand"
        />
      </Link>

      {/* 오늘의 학습 — 가장 크게, 한 번에 시작 */}
      <Card highlight padding="lg">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-600">
          <BookOpen className="size-4" /> 오늘의 학습
        </div>
        <p className="mt-2 text-xl font-bold">
          {allDone ? "모든 레슨을 끝냈어요! 🎉" : getLessonTitle(nextId)}
        </p>
        <p className="mt-1 text-sm text-muted">
          {allDone
            ? "새 레슨이 곧 추가돼요. 복습도 좋아요!"
            : started
              ? "이어서 한 걸음 더 가볼까요?"
              : "30초면 첫 문제 맞혀요."}
        </p>
        <Link
          href={allDone ? "/learn" : `/learn/${nextId}`}
          className={buttonVariants({
            size: "lg",
            fullWidth: true,
            className: "mt-5",
          })}
        >
          {allDone ? "학습 경로 보기" : started ? "이어서 풀기" : "시작하기"}
          <ArrowRight className="size-5" />
        </Link>
      </Card>

      {/* 복습 — 틀린 문제를 며칠 뒤 다시. 학습을 시작한 사람에게만 노출 */}
      {showReview && (
        <Link
          href="/review"
          className="flex items-center gap-3 rounded-card border border-border bg-surface p-4 transition-colors hover:border-brand-400 hover:bg-brand-500/5"
        >
          <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <RotateCcw className="size-5" />
            {dueCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-bold text-white">
                {dueCount}
              </span>
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">복습 퀴즈</span>
            <span className="block text-xs text-muted">
              {dueCount > 0
                ? `복습할 문제 ${dueCount}개가 기다려요`
                : "지난 레슨을 가볍게 다시 풀어봐요"}
            </span>
          </span>
          <ArrowRight className="size-4 text-muted" />
        </Link>
      )}

      {/* 오늘의 한 입 */}
      <Card padding="md">
        <p className="text-xs font-semibold tracking-wide text-muted">
          오늘의 한 입
        </p>
        <p className="mt-1 text-lg font-bold">{term.term}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{term.short}</p>
        <Link
          href="/glossary"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          용어 사전 더 보기 <ArrowRight className="size-4" />
        </Link>
      </Card>

      {/* 도구 */}
      <Link
        href="/tools"
        className="flex items-center gap-3 rounded-card border border-border bg-surface p-4 transition-colors hover:border-brand-400 hover:bg-brand-500/5"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
          <Calculator className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">계산기</span>
          <span className="block text-xs text-muted">
            실수령액·연말정산·연금저축·복리
          </span>
        </span>
        <ArrowRight className="size-4 text-muted" />
      </Link>
    </main>
  );
}

function Stat({
  icon,
  value,
  unit,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  unit: string;
  accent: "flame" | "brand";
}) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-4">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          accent === "flame"
            ? "bg-orange-500/10 text-orange-500"
            : "bg-brand-500/10 text-brand-600",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted">{unit}</p>
      </div>
    </div>
  );
}
