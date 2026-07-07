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
}: {
  variant?: MascotVariant;
  message: string;
  className?: string;
  size?: "md" | "lg";
  priority?: boolean;
}) {
  const width = size === "lg" ? "w-24" : "w-16";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="shrink-0">
        <MascotImage variant={variant} className={width} priority={priority} />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-accent-500/15 bg-accent-500/10 px-4 py-2.5 text-sm font-medium">
        {message}
      </div>
    </div>
  );
}
