"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarClock, Sparkles, Wallet } from "lucide-react";
import { NewsIcon } from "@/components/icons/PixelIcon";
import { LearnStatus } from "@/components/home/LearnStatus";
import { MascotBubble } from "@/components/mascot/MascotBubble";
import { NewsList } from "@/components/news/NewsList";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Card } from "@/components/ui/Card";
import { tileVariants } from "@/components/ui/tileStyles";
import { glossaryTerms } from "@/content/glossary";
import { orderedLessonIds } from "@/content/levels";
import { greetingLines } from "@/content/messages";
import { scenarios } from "@/content/scenarios";
import { formatWon } from "@/lib/format";
import { firstIncompleteLessonId } from "@/lib/path";
import { hasProfile, profileTakeHome, saveProfile } from "@/lib/profile";
import { todayKey } from "@/lib/progress";
import { currentSeason, getSeasonById } from "@/lib/season";
import { useProfile } from "@/store/useProfile";
import { useProgress } from "@/store/useProgress";
import type { Profile } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { getUserLevelInfo } from "@/lib/achievements";
import type { MascotVariant } from "@/components/mascot/MascotImage";

/** 날짜 문자열을 시드로 한 안정적 인덱스(서버·클라이언트 동일 → 하이드레이션 안전). */
function dailyIndex(key: string, mod: number): number {
  if (mod <= 0) return 0;
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum % mod;
}

function AnimatedWon({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 800;
    const startTime = performance.now();
    let frameId: number;

    function run(now: number) {
      const progress = Math.min(1, (now - startTime) / duration);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * end);
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(run);
      }
    }

    frameId = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <>{formatWon(displayValue)}</>;
}

