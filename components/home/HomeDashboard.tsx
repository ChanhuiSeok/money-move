"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarClock,
  ClipboardCheck,
  Flame,
  Newspaper,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { NewsList } from "@/components/news/NewsList";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { glossaryTerms } from "@/content/glossary";
import { orderedLessonIds } from "@/content/levels";
import { greetingLines } from "@/content/messages";
import { scenarios } from "@/content/scenarios";
import { formatWon } from "@/lib/format";
import { firstIncompleteLessonId } from "@/lib/path";
import { hasProfile, profileTakeHome } from "@/lib/profile";
import { todayKey } from "@/lib/progress";
import { currentSeason, getSeasonById } from "@/lib/season";
import { useProfile } from "@/store/useProfile";
import { useProgress } from "@/store/useProgress";

/** 날짜 문자열을 시드로 한 안정적 인덱스(서버·클라이언트 동일 → 하이드레이션 안전). */
function dailyIndex(key: string, mod: number): number {
  if (mod <= 0) return 0;
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum % mod;
}

export function HomeDashboard() {
  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const progress = useProgress((s) => s.progress);
  const hydrateProfile = useProfile((s) => s.hydrate);
  const profileHydrated = useProfile((s) => s.hydrated);
  const profile = useProfile((s) => s.profile);

  useEffect(() => {
    hydrate();
    hydrateProfile();
  }, [hydrate, hydrateProfile]);

  const today = todayKey();
  // 개발 모드에서만 ?season=year-end|year-end-prep 로 시즌 배너를 미리 띄워볼 수 있다.
  const searchParams = useSearchParams();
  const seasonOverride =
    process.env.NODE_ENV !== "production"
      ? getSeasonById(searchParams.get("season"))
      : null;
  const season = seasonOverride ?? currentSeason(today);
  const term = glossaryTerms[dailyIndex(today, glossaryTerms.length)];
  const greeting = greetingLines[dailyIndex(today, greetingLines.length)];

  const nextId = firstIncompleteLessonId(
    orderedLessonIds,
    progress.completedLessonIds,
  );
  const started = progress.completedLessonIds.length > 0;
  const allDone = nextId === null;
  // 스트릭이 있는데 오늘 아직 활동 안 함 → 끊길 위험(히어로에 흡수)
  const streakAtRisk =
    hydrated && progress.streak.count > 0 && progress.streak.lastDate !== today;

  const th =
    profileHydrated && hasProfile(profile) ? profileTakeHome(profile) : null;

  const learnSub = allDone
    ? "다시 보기"
    : streakAtRisk
      ? `${progress.streak.count}일째 이어가기`
      : started
        ? "이어서 풀기"
        : "첫 문제 풀기";

  return (
    <main className="mx-auto w-full max-w-md flex-1 p-5 lg:max-w-4xl lg:py-8">
      {/* 인사 */}
      <MascotBubble mood="idle" message={greeting} className="pt-2" />

      {/* PC(lg): 2단 — 좌측 메인 + 우측 경제뉴스(sticky). 모바일: 세로 스택(뉴스는 맨 아래 그대로). */}
      <div className="mt-5 flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_336px] lg:items-start lg:gap-6">
        <div className="flex flex-col gap-5">
          {/* 시즌 배너 — '필요한 때'에만. hydrated 게이트(SSR/클라 날짜 불일치 회피) */}
          {hydrated && season && (
            <Link
              href={season.ctaHref}
              className="flex items-center gap-3 rounded-card border border-brand-500/30 bg-brand-500/10 p-4 transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-brand-500/15 hover:shadow-md active:translate-y-0"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-600">
                <CalendarClock className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{season.title}</span>
                <span className="block text-xs text-muted">
                  {season.message}
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-brand-600" />
            </Link>
          )}

          {/* ── 히어로: 내 돈 (개인화된 금융 대시보드 = 이 앱의 축) ── */}
          <Card highlight padding="lg">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-brand-600">
                <Wallet className="size-4" /> 내 돈
              </span>
              {hydrated && (progress.streak.count > 0 || progress.xp > 0) && (
                <Link
                  href="/achievements"
                  className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold tabular-nums"
                >
                  <span className="flex items-center gap-1 text-orange-500">
                    <Flame className="size-3.5" />
                    {progress.streak.count}
                  </span>
                  <span className="flex items-center gap-1 text-brand-600">
                    <Zap className="size-3.5" />
                    {progress.xp}
                  </span>
                </Link>
              )}
            </div>

            {th ? (
              <>
                <p className="mt-3 text-sm text-muted">
                  사용자님의 이번 달 실수령액 (추정)
                </p>
                <p className="mt-0.5 text-3xl font-bold tracking-tight tabular-nums lg:text-4xl">
                  {formatWon(th.net)}
                </p>
                {/* 실수령 vs 공제 비중 바 */}
                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-subtle"
                  aria-hidden
                >
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${(th.net / th.monthlyGross) * 100}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-muted tabular-nums">
                  <span>실수령 {formatWon(th.net)}</span>
                  <span>
                    세전 {formatWon(th.monthlyGross)} · 공제 −
                    {formatWon(th.totalDeduction)}
                  </span>
                </div>
                <div className="mt-5 flex gap-2">
                  <Link
                    href="/tools/take-home"
                    className={buttonVariants({
                      size: "md",
                      className: "flex-1",
                    })}
                  >
                    내역 자세히 <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/profile"
                    className={buttonVariants({
                      variant: "secondary",
                      size: "md",
                    })}
                  >
                    내 정보
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="mt-3 text-xl font-bold tracking-tight lg:text-2xl">
                  월급 한 번만 넣으면, 여기가 사용자님 얘기가 돼요
                </p>
                <p className="mt-1 text-sm text-muted">
                  레슨·계산기가 사용자님 실제 숫자로 바뀌어요. 30초면 끝나요.
                </p>
                <Link
                  href="/profile"
                  className={buttonVariants({
                    size: "lg",
                    fullWidth: true,
                    className: "mt-5",
                  })}
                >
                  월급 넣기 <ArrowRight className="size-5" />
                </Link>
              </>
            )}
          </Card>

          {/* ── 빠른 이동: 학습 · 계산기 · 모의고사/진단 (모두 동급) ── */}
          <div className="grid grid-cols-3 gap-3">
            <ChipLink
              href={allDone ? "/learn" : `/learn/${nextId}`}
              icon={<BookOpen className="size-4" />}
              label="오늘의 학습"
              sub={learnSub}
            />
            <ChipLink
              href="/tools"
              icon={<Calculator className="size-4" />}
              label="계산기"
              sub="실수령액 등"
            />
            {hydrated &&
              (started ? (
                <ChipLink
                  href="/exams"
                  icon={<ClipboardCheck className="size-4" />}
                  label="모의고사"
                  sub="실전 시험지"
                />
              ) : (
                <ChipLink
                  href="/diagnostic"
                  icon={<Sparkles className="size-4" />}
                  label="진단"
                  sub="레벨 건너뛰기"
                />
              ))}
          </div>

          {/* ── 상황별로 시작하기 (보조) ── */}
          <section>
            <h2 className="text-sm font-bold text-muted">상황별로 시작하기</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {scenarios.map((s) => (
                <Link
                  key={s.id}
                  href={`/start/${s.id}`}
                  className="group flex items-center gap-2 rounded-card border border-border bg-surface p-3 transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-500/5 hover:shadow-md active:translate-y-0 lg:flex-col lg:items-start lg:gap-2"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 transition-transform duration-200 group-hover:scale-110">
                    <s.icon className="size-4" />
                  </span>
                  <span className="min-w-0 text-sm font-bold leading-tight">
                    {s.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── 오늘의 한 입 (하단, 가볍게) ── */}
          <Card padding="md">
            <p className="text-xs font-semibold tracking-wide text-muted">
              오늘의 한 입
            </p>
            <p className="mt-1 text-lg font-bold">{term.term}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {term.short}
            </p>
            <Link
              href="/glossary"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              용어 사전 더 보기 <ArrowRight className="size-4" />
            </Link>
          </Card>
        </div>

        {/* ── 오늘의 경제뉴스 — PC(lg)에서는 우측 sticky 컬럼, 모바일에선 맨 아래 ── */}
        <div className="lg:sticky lg:top-8">
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                  <Newspaper className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-none">
                    오늘의 경제뉴스
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
                    <span className="size-1.5 animate-pulse rounded-full bg-success" />
                    여러 주제 · 최신순
                  </p>
                </div>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-1 rounded-full bg-subtle px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-600"
              >
                더 보기 <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-2">
              <NewsList limit={8} numbered mixed />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

function ChipLink({
  href,
  icon,
  label,
  sub,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1.5 rounded-card border border-border bg-surface p-3 transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-500/5 hover:shadow-md active:translate-y-0"
    >
      <span className="relative flex size-8 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 transition-transform duration-200 group-hover:scale-110">
        {icon}
      </span>
      <span className="text-sm font-bold leading-none">{label}</span>
      {sub && (
        <span className="truncate text-xs text-muted tabular-nums">{sub}</span>
      )}
    </Link>
  );
}
