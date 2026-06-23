import Link from "next/link";
import { Card } from "@/components/ui/Card";

/** "이 숫자가 왜?" → 관련 레슨으로 잇는 카드. 배운 걸 바로 써먹게. */
export function RelatedLessons({
  title = "이 숫자가 왜 이렇게 나와요?",
  items,
}: {
  title?: string;
  items: { id: string; label: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <Card padding="md" className="mt-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted">관련 레슨에서 한 입씩 풀어봐요.</p>
      <div className="mt-3 flex flex-col gap-2">
        {items.map((r) => (
          <Link
            key={r.id}
            href={`/learn/${r.id}`}
            className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-brand-400 hover:bg-brand-500/5"
          >
            <span>{r.label}</span>
            <span className="text-brand-600">→</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
