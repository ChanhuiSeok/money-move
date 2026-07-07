"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Lock, Search } from "lucide-react";
import { MascotImage } from "@/components/mascot/MascotImage";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { glossaryTerms } from "@/content/glossary";
import { allLessons } from "@/content/lessons";
import { filterTerms, learnedTermIds, normalizeQuery } from "@/lib/glossary";
import type { GlossaryTerm } from "@/lib/schema";
import { useProgress } from "@/store/useProgress";

export function GlossaryBook() {
  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const progress = useProgress((s) => s.progress);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const [query, setQuery] = useState("");

  const learnedSet = hydrated
    ? learnedTermIds(progress.completedLessonIds, allLessons)
    : new Set<string>();
  const searching = normalizeQuery(query) !== "";
  const filtered = filterTerms(glossaryTerms, query);
  const learned = filtered.filter((t) => learnedSet.has(t.id));
  const notYet = filtered.filter((t) => !learnedSet.has(t.id));

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      <BackLink className="mb-3" />
      <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-4xl">
        용어 사전
      </h1>
      <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
        레슨에서 만난 용어를 한곳에 모았어요.{" "}
        {hydrated && `${learnedSet.size}개 배웠어요.`}
      </p>

      {/* 검색 */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20">
        <Search className="size-4 shrink-0 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="용어 검색 (예: 소득세)"
          className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted"
        />
      </div>

      {!hydrated ? (
        <p className="mt-8 text-center text-sm text-muted">불러오는 중…</p>
      ) : (
        <>
          {/* 내가 배운 용어 */}
          <section className="mt-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-brand-600">
              <BookOpen className="size-4" /> 내가 배운 용어
              <span className="text-muted">({learned.length})</span>
            </h2>

            {learned.length > 0 ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {learned.map((t) => (
                  <TermCard key={t.id} term={t} />
                ))}
              </div>
            ) : (
              <EmptyLearned searching={searching} />
            )}
          </section>

          {/* 아직 안 배운 용어 */}
          {notYet.length > 0 && (
            <section className="mt-7">
              <h2 className="flex items-center gap-2 text-sm font-bold text-muted">
                <Lock className="size-3.5" /> 아직 만나지 않은 용어
                <span>({notYet.length})</span>
              </h2>
              <p className="mt-1 text-xs text-muted">
                레슨에서 맥락과 함께 한 입씩 배워요.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {notYet.map((t) =>
                  searching ? (
                    // 검색 중엔 찾으려는 의도가 분명하니 설명을 보여준다.
                    <TermCard key={t.id} term={t} dimmed />
                  ) : (
                    <LockedTerm key={t.id} term={t} />
                  )
                )}
              </div>
            </section>
          )}

          {searching && learned.length === 0 && notYet.length === 0 && (
            <p className="mt-8 text-center text-sm text-muted">
              ‘{query}’에 맞는 용어가 없어요.
            </p>
          )}
        </>
      )}
    </main>
  );
}

function TermCard({ term, dimmed }: { term: GlossaryTerm; dimmed?: boolean }) {
  return (
    <Card padding="md" className={dimmed ? "opacity-80" : undefined}>
      <p className="text-base font-bold">{term.term}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{term.short}</p>
      {term.full && (
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
          {term.full}
        </p>
      )}
    </Card>
  );
}

function LockedTerm({ term }: { term: GlossaryTerm }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted">
      <Lock className="size-3.5 shrink-0" />
      <span className="font-semibold">{term.term}</span>
    </div>
  );
}

function EmptyLearned({ searching }: { searching: boolean }) {
  if (searching) {
    return (
      <p className="mt-3 text-sm text-muted">배운 용어 중엔 결과가 없어요.</p>
    );
  }
  return (
    <Card padding="lg" className="mt-3 text-center">
      <MascotImage variant="study" className="mx-auto w-20" />
      <p className="mt-3 text-sm font-semibold">아직 배운 용어가 없어요.</p>
      <p className="mt-1 text-sm text-muted">
        첫 레슨을 끝내면 여기에 하나씩 쌓여요.
      </p>
      <Link
        href="/learn"
        className={buttonVariants({ size: "lg", className: "mt-4" })}
      >
        학습 시작하기
      </Link>
    </Card>
  );
}
