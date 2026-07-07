import { MascotImage, type MascotVariant } from "@/components/mascot/MascotImage";
import { cn } from "@/lib/utils";

/** 마스코트 + 말풍선. 홈 인사·계산기 안내 등에 쓴다.
 *  variant로 포즈 선택(home=인사, study=학습/계산기), size로 히어로급 크기 조절. */
export function MascotBubble({
  variant = "home",
  message,
  className,
  size = "md",
  priority = false,
  isLoading = false,
}: {
  variant?: MascotVariant;
  message?: string;
  className?: string;
  size?: "md" | "lg";
  priority?: boolean;
  isLoading?: boolean;
}) {
  const width = size === "lg" ? "w-24" : "w-16";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="shrink-0">
        <MascotImage variant={variant} className={width} priority={priority} />
      </div>
      <div
        className={cn(
          "relative rounded-2xl border border-accent-500/30 bg-white px-4 py-2.5 text-sm font-bold text-foreground shadow-[0_3px_0_0_var(--edge-tile)] dark:bg-surface",
          // 꼬리표 바깥 테두리 (border border-accent-500/30)
          "before:absolute before:right-full before:top-4 before:h-0 before:w-0 before:border-8 before:border-transparent before:border-r-accent-500/30",
          // 꼬리표 안쪽 채우기 (1px 테두리 라인 효과를 위해 1px 우측 이동 및 y축 중앙 정렬)
          "after:absolute after:right-full after:top-[17px] after:translate-x-[1px] after:h-0 after:w-0 after:border-[7px] after:border-transparent after:border-r-white dark:after:border-r-surface"
        )}
      >
        {isLoading ? (
          <span className="flex h-5 items-center gap-1" aria-hidden>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-500 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-500 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-500" />
          </span>
        ) : (
          message
        )}
      </div>
    </div>
  );
}

