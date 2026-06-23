import { Info } from "lucide-react";

/** 계산기 하단 "추정치" 안내. 불변 원칙: 계산기는 항상 추정치임을 알린다. */
export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex gap-2 rounded-xl bg-subtle p-4 text-xs leading-relaxed text-muted">
      <Info className="size-4 shrink-0 translate-y-0.5" />
      <p>{children}</p>
    </div>
  );
}
