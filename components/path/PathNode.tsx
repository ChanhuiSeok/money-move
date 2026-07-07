"use client";

import Link from "next/link";
import { Check, Play } from "lucide-react";
import { MascotImage } from "@/components/mascot/MascotImage";
import type { NodeState } from "@/lib/path";
import { cn } from "@/lib/utils";

/** 학습 경로의 레슨 노드. 완료=체크, 현재=강조(맥동), 예정=흐리지만 열 수 있음.
   소프트 언락: 모든 노드가 탭 가능하고, 상태는 '어디까지 했는지' 안내용일 뿐이다. */
export function PathNode({
  id,
  title,
  state,
}: {
  id: string;
  title: string;
  state: NodeState;
}) {
  const upcoming = state === "upcoming";

  const circle = (
    <span className="relative inline-flex">
      {state === "current" && (
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/25" />
      )}
      <span
        className={cn(
          "relative flex size-16 items-center justify-center rounded-full border-2 transition-colors",
          state === "completed" && "border-brand-600 bg-brand-600 text-white",
          state === "current" &&
            "border-brand-600 bg-surface text-brand-600 shadow-md shadow-brand-500/25",
          upcoming && "border-border bg-subtle text-muted/70",
        )}
      >
        {state === "completed" ? (
          <Check className="size-7" />
        ) : (
          <Play
            className={cn(
              "size-6 translate-x-0.5",
              state === "current" ? "fill-current" : "fill-current opacity-60",
            )}
          />
        )}
      </span>
    </span>
  );

  const label = (
    <span
      className={cn(
        "mt-2 max-w-[11rem] text-center text-sm font-semibold leading-tight",
        upcoming ? "text-muted" : "text-foreground",
      )}
    >
      {title}
    </span>
  );

  return (
    <Link
      href={`/learn/${id}`}
      aria-label={`${title} 레슨 ${state === "completed" ? "다시 풀기" : "시작하기"}`}
      className="flex flex-col items-center rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
    >
      {/* 현재 위치 표시 — 마스코트가 이 레슨을 향해 달려요 */}
      {state === "current" && (
        <MascotImage variant="run" className="-mb-1 w-10 drop-shadow-sm" />
      )}
      {circle}
      {label}
    </Link>
  );
}
