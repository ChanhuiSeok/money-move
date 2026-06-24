"use client";

import { useState } from "react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/tools/Disclaimer";
import { MoneyField } from "@/components/tools/MoneyField";
import { RangeField } from "@/components/tools/RangeField";
import { RelatedLessons } from "@/components/tools/RelatedLessons";
import { ResultDivider, ResultRow } from "@/components/tools/ResultRow";
import { RATE_YEAR } from "@/content/rates";
import { formatPercent, formatWon } from "@/lib/format";
import { estimatePensionCredit } from "@/lib/pension";
import {
  bracketOf,
  simulateYearEnd,
  taxBrackets,
  type TaxBracket,
} from "@/lib/taxsim";
import { cn } from "@/lib/utils";

const RELATED = [
  { id: "deduction-vs-credit", label: "소득공제 vs 세액공제" },
  { id: "year-end-tax", label: "연말정산이 뭐예요?" },
];

const SALARY_PRESETS = [30_000_000, 50_000_000, 70_000_000];
/** 연금저축+IRP 합산 세액공제 한도(900만 납입 가정). */
const PENSION_PAYMENT = { pension: 6_000_000, irp: 3_000_000 };

function ratio(part: number, whole: number): string {
  const p = whole > 0 ? Math.min(100, Math.max(0, (part / whole) * 100)) : 0;
  return `${p}%`;
}

/** 금액을 '○억 ○만' 꼴로 짧게. (세율 구간 라벨용) */
function compactMan(n: number): string {
  if (!Number.isFinite(n)) return "∞";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.round((n % 100_000_000) / 10_000);
  if (eok > 0)
    return man > 0 ? `${eok}억 ${man.toLocaleString("ko-KR")}만` : `${eok}억`;
  return `${man.toLocaleString("ko-KR")}만`;
}

function bracketLabel(b: TaxBracket): string {
  if (b.lower === 0) return `${compactMan(b.upper)} 이하`;
  if (!Number.isFinite(b.upper)) return `${compactMan(b.lower)} 초과`;
  return `${compactMan(b.lower)}~${compactMan(b.upper)}`;
}

