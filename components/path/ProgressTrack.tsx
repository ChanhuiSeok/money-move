import { MascotImage } from "@/components/mascot/MascotImage";
import { cn } from "@/lib/utils";

/** 학습 진행도 게이지 — 완료 비율만큼 트랙이 채워지고, 그 끝에 마스코트가 서 있다. */
export function ProgressTrack({
  completed,
  total,
  className,
}: {
  completed: number;
  total: number;
  className?: string;
}) {
  const pct =
    total <= 0 ? 0 : Math.min(100, Math.round((completed / total) * 100));

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface p-4",
        className,
      )}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold">내 진행도</span>
        <span className="text-xs font-semibold tabular-nums text-brand-600">
          {completed}/{total} 레슨 · {pct}%
        </span>
      </div>

      <div className="relative mt-5 h-14">
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-subtle">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* 러너 — left(%)+translateX(-%) 조합으로 발끝이 트랙 시작~끝을 벗어나지 않게 정렬 */}
        <div
          className="absolute"
          style={{
            left: `${pct}%`,
            bottom: "calc(50% - 1px)",
            transform: `translateX(-${pct}%)`,
          }}
        >
          <MascotImage variant="run" className="w-10 sm:w-11" priority />
        </div>
      </div>
    </div>
  );
}
