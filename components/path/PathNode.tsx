"use client";

import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import type { NodeState } from "@/lib/path";
import { cn } from "@/lib/utils";

/** 학습 경로의 레슨 노드. 완료=체크, 현재=강조(맥동), 잠김=자물쇠. */
export function PathNode({
  id,
  title,
  state,
}: {
  id: string;
  title: string;
  state: NodeState;
}) {
  const locked = state === "locked";

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
          locked && "border-border bg-subtle text-muted",
        )}
      >
        {state === "completed" ? (
          <Check className="size-7" />
        ) : locked ? (
          <Lock className="size-6" />
        ) : (
          <Play className="size-6 translate-x-0.5 fill-current" />
        )}
      </span>
    </span>
  );

  const label = (
    <span
      className={cn(
        "mt-2 max-w-[11rem] text-center text-sm font-semibold leading-tight",
        locked ? "text-muted" : "text-foreground",
      )}
    >
      {title}
    </span>
  );

  if (locked) {
    return (
      <div
        aria-disabled
        title="앞 레슨을 끝내면 열려요"
        className="flex cursor-not-allowed flex-col items-center"
      >
        {circle}
        {label}
      </div>
    );
  }

  return (
    <Link
      href={`/learn/${id}`}
      aria-label={`${title} 레슨 ${state === "completed" ? "다시 풀기" : "시작하기"}`}
      className="flex flex-col items-center rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
    >
      {circle}
      {label}
    </Link>
  );
}
