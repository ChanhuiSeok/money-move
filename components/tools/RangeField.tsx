"use client";

import { formatWon } from "@/lib/format";

/** 금액을 드래그로 조절하는 슬라이더(range) 입력. 현재 값을 우측에 크게 보여준다. */
export function RangeField({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max,
  step = 10_000,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  step?: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-sm font-semibold text-muted">
          {label}
          {hint && <span className="ml-1 font-normal">· {hint}</span>}
        </label>
        <span className="shrink-0 text-sm font-bold tabular-nums text-brand-600">
          {formatWon(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand-500"
        aria-label={label}
      />
    </div>
  );
}