export default function TaxSimulatorPage() {
  const [salary, setSalary] = useState("40000000");
  const [extraDeduction, setExtraDeduction] = useState(0);
  const [extraCredit, setExtraCredit] = useState(0);

  const totalSalary = Number(salary || "0");
  // 연금저축 900만 채웠을 때 받는 세액공제는 총급여 구간에 따라 달라진다(16.5% / 13.2%).
  const pensionMaxCredit = estimatePensionCredit({
    ...PENSION_PAYMENT,
    totalSalary,
  }).totalSaved;

  // 추가 소득공제 한도 = 과세표준이 0이 되는 지점(그 위로는 빼도 효과 없음).
  // step(10만)에 맞춰 '올림'해야 슬라이더 끝값이 0 지점에 정확히 닿아 과세표준이 0이 된다.
  const baseSim = simulateYearEnd({
    totalSalary,
    extraIncomeDeduction: 0,
    extraTaxCredit: 0,
  });
  const deductionMax = Math.ceil(baseSim.taxableBase / 100_000) * 100_000;
  const effectiveDeduction = Math.min(extraDeduction, deductionMax);

  // 추가 세액공제 슬라이더 범위 — 법정 한도가 아니라 '산출세액을 0으로 만드는 지점'을
  // 조금 넘게 잡는다(그 너머는 어차피 사라지므로). 연금 프리셋이 항상 들어가도록 보정.
  const creditZeroPoint = Math.max(0, baseSim.computedTax - baseSim.earnedTaxCredit);
  const creditSliderMax = Math.max(
    pensionMaxCredit,
    Math.ceil((creditZeroPoint * 1.25) / 50_000) * 50_000,
  );
  const effectiveCredit = Math.min(extraCredit, creditSliderMax);

  const r = simulateYearEnd({
    totalSalary,
    extraIncomeDeduction: effectiveDeduction,
    extraTaxCredit: effectiveCredit,
  });
  const { index: bracketIndex, bracket } = bracketOf(r.taxableBase);
  // 연말정산 결과지 관례: 결정세액 − 기납부세액. 음수면 환급, 양수면 추가납부.
  const settle = r.determinedTax - r.withheld;
  const isRefund = settle <= 0;
  const hasTax = r.computedTax > 0;

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6 lg:max-w-5xl lg:px-8 lg:py-8">
      <BackLink className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">연말정산 시뮬레이터</h1>
      <p className="mt-1 text-sm text-muted">
        공제를 움직여 보며, 내 세금이 어떻게 줄고 얼마를 돌려받는지 흐름으로
        확인해요.
      </p>

      <MascotBubble
        mood="idle"
        message="슬라이더를 움직여 보세요. 세액공제가 '낼 세금'을 넘으면 어떻게 되는지가 핵심이에요!"
        className="mt-4"
      />

      {/* 입력 — 데스크탑에선 가로 3분할로 눕혀 높이를 줄인다 */}
      <Card padding="md" className="mt-4 space-y-5 lg:grid lg:grid-cols-3 lg:items-start lg:gap-5 lg:space-y-0">
        <div>
          <MoneyField
            label="총급여 (연, 비과세 제외)"
            value={salary}
            onChange={setSalary}
          />
          <div className="mt-2 flex gap-2">
            {SALARY_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSalary(String(p))}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  totalSalary === p
                    ? "border-brand-500 bg-brand-500/10 text-brand-600"
                    : "border-border text-muted hover:border-brand-400"
                )}
              >
                {p / 10_000}만
              </button>
            ))}
          </div>
        </div>

        <div>
          <RangeField
            label="추가 소득공제 (연)"
            hint="신용카드·주택청약 등 합계"
            value={effectiveDeduction}
            onChange={setExtraDeduction}
            max={Math.max(deductionMax, 100_000)}
            step={100_000}
          />
          <p className="mt-1.5 text-xs text-muted">
            과세표준이 0이 되는 <b>{formatWon(deductionMax)}</b>까지 빼볼 수
            있어요. 그 위로는 더 빼도 세금이 줄지 않아요.
          </p>
        </div>

        <div>
          <RangeField
            label="추가 세액공제 (연)"
            hint="연금·월세·보험 등 합계"
            value={effectiveCredit}
            onChange={setExtraCredit}
            max={creditSliderMax}
            step={50_000}
          />
          <button
            type="button"
            onClick={() => setExtraCredit(pensionMaxCredit)}
            className="mt-2 rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted transition-colors hover:border-brand-400"
          >
            연금저축 900만 채우기 (공제 {formatWon(pensionMaxCredit)})
          </button>
          <p className="mt-1.5 text-xs text-muted">
            여러 세액공제(연금·월세·보험 등)를 더한 값이에요. 합산에 정해진 법정
            한도는 없고, <b>산출세액</b>을 넘는 만큼은 효과 없이 사라져요 — 슬라이더는
            딱 그 지점까지 움직여요. (연금 공제율은 총급여 5,500만 이하 16.5%, 초과
            13.2%)
          </p>
        </div>
          </Card>

          {/* 모바일 전용 — 슬라이더 바로 아래 핵심 결과 요약 */}
          {totalSalary > 0 && (
            <div
              className={cn(
                "mt-4 rounded-card border p-4 lg:hidden",
                isRefund
                  ? "border-success/40 bg-success/5"
                  : "border-danger/40 bg-danger/5",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isRefund ? "text-success" : "text-danger",
                  )}
                >
                  {isRefund ? "예상 환급" : "추가 납부"}
                </span>
                <span
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    isRefund ? "text-success" : "text-danger",
                  )}
                >
                  {settle < 0
                    ? `− ${formatWon(-settle)}`
                    : settle > 0
                      ? `+ ${formatWon(settle)}`
                      : formatWon(0)}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>과세표준 {formatWon(r.taxableBase)}</span>
                <span>결정세액 {formatWon(r.determinedTax)}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted">자세한 흐름은 아래에서 ↓</p>
            </div>
          )}

      {totalSalary > 0 && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {/* ① 소득공제 → 과세표준 */}
            <Card padding="md">
            <p className="text-sm font-bold text-brand-600">
              ① 소득공제: 세금 매기는 ‘기준’을 줄여요
            </p>
            <p className="mt-1 text-xs text-muted">
              총급여에서 공제를 빼고 남은 <b>과세표준</b>에만 세금이 붙어요.
            </p>

            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-subtle">
              <div
                className="h-full bg-brand-500"
                style={{ width: ratio(r.taxableBase, r.totalSalary) }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-muted">
              <span>
                <span className="mr-1 inline-block size-2 rounded-full bg-brand-500 align-middle" />
                과세표준 {formatWon(r.taxableBase)}
              </span>
              <span>
                공제로 빠짐 {formatWon(r.totalSalary - r.taxableBase)}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <ResultRow label="총급여" value={r.totalSalary} />
              <ResultRow label="근로소득공제" value={-r.earnedDeduction} />
              <ResultRow label="기본공제(본인)" value={-r.basicDeduction} />
              <ResultRow label="4대 보험료" value={-r.insuranceDeduction} />
              <ResultRow
                label="추가 소득공제"
                hint="슬라이더"
                value={-r.extraIncomeDeduction}
              />
              <ResultDivider />
              <ResultRow label="과세표준" value={r.taxableBase} strong />
            </div>

            {/* 누진세율 구간 — 소득공제를 움직이면 과세표준이 구간 사이를 오간다 */}
            <div className="mt-4 rounded-xl bg-subtle/60 p-3">
              <p className="text-xs font-semibold text-muted">
                세율 구간 — 과세표준을 8단계로 나눠 위로 갈수록 높은 세율
              </p>
              <div className="mt-2 flex gap-0.5">
                {taxBrackets.map((b, i) => (
                  <div
                    key={b.rate}
                    className={cn(
                      "flex-1 rounded py-1 text-center text-[10px] font-bold tabular-nums transition-colors",
                      i === bracketIndex
                        ? "bg-brand-500 text-white"
                        : "bg-surface text-muted"
                    )}
                  >
                    {Math.round(b.rate * 100)}%
                  </div>
                ))}
              </div>

              {/* 구간별 누진공제 — 위 칸과 정렬. 구간이 올라갈수록 커진다 */}
              <p className="mt-2 text-[11px] font-semibold text-muted">
                구간별 누진공제{" "}
                <span className="font-normal">(만원, 높을수록 큼)</span>
              </p>
              <div className="mt-1 flex gap-0.5">
                {taxBrackets.map((b, i) => (
                  <div
                    key={b.rate}
                    className={cn(
                      "flex-1 rounded py-1 text-center text-[9px] tabular-nums transition-colors",
                      i === bracketIndex
                        ? "bg-brand-500/15 font-bold text-brand-600"
                        : "text-muted"
                    )}
                  >
                    {Math.round(b.deduction / 10_000).toLocaleString("ko-KR")}
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-muted">
                과세표준{" "}
                <b className="text-foreground">{formatWon(r.taxableBase)}</b> →{" "}
                {bracketLabel(bracket)} 구간 · 세율{" "}
                <b className="text-brand-600">{formatPercent(bracket.rate)}</b>{" "}
                · 누진공제{" "}
                <b className="text-foreground">
                  {formatWon(bracket.deduction)}
                </b>
              </p>
              {hasTax && (
                <p className="mt-1 text-xs text-muted">
                  이 구간에선 소득공제 100만 원이 세금을 약{" "}
                  <b className="text-foreground">
                    {formatWon(1_000_000 * bracket.rate)}
                  </b>{" "}
                  줄여요(= 현재 세율).
                </p>
              )}
            </div>
          </Card>

          {/* ② 산출세액 → 세액공제 → 결정세액 (핵심) */}
          <Card padding="md">
            <p className="text-sm font-bold text-brand-600">
              ② 세액공제: ‘계산된 세금’을 직접 깎아요
            </p>
            <p className="mt-1 text-xs text-muted">
              과세표준에 세율을 매긴 <b>산출세액</b>에서 세액공제를 빼요.
            </p>

            {/* 산출세액 계산식 — 과세표준 × 세율 − 누진공제 */}
            <div className="mt-3 rounded-xl bg-subtle/60 p-3">
              <p className="text-xs font-semibold text-muted">
                산출세액은 이렇게 나와요
              </p>
              <p className="mt-1 text-sm leading-relaxed">
                <span className="tabular-nums">{formatWon(r.taxableBase)}</span>
                <span className="text-muted"> × </span>
                <b className="text-brand-600">{formatPercent(bracket.rate)}</b>
                {bracket.deduction > 0 && (
                  <>
                    <span className="text-muted"> − </span>
                    <span className="tabular-nums">
                      {formatWon(bracket.deduction)}
                    </span>
                    <span className="text-muted"> (누진공제)</span>
                  </>
                )}
                <span className="text-muted"> = </span>
                <b className="tabular-nums">{formatWon(r.computedTax)}</b>
              </p>
              {bracket.deduction > 0 && (
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  누진공제는 ‘낮은 구간은 낮은 세율로’ 계산되게 맞춰주는
                  보정값이에요. 과세표준에 세율을 곱한 뒤, 누진공제 만큼 빼죠.
                  그래서 과세표준이 위 구간으로 갈수록 누진공제도 점점 커져요.
                </p>
              )}
            </div>

            {hasTax ? (
              <>
                <div className="mt-3 flex h-5 w-full overflow-hidden rounded-full bg-subtle">
                  <div
                    className="h-full bg-success"
                    style={{ width: ratio(r.appliedCredit, r.computedTax) }}
                  />
                  <div
                    className="h-full bg-foreground/70"
                    style={{
                      width: ratio(r.determinedIncomeTax, r.computedTax),
                    }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-muted">
                  <span>
                    <span className="mr-1 inline-block size-2 rounded-full bg-success align-middle" />
                    공제로 깎임 {formatWon(r.appliedCredit)}
                  </span>
                  <span>
                    <span className="mr-1 inline-block size-2 rounded-full bg-foreground/70 align-middle" />
                    결정세액 {formatWon(r.determinedIncomeTax)}
                  </span>
                </div>
              </>
            ) : (
              <p className="mt-3 rounded-xl bg-subtle px-4 py-3 text-sm text-muted">
                낼 세금(산출세액)이 0원이에요. 세액공제로 더 돌려받을 것도
                없어요.
              </p>
            )}

            <div className="mt-4 space-y-2 text-sm">
              <ResultRow label="산출세액(소득세)" value={r.computedTax} />
              <ResultRow label="근로소득세액공제" value={-r.earnedTaxCredit} />
              <ResultRow
                label="추가 세액공제"
                hint="실제 적용분"
                value={
                  -Math.min(
                    r.extraTaxCredit,
                    Math.max(0, r.computedTax - r.earnedTaxCredit)
                  )
                }
              />
              <ResultDivider />
              <ResultRow
                label="결정세액(소득세)"
                value={r.determinedIncomeTax}
                strong
              />
            </div>

            {r.wastedCredit > 0 && (
              <p className="mt-4 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm">
                ⚠️ 세액공제 <b>{formatWon(r.wastedCredit)}</b>은 낼 세금이 없어
                <b> 효과 없이 사라졌어요.</b> 세금은 0원 밑으로 내려가지
                않거든요. 세액공제를 더 받아도 이만큼은 돌려받지 못해요.
              </p>
            )}
          </Card>

          {/* ③ 환급/추납 — 두 열 아래 가로 전체 */}
          <Card highlight padding="lg" className="lg:col-span-2">
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isRefund ? "text-success" : "text-danger"
                  )}
                >
                  {isRefund ? "예상 환급액 (추정)" : "추가 납부 예상 (추정)"}
                </p>
                <p
                  className={cn(
                    "mt-1 text-3xl font-bold tabular-nums lg:text-4xl",
                    isRefund ? "text-success" : "text-danger"
                  )}
                >
                  {formatWon(Math.abs(r.refund))}
                </p>
                <p className="mt-4 text-xs text-muted">
                  결정세액이 기납부세액보다 <b>적으면 −(환급)</b>, <b>많으면 +(추가납부)</b>
                  예요. 환급은 미리 더 낸 세금을 돌려받는 거라, 기납부세액보다 많이 받을
                  수는 없어요.
                </p>
              </div>
              <div className="mt-5 space-y-2 text-sm lg:mt-0">
                <ResultRow
                  label="결정세액"
                  hint="실제 낼 세금(지방세 포함)"
                  value={r.determinedTax}
                />
                <ResultRow
                  label="기납부세액"
                  hint="매달 미리 떼인 세금"
                  value={r.withheld}
                />
                <ResultDivider />
                <div className="flex items-center justify-between">
                  <span className="font-bold">결정세액 − 기납부세액</span>
                  <span
                    className={cn(
                      "text-base font-bold tabular-nums",
                      isRefund ? "text-success" : "text-danger",
                    )}
                  >
                    {settle < 0
                      ? `− ${formatWon(-settle)}`
                      : settle > 0
                        ? `+ ${formatWon(settle)}`
                        : formatWon(0)}
                    <span className="ml-1.5 text-xs">
                      {settle < 0 ? "(환급)" : settle > 0 ? "(추가납부)" : ""}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <RelatedLessons items={RELATED} />

      <Disclaimer>
        {RATE_YEAR}년 기준, 본인 1인을 가정한 <b>아주 단순화한 추정치예요.</b>{" "}
        실제 공제 항목·한도는 훨씬 다양해서 결과와 차이가 날 수 있어요. 정확한
        금액은 국세청 연말정산 간소화·회사에서 확인하세요.
      </Disclaimer>
    </main>
  );
}
