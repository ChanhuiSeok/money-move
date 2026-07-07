"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/tools/Disclaimer";
import { MoneyField } from "@/components/tools/MoneyField";
import { RelatedLessons } from "@/components/tools/RelatedLessons";
import { ResultDivider, ResultRow } from "@/components/tools/ResultRow";
import { RATE_YEAR, localIncomeTaxRate, pensionSavings } from "@/content/rates";
import { formatPercent, formatWon } from "@/lib/format";
import { estimatePensionCredit, pensionCreditRate } from "@/lib/pension";
import { hasProfile, taxableAnnual } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { useProfile } from "@/store/useProfile";

const RELATED = [
  { id: "deduction-vs-credit", label: "소득공제 vs 세액공제" },
  { id: "year-end-tax", label: "연말정산이 뭐예요?" },
];

/** 연금저축 vs IRP 차이(정성). 종목 추천이 아니라 '계좌 구조' 안내. */
const COMPARE: { label: string; pension: string; irp: string }[] = [
  { label: "세액공제 한도", pension: "단독 600만원", irp: "연금저축 합산 900만원" },
  { label: "투자 범위", pension: "펀드·ETF 등 자유", irp: "위험자산 70%까지" },
  { label: "중도 인출", pension: "비교적 자유(세금)", irp: "까다로움(제한 사유)" },
  { label: "가입 대상", pension: "누구나", irp: "소득 있는 사람" },
];

/** 지방소득세까지 포함한 '체감' 세액공제율. (소득세 공제율 × 1.1) */
function combinedRate(totalSalary: number): number {
  return pensionCreditRate(totalSalary) * (1 + localIncomeTaxRate);
}

export default function PensionCreditPage() {
  const hydrate = useProfile((s) => s.hydrate);
  const hydrated = useProfile((s) => s.hydrated);
  const profile = useProfile((s) => s.profile);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const initialSalary =
    hydrated && hasProfile(profile) ? String(taxableAnnual(profile)) : "";

  return (
    <PensionCredit key={hydrated ? "ready" : "empty"} initialSalary={initialSalary} />
  );
}

