"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Stepper } from "@/components/ui/Stepper";
import {
  RATE_YEAR,
  insuranceRates,
  localIncomeTaxRate,
} from "@/content/rates";
import { formatPercent, formatWon, onlyDigits } from "@/lib/format";
import { hasProfile } from "@/lib/profile";
import type { Profile } from "@/lib/schema";
import { estimateTakeHome } from "@/lib/takehome";
import { cn } from "@/lib/utils";
import { useProfile } from "@/store/useProfile";

const RELATED = [
  { id: "payslip-basics", label: "월급명세서 읽기" },
  { id: "four-insurances", label: "4대 보험이 뭐예요?" },
  { id: "deduction-vs-credit", label: "소득공제 vs 세액공제" },
];

type Inputs = {
  period: "month" | "year";
  amount: string;
  nontax: string;
  dependents: number;
  children: number;
};

function seedFrom(profile: Profile): Inputs {
  if (!hasProfile(profile)) {
    return { period: "month", amount: "", nontax: "200000", dependents: 1, children: 0 };
  }
  return {
    period: profile.period,
    amount: String(profile.amount),
    nontax: String(profile.monthlyNontax),
    dependents: profile.dependents,
    children: profile.children,
  };
}

export default function TakeHomePage() {
  const hydrate = useProfile((s) => s.hydrate);
  const hydrated = useProfile((s) => s.hydrated);
  const profile = useProfile((s) => s.profile);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // hydrate 전엔 빈 값, 후엔 프로필로 seed해 remount(setState-in-effect 회피).
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      <BackLink href="/tools" label="계산기" className="mb-3" />
      <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-3xl">
        실수령액 계산기
      </h1>
      <p className="mt-1 text-sm text-muted">
        세전 월급/연봉을 넣으면, 4대 보험·소득세를 빼고 통장에 들어올 금액을 추정해요.
      </p>

      <MascotBubble
        variant="study"
        message={
          hydrated && hasProfile(profile)
            ? "내 프로필로 채워뒀어요. 바꿔봐도 좋아요!"
            : "대략 얼마 들어올지 같이 가늠해봐요!"
        }
        className="mt-4"
        size="lg"
      />

      <Calculator key={hydrated ? "ready" : "empty"} initial={seedFrom(profile)} />
    </main>
  );
}

function Calculator({ initial }: { initial: Inputs }) {
  const [period, setPeriod] = useState(initial.period);
  const [amount, setAmount] = useState(initial.amount);
  const [dependents, setDependents] = useState(initial.dependents);
  const [children, setChildren] = useState(initial.children);
  const [nontax, setNontax] = useState(initial.nontax);

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
    <>
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
    </>
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
