import { cn } from "@/lib/utils";

// 서버/클라이언트 양쪽에서 쓰는 순수 스타일 헬퍼 ("use client" 아님).
// <Link> 등을 버튼처럼 보이게 할 때도 쓴다(중첩 인터랙티브 방지).

export type ButtonVariant = "primary" | "secondary" | "ghost" | "success";
export type ButtonSize = "sm" | "md" | "lg";

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold " +
  "transition-[transform,background-color,border-color,color] duration-150 " +
  "active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:ring-brand-500/30",
  secondary:
    "bg-surface text-brand-600 border border-border hover:bg-subtle focus-visible:ring-brand-500/20",
  ghost:
    "bg-transparent text-foreground hover:bg-foreground/5 focus-visible:ring-foreground/10",
  success:
    "bg-success text-white shadow-sm hover:brightness-95 focus-visible:ring-success/30",
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
