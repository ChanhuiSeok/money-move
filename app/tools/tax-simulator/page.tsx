"use client";

import { useEffect, useState } from "react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { Disclaimer } from "@/components/tools/Disclaimer";
import { ItemMoneyRow } from "@/components/tools/ItemMoneyRow";
import { MoneyField } from "@/components/tools/MoneyField";
import { RelatedLessons } from "@/components/tools/RelatedLessons";
import { ResultDivider, ResultRow } from "@/components/tools/ResultRow";
import { RATE_YEAR } from "@/content/rates";
import { formatPercent, formatWon } from "@/lib/format";
import {
  bracketOf,
  simulateYearEnd,
  taxBrackets,
  type TaxBracket,
} from "@/lib/taxsim";
import {
  computeCredits,
  computeDeductions,
  emptyCreditInputs,
  emptyDeductionInputs,
  type CreditInputs,
  type DeductionInputs,
} from "@/lib/yearend-items";
import { hasProfile, taxableAnnual } from "@/lib/profile";
import { useProfile } from "@/store/useProfile";
import { cn } from "@/lib/utils";

const RELATED = [
  { id: "deduction-vs-credit", label: "소득공제 vs 세액공제" },
  { id: "year-end-tax", label: "연말정산이 뭐예요?" },
];

const SALARY_PRESETS = [30_000_000, 50_000_000, 70_000_000];

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

/** 신용카드 등 3종 입력 항목(합쳐서 하나의 카드 소득공제로). */
const CARD_ITEMS: {
  key: "cardCredit" | "cardCheckCash" | "cardMarketTransit";
  label: string;
  tip: string;
}[] = [
  {
    key: "cardCredit",
    label: "신용카드",
    tip: "신용카드 사용분은 15% 공제돼요. 단, 총급여의 25%를 넘게 쓴 금액부터 인정돼요.",
  },
  {
    key: "cardCheckCash",
    label: "체크카드·현금영수증",
    tip: "체크카드·현금영수증은 30%로, 신용카드(15%)보다 공제율이 두 배 높아요.",
  },
  {
    key: "cardMarketTransit",
    label: "전통시장·대중교통",
    tip: "전통시장·대중교통 사용분은 40%까지 공제돼요. 같은 돈이면 여기 쓴 게 제일 유리해요.",
  },
];

/** 세액공제 항목(연금/IRP는 따로 묶어 표시). */
const CREDIT_ITEMS: {
  key: keyof Omit<CreditInputs, "pension" | "irp">;
  label: string;
  tip: string;
}[] = [
  {
    key: "insurancePremium",
    label: "보장성보험료",
    tip: "실손·자동차·생명보험 등 보장성보험료는 연 100만 원까지, 그 12%를 세금에서 깎아요.",
  },
  {
    key: "medical",
    label: "의료비",
    tip: "총급여의 3%를 넘게 쓴 의료비의 15%를 공제해요. 3% 이하로 쓰면 공제가 없어요.",
  },
  {
    key: "education",
    label: "교육비",
    tip: "본인·부양가족 교육비의 15%를 공제해요. (대상·한도는 단순화한 추정치예요)",
  },
  {
    key: "donation",
    label: "기부금",
    tip: "기부금은 1천만 원까지 15%, 그 초과분은 30%를 세금에서 깎아요.",
  },
  {
    key: "rent",
    label: "월세",
    tip: "총급여 8천만 이하 무주택 세대주면, 월세(연 1천만 한도)의 15%(5,500만 이하 17%)를 공제해요.",
  },
];

export default function TaxSimulatorPage() {
  const hydrate = useProfile((s) => s.hydrate);
  const hydrated = useProfile((s) => s.hydrated);
  const profile = useProfile((s) => s.profile);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // hydrate 후 프로필 총급여로 seed해 remount(setState-in-effect 회피).
  const initialSalary =
    hydrated && hasProfile(profile)
      ? String(taxableAnnual(profile))
      : "40000000";

  return (
    <TaxSimulator key={hydrated ? "ready" : "empty"} initialSalary={initialSalary} />
  );
}

