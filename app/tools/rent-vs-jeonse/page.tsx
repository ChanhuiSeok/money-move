"use client";

import { useState } from "react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/tools/Disclaimer";
import { MoneyField } from "@/components/tools/MoneyField";
import { PercentField } from "@/components/tools/PercentField";
import { RelatedLessons } from "@/components/tools/RelatedLessons";
import { ResultDivider, ResultRow } from "@/components/tools/ResultRow";
import { formatWon } from "@/lib/format";
import { compareRentVsJeonse } from "@/lib/housing";
import { cn } from "@/lib/utils";

const RELATED = [
  { id: "jeonse-wolse", label: "전세·월세, 보증금 지키기" },
  { id: "interest-rates", label: "금리가 뭐예요? (기회비용)" },
];

const pct = (s: string) => Number(s || "0") / 100;

export default function RentVsJeonsePage() {
  const [jeonseDeposit, setJeonseDeposit] = useState("");
  const [jeonseLoan, setJeonseLoan] = useState("");
  const [jeonseLoanRate, setJeonseLoanRate] = useState("4");
  const [monthlyDeposit, setMonthlyDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [oppRate, setOppRate] = useState("3");

  const hasInput =
    Number(jeonseDeposit || "0") > 0 ||
    Number(monthlyRent || "0") > 0 ||
    Number(monthlyDeposit || "0") > 0;

  const r = hasInput
    ? compareRentVsJeonse({
        jeonseDeposit: Number(jeonseDeposit || "0"),
        jeonseLoan: Number(jeonseLoan || "0"),
        jeonseLoanRate: pct(jeonseLoanRate),
        monthlyDeposit: Number(monthlyDeposit || "0"),
        monthlyRent: Number(monthlyRent || "0"),
        opportunityRate: pct(oppRate),
      })
    : null;

  const verdict =
    r === null
      ? ""
      : r.cheaper === "tie"
        ? "둘이 비슷해요"
        : r.cheaper === "jeonse"
          ? `전세가 월 ${formatWon(r.monthlyDiff)} 저렴해요`
          : `월세가 월 ${formatWon(r.monthlyDiff)} 저렴해요`;

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6">
      <BackLink href="/tools" label="계산기" className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">전세 vs 월세</h1>
      <p className="mt-1 text-sm text-muted">
        전세는 보증금이 묶여 ‘이자 기회비용’이, 월세는 매달 월세가 들죠. 둘을 같은
        ‘월 실부담’으로 환산해 비교해요.
      </p>

      <MascotBubble
        variant="study"
        message="큰 보증금도 ‘묶이는 비용’이 있어요. 같이 따져봐요!"
        className="mt-4"
      />

      {/* 전세 조건 */}
      <Card padding="md" className="mt-4 space-y-4">
        <p className="text-sm font-bold text-brand-600">전세 조건</p>
        <MoneyField
          label="전세 보증금"
          value={jeonseDeposit}
          onChange={setJeonseDeposit}
        />
        <MoneyField
          label="전세대출액"
          hint="없으면 0"
          value={jeonseLoan}
          onChange={setJeonseLoan}
        />
        <PercentField
          label="전세대출 금리 (연)"
          value={jeonseLoanRate}
          onChange={setJeonseLoanRate}
        />
      </Card>

      {/* 월세 조건 */}
      <Card padding="md" className="mt-4 space-y-4">
        <p className="text-sm font-bold text-brand-600">월세 조건</p>
        <MoneyField
          label="월세 보증금"
          value={monthlyDeposit}
          onChange={setMonthlyDeposit}
        />
        <MoneyField label="월세 (월)" value={monthlyRent} onChange={setMonthlyRent} />
      </Card>

      {/* 가정 */}
      <Card padding="md" className="mt-4">
        <PercentField
          label="내 돈을 굴렸다면 받을 수익률 (연)"
          hint="예금·투자 기회비용. 보통 3% 안팎"
          value={oppRate}
          onChange={setOppRate}
        />
      </Card>

      {/* 결과 */}
      {r && (
        <Card highlight padding="lg" className="mt-4">
          <p className="text-sm font-semibold text-brand-600">월 실부담 비교 (추정)</p>
          <p className="mt-1 text-2xl font-bold">{verdict}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <CostBox
              label="전세"
              value={r.jeonseMonthlyCost}
              win={r.cheaper === "jeonse"}
            />
            <CostBox
              label="월세"
              value={r.monthlyTotalCost}
              win={r.cheaper === "monthly"}
            />
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <ResultRow
              label="전세 — 자기자금 기회비용"
              hint="묶인 내 돈의 이자"
              value={r.jeonseOppCost}
            />
            <ResultRow
              label="전세 — 대출이자"
              value={r.jeonseInterest}
            />
            <ResultDivider />
            <ResultRow label="월세 — 월세" value={Number(monthlyRent || "0")} />
            <ResultRow
              label="월세 — 보증금 기회비용"
              value={r.monthlyDepositOppCost}
            />
            <ResultDivider />
            <ResultRow
              label="연으로 보면 차이"
              hint="1년 기준"
              value={r.yearlyDiff}
              strong
            />
          </div>
        </Card>
      )}

      <RelatedLessons items={RELATED} />

      <Disclaimer>
        ‘월 실부담’만 단순 비교한 <b>추정치예요.</b> 보증금 미반환 위험(전세사기)·집값
        변동·이사비·중개수수료·세금은 빼고 계산했어요. 실제 결정은 보증금 안전성과
        현금흐름까지 함께 따져보세요.
      </Disclaimer>
    </main>
  );
}

function CostBox({
  label,
  value,
  win,
}: {
  label: string;
  value: number;
  win: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        win ? "border-success/40 bg-success/5" : "border-border bg-surface",
      )}
    >
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p
        className={cn(
          "mt-1 text-xl font-bold tabular-nums",
          win && "text-success",
        )}
      >
        {formatWon(value)}
      </p>
      <p className="mt-0.5 text-[11px] text-muted">월 실부담{win ? " · 더 저렴" : ""}</p>
    </div>
  );
}
