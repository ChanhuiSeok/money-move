"use client";

import { useState } from "react";
import type { Profile } from "@/lib/schema";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stepper } from "@/components/ui/Stepper";
import { onlyDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

/** 내 급여·가족 상황을 입력받아 Profile로 저장한다.
   실수령액 계산기와 같은 입력 묶음(기간·급여·비과세·부양가족·자녀)을 한곳에서. */
export function ProfileForm({
  initial,
  onSave,
  submitLabel = "저장하기",
}: {
  initial: Profile;
  onSave: (profile: Profile) => void;
  submitLabel?: string;
}) {
  const [period, setPeriod] = useState<Profile["period"]>(initial.period);
  const [amount, setAmount] = useState(initial.amount ? String(initial.amount) : "");
  const [nontax, setNontax] = useState(String(initial.monthlyNontax));
  const [dependents, setDependents] = useState(initial.dependents);
  const [children, setChildren] = useState(initial.children);

  // 자녀는 본인을 뺀 부양가족 수까지만.
  const maxChildren = Math.max(0, dependents - 1);
  const childrenClamped = Math.min(children, maxChildren);

  function handleDependents(v: number) {
    setDependents(v);
    setChildren((c) => Math.min(c, Math.max(0, v - 1)));
  }

  const amountNum = Number(amount || "0");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      period,
      amount: amountNum,
      monthlyNontax: Number(nontax || "0"),
      dependents,
      children: childrenClamped,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card padding="md">
        <div className="inline-flex rounded-xl bg-subtle p-1">
          {(["month", "year"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
                period === p ? "bg-surface text-foreground shadow-sm" : "text-muted",
              )}
            >
              {p === "month" ? "월급" : "연봉"}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-sm font-semibold text-muted">
          세전 {period === "month" ? "월급" : "연봉"}
        </label>
        <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20">
          <input
            inputMode="numeric"
            value={amount ? Number(amount).toLocaleString("ko-KR") : ""}
            onChange={(e) => setAmount(onlyDigits(e.target.value))}
            placeholder="0"
            className="h-12 w-full bg-transparent text-right text-lg font-bold tabular-nums outline-none"
          />
          <span className="text-muted">원</span>
        </div>

        <label className="mt-4 block text-sm font-semibold text-muted">
          비과세액 (월) <span className="font-normal">· 보통 식대 20만원</span>
        </label>
        <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20">
          <input
            inputMode="numeric"
            value={nontax ? Number(nontax).toLocaleString("ko-KR") : ""}
            onChange={(e) => setNontax(onlyDigits(e.target.value))}
            placeholder="0"
            className="h-12 w-full bg-transparent text-right text-lg font-bold tabular-nums outline-none"
          />
          <span className="text-muted">원</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-muted">
            부양가족 수 <span className="font-normal">(본인 포함)</span>
          </span>
          <Stepper value={dependents} onChange={handleDependents} min={1} max={10} />
        </div>

        {maxChildren > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">
              자녀 수 <span className="font-normal">(만 8~20세)</span>
            </span>
            <Stepper
              value={childrenClamped}
              onChange={setChildren}
              min={0}
              max={maxChildren}
            />
          </div>
        )}
      </Card>

      <Button type="submit" size="lg" fullWidth className="mt-4" disabled={amountNum <= 0}>
        {submitLabel}
      </Button>
    </form>
  );
}
