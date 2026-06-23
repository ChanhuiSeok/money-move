import { formatWon } from "@/lib/format";
import { cn } from "@/lib/utils";

/** 결과 표의 한 줄. 음수면 "− 1,000원"으로 표시한다. */
export function ResultRow({
  label,
  hint,
  value,
  strong,
  muted,
}: {
  label: string;
  hint?: string;
  value: number;
  strong?: boolean;
  muted?: boolean;
}) {
  const negative = value < 0;
  return (
    <div className="flex items-center justify-between">
      <span className={cn(strong ? "font-bold" : "text-muted")}>
        {label}
        {hint && (
          <span className="ml-1.5 text-xs font-normal text-muted/70">{hint}</span>
        )}
      </span>
      <span
        className={cn(
          "tabular-nums",
          strong && "text-base font-bold",
          muted && "text-muted",
          negative && !muted && "text-foreground/70",
        )}
      >
        {negative ? `− ${formatWon(-value)}` : formatWon(value)}
      </span>
    </div>
  );
}

export function ResultDivider() {
  return <div className="my-1 h-px bg-border" />;
}
