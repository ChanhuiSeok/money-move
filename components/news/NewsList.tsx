"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatNewsDate, newsTopics, type NewsItem } from "@/lib/news";
import { cn } from "@/lib/utils";

/** 어떤 토픽의 결과인지까지 담는다. result.topic !== 선택 토픽이면 '로딩 중'으로 본다
   (effect 안 동기 setState 회피 — 로딩 상태를 파생값으로 계산). */
type Result = { topic: string; status: "ready" | "error"; items: NewsItem[] };

/** 오늘의 경제뉴스 목록. /api/news(서버 프록시)에서 받아 렌더한다.
   - withTopics: 주제 태그 버튼을 띄우고 토픽을 바꾼다.
   - numbered: 순위 번호(홈 카드용 '톱 뉴스' 느낌).
   - limit / showDescription: 개수 자르기 / 요약 노출. */
export function NewsList({
  limit,
  showDescription = false,
  numbered = false,
  withTopics = false,
  mixed = false,
}: {
  limit?: number;
  showDescription?: boolean;
  numbered?: boolean;
  withTopics?: boolean;
  /** 여러 주제를 섞은 최신 피드(홈 카드용). withTopics와 함께 쓰지 않는다. */
  mixed?: boolean;
}) {
  const [topic, setTopic] = useState(mixed ? "mixed" : "all");
  // 초기값의 topic은 어떤 선택과도 안 맞아 첫 렌더는 자동으로 로딩 표시.
  const [result, setResult] = useState<Result>({
    topic: "",
    status: "ready",
    items: [],
  });

  useEffect(() => {
    let alive = true;
    fetch(`/api/news?topic=${topic}`)
      .then((r) => r.json())
      .then((data: { items?: NewsItem[] }) => {
        if (alive) setResult({ topic, status: "ready", items: data.items ?? [] });
      })
      .catch(() => {
        if (alive) setResult({ topic, status: "error", items: [] });
      });
    return () => {
      alive = false;
    };
  }, [topic]);

  const synced = result.topic === topic; // 선택 토픽의 결과가 도착했나
  const loading = !synced;
  const error = synced && result.status === "error";
  const all = synced ? result.items : [];
  const items = limit ? all.slice(0, limit) : all;

  return (
    <div>
      {withTopics && (
        <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {newsTopics.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopic(t.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                topic === t.id
                  ? "bg-brand-600 text-white"
                  : "bg-subtle text-muted hover:bg-brand-500/10 hover:text-brand-600",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <ul className="flex flex-col gap-1">
          {Array.from({ length: limit ?? 6 }).map((_, i) => (
            <li key={i} className="flex flex-col gap-2 px-2 py-3">
              <div className="h-3.5 w-[85%] animate-pulse rounded bg-subtle" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-subtle" />
            </li>
          ))}
        </ul>
      ) : error || items.length === 0 ? (
        <p className="px-2 py-6 text-center text-sm text-muted">
          지금은 뉴스를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      ) : (
        <ul className="flex flex-col">
          {items.map((item, i) => (
            <li key={`${item.link}-${i}`}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group -mx-2 flex gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-brand-500/[0.06]"
              >
                {numbered && (
                  <span className="mt-0.5 w-5 shrink-0 text-center font-display text-lg font-bold tabular-nums text-brand-600/55">
                    {i + 1}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground transition-colors group-hover:text-brand-600">
                    {item.title}
                  </span>
                  {showDescription && item.description && (
                    <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted">
                      {item.description}
                    </span>
                  )}
                  <span className="mt-2 flex items-center gap-1 text-xs text-muted">
                    <Clock className="size-3" />
                    {formatNewsDate(item.pubDate)}
                  </span>
                </span>
              </a>
              {i < items.length - 1 && <div className="mx-2 h-px bg-border/50" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
