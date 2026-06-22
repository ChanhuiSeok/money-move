"use client";

import Link from "next/link";
import { useState } from "react";
import { Info } from "lucide-react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import {
  RATE_YEAR,
  insuranceRates,
  localIncomeTaxRate,
} from "@/content/rates";
import { formatPercent, formatWon, onlyDigits } from "@/lib/format";
import { estimateTakeHome } from "@/lib/takehome";
import { cn } from "@/lib/utils";

const RELATED = [
  { id: "payslip-basics", label: "월급명세서 읽기" },
  { id: "four-insurances", label: "4대 보험이 뭐예요?" },
  { id: "deduction-vs-credit", label: "소득공제 vs 세액공제" },
];

export default function TakeHomePage() {
  const [period, setPeriod] = useState<"month" | "year">("month");
  const [amount, setAmount] = useState("");
  const [dependents, setDependents] = useState(1);
  const [children, setChildren] = useState(0); // 20세 이하 자녀 수
  const [nontax, setNontax] = useState("200000"); // 비과세(월) — 보통 식대 20만

  // 자녀는 본인을 뺀 부양가족 수까지만.
  const maxChildren = Math.max(0, dependents - 1);
  const childrenClamped = Math.min(children, maxChildren);

  function handleDependents(v: number) {
    setDependents(v);
    setChildren((c) => Math.min(c, Math.max(0, v - 1)));
  }

  const num = Number(amount || "0");
  const annualGross = period === "month" ? num * 12 : num;
  const annualNontax = Number(nontax || "0") * 12;
  const result =
    num > 0
      ? estimateTakeHome(annualGross, dependents, annualNontax, childrenClamped)
      : null;

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6">
      <BackLink className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">실수령액 계산기</h1>
      <p className="mt-1 text-sm text-muted">
        세전 월급/연봉을 넣으면, 4대 보험·소득세를 빼고 통장에 들어올 금액을 추정해요.
      </p>

      <MascotBubble
        mood="idle"
        message="대략 얼마 들어올지 같이 가늠해봐요!"
        className="mt-4"
      />

      {/* 입력 */}
      <Card padding="md" className="mt-4">
        <div className="inline-flex rounded-xl bg-subtle p-1">
          {(["month", "year"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
                period === p
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted",
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
          비과세액 (월){" "}
          <span className="font-normal">· 보통 식대 20만원</span>
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
            부양가족 수{" "}
            <span className="font-normal">(본인 포함)</span>
          </span>
          <Stepper
            value={dependents}
            onChange={handleDependents}
            min={1}
            max={10}
          />
        </div>

        {maxChildren > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">
              자녀 수 <span className="font-normal">(만 8~20세, 2026 기준)</span>
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

      {/* 결과 */}
      {result && (
        <Card highlight padding="lg" className="mt-4">
          <p className="text-sm font-semibold text-brand-600">월 실수령액 (추정)</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            {formatWon(result.net)}
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <Row label="세전 월급" value={result.monthlyGross} />
            <Divider />
            <Row
              label="국민연금"
              hint={formatPercent(insuranceRates.nationalPension)}
              value={-result.nationalPension}
            />
            <Row
              label="건강보험"
              hint={formatPercent(insuranceRates.healthInsurance)}
              value={-result.healthInsurance}
            />
            <Row
              label="장기요양보험"
              hint={`건강보험료의 ${formatPercent(insuranceRates.longTermCareOfHealth)}`}
              value={-result.longTermCare}
            />
            <Row
              label="고용보험"
              hint={formatPercent(insuranceRates.employment)}
              value={-result.employment}
            />
            <Row label="소득세" hint="간이세액 추정" value={-result.incomeTax} />
            <Row
              label="지방소득세"
              hint={`소득세의 ${formatPercent(localIncomeTaxRate)}`}
              value={-result.localIncomeTax}
            />
            <Divider />
            <Row label="공제 합계" value={-result.totalDeduction} muted />
            <Row label="실수령액" value={result.net} strong />
          </div>
        </Card>
      )}

      {/* 이 숫자가 왜? */}
      <Card padding="md" className="mt-4">
        <p className="text-sm font-semibold">이 숫자가 왜 이렇게 나와요?</p>
        <p className="mt-1 text-sm text-muted">관련 레슨에서 한 입씩 풀어봐요.</p>
        <div className="mt-3 flex flex-col gap-2">
          {RELATED.map((r) => (
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

      {/* 안내 */}
      <div className="mt-4 flex gap-2 rounded-xl bg-subtle p-4 text-xs leading-relaxed text-muted">
        <Info className="size-4 shrink-0 translate-y-0.5" />
        <p>
          {RATE_YEAR}년 기준 요율로 계산한 <b>추정치예요.</b> 비과세 수당·부양가족
          상세·각종 공제에 따라 실제 금액은 달라져요. 정확한 금액은 회사(급여
          담당)·국세청·4대 보험 기관에서 확인하세요.
        </p>
      </div>
    </main>
  );
}

function Row({
  label,
  hint,
  value,
  strong,
  muted,
}: {
  label: string;
  hint?: string;
  value: number;
  strong?: boolean;
  muted?: boolean;
}) {
  const negative = value < 0;
  return (
    <div className="flex items-center justify-between">
      <span className={cn(strong ? "font-bold" : "text-muted")}>
        {label}
        {hint && (
          <span className="ml-1.5 text-xs font-normal text-muted/70">
            {hint}
          </span>
        )}
      </span>
      <span
        className={cn(
          "tabular-nums",
          strong && "text-base font-bold",
          muted && "text-muted",
          negative && !muted && "text-foreground/70",
        )}
      >
        {negative ? `− ${formatWon(-value)}` : formatWon(value)}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="my-1 h-px bg-border" />;
}

function Stepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="줄이기"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex size-8 items-center justify-center rounded-full border border-border text-lg font-bold text-muted transition-colors hover:bg-subtle disabled:opacity-40"
        disabled={value <= min}
      >
        −
      </button>
      <span className="w-5 text-center font-bold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="늘리기"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex size-8 items-center justify-center rounded-full border border-border text-lg font-bold text-muted transition-colors hover:bg-subtle disabled:opacity-40"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
