import { cn } from "@/lib/utils";

// 서버/클라이언트 양쪽에서 쓰는 순수 스타일 헬퍼 ("use client" 아님).
// <Link> 등을 버튼처럼 보이게 할 때도 쓴다(중첩 인터랙티브 방지).

export type ButtonVariant = "primary" | "secondary" | "ghost" | "success";
export type ButtonSize = "sm" | "md" | "lg";

// 청크 UI — 버튼은 아래 '솔리드 엣지'로 두께를 갖고, 누르면 그만큼 내려앉는다(물성).
// 연속 애니메이션은 없고, 누름/포커스에만 짧게(100ms) 반응한다.
export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold " +
  "transition-[transform,box-shadow,background-color,border-color,color] duration-100 " +
  "focus-visible:outline-none focus-visible:ring-4 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0";

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_4px_0_0_var(--edge-brand)] hover:bg-brand-500 " +
    "active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--edge-brand)] focus-visible:ring-brand-500/30",
  secondary:
    "bg-surface text-brand-600 border border-border shadow-[0_3px_0_0_var(--edge-tile)] hover:border-brand-400 " +
    "active:translate-y-[2px] active:shadow-[0_1px_0_0_var(--edge-tile)] focus-visible:ring-brand-500/20",
  ghost:
    "bg-transparent text-foreground hover:bg-foreground/5 focus-visible:ring-foreground/10",
  success:
    "bg-success text-white shadow-[0_4px_0_0_var(--edge-success)] hover:brightness-105 " +
    "active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--edge-success)] focus-visible:ring-success/30",
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  return cn(
    buttonBase,
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}
