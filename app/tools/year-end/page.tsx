"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/tools/Disclaimer";
import { MoneyField } from "@/components/tools/MoneyField";
import { RelatedLessons } from "@/components/tools/RelatedLessons";
import { ResultDivider, ResultRow } from "@/components/tools/ResultRow";
import { Stepper } from "@/components/tools/Stepper";
import { RATE_YEAR } from "@/content/rates";
import { formatWon } from "@/lib/format";
import { estimateYearEnd } from "@/lib/yearend";
import { cn } from "@/lib/utils";

const RELATED = [
  { id: "year-end-tax", label: "연말정산이 뭐예요?" },
  { id: "deduction-vs-credit", label: "소득공제 vs 세액공제" },
];

export default function YearEndPage() {
  const [period, setPeriod] = useState<"month" | "year">("year");
  const [amount, setAmount] = useState("");
  const [nontax, setNontax] = useState("200000");
  const [dependents, setDependents] = useState(1);
  const [children, setChildren] = useState(0);
  const [extraDeduction, setExtraDeduction] = useState("");
  const [extraCredit, setExtraCredit] = useState("");

  const maxChildren = Math.max(0, dependents - 1);
  const childrenClamped = Math.min(children, maxChildren);

  function handleDependents(v: number) {
    setDependents(v);
    setChildren((c) => Math.min(c, Math.max(0, v - 1)));
  }

  const num = Number(amount || "0");
  const annualGross = period === "month" ? num * 12 : num;
  const result =
    num > 0
      ? estimateYearEnd({
          annualGross,
          dependents,
          children: childrenClamped,
          annualNontax: Number(nontax || "0") * 12,
          extraDeduction: Number(extraDeduction || "0"),
          extraCredit: Number(extraCredit || "0"),
        })
      : null;

  const isRefund = result ? result.refund >= 0 : true;

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6">
      <BackLink className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">연말정산 환급 계산기</h1>
      <p className="mt-1 text-sm text-muted">
        13월의 월급, 돌려받을까 더 낼까? 대략적인 방향을 가늠해봐요.
      </p>

      <MascotBubble
        mood="idle"
        message="공제를 챙길수록 돌려받아요. 숫자로 확인해볼까요?"
        className="mt-4"
      />

      {/* 입력 */}
      <Card padding="md" className="mt-4 space-y-4">
        <div className="inline-flex rounded-xl bg-subtle p-1">
          {(["year", "month"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
                period === p ? "bg-surface text-foreground shadow-sm" : "text-muted",
              )}
            >
              {p === "year" ? "연봉" : "월급"}
            </button>
          ))}
        </div>

        <MoneyField
          label={`세전 ${period === "year" ? "연봉" : "월급"}`}
          value={amount}
          onChange={setAmount}
        />
        <MoneyField
          label="비과세액 (월)"
          hint="보통 식대 20만원"
          value={nontax}
          onChange={setNontax}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted">
            부양가족 수 <span className="font-normal">(본인 포함)</span>
          </span>
          <Stepper value={dependents} onChange={handleDependents} min={1} max={10} />
        </div>

        {maxChildren > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">
              자녀 수 <span className="font-normal">(만 8~20세)</span>
            </span>
            <Stepper value={childrenClamped} onChange={setChildren} min={0} max={maxChildren} />
          </div>
        )}

        <ResultDivider />

        <MoneyField
          label="추가 소득공제 (연)"
          hint="신용카드·주택청약 등"
          value={extraDeduction}
          onChange={setExtraDeduction}
        />
        <MoneyField
          label="추가 세액공제 (연)"
          hint="연금저축·월세·기부 등"
          value={extraCredit}
          onChange={setExtraCredit}
        />
        <Link
          href="/tools/pension-credit"
          className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-brand-400 hover:bg-brand-500/5"
        >
          <span>연금저축 세액공제액 계산하기</span>
          <ArrowRight className="size-4 text-brand-600" />
        </Link>
      </Card>

      {/* 결과 */}
      {result && (
        <Card highlight padding="lg" className="mt-4">
          <p
            className={cn(
              "text-sm font-semibold",
              isRefund ? "text-success" : "text-danger",
            )}
          >
            {isRefund ? "예상 환급액 (추정)" : "추가 납부 예상 (추정)"}
          </p>
          <p
            className={cn(
              "mt-1 text-3xl font-bold tabular-nums",
              isRefund ? "text-success" : "text-danger",
            )}
          >
            {formatWon(Math.abs(result.refund))}
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <ResultRow label="기납부세액" hint="매달 떼인 세금" value={result.withheld} />
            <ResultRow label="결정세액" hint="실제 낼 세금" value={result.determined} />
            <ResultDivider />
            <ResultRow
              label={isRefund ? "돌려받음" : "더 냄"}
              value={result.refund}
              strong
            />
          </div>
        </Card>
      )}

      <RelatedLessons items={RELATED} />

      <Disclaimer>
        {RATE_YEAR}년 기준으로 <b>아주 단순화한 추정치예요.</b> 의료비·신용카드·
        보험료 등 실제 공제는 사람마다 크게 달라서 결과와 차이가 날 수 있어요.
        정확한 금액은 국세청 연말정산 간소화·회사에서 확인하세요.
      </Disclaimer>
    </main>
  );
}
