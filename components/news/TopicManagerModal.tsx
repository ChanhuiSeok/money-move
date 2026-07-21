"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Pencil,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  useNewsTopics,
  RECOMMENDED_KEYWORDS,
  type CustomNewsTopic,
} from "@/store/useNewsTopics";
import { buttonVariants } from "@/components/ui/buttonStyles";

interface TopicManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TopicManagerModal({ isOpen, onClose }: TopicManagerModalProps) {
  const topics = useNewsTopics((s) => s.topics);
  const addTopic = useNewsTopics((s) => s.addTopic);
  const removeTopic = useNewsTopics((s) => s.removeTopic);
  const reorderTopics = useNewsTopics((s) => s.reorderTopics);
  const resetTopics = useNewsTopics((s) => s.resetTopics);

  const [inputVal, setInputVal] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleAdd = (keyword: string) => {
    setErrorMsg("");
    const success = addTopic(keyword);
    if (success) {
      setInputVal("");
    } else {
      setErrorMsg("이미 존재하거나 올바르지 않은 키워드예요.");
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= topics.length) return;

    const nextList = [...topics];
    const temp = nextList[index];
    nextList[index] = nextList[targetIndex];
    nextList[targetIndex] = temp;

    reorderTopics(nextList);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Pencil className="size-5 text-brand-600" />
            <h2 className="text-lg font-extrabold text-foreground">
              뉴스 탭 설정 & 순서 편집
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-subtle text-muted hover:text-foreground active:scale-95 transition-all"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 나만의 키워드 추가 폼 */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-muted mb-1.5">
            관심 키워드 탭 추가
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd(inputVal);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="예: 미국주식, 청약, 엔화..."
              className="flex-1 min-w-0 rounded-xl border border-border/80 bg-subtle/50 px-3.5 py-2 text-sm font-semibold text-foreground placeholder:text-muted/60 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              className={buttonVariants({
                variant: "primary",
                size: "sm",
                className: "shrink-0 whitespace-nowrap gap-1 px-3 sm:px-4",
              })}
            >
              <Plus className="size-4" /> 추가
            </button>
          </form>
          {errorMsg && (
            <p className="mt-1.5 text-xs text-accent-600 font-semibold">
              {errorMsg}
            </p>
          )}
        </div>

        {/* 추천 키워드 태그 칩 */}
        <div className="mt-4">
          <p className="flex items-center gap-1 text-[11px] font-bold text-muted mb-2">
            <Sparkles className="size-3 text-brand-600" /> 추천 관심 키워드
          </p>
          <div className="flex flex-wrap gap-1.5">
            {RECOMMENDED_KEYWORDS.map((kw) => {
              const isAdded = topics.some((t) => t.label === kw);
              return (
                <button
                  key={kw}
                  type="button"
                  disabled={isAdded}
                  onClick={() => handleAdd(kw)}
                  className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
                    isAdded
                      ? "bg-subtle/50 text-muted/50 cursor-not-allowed border border-border/40"
                      : "border border-brand-500/30 bg-brand-500/10 text-brand-600 hover:bg-brand-500/20 active:scale-95"
                  }`}
                >
                  #{kw} {isAdded ? "✓" : "+"}
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 순서 및 삭제 목록 */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted">
              내 탭 순서 (위/아래 버튼으로 변경)
            </span>
            <button
              type="button"
              onClick={resetTopics}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-muted hover:text-brand-600 transition-colors"
            >
              <RotateCcw className="size-3" /> 탭 초기화
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
            {topics.map((t, idx) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-subtle/40 px-3 py-2 text-sm font-semibold transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-muted/60 tabular-nums w-4 text-center">
                    {idx + 1}
                  </span>
                  <span className="truncate text-foreground font-bold">
                    {t.label}
                  </span>
                  {t.isCustom && (
                    <span className="rounded bg-brand-500/15 px-1.5 py-0.5 text-[10px] font-extrabold text-brand-600">
                      MY
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    className="flex size-7 items-center justify-center rounded-lg border border-border/50 bg-surface text-muted hover:text-brand-600 disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-all"
                    title="위로 이동"
                  >
                    <ChevronUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === topics.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="flex size-7 items-center justify-center rounded-lg border border-border/50 bg-surface text-muted hover:text-brand-600 disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-all"
                    title="아래로 이동"
                  >
                    <ChevronDown className="size-3.5" />
                  </button>

                  {/* 삭제 버튼 (단, 최소 1개 이상일 때) */}
                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(t.id)}
                      className="flex size-7 items-center justify-center rounded-lg border border-border/50 bg-surface text-muted hover:bg-accent-500/10 hover:text-accent-600 active:scale-90 transition-all ml-1"
                      title="탭 삭제"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 완료 버튼 */}
        <div className="mt-5 border-t border-border/60 pt-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={buttonVariants({
              variant: "primary",
              size: "md",
              className: "w-full",
            })}
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
