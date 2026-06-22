import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 더 도드라지게(현재 학습 카드 등) */
  highlight?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddings = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/** 둥글고 부드러운 공용 카드 표면. */
export function Card({
  className,
  highlight,
  padding = "md",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-surface",
        paddings[padding],
        highlight
          ? "border border-brand-500/40 ring-1 ring-brand-500/15 shadow-sm"
          : "border border-border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
