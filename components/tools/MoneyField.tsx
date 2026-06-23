"use client";

import { onlyDigits } from "@/lib/format";

/** 금액 입력 필드(천단위 콤마 + 단위). value는 숫자만 담긴 문자열, onChange도 숫자 문자열을 준다. */
export function MoneyField({
  label,
  hint,
  value,
  onChange,
  suffix = "원",
  placeholder = "0",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (digits: string) => void;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-muted">
        {label}
        {hint && <span className="ml-1 font-normal">· {hint}</span>}
      </label>
      <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20">
        <input
          inputMode="numeric"
          value={value ? Number(value).toLocaleString("ko-KR") : ""}
          onChange={(e) => onChange(onlyDigits(e.target.value))}
          placeholder={placeholder}
          className="h-12 w-full bg-transparent text-right text-lg font-bold tabular-nums outline-none"
        />
        <span className="shrink-0 text-muted">{suffix}</span>
      </div>
    </div>
  );
}
