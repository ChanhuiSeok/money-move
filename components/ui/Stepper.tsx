"use client";

/** −/+ 로 정수를 조절하는 공용 스테퍼. (부양가족 수·자녀 수 등) */
export function Stepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="줄이기"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex size-8 items-center justify-center rounded-full border border-border text-lg font-bold text-muted transition-colors hover:bg-subtle disabled:opacity-40"
        disabled={value <= min}
      >
        −
      </button>
      <span className="w-5 text-center font-bold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="늘리기"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex size-8 items-center justify-center rounded-full border border-border text-lg font-bold text-muted transition-colors hover:bg-subtle disabled:opacity-40"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
