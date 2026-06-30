"use client";

/** 퍼센트 입력 필드(소수 한 자리까지). value/onChange는 "3.5" 같은 문자열을 주고받는다. */
export function PercentField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  function handle(raw: string) {
    // 숫자와 점 하나만 허용.
    const cleaned = raw.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    onChange(cleaned);
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-muted">
        {label}
        {hint && <span className="ml-1 font-normal">· {hint}</span>}
      </label>
      <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20">
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => handle(e.target.value)}
          placeholder="0"
          className="h-12 w-full bg-transparent text-right text-lg font-bold tabular-nums outline-none"
        />
        <span className="shrink-0 text-muted">%</span>
      </div>
    </div>
  );
}
