"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, BookOpen, Calculator, Flame, Zap } from "lucide-react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { glossaryTerms } from "@/content/glossary";
import { getLessonTitle } from "@/content/lessons";
import { orderedLessonIds } from "@/content/levels";
import { greetingLines } from "@/content/messages";
import { firstIncompleteLessonId } from "@/lib/path";
import { todayKey } from "@/lib/progress";
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

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 p-5">
      {/* 마스코트 인사 */}
      <MascotBubble mood="idle" message={greeting} className="pt-2" />

      {/* 스트릭 + XP */}
      <div className="grid grid-cols-2 gap-3">
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
      </div>

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

      {/* 오늘의 한 입 */}
      <Card padding="md">
        <p className="text-xs font-semibold tracking-wide text-muted">
          오늘의 한 입
        </p>
        <p className="mt-1 text-lg font-bold">{term.term}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{term.short}</p>
      </Card>

      {/* 도구 */}
      <Link
        href="/tools/take-home"
        className="flex items-center gap-3 rounded-card border border-border bg-surface p-4 transition-colors hover:border-brand-400 hover:bg-brand-500/5"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
          <Calculator className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">실수령액 계산기</span>
          <span className="block text-xs text-muted">
            내 월급, 실제로 얼마 들어올까?
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
