"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Compass,
  GraduationCap,
  Search,
  type LucideIcon,
} from "lucide-react";
import { BackLink } from "@/components/ui/BackLink";
import { tileVariants } from "@/components/ui/tileStyles";
import { search, type SearchHit, type SearchKind } from "@/lib/search";

const KIND_META: Record<SearchKind, { label: string; icon: LucideIcon }> = {
  lesson: { label: "레슨", icon: GraduationCap },
  tool: { label: "계산기", icon: Calculator },
  term: { label: "용어", icon: BookOpen },
  scenario: { label: "상황별 시작", icon: Compass },
};

const KIND_ORDER: SearchKind[] = ["lesson", "tool", "term", "scenario"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const hits = search(query);
  const trimmed = query.trim();

  const grouped = KIND_ORDER.map((kind) => ({
    kind,
    items: hits.filter((h) => h.kind === kind),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      <BackLink className="mb-3" />
      <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-4xl">
        검색
      </h1>
      <p className="mt-1 text-sm text-muted">
        레슨·계산기·용어·상황을 한 번에 찾아요.
      </p>

      {/* 검색 입력 */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20">
        <Search className="size-5 shrink-0 text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 연말정산, 전세, ETF, 비상금"
          className="h-12 w-full bg-transparent text-base outline-none"
        />
      </div>

      {/* 결과 */}
      {trimmed.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          궁금한 단어를 입력해 보세요.
        </p>
      ) : grouped.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          ‘{trimmed}’에 대한 결과가 없어요. 다른 단어로 찾아볼까요?
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {grouped.map((group) => {
            const meta = KIND_META[group.kind];
            return (
              <section key={group.kind}>
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-muted">
                  <meta.icon className="size-4" /> {meta.label}
                  <span className="font-normal">· {group.items.length}</span>
                </h2>
                <div className="mt-2 flex flex-col gap-2">
                  {group.items.map((hit) => (
                    <HitRow key={`${hit.kind}-${hit.href}-${hit.title}`} hit={hit} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

function HitRow({ hit }: { hit: SearchHit }) {
  return (
    <Link href={hit.href} className={tileVariants({ className: "items-center gap-3 p-4" })}>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{hit.title}</span>
        <span className="block truncate text-xs text-muted">{hit.sub}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted" />
    </Link>
  );
}
