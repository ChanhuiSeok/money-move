import { cn } from "@/lib/utils";

/* 서버/클라이언트 양쪽에서 쓰는 순수 스타일 헬퍼 ("use client" 아님).
   클릭 가능한 '타일'(빠른 이동·상황별·계산기·모의고사 목록 등)의 공용 룩을 한곳에서 정의해
   사이트 전반의 통일감을 만든다. 청크 UI: 아래 솔리드 엣지로 두께를 주고, 누르면 내려앉는다.
   연속 애니메이션은 없고 호버는 테두리/틴트로만 은은하게. */

export function tileVariants({ className }: { className?: string } = {}): string {
  return cn(
    "group relative flex rounded-card border border-border bg-surface " +
      "shadow-[0_3px_0_0_var(--edge-tile)] " +
      "transition-[transform,box-shadow,border-color,background-color] duration-100 " +
      "hover:border-brand-400 hover:bg-brand-500/[0.04] " +
      "active:translate-y-[2px] active:shadow-[0_1px_0_0_var(--edge-tile)] " +
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25",
    className,
  );
}