function TaxSimulator({ initialSalary }: { initialSalary: string }) {
  const [salary, setSalary] = useState(initialSalary);
  const [ded, setDed] = useState<DeductionInputs>(emptyDeductionInputs);
  const [cred, setCred] = useState<CreditInputs>(emptyCreditInputs);

  const totalSalary = Number(salary || "0");

  // 항목별 입력 → 합산 공제액. 이 값이 그대로 아래 흐름 시각화로 흘러간다.
  const dedBreak = computeDeductions(ded, totalSalary);
  const credBreak = computeCredits(cred, totalSalary);

  const r = simulateYearEnd({
    totalSalary,
    extraIncomeDeduction: dedBreak.total,
    extraTaxCredit: credBreak.total,
  });
  const { index: bracketIndex, bracket } = bracketOf(r.taxableBase);
  // 연말정산 결과지 관례: 결정세액 − 기납부세액. 음수면 환급, 양수면 추가납부.
  const settle = r.determinedTax - r.withheld;
  const isRefund = settle <= 0;
  const hasTax = r.computedTax > 0;

  const setDedKey =
    (k: keyof DeductionInputs) => (v: number) =>
      setDed((s) => ({ ...s, [k]: v }));
  const setCredKey =
    (k: keyof CreditInputs) => (v: number) =>
      setCred((s) => ({ ...s, [k]: v }));

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6 lg:max-w-5xl lg:px-8 lg:py-8">
      <BackLink className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">연말정산 시뮬레이터</h1>
      <p className="mt-1 text-sm text-muted">
        내 공제 항목을 대략 입력하면, 세금이 어떻게 줄고 얼마를 돌려받는지 흐름으로
        보여 줘요.
      </p>

      <MascotBubble
        mood="idle"
        message="카드값·연금·의료비… 아는 만큼만 넣어 보세요. 빈칸은 0으로 둬도 괜찮아요!"
        className="mt-4"
      />

      {/* 입력 — 총급여 + 항목별 소득공제/세액공제 */}
      <Card padding="md" className="mt-4">
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
                  : "border-border text-muted hover:border-brand-400",
              )}
            >
              {p / 10_000}만
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-x-8 gap-y-6 lg:grid-cols-2">
          {/* 소득공제 항목 */}
          <section>
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-bold text-brand-600">소득공제 항목</h2>
              <Tooltip>
                과세표준(세금 매기는 기준)을 줄여 주는 항목들이에요. 같은 금액이면
                세액공제보다 효과는 작지만, 카드·청약처럼 이미 쓰는 돈이라 챙기기
                쉬워요.
              </Tooltip>
            </div>
            <p className="mt-0.5 text-xs text-muted">신용카드·청약 등</p>

            <div className="mt-2 divide-y divide-border/60">
              {CARD_ITEMS.map((it) => (
                <ItemMoneyRow
                  key={it.key}
                  label={it.label}
                  tooltip={it.tip}
                  value={ded[it.key]}
                  onChange={setDedKey(it.key)}
                />
              ))}
            </div>
            <div className="mt-1.5 flex items-center justify-between rounded-lg bg-subtle/60 px-3 py-2 text-xs">
              <span className="flex items-center gap-1 text-muted">
                카드 소득공제
                <Tooltip>
                  총급여의 25%를 넘게 쓴 금액부터 공제돼요. 한도는 총급여 7천만
                  이하 300만, 초과 250만이에요. (단순화한 추정치)
                </Tooltip>
              </span>
              <span className="font-bold tabular-nums text-success">
                {formatWon(dedBreak.card)}
              </span>
            </div>

            <div className="mt-3 divide-y divide-border/60">
              <ItemMoneyRow
                label="주택청약저축"
                tooltip="무주택 세대주·총급여 7천만 이하면, 납입액(연 300만 한도)의 40%를 소득공제해요."
                value={ded.housingSavings}
                onChange={setDedKey("housingSavings")}
                effect={dedBreak.housing}
                effectPrefix="소득공제"
              />
            </div>
          </section>

          {/* 세액공제 항목 */}
          <section>
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-bold text-brand-600">세액공제 항목</h2>
              <Tooltip>
                계산된 세금(산출세액)을 1:1로 직접 깎아 주는 항목들이에요. 효과가
                커서 챙기면 환급이 쑥 늘어요. 단, 낼 세금보다 많이는 못 깎아요.
              </Tooltip>
            </div>
            <p className="mt-0.5 text-xs text-muted">연금·의료비·기부금 등</p>

            <div className="mt-2 divide-y divide-border/60">
              <ItemMoneyRow
                label="연금저축"
                tooltip="연금저축은 연 600만 원까지 공제 대상이에요. 노후 준비하면서 세금도 깎는 인기 항목이죠."
                value={cred.pension}
                onChange={setCredKey("pension")}
              />
              <ItemMoneyRow
                label="IRP(퇴직연금)"
                tooltip="IRP를 더하면 연금저축과 합쳐 연 900만 원까지 공제돼요."
                value={cred.irp}
                onChange={setCredKey("irp")}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between rounded-lg bg-subtle/60 px-3 py-2 text-xs">
              <span className="flex items-center gap-1 text-muted">
                연금·IRP 세액공제
                <Tooltip>
                  공제 대상 납입액의 세금이 총급여 5,500만 이하 16.5%, 초과 13.2%
                  줄어요(지방세 포함). 여기 표시는 소득세 몫이에요.
                </Tooltip>
              </span>
              <span className="font-bold tabular-nums text-success">
                {formatWon(credBreak.pension)}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setCred((s) => ({ ...s, pension: 6_000_000, irp: 3_000_000 }))
              }
              className="mt-2 rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted transition-colors hover:border-brand-400"
            >
              연금 900만 채우기
            </button>

            <div className="mt-3 divide-y divide-border/60">
              {CREDIT_ITEMS.map((it) => (
                <ItemMoneyRow
                  key={it.key}
                  label={it.label}
                  tooltip={it.tip}
                  value={cred[it.key]}
                  onChange={setCredKey(it.key)}
                  effect={credBreak[it.key]}
                  effectPrefix="세액공제"
                />
              ))}
            </div>
          </section>
        </div>
      </Card>

      {/* 모바일 전용 — 입력 바로 아래 핵심 결과 요약 */}
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
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold text-brand-600">
                ① 소득공제: 세금 매기는 ‘기준’을 줄여요
              </p>
            </div>
            <p className="mt-1 text-xs text-muted">
              내 연봉 전체에 세금이 붙는 게 아니에요. 공제를 다 뺀 나머지(이걸{" "}
              <b>과세표준</b>이라고 해요)에만 붙어요. 그래서 공제가 클수록 세금
              기준이 작아져요.
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
              <span>공제로 빠짐 {formatWon(r.totalSalary - r.taxableBase)}</span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <ResultRow label="총급여" value={r.totalSalary} />
              <ResultRow label="근로소득공제" value={-r.earnedDeduction} />
              <ResultRow label="기본공제(본인)" value={-r.basicDeduction} />
              <ResultRow label="4대 보험료" value={-r.insuranceDeduction} />
              <ResultRow
                label="내가 넣은 소득공제"
                hint="카드·청약 등"
                value={-r.extraIncomeDeduction}
              />
              <ResultDivider />
              <ResultRow label="과세표준" value={r.taxableBase} strong />
            </div>

            {/* 누진세율 구간 — 소득공제를 움직이면 과세표준이 구간 사이를 오간다 */}
            <div className="mt-4 rounded-xl bg-subtle/60 p-3">
              <p className="flex items-center gap-1 text-xs font-semibold text-muted">
                세율 구간 — 위로 갈수록 높은 세율
                <Tooltip>
                  과세표준을 8단계로 나눠, 높은 구간일수록 높은 세율을 매겨요.
                  소득공제로 과세표준이 줄면 더 낮은 구간으로 내려갈 수 있어요.
                </Tooltip>
              </p>
              <div className="mt-2 flex gap-0.5">
                {taxBrackets.map((b, i) => (
                  <div
                    key={b.rate}
                    className={cn(
                      "flex-1 rounded py-1 text-center text-[10px] font-bold tabular-nums transition-colors",
                      i === bracketIndex
                        ? "bg-brand-500 text-white"
                        : "bg-surface text-muted",
                    )}
                  >
                    {Math.round(b.rate * 100)}%
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-muted">
                과세표준{" "}
                <b className="text-foreground">{formatWon(r.taxableBase)}</b> →{" "}
                {bracketLabel(bracket)} 구간 · 세율{" "}
                <b className="text-brand-600">{formatPercent(bracket.rate)}</b>
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
              <p className="flex items-center gap-1 text-xs font-semibold text-muted">
                산출세액은 이렇게 나와요
                {bracket.deduction > 0 && (
                  <Tooltip>
                    누진공제는 ‘낮은 구간은 낮은 세율로’ 계산되게 맞춰 주는
                    보정값이에요. 과세표준에 세율을 곱한 뒤 누진공제만큼 빼죠.
                    그래서 과세표준이 위 구간으로 갈수록 누진공제도 커져요.
                  </Tooltip>
                )}
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
                낼 세금(산출세액)이 0원이에요. 세액공제로 더 돌려받을 것도 없어요.
              </p>
            )}

            <div className="mt-4 space-y-2 text-sm">
              <ResultRow label="산출세액(소득세)" value={r.computedTax} />
              <ResultRow label="근로소득세액공제" value={-r.earnedTaxCredit} />
              <ResultRow
                label="내가 넣은 세액공제"
                hint="실제 적용분"
                value={
                  -Math.min(
                    r.extraTaxCredit,
                    Math.max(0, r.computedTax - r.earnedTaxCredit),
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
                않거든요.
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
                    isRefund ? "text-success" : "text-danger",
                  )}
                >
                  {isRefund ? "예상 환급액 (추정)" : "추가 납부 예상 (추정)"}
                </p>
                <p
                  className={cn(
                    "mt-1 text-3xl font-bold tabular-nums lg:text-4xl",
                    isRefund ? "text-success" : "text-danger",
                  )}
                >
                  {formatWon(Math.abs(r.refund))}
                </p>
                <p className="mt-4 text-xs text-muted">
                  결정세액이 기납부세액보다 <b>적으면 −(환급)</b>,{" "}
                  <b>많으면 +(추가납부)</b>예요. 환급은 미리 더 낸 세금을 돌려받는
                  거라, 기납부세액보다 많이 받을 수는 없어요.
                </p>
              </div>
              <div className="mt-5 space-y-2 text-sm lg:mt-0">
                <ResultRow
                  label="결정세액(소득세)"
                  hint="②에서 이어짐"
                  value={r.determinedIncomeTax}
                />
                <ResultRow
                  label="지방소득세"
                  hint="소득세의 10%"
                  value={r.localTax}
                />
                <ResultDivider />
                <ResultRow
                  label="결정세액 합계"
                  hint="실제 낼 세금"
                  value={r.determinedTax}
                  strong
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
        공제 항목·한도·문턱은 실제로 훨씬 다양해서 결과와 차이가 날 수 있어요.
        정확한 금액은 국세청 연말정산 간소화·회사에서 확인하세요.
      </Disclaimer>
    </main>
  );
}
