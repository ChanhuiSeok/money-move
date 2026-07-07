import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 더 도드라지게(현재 학습 카드 등) — 브랜드 테두리 + 링 */
  highlight?: boolean;
  /** 클릭 가능한 타일처럼 — 아래 솔리드 엣지 + 호버/누름 반응(청크 UI) */
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-7 sm:p-8",
};

/** 둥글고 도톰한 공용 카드 표면.
 *  정적 카드는 은은한 2겹 그림자(var(--shadow-card))로 흰 배경 위에서도 또렷하게 뜨고,
 *  interactive 카드는 대신 아래 솔리드 엣지를 둬 '누를 수 있는 타일'처럼 보인다(box-shadow 충돌 방지 위해 택일). */
export function Card({
  className,
  highlight,
  interactive,
  padding = "md",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border-2 bg-surface",
        paddings[padding],
        highlight ? "border-brand-500/50" : "border-border",
        interactive
          ? "transition-[border-color,background-color] duration-100 hover:border-brand-400 hover:bg-brand-500/[0.04]"
          : "",
        className,
      )}
      {...props}
    />
  );
}
