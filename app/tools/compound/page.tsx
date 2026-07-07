"use client";

import { useState } from "react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/tools/Disclaimer";
import { MoneyField } from "@/components/tools/MoneyField";
import { RelatedLessons } from "@/components/tools/RelatedLessons";
import { ResultDivider, ResultRow } from "@/components/tools/ResultRow";
import { formatWon } from "@/lib/format";
import { estimateSavings } from "@/lib/compound";
import { cn } from "@/lib/utils";

const RELATED = [{ id: "emergency-saving", label: "비상금부터 모으기" }];
const YEAR_PRESETS = [5, 10, 20, 30];

/** 이율 입력: 숫자와 소수점 한 개만 허용. */
function sanitizeRate(s: string): string {
  const cleaned = s.replace(/[^\d.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot === -1) return cleaned;
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
}

export default function CompoundPage() {
  const [principal, setPrincipal] = useState("");
  const [monthly, setMonthly] = useState("100000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState(20);

  const principalNum = Number(principal || "0");
  const monthlyNum = Number(monthly || "0");
  const rateNum = Number(rate || "0");

  const hasInput = principalNum > 0 || monthlyNum > 0;
  const result = hasInput
    ? estimateSavings({
        principal: principalNum,
        monthly: monthlyNum,
        annualRatePercent: rateNum,
        years,
      })
    : null;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      <BackLink className="mb-3" />
      <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-3xl">
        복리 계산기
      </h1>
      <p className="mt-1 text-sm text-muted">
        매달 꾸준히 모으면 이자가 이자를 낳는 복리로 얼마까지 불어날까요?
      </p>

      <MascotBubble
        variant="study"
        message="시간이 가장 큰 무기예요. 길게 볼수록 차이가 커져요!"
        className="mt-4"
      />

      {/* 입력 */}
      <Card padding="md" className="mt-4 space-y-4">
        <MoneyField
          label="초기 원금"
          hint="지금 가진 목돈(없으면 0)"
          value={principal}
          onChange={setPrincipal}
        />
        <MoneyField
          label="매월 적립액"
          value={monthly}
          onChange={setMonthly}
        />

        <div>
          <label className="block text-sm font-semibold text-muted">연이율</label>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20">
            <input
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(sanitizeRate(e.target.value))}
              placeholder="0"
              className="h-12 w-full bg-transparent text-right text-lg font-bold tabular-nums outline-none"
            />
            <span className="shrink-0 text-muted">%</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-muted">기간</label>
            <span className="font-bold tabular-nums">{years}년</span>
          </div>
          <div className="mt-2 flex gap-2">
            {YEAR_PRESETS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYears(y)}
                className={cn(
                  "flex-1 rounded-xl border py-2 text-sm font-semibold transition-colors",
                  years === y
                    ? "border-brand-500 bg-brand-500/10 text-brand-600"
                    : "border-border text-muted hover:border-brand-400",
                )}
              >
                {y}년
              </button>
            ))}
          </div>
          <input
            type="range"
            min={1}
            max={40}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-3 w-full accent-brand-600"
            aria-label="기간(년)"
          />
        </div>
      </Card>

      {/* 결과 */}
      {result && (
        <Card highlight padding="lg" className="mt-4">
          <p className="text-sm font-semibold text-brand-600">
            {years}년 뒤 (추정)
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            {formatWon(result.compound.futureValue)}
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <ResultRow label="내가 넣은 돈" value={result.contributed} />
            <ResultRow
              label="불어난 이자"
              hint={`연 ${rateNum}% 월복리`}
              value={result.compound.interest}
            />
            <ResultDivider />
            <ResultRow label="만기 평가액 (복리)" value={result.compound.futureValue} strong />
          </div>

          {/* 복리 vs 단리 비교 — 복리는 이자가 이자를 낳는다 */}
          {result.compoundExtra > 0 && (
            <div className="mt-5 rounded-xl bg-brand-500/10 p-4 text-sm">
              <div className="flex items-center justify-between text-muted">
                <span>은행 적금처럼 단리로 모으면</span>
                <span className="tabular-nums">{formatWon(result.simple.futureValue)}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between font-bold text-brand-700">
                <span>복리로 더 버는 돈</span>
                <span className="tabular-nums">+ {formatWon(result.compoundExtra)}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-brand-700/80">
                복리는 이자가 다시 이자를 낳아요. 기간이 길수록 격차가 더 벌어져요.
              </p>
            </div>
          )}
        </Card>
      )}

      <RelatedLessons items={RELATED} />

      <Disclaimer>
        매월 초 적립·월복리 가정의 <b>추정치예요.</b> 세전·물가 미반영이고, 실제
        수익률은 매년 달라져요. 이자엔 보통 15.4% 이자소득세가 붙고, 원금 보장
        상품이 아니면 손실도 가능해요. (이 앱은 특정 상품·종목을 추천하지 않아요.)
      </Disclaimer>
    </main>
  );
}
