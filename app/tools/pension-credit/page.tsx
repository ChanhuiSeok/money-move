"use client";

import { useState } from "react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/tools/Disclaimer";
import { MoneyField } from "@/components/tools/MoneyField";
import { RelatedLessons } from "@/components/tools/RelatedLessons";
import { ResultDivider, ResultRow } from "@/components/tools/ResultRow";
import { RATE_YEAR, pensionSavings } from "@/content/rates";
import { formatPercent, formatWon } from "@/lib/format";
import { estimatePensionCredit } from "@/lib/pension";

const RELATED = [
  { id: "deduction-vs-credit", label: "소득공제 vs 세액공제" },
  { id: "year-end-tax", label: "연말정산이 뭐예요?" },
];

export default function PensionCreditPage() {
  const [salary, setSalary] = useState("");
  const [pension, setPension] = useState("");
  const [irp, setIrp] = useState("");

  const salaryNum = Number(salary || "0");
  const pensionNum = Number(pension || "0");
  const irpNum = Number(irp || "0");

  const hasInput = pensionNum > 0 || irpNum > 0;
  const result = hasInput
    ? estimatePensionCredit({
        pension: pensionNum,
        irp: irpNum,
        totalSalary: salaryNum,
      })
    : null;

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6">
      <BackLink className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">연금저축 세액공제 계산기</h1>
      <p className="mt-1 text-sm text-muted">
        연금저축·IRP에 넣은 돈으로 연말정산 때 세금을 얼마나 돌려받을 수 있는지 추정해요.
      </p>

      <MascotBubble
        mood="idle"
        message="노후도 준비하고 세금도 아끼는 일석이조예요!"
        className="mt-4"
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
      </Card>

      {/* 결과 */}
      {result && (
        <Card highlight padding="lg" className="mt-4">
          <p className="text-sm font-semibold text-brand-600">
            돌려받는 세금 (추정)
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            {formatWon(result.totalSaved)}
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <ResultRow label="세액공제 대상 납입액" value={result.creditable} />
            <ResultRow
              label="소득세 절감"
              hint={`공제율 ${formatPercent(result.rate)}`}
              value={result.incomeTaxSaved}
            />
            <ResultRow
              label="지방소득세 절감"
              hint="소득세의 10%"
              value={result.localTaxSaved}
            />
            <ResultDivider />
            <ResultRow label="총 절세액" value={result.totalSaved} strong />
          </div>

          {result.excess > 0 && (
            <p className="mt-4 rounded-xl bg-subtle px-4 py-3 text-sm text-muted">
              한도를 넘긴 <b>{formatWon(result.excess)}</b>은 올해 공제받지 못해요.
              (연금저축 {formatWon(pensionSavings.pensionOnlyCap)} · IRP 합산{" "}
              {formatWon(pensionSavings.combinedCap)} 한도)
            </p>
          )}
        </Card>
      )}

      <RelatedLessons items={RELATED} />

      <Disclaimer>
        {RATE_YEAR}년 기준 <b>추정치예요.</b> 산출세액(낼 세금)이 공제액보다 적으면
        그만큼은 돌려받지 못할 수 있어요. 정확한 금액은 국세청 연말정산
        간소화·회사에서 확인하세요. 연금은 중도 해지 시 불이익이 있어요.
      </Disclaimer>
    </main>
  );
}
