"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ChevronRight, Clock, Pencil } from "lucide-react";
import { formatNewsDate, type NewsItem } from "@/lib/news";
import { useNewsTopics } from "@/store/useNewsTopics";
import { TopicManagerModal } from "@/components/news/TopicManagerModal";
import { cn } from "@/lib/utils";

type Result = { activeId: string; status: "ready" | "error"; items: NewsItem[] };

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
   - withTopics: 주제 태그 버튼 & 우측 고정 탭 편집 버튼.
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
  const topics = useNewsTopics((s) => s.topics);
  const hydrateTopics = useNewsTopics((s) => s.hydrate);

  const [activeId, setActiveId] = useState<string>(mixed ? "mixed" : "stock");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState<Result>({
    activeId: "",
    status: "ready",
    items: [],
  });

  useEffect(() => {
    hydrateTopics();
  }, [hydrateTopics]);

  useEffect(() => {
    if (
      topics.length > 0 &&
      !topics.some((t) => t.id === activeId) &&
      activeId !== "mixed"
    ) {
      setActiveId(topics[0].id);
    }
  }, [topics, activeId]);

  const activeTopicObj = topics.find((t) => t.id === activeId);

  useEffect(() => {
    let alive = true;
    let url = `/api/news?topic=${activeId}`;

    if (activeTopicObj?.query) {
      url = `/api/news?query=${encodeURIComponent(activeTopicObj.query)}`;
    }

    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { items?: NewsItem[] }) => {
        if (alive) setResult({ activeId, status: "ready", items: data.items ?? [] });
      })
      .catch(() => {
        if (alive) setResult({ activeId, status: "error", items: [] });
      });
    return () => {
      alive = false;
    };
  }, [activeId, activeTopicObj]);

  const synced = result.activeId === activeId;
  const loading = !synced;
  const error = synced && result.status === "error";
  const all = synced ? result.items : [];
  const items = limit ? all.slice(0, limit) : all;

  return (
    <div>
      {withTopics && (
        <>
          {/* 겹침 없는 깔끔한 Flex 레이아웃 (좌측: 탭 스크롤 영역, 우측: 고정 독립 편집 구역) */}
          <div className="mb-3.5 flex items-center justify-between gap-2">
            {/* 가로 스크롤 탭 목록 영역 (PC 마우스 휠 가로 스크롤 연동) */}
            <div
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
              className="no-scrollbar lg:custom-scrollbar flex flex-1 min-w-0 items-center gap-1.5 overflow-x-auto scroll-smooth py-0.5"
            >
              {topics.map((t) => {
                const active = activeId === t.id;
                return (
                  <motion.button
                    key={t.id}
                    type="button"
                    onClick={(e) => {
                      setActiveId(t.id);
                      e.currentTarget.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center",
                      });
                    }}
                    whileTap={{ scale: 0.93 }}
                    className={cn(
                      "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold lg:px-4 lg:py-2 lg:text-sm transition-colors flex items-center gap-1 lg:gap-1.5",
                      active
                        ? "bg-brand-600 text-white shadow-sm shadow-brand-500/30"
                        : "bg-subtle text-muted hover:bg-brand-500/10 hover:text-brand-600"
                    )}
                  >
                    {t.label}
                    {t.isCustom && (
                      <span className="text-[9px] lg:text-[10px] opacity-90 font-extrabold bg-white/20 dark:bg-black/30 px-1 rounded">
                        MY
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* 오른쪽 일정 구역을 항상 단단하게 차지하는 독립 편집 버튼 */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="shrink-0 flex items-center gap-1 lg:gap-1.5 rounded-full bg-brand-500/10 px-3.5 py-1.5 text-xs font-bold lg:px-4 lg:py-2 lg:text-sm text-brand-600 hover:bg-brand-500/20 active:scale-95 transition-all"
              title="관심 키워드 탭 추가 및 순서 편집"
            >
              <Pencil className="size-3.5 lg:size-4 shrink-0" />
              <span>편집</span>
            </button>
          </div>

          <TopicManagerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}

      {loading ? (
        <div className="divide-y divide-border/60 min-h-[320px]">
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
          key={activeId}
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
