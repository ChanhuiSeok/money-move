"use client";

import { formatWon, onlyDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

/** 연말정산 항목 한 줄 — 라벨(+설명 툴팁) · 금액 입력 · 적용 결과.
   value/onChange는 숫자로 주고받는다(천단위 콤마는 내부에서 처리). */
export function ItemMoneyRow({
  label,
  tooltip,
  value,
  onChange,
  effect,
  effectPrefix = "공제",
  placeholder = "0",
}: {
  label: string;
  tooltip?: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  /** 이 항목이 만들어 낸 공제/절세 금액(0보다 크면 표시). */
  effect?: number;
  effectPrefix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <span className="truncate text-sm font-medium">{label}</span>
          {tooltip && <Tooltip>{tooltip}</Tooltip>}
        </div>
        {effect != null && effect > 0 && (
          <p className="mt-0.5 text-[11px] font-semibold text-success">
            {effectPrefix} {formatWon(effect)}
          </p>
        )}
      </div>
      <div
        className={cn(
          "flex w-32 shrink-0 items-center gap-1 rounded-lg border border-border bg-surface px-3",
          "focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20",
        )}
      >
        <input
          inputMode="numeric"
          value={value ? value.toLocaleString("ko-KR") : ""}
          onChange={(e) => onChange(Number(onlyDigits(e.target.value)))}
          placeholder={placeholder}
          className="h-9 w-full bg-transparent text-right text-sm font-bold tabular-nums outline-none"
        />
        <span className="shrink-0 text-xs text-muted">원</span>
      </div>
    </div>
  );
}
