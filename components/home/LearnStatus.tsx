import Link from "next/link";
import { Flame, GraduationCap, Zap } from "lucide-react";
import { buttonVariants, type ButtonVariant } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { levels, lessonIdsOfLevel } from "@/content/levels";
import { cn } from "@/lib/utils";

/** 홈의 '내 학습' 요약 모듈 — 레벨별 진행도 + 스트릭/XP + 이어서 풀기.
 *  강조하진 않되(내 돈 히어로가 축), 지금 어디까지 왔는지 한눈에 보이게 한다.
 *  상세 경로는 /learn, 이 카드는 요약 + 진입점 역할. */
export function LearnStatus({
  hydrated,
  completedIds,
  xp,
  streakCount,
  nextHref,
  ctaLabel,
  variant = "primary",
}: {
  hydrated: boolean;
  completedIds: string[];
  xp: number;
  streakCount: number;
  nextHref: string;
  ctaLabel: string;
  variant?: ButtonVariant;
}) {
  const done = new Set(completedIds);

  return (
    <Card padding="md">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-bold text-brand-600">
          <GraduationCap className="size-5" /> 내 학습
        </span>
        <div className="flex items-center gap-2 tabular-nums">
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-500">
            <Flame className="size-3.5" />
            {hydrated ? streakCount : 0}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-600">
            <Zap className="size-3.5" />
            {hydrated ? xp : 0}
          </span>
        </div>
      </div>

      {/* 레벨별 진행 — 모의고사 결과의 영역 막대와 같은 언어로 통일 */}
      <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {levels.map((level, i) => {
          const ids = lessonIdsOfLevel(level.id);
          const total = ids.length;
          const doneCount = hydrated
            ? ids.filter((id) => done.has(id)).length
            : 0;
          const pct = total > 0 ? (doneCount / total) * 100 : 0;
          const complete = total > 0 && doneCount === total;
          return (
            <li key={level.id} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tabular-nums",
                  complete
                    ? "bg-brand-600 text-white"
                    : "bg-subtle text-muted",
                )}
              >
                {i + 1}
              </span>
              <span className="w-[4.5rem] shrink-0 truncate text-xs font-semibold">
                {level.title}
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-subtle">
                <span
                  className="block h-full rounded-full bg-brand-500"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-muted">
                {doneCount}/{total}
              </span>
            </li>
          );
        })}
      </ul>

      <Link
        href={nextHref}
        className={buttonVariants({
          variant: hydrated ? variant : "secondary",
          size: "md",
          fullWidth: true,
          className: cn("mt-5", !hydrated && "opacity-50 pointer-events-none"),
        })}
      >
        {ctaLabel}
      </Link>
    </Card>
  );
}

