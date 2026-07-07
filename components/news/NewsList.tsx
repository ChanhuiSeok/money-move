"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";
import { formatNewsDate, newsTopics, type NewsItem } from "@/lib/news";
import { cn } from "@/lib/utils";

/** 어떤 토픽의 결과인지까지 담는다. result.topic !== 선택 토픽이면 '로딩 중'으로 본다
   (effect 안 동기 setState 회피 — 로딩 상태를 파생값으로 계산). */
type Result = { topic: string; status: "ready" | "error"; items: NewsItem[] };

const listV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const itemV: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 26 },
  },
};

/** 오늘의 경제뉴스 목록. /api/news(서버 프록시)에서 받아 렌더한다.
   - withTopics: 주제 태그 버튼. mixed: 여러 주제 섞은 피드(홈).
   - numbered: 순위 배지. limit / showDescription: 개수 / 요약. */
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
  mixed?: boolean;
}) {
  const [topic, setTopic] = useState(mixed ? "mixed" : "all");
  const [result, setResult] = useState<Result>({
    topic: "",
    status: "ready",
    items: [],
  });

  useEffect(() => {
    let alive = true;
    fetch(`/api/news?topic=${topic}`, { cache: "no-store" })
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

  const synced = result.topic === topic;
  const loading = !synced;
  const error = synced && result.status === "error";
  const all = synced ? result.items : [];
  const items = limit ? all.slice(0, limit) : all;

  return (
    <div>
      {withTopics && (
        <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {newsTopics.map((t) => {
            const active = topic === t.id;
            return (
              <motion.button
                key={t.id}
                type="button"
                onClick={() => setTopic(t.id)}
                whileTap={{ scale: 0.93 }}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors",
                  active
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-500/30"
                    : "bg-subtle text-muted hover:bg-brand-500/10 hover:text-brand-600",
                )}
              >
                {t.label}
              </motion.button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="divide-y divide-border/60">
          {Array.from({ length: limit ?? 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              {numbered && (
                <div className="size-6 shrink-0 animate-pulse rounded-full bg-subtle" />
              )}
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-[88%] animate-pulse rounded bg-subtle" />
                <div className="h-2.5 w-16 animate-pulse rounded bg-subtle" />
              </div>
            </div>
          ))}
        </div>
      ) : error || items.length === 0 ? (
        <p className="px-2 py-8 text-center text-sm text-muted">
          지금은 뉴스를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      ) : (
        <motion.ul
          key={topic}
          variants={listV}
          initial="hidden"
          animate="show"
          className="divide-y divide-border/60"
        >
          {items.map((item, i) => (
            <motion.li key={`${item.link}-${i}`} variants={itemV}>
              <motion.a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.985 }}
                className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-subtle/70"
              >
                {numbered && (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-xs font-bold tabular-nums text-brand-600">
                    {i + 1}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
                    {item.title}
                  </span>
                  {showDescription && item.description && (
                    <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted">
                      {item.description}
                    </span>
                  )}
                  <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-muted">
                    <Clock className="size-3" />
                    {formatNewsDate(item.pubDate)}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted/60 transition-colors group-hover:text-brand-600" />
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