function DDayWidgetView({
  profile,
  onSalaryDayChange,
}: {
  profile: Profile;
  onSalaryDayChange: (day: number) => void;
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });

  useEffect(() => {
    function update() {
      const now = new Date();
      const day = profile.salaryDay ?? 25;
      let target = new Date(now.getFullYear(), now.getMonth(), day, 0, 0, 0, 0);
      if (now >= target) {
        target = new Date(now.getFullYear(), now.getMonth() + 1, day, 0, 0, 0, 0);
      }
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
        return;
      }
      const totalSecs = Math.floor(diff / 1000);
      const d = Math.floor(totalSecs / (3600 * 24));
      const h = Math.floor((totalSecs % (3600 * 24)) / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, totalSeconds: totalSecs });
    }

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [profile.salaryDay]);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <p className="text-sm text-muted">다음 월급날까지 남은 시간</p>
        
        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-brand-600 lg:text-5xl">
            D-{timeLeft.days}
          </span>
          <span className="text-base font-bold tabular-nums text-foreground/80">
            {timeLeft.hours.toString().padStart(2, "0")}시간{" "}
            {timeLeft.minutes.toString().padStart(2, "0")}분{" "}
            {timeLeft.seconds.toString().padStart(2, "0")}초
          </span>
        </div>

        <p className="mt-3 text-xs text-muted/80">
          남은 시간: <span className="font-bold tabular-nums text-foreground">{timeLeft.totalSeconds.toLocaleString()}초</span>
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-xs">
        <span className="font-semibold text-muted">내 월급날 설정</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSalaryDayChange((profile.salaryDay ?? 25) - 1)}
            className="flex size-6 items-center justify-center rounded border border-border bg-surface font-bold text-muted hover:bg-subtle active:scale-95 transition-transform"
          >
            −
          </button>
          <span className="w-16 text-center font-bold text-foreground">
            매월 {profile.salaryDay ?? 25}일
          </span>
          <button
            type="button"
            onClick={() => onSalaryDayChange((profile.salaryDay ?? 25) + 1)}
            className="flex size-6 items-center justify-center rounded border border-border bg-surface font-bold text-muted hover:bg-subtle active:scale-95 transition-transform"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// NudgeWidgetView removed

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

  const saveProfileStore = useProfile((s) => s.save);
  const widgetType = profile.widgetType ?? "salary";

  function handleWidgetChange(type: "salary" | "dday") {
    saveProfileStore({
      ...profile,
      widgetType: type,
    });
  }

  function handleSalaryDayChange(day: number) {
    const clamped = Math.min(31, Math.max(1, day));
    saveProfileStore({
      ...profile,
      salaryDay: clamped,
    });
  }

  const showOnboardingNudge = profileHydrated && !hasProfile(profile);
  const bubbleMessage = showOnboardingNudge
    ? "반가워요! 아래에 월급을 딱 한 번만 적어두면, 모든 레슨과 계산기가 실제 내 숫자로 바뀐답니다!"
    : widgetType === "dday"
      ? "월급날까지 지갑 사수 대작전! 🪙 조금만 더 힘내볼까요?"
      : greeting;

  const currentLvl = getUserLevelInfo(progress.xp);
  const mascotVariant = `lv${currentLvl.level}` as MascotVariant;

  const nextId = firstIncompleteLessonId(
    orderedLessonIds,
    progress.completedLessonIds,
  );
  const started = progress.completedLessonIds.length > 0;
  const allDone = nextId === null;
  const streakAtRisk =
    hydrated && progress.streak.count > 0 && progress.streak.lastDate !== today;

  const th =
    profileHydrated && hasProfile(profile) ? profileTakeHome(profile) : null;

  const learnCta = allDone
    ? "학습 경로 다시 보기"
    : streakAtRisk
      ? `${progress.streak.count}일째 이어가기`
      : started
        ? "이어서 풀기"
        : "학습 시작하기";

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      {/* 인사 */}
      <MascotBubble
        variant={mascotVariant}
        message={bubbleMessage}
        size="lg"
        priority
        isLoading={!profileHydrated || !hydrated}
      />

      {/* 시즌 배너 — '필요한 때'에만. hydrated 게이트(SSR/클라 날짜 불일치 회피) */}
      {hydrated && season && (
        <Link
          href={season.ctaHref}
          className="mt-5 flex items-center gap-3 rounded-card border-2 border-brand-500/30 bg-brand-500/10 p-4 transition-[border-color,background-color] duration-100 hover:bg-brand-500/15"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-600">
            <CalendarClock className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">{season.title}</span>
            <span className="block text-xs text-muted">{season.message}</span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-brand-600" />
        </Link>
      )}

      {/* PC(lg): 2단 — 좌측 메인(내 돈·내 학습·상황별·한 입) + 우측 뉴스(sticky).
          모바일: 세로 스택. 헤더/탭바에 이미 전역 내비가 있어, 홈은 '내비 칩' 없이 콘텐츠에 집중한다. */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.7fr_1fr] lg:items-start lg:gap-6">
        {/* ── 메인 컬럼 ── */}
        <div className="flex flex-col gap-5">
          {/* 내 돈 — 개인화 금융 대시보드(이 앱의 축) */}
          <Card highlight padding="lg">
            <div className="h-8 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-brand-600">
                <Wallet className="size-6" /> 내 돈
              </span>

              {/* 위젯 스위처 버튼 & 로딩 중 스켈레톤 스페이서 */}
              {!profileHydrated ? (
                <div className="h-6 w-24 animate-pulse rounded-lg bg-subtle/50" />
              ) : hasProfile(profile) ? (
                <div className="flex gap-0.5 rounded-lg bg-subtle p-0.5 text-[10px]">
                  {(["salary", "dday"] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => handleWidgetChange(w)}
                      className={cn(
                        "rounded-md px-2 py-1 font-bold transition-colors",
                        widgetType === w
                          ? "bg-surface text-brand-600 shadow-sm"
                          : "text-muted hover:text-foreground",
                      )}
                    >
                      {w === "salary" ? "실수령" : "디데이"}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="mt-3 h-[208px] flex flex-col justify-between">
              {!profileHydrated ? (
                <div className="animate-pulse flex-1 flex flex-col justify-between">
                  <div>
                    {/* 타이틀 스켈레톤 */}
                    <div className="h-5 w-40 rounded bg-subtle/50" />
                    {/* 금액 스켈레톤 */}
                    <div className="mt-2.5 h-10 w-56 rounded-lg bg-subtle/50 lg:h-12" />
                    {/* 비중 바 스켈레톤 */}
                    <div className="mt-5 h-2.5 w-full rounded-full bg-subtle/50" />
                    {/* 상세설명 스켈레톤 */}
                    <div className="mt-2 flex justify-between">
                      <div className="h-4 w-28 rounded bg-subtle/50" />
                      <div className="h-4 w-48 rounded bg-subtle/50" />
                    </div>
                  </div>
                  {/* 버튼 스켈레톤 */}
                  <div className="flex gap-2">
                    <div className="h-11 flex-1 rounded-xl bg-subtle/50" />
                    <div className="h-11 w-20 rounded-xl bg-subtle/50" />
                  </div>
                </div>
              ) : th ? (
                widgetType === "salary" ? (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-muted">
                        이번 달에 받을 예상 실수령액이에요
                      </p>
                      <p className="mt-0.5 text-4xl font-extrabold tracking-tight tabular-nums lg:text-5xl">
                        <AnimatedWon value={th.net} />
                      </p>
                      {/* 실수령 vs 공제 비중 바 */}
                      <div
                        className="mt-4 h-2.5 overflow-hidden rounded-full bg-subtle/50"
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
                    </div>
                    <div className="mt-5 flex gap-2">
                      <Link
                        href="/tools/take-home"
                        className={buttonVariants({
                          variant: "secondary",
                          size: "md",
                          className: "flex-1",
                        })}
                      >
                        내역 자세히 <ArrowRight className="size-4" />
                      </Link>
                      <Link
                        href="/profile"
                        className={buttonVariants({
                          variant: "ghost",
                          size: "md",
                          className: "text-muted hover:text-foreground",
                        })}
                      >
                        내 정보
                      </Link>
                    </div>
                  </div>
                ) : (
                  <DDayWidgetView profile={profile} onSalaryDayChange={handleSalaryDayChange} />
                )
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-2xl font-extrabold tracking-tight lg:text-3xl leading-tight text-foreground">
                      월급 딱 한 번만 적어볼까요?
                      <br className="hidden sm:block" /> 여기가 전부 내 지갑 이야기가 돼요
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      모든 레슨과 계산기가 내 실제 월급 기준으로 바뀌어요. 30초면 충분해요.
                    </p>
                  </div>
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
                </div>
              )}
            </div>
          </Card>

          {/* 내 학습 — 레벨별 진행 + 스트릭/XP + 이어서 풀기 */}
          <LearnStatus
            hydrated={hydrated}
            completedIds={progress.completedLessonIds}
            xp={progress.xp}
            streakCount={progress.streak.count}
            nextHref={allDone ? "/learn" : `/learn/${nextId}`}
            ctaLabel={learnCta}
            variant={showOnboardingNudge ? "secondary" : "primary"}
          />
          {hydrated && !started && (
            <p className="-mt-1 text-center text-sm">
              <Link
                href="/diagnostic"
                className="inline-flex items-center gap-1 font-semibold text-muted transition-colors hover:text-brand-600"
              >
                <Sparkles className="size-4" /> 이미 좀 아세요? 진단으로 레벨
                건너뛰기
              </Link>
            </p>
          )}

          {/* 상황별로 시작하기 — 라이프 이벤트 진입(내비엔 없는 콘텐츠 경로) */}
          <section>
            <h2 className="text-base font-bold">지금 어떤 고민이 있나요?</h2>
            <p className="mt-0.5 text-sm text-muted">
              내 상황을 고르면 꼭 필요한 레슨과 계산기만 쏙쏙 골라 모아 드릴게요.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {scenarios.map((s) => (
                <Link
                  key={s.id}
                  href={`/start/${s.id}`}
                  className={tileVariants({
                    className: "flex-col items-start gap-2 p-4",
                  })}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-500/10">
                    <s.icon className="w-8" />
                  </span>
                  <span className="mt-0.5 block text-sm font-bold leading-tight">
                    {s.title}
                  </span>
                  <span className="hidden text-xs leading-snug text-muted sm:block">
                    {s.blurb}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* 오늘의 한 입 — 용어 하나 */}
          <Card padding="md">
            <p className="text-xs font-bold tracking-wide text-brand-600">
              하루 1분, 오늘의 한 입 🍪
            </p>
            <p className="mt-1.5 text-xl font-bold">{term.term}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{term.short}</p>
            <Link
              href="/glossary"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              용어 사전 더 보기 <ArrowRight className="size-4" />
            </Link>
          </Card>
        </div>

        {/* ── 오늘의 경제뉴스 — PC(lg)에서는 우측 sticky 컬럼, 모바일에선 맨 아래 ── */}
        <aside className="lg:sticky lg:top-24">
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-500/10">
                  <NewsIcon className="w-8" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-none">
                    오늘의 경제뉴스
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
                    <span className="size-1.5 rounded-full bg-success" />
                    놓쳐선 안 될 최신 소식들
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

          {/* 청약 정보 광고 배너 */}
          <div
            className="mt-4 p-3 rounded-card bg-subtle/80 hover:bg-subtle dark:bg-subtle/30 dark:hover:bg-subtle/50 transition-colors"
          >
            <a
              href="https://www.applyhome.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 text-xl">
                🏢
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-brand-600">청약 가이드 🔔</p>
                <p className="mt-0.5 text-sm font-bold leading-tight text-foreground truncate">
                  내 지역 청약정보를 알고 싶다면?
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  청약홈 바로가기 · 청약 일정 확인
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-brand-600" />
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