function PensionCredit({ initialSalary }: { initialSalary: string }) {
  const [salary, setSalary] = useState(initialSalary);
  const [pension, setPension] = useState("");
  const [irp, setIrp] = useState("");

  const salaryNum = Number(salary || "0");
  const pensionNum = Number(pension || "0");
  const irpNum = Number(irp || "0");

  const hasInput = pensionNum > 0 || irpNum > 0;
  const result = hasInput
    ? estimatePensionCredit({ pension: pensionNum, irp: irpNum, totalSalary: salaryNum })
    : null;
  // IRP를 더해 늘어난 절세(연금저축만 넣었을 때와 비교).
  const pensionOnly = hasInput
    ? estimatePensionCredit({ pension: pensionNum, irp: 0, totalSalary: salaryNum })
    : null;
  const extraFromIrp =
    result && pensionOnly ? result.totalSaved - pensionOnly.totalSaved : 0;

  const higherRate = salaryNum <= pensionSavings.higherRateSalaryCeiling;

  function fillRecommended() {
    setPension(String(pensionSavings.pensionOnlyCap)); // 연금저축 600만
    setIrp(String(pensionSavings.combinedCap - pensionSavings.pensionOnlyCap)); // IRP 300만
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      <BackLink href="/tools" label="계산기" className="mb-3" />
      <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-3xl">
        연금저축·IRP 세액공제
      </h1>
      <p className="mt-1 text-sm text-muted">
        연금저축·IRP에 넣은 돈으로 연말정산 때 얼마나 돌려받는지, 그리고 둘을 어떻게
        나누면 좋은지 알려줘요.
      </p>

      <MascotBubble
        variant="study"
        message="더 유연한 연금저축부터 600만, 남으면 IRP로 900만까지! 같이 짜봐요."
        className="mt-4"
        size="lg"
      />

      {/* 입력 */}
      <Card padding="md" className="mt-4 space-y-4">
        <MoneyField
          label="작년 총급여(연봉)"
          hint="공제율 판단용"
          value={salary}
          onChange={setSalary}
        />
        <MoneyField
          label="연금저축 납입액 (연)"
          hint={`최대 ${formatWon(pensionSavings.pensionOnlyCap)} 공제`}
          value={pension}
          onChange={setPension}
        />
        <MoneyField
          label="IRP(퇴직연금) 납입액 (연)"
          hint="없으면 0"
          value={irp}
          onChange={setIrp}
        />
        <button
          type="button"
          onClick={fillRecommended}
          className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted transition-colors hover:border-brand-400"
        >
          추천 배분 채우기 (연금 600 · IRP 300)
        </button>
      </Card>

      {/* 공제율 안내 — 항상 보이게 */}
      <div className="mt-4 rounded-xl bg-subtle/60 p-4 text-sm">
        <p className="font-semibold">세액공제율 (지방소득세 포함)</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <RateCard
            label="총급여 5,500만원 이하"
            sub="(종합소득 4,500만원 이하)"
            rate="16.5%"
            active={hasInput && higherRate}
          />
          <RateCard
            label="총급여 5,500만원 초과"
            sub="(종합소득 4,500만원 초과)"
            rate="13.2%"
            active={hasInput && !higherRate}
          />
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <Card highlight padding="lg" className="mt-4">
          <p className="text-sm font-semibold text-brand-600">돌려받는 세금 (추정)</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            {formatWon(result.totalSaved)}
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <ResultRow
              label="세액공제 대상 납입액"
              hint={`공제율 ${formatPercent(combinedRate(salaryNum))}`}
              value={result.creditable}
            />
            <ResultRow label="소득세 절감" value={result.incomeTaxSaved} />
            <ResultRow
              label="지방소득세 절감"
              hint="소득세의 10%"
              value={result.localTaxSaved}
            />
            <ResultDivider />
            <ResultRow label="총 절세액" value={result.totalSaved} strong />
          </div>

          {extraFromIrp > 0 && (
            <p className="mt-4 rounded-xl bg-brand-500/10 px-4 py-3 text-sm">
              IRP를 더해 <b>{formatWon(extraFromIrp)}</b>을 더 아꼈어요. (연금저축
              단독은 600만, IRP를 합치면 900만까지 공제되거든요.)
            </p>
          )}

          {result.excess > 0 && (
            <p className="mt-4 rounded-xl bg-subtle px-4 py-3 text-sm text-muted">
              한도를 넘긴 <b>{formatWon(result.excess)}</b>은 올해 공제받지 못해요.
              (연금저축 {formatWon(pensionSavings.pensionOnlyCap)} · IRP 합산{" "}
              {formatWon(pensionSavings.combinedCap)} 한도)
            </p>
          )}
        </Card>
      )}

      {/* 연금저축 vs IRP 차이 */}
      <Card padding="md" className="mt-4">
        <p className="text-sm font-bold">연금저축 vs IRP, 뭐가 달라요?</p>
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-subtle/60 text-xs font-bold">
            <span className="px-3 py-2 text-muted">항목</span>
            <span className="px-3 py-2 text-brand-600">연금저축</span>
            <span className="px-3 py-2">IRP</span>
          </div>
          {COMPARE.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1.1fr_1fr_1fr] border-t border-border text-xs"
            >
              <span className="px-3 py-2 font-semibold text-muted">{row.label}</span>
              <span className="px-3 py-2">{row.pension}</span>
              <span className="px-3 py-2">{row.irp}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
          <Check className="size-3.5 shrink-0 translate-y-0.5 text-success" />
          연금저축이 더 유연해서 600만까지 먼저 채우고, 한도를 더 쓰고 싶을 때 IRP를
          더하는 식이 무난해요.
        </p>
      </Card>

      <RelatedLessons items={RELATED} />

      <Disclaimer>
        {RATE_YEAR}년 기준 <b>추정치예요.</b> 산출세액(낼 세금)이 공제액보다 적으면
        그만큼은 돌려받지 못할 수 있어요. 투자 상품·수수료·중도해지 불이익은 상품마다
        달라요. 정확한 건 국세청·금융회사에서 확인하세요.
      </Disclaimer>
    </main>
  );
}

function RateCard({
  label,
  sub,
  rate,
  active,
}: {
  label: string;
  sub: string;
  rate: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-colors",
        active ? "border-brand-500 bg-brand-500/10" : "border-border bg-surface",
      )}
    >
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-[11px] text-muted">{sub}</p>
      <p
        className={cn(
          "mt-1 text-lg font-bold tabular-nums",
          active ? "text-brand-600" : "text-foreground",
        )}
      >
        {rate}
      </p>
    </div>
  );
}
