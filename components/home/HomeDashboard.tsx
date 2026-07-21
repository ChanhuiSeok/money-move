"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  GripVertical,
  RotateCcw,
  Sparkles,
  Wallet,
} from "lucide-react";
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
import { hasProfile, profileTakeHome } from "@/lib/profile";
import { todayKey } from "@/lib/progress";
import { currentSeason, getSeasonById } from "@/lib/season";
import { useProfile } from "@/store/useProfile";
import { useProgress } from "@/store/useProgress";
import {
  useHomeOrder,
  type HomeSectionId,
  type MobileTab,
  DEFAULT_PC_COLUMNS,
  DEFAULT_MOBILE_SECTION_IDS,
} from "@/store/useHomeOrder";
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
    if (value === 0) return;

    const duration = 800;
    const startTime = performance.now();
    let frameId: number;

    function run(now: number) {
      const progress = Math.min(1, (now - startTime) / duration);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * value);
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
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  useEffect(() => {
    function update() {
      const now = new Date();
      const day = profile.salaryDay ?? 25;
      let target = new Date(now.getFullYear(), now.getMonth(), day, 0, 0, 0, 0);
      if (now >= target) {
        target = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          day,
          0,
          0,
          0,
          0
        );
      }
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
        });
        return;
      }
      const totalSecs = Math.floor(diff / 1000);
      const d = Math.floor(totalSecs / (3600 * 24));
      const h = Math.floor((totalSecs % (3600 * 24)) / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      setTimeLeft({
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
        totalSeconds: totalSecs,
      });
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
          남은 시간:{" "}
          <span className="font-bold tabular-nums text-foreground">
            {timeLeft.totalSeconds.toLocaleString()}초
          </span>
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

/** 카드 드래그 핸들 UI (PC 마우스 전용 인디케이터) */
function DragHandle() {
  return (
    <div
      className="flex size-6 items-center justify-center text-muted/40 hover:text-brand-600 transition-colors shrink-0"
      title="카드를 잡고 이동 (Drag & Drop)"
    >
      <GripVertical className="size-4" />
    </div>
  );
}

/** PC 전용 카드 컨트롤러 */
function CardControl() {
  return (
    <div className="hidden lg:block shrink-0">
      <DragHandle />
    </div>
  );
}

/** 모바일 전용 모던 세그먼트 토글 바 */
function MobileToggleBar() {
  const mobileTab = useHomeOrder((s) => s.mobileTab);
  const setMobileTab = useHomeOrder((s) => s.setMobileTab);

  return (
    <div className="mt-4 flex rounded-xl bg-subtle p-1 border border-border/60 lg:hidden">
      <button
        type="button"
        onClick={() => setMobileTab("news")}
        className={cn(
          "flex-1 flex items-center justify-center rounded-lg py-2.5 text-sm font-bold transition-all",
          mobileTab === "news"
            ? "bg-surface text-foreground shadow-sm border border-border/50 dark:bg-[#2b3248] dark:text-foreground dark:border-white/10 dark:shadow-md"
            : "text-muted font-medium hover:text-foreground"
        )}
      >
        <span>경제 뉴스</span>
      </button>
      <button
        type="button"
        onClick={() => setMobileTab("my-economy")}
        className={cn(
          "flex-1 flex items-center justify-center rounded-lg py-2.5 text-sm font-bold transition-all",
          mobileTab === "my-economy"
            ? "bg-surface text-foreground shadow-sm border border-border/50 dark:bg-[#2b3248] dark:text-foreground dark:border-white/10 dark:shadow-md"
            : "text-muted font-medium hover:text-foreground"
        )}
      >
        <span>나의 경제</span>
      </button>
    </div>
  );
}

/** 도톰하고 명확한 드롭 위치 안내 칩 */
function DropIndicator() {
  return (
    <div className="my-1.5 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-500 bg-brand-500/10 py-3 transition-all duration-150 animate-pulse">
      <span className="size-2 rounded-full bg-brand-500 animate-ping" />
      <span className="text-xs font-bold text-brand-600">
        이곳에 놓아 카드를 이동합니다
      </span>
    </div>
  );
}

/** 빈 컬럼 엠프티 스테이트 및 드롭 타겟 전환 박스 */
function EmptyColumnBox({ isDropTarget }: { isDropTarget: boolean }) {
  if (isDropTarget) {
    return (
      <div className="my-2 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-500 bg-brand-500/10 py-10 transition-all duration-150 animate-pulse">
        <span className="size-2 rounded-full bg-brand-500 animate-ping" />
        <span className="text-xs font-bold text-brand-600">
          이곳에 놓아 카드를 이동합니다
        </span>
      </div>
    );
  }

  return (
    <div className="my-2 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border/60 bg-subtle/30 py-10 text-center text-muted transition-colors">
      <GripVertical className="size-4 text-muted/50" />
      <span className="text-xs font-semibold text-muted">
        여기에 영역을 옮길 수 있어요
      </span>
    </div>
  );
}

export function HomeDashboard() {
  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const progress = useProgress((s) => s.progress);
  const hydrateProfile = useProfile((s) => s.hydrate);
  const profileHydrated = useProfile((s) => s.hydrated);
  const profile = useProfile((s) => s.profile);

  // PC & 모바일 독립 스토어 상태 및 메소드
  const pcColumns = useHomeOrder((s) => s.pcColumns);
  const mobileSectionIds = useHomeOrder((s) => s.mobileSectionIds);
  const orderHydrated = useHomeOrder((s) => s.hydrated);
  const hydrateHomeOrder = useHomeOrder((s) => s.hydrate);
  const movePcSectionToPosition = useHomeOrder(
    (s) => s.movePcSectionToPosition
  );
  const resetPcColumns = useHomeOrder((s) => s.resetPcColumns);
  const resetMobileOrder = useHomeOrder((s) => s.resetMobileOrder);

  // Cross-Column Drag and Drop 상태 (PC전용)
  const [draggedId, setDraggedId] = useState<HomeSectionId | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    column: "left" | "right";
    index: number;
  } | null>(null);

  useEffect(() => {
    hydrate();
    hydrateProfile();
    hydrateHomeOrder();
  }, [hydrate, hydrateProfile, hydrateHomeOrder]);

  const today = todayKey();
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
    progress.completedLessonIds
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

  const isPcCustomized =
    JSON.stringify(pcColumns) !== JSON.stringify(DEFAULT_PC_COLUMNS);

  const isMobileCustomized =
    JSON.stringify(mobileSectionIds) !==
    JSON.stringify(DEFAULT_MOBILE_SECTION_IDS);

  // ── PC Pointer Drag Event Handlers ──
  const handlePointerDown = (e: React.PointerEvent, id: HomeSectionId) => {
    e.preventDefault();
    e.stopPropagation();

    const handleEl = e.currentTarget as HTMLElement;
    try {
      handleEl.setPointerCapture(e.pointerId);
    } catch {
      // 무시
    }

    setDraggedId(id);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const el = document.elementFromPoint(
        moveEvent.clientX,
        moveEvent.clientY
      );
      if (!el) return;

      const cardEl = el.closest("[data-section-id]") as HTMLElement | null;
      const colEl = el.closest("[data-column-id]") as HTMLElement | null;

      if (cardEl) {
        const columnId = cardEl.getAttribute("data-column-scope") as
          | "left"
          | "right";
        const indexStr = cardEl.getAttribute("data-section-index");

        if (columnId && indexStr !== null) {
          const index = parseInt(indexStr, 10);
          const rect = cardEl.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          const insertIndex = moveEvent.clientY < midY ? index : index + 1;

          setDropTarget({ column: columnId, index: insertIndex });
        }
      } else if (colEl) {
        const columnId = colEl.getAttribute("data-column-id") as
          | "left"
          | "right";
        if (columnId) {
          const list = columnId === "left" ? pcColumns.left : pcColumns.right;
          setDropTarget({ column: columnId, index: list.length });
        }
      }
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      try {
        handleEl.releasePointerCapture(upEvent.pointerId);
      } catch {
        // 무시
      }

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      const el = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
      let targetCol: "left" | "right" | null = null;
      let targetIndex = 0;

      if (el) {
        const cardEl = el.closest("[data-section-id]") as HTMLElement | null;
        const colEl = el.closest("[data-column-id]") as HTMLElement | null;

        if (cardEl) {
          targetCol = cardEl.getAttribute("data-column-scope") as
            | "left"
            | "right";
          const indexStr = cardEl.getAttribute("data-section-index");
          if (indexStr !== null) {
            const index = parseInt(indexStr, 10);
            const rect = cardEl.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            targetIndex = upEvent.clientY < midY ? index : index + 1;
          }
        } else if (colEl) {
          targetCol = colEl.getAttribute("data-column-id") as "left" | "right";
          const list = targetCol === "left" ? pcColumns.left : pcColumns.right;
          targetIndex = list.length;
        }
      }

      if (targetCol && id) {
        movePcSectionToPosition(id, targetCol, targetIndex);
      } else if (dropTarget && id) {
        movePcSectionToPosition(id, dropTarget.column, dropTarget.index);
      }

      setDraggedId(null);
      setDropTarget(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  // ── HTML5 Drag & Drop Event Handlers (PC 마우스) ──
  const handleDragStart = (e: React.DragEvent, id: HomeSectionId) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedId(id);
  };

  const handleDragOverCard = (
    e: React.DragEvent,
    column: "left" | "right",
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const insertIndex = e.clientY < midY ? index : index + 1;

    if (
      !dropTarget ||
      dropTarget.column !== column ||
      dropTarget.index !== insertIndex
    ) {
      setDropTarget({ column, index: insertIndex });
    }
  };

  const handleDragOverColumnContainer = (
    e: React.DragEvent,
    column: "left" | "right"
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const list = column === "left" ? pcColumns.left : pcColumns.right;
    if (list.length === 0) {
      if (
        !dropTarget ||
        dropTarget.column !== column ||
        dropTarget.index !== 0
      ) {
        setDropTarget({ column, index: 0 });
      }
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    column: "left" | "right",
    targetIndex?: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const id = (e.dataTransfer.getData("text/plain") ||
      draggedId) as HomeSectionId;
    if (!id) return;

    const list = column === "left" ? pcColumns.left : pcColumns.right;
    const finalIndex =
      targetIndex !== undefined
        ? targetIndex
        : dropTarget
        ? dropTarget.index
        : list.length;

    movePcSectionToPosition(id, column, finalIndex);
    setDraggedId(null);
    setDropTarget(null);
  };

  const renderSection = (id: HomeSectionId) => {
    switch (id) {
      case "my-money":
        return (
          <Card highlight padding="sm">
            <div className="h-8 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-brand-600">
                <Wallet className="size-6" /> 내 돈
              </span>

              <div className="flex items-center gap-2">
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
                            : "text-muted hover:text-foreground"
                        )}
                      >
                        {w === "salary" ? "실수령" : "디데이"}
                      </button>
                    ))}
                  </div>
                ) : null}
                <CardControl />
              </div>
            </div>
            <div className="mt-3 h-[208px] flex flex-col justify-between">
              {!profileHydrated ? (
                <div className="animate-pulse flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-5 w-40 rounded bg-subtle/50" />
                    <div className="mt-2.5 h-10 w-56 rounded-lg bg-subtle/50 lg:h-12" />
                    <div className="mt-5 h-2.5 w-full rounded-full bg-subtle/50" />
                    <div className="mt-2 flex justify-between">
                      <div className="h-4 w-28 rounded bg-subtle/50" />
                      <div className="h-4 w-48 rounded bg-subtle/50" />
                    </div>
                  </div>
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
                      <div
                        className="mt-4 h-2.5 overflow-hidden rounded-full bg-subtle/50"
                        aria-hidden
                      >
                        <div
                          className="h-full rounded-full bg-brand-500"
                          style={{
                            width: `${(th.net / th.monthlyGross) * 100}%`,
                          }}
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
                  <DDayWidgetView
                    profile={profile}
                    onSalaryDayChange={handleSalaryDayChange}
                  />
                )
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-2xl font-extrabold tracking-tight lg:text-3xl leading-tight text-foreground">
                      월급 딱 한 번만 적어볼까요?
                      <br className="hidden sm:block" /> 여기가 전부 내 지갑
                      이야기가 돼요
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      모든 레슨과 계산기가 내 실제 월급 기준으로 바뀌어요.
                      30초면 충분해요.
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
        );

      case "learn-status":
        return (
          <div className="flex flex-col gap-2">
            <LearnStatus
              hydrated={hydrated}
              completedIds={progress.completedLessonIds}
              xp={progress.xp}
              streakCount={progress.streak.count}
              nextHref={allDone ? "/learn" : `/learn/${nextId}`}
              ctaLabel={learnCta}
              variant={showOnboardingNudge ? "secondary" : "primary"}
              rightSlot={<CardControl />}
            />
            {hydrated && !started && (
              <p className="text-center text-sm">
                <Link
                  href="/diagnostic"
                  className="inline-flex items-center gap-1 font-semibold text-muted transition-colors hover:text-brand-600"
                >
                  <Sparkles className="size-4" /> 이미 좀 아세요? 진단으로 레벨
                  건너뛰기
                </Link>
              </p>
            )}
          </div>
        );

      case "scenarios":
        return (
          <Card padding="sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  지금 어떤 고민이 있나요?
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  내 상황을 고르면 꼭 필요한 레슨과 계산기만 쏙쏙 골라 모아
                  드릴게요.
                </p>
              </div>
              <CardControl />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
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
          </Card>
        );

      case "daily-term":
        return (
          <Card padding="sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-wide text-brand-600">
                하루 1분, 오늘의 한 입 🍪
              </p>
              <CardControl />
            </div>
            <p className="mt-1.5 text-xl font-bold">{term.term}</p>
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
        );

      case "news-aside":
        return (
          <Card padding="sm">
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
              <div className="flex items-center gap-2">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-1 rounded-full bg-subtle px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-brand-500/10 hover:text-brand-600"
                >
                  더 보기 <ArrowRight className="size-3.5" />
                </Link>
                <CardControl />
              </div>
            </div>
            <div className="mt-3">
              <NewsList limit={6} numbered withTopics />
            </div>

            {/* 청약 정보 광고 배너 */}
            <div className="mt-4 p-3 rounded-card bg-subtle/80 hover:bg-subtle dark:bg-subtle/30 dark:hover:bg-subtle/50 transition-colors">
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
                  <p className="text-xs font-bold text-brand-600">
                    청약 가이드 🔔
                  </p>
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
          </Card>
        );

      default:
        return null;
    }
  };

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

      {/* 모바일 전용 토글 세그먼트 스위처 */}
      <MobileToggleBar />

      {/* 시즌 배너 */}
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

      {/* 홈 커스텀 가이드 & 리셋 옵션 (PC / 모바일 분기) */}
      {orderHydrated && (
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <GripVertical className="size-3.5 text-brand-600 shrink-0" />
            <span className="hidden lg:inline">
              카드를 잡고 <b>마우스 드래그앤드롭</b>으로 원하는 위치에 자유롭게
              배치할 수 있습니다.
            </span>
            <span className="inline lg:hidden">
              주로 확인할 컨텐츠를 탭으로 전환할 수 있습니다.
            </span>
          </span>

          {/* PC용 리셋 버튼 */}
          {isPcCustomized && (
            <button
              type="button"
              onClick={resetPcColumns}
              className="hidden lg:inline-flex items-center gap-1 rounded-full border border-border bg-subtle px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-surface active:scale-95 transition-all shrink-0 ml-2"
            >
              <RotateCcw className="size-3" /> 순서 초기화
            </button>
          )}

          {/* 모바일용 리셋 버튼 */}
          {isMobileCustomized && (
            <button
              type="button"
              onClick={resetMobileOrder}
              className="inline-flex lg:hidden items-center gap-1 rounded-full border border-border bg-subtle px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-surface active:scale-95 transition-all shrink-0 ml-2"
            >
              <RotateCcw className="size-3" /> 순서 초기화
            </button>
          )}
        </div>
      )}

      {orderHydrated ? (
        <>
          {/* 💻 PC(lg 이상) 2단 그리드 독립 배치 뷰 */}
          <div className="mt-5 hidden lg:grid grid-cols-[1.7fr_1fr] items-start gap-6">
            {/* PC 좌측 컬럼 */}
            <div
              data-column-id="left"
              onDragOver={(e) => handleDragOverColumnContainer(e, "left")}
              onDrop={(e) => handleDrop(e, "left")}
              className="flex flex-col gap-5 min-h-[160px] transition-colors rounded-card"
            >
              {pcColumns.left.map((id, index) => {
                const showIndicatorBefore =
                  dropTarget?.column === "left" && dropTarget.index === index;
                const isLast = index === pcColumns.left.length - 1;
                const showIndicatorAfter =
                  dropTarget?.column === "left" &&
                  dropTarget.index === index + 1;

                return (
                  <div key={id} className="flex flex-col">
                    {showIndicatorBefore && <DropIndicator />}
                    <div
                      draggable
                      data-section-id={id}
                      data-column-scope="left"
                      data-section-index={index}
                      onDragStart={(e) => handleDragStart(e, id)}
                      onDragEnd={() => {
                        setDraggedId(null);
                        setDropTarget(null);
                      }}
                      onDragOver={(e) => handleDragOverCard(e, "left", index)}
                      onDrop={(e) => handleDrop(e, "left")}
                      className={cn(
                        "relative rounded-card transition-all duration-150 touch-none",
                        draggedId === id &&
                          "opacity-40 scale-[0.98] border-2 border-dashed border-brand-500/60"
                      )}
                    >
                      {renderSection(id)}
                    </div>
                    {isLast && showIndicatorAfter && <DropIndicator />}
                  </div>
                );
              })}

              {pcColumns.left.length === 0 && (
                <div
                  data-column-id="left"
                  onDragOver={(e) => handleDragOverColumnContainer(e, "left")}
                  onDrop={(e) => handleDrop(e, "left")}
                >
                  <EmptyColumnBox
                    isDropTarget={dropTarget?.column === "left"}
                  />
                </div>
              )}
            </div>

            {/* PC 우측 컬럼 (Sticky) */}
            <aside
              data-column-id="right"
              onDragOver={(e) => handleDragOverColumnContainer(e, "right")}
              onDrop={(e) => handleDrop(e, "right")}
              className="sticky top-24 flex flex-col gap-5 min-h-[160px] transition-colors rounded-card"
            >
              {pcColumns.right.map((id, index) => {
                const showIndicatorBefore =
                  dropTarget?.column === "right" && dropTarget.index === index;
                const isLast = index === pcColumns.right.length - 1;
                const showIndicatorAfter =
                  dropTarget?.column === "right" &&
                  dropTarget.index === index + 1;

                return (
                  <div key={id} className="flex flex-col">
                    {showIndicatorBefore && <DropIndicator />}
                    <div
                      draggable
                      data-section-id={id}
                      data-column-scope="right"
                      data-section-index={index}
                      onDragStart={(e) => handleDragStart(e, id)}
                      onDragEnd={() => {
                        setDraggedId(null);
                        setDropTarget(null);
                      }}
                      onDragOver={(e) => handleDragOverCard(e, "right", index)}
                      onDrop={(e) => handleDrop(e, "right")}
                      className={cn(
                        "relative rounded-card transition-all duration-150 touch-none",
                        draggedId === id &&
                          "opacity-40 scale-[0.98] border-2 border-dashed border-brand-500/60"
                      )}
                    >
                      {renderSection(id)}
                    </div>
                    {isLast && showIndicatorAfter && <DropIndicator />}
                  </div>
                );
              })}

              {pcColumns.right.length === 0 && (
                <div
                  data-column-id="right"
                  onDragOver={(e) => handleDragOverColumnContainer(e, "right")}
                  onDrop={(e) => handleDrop(e, "right")}
                >
                  <EmptyColumnBox
                    isDropTarget={dropTarget?.column === "right"}
                  />
                </div>
              )}
            </aside>
          </div>

          {/* 📱 모바일(lg 미만) 세로 1열 독립 배치 뷰 */}
          <div className="mt-5 flex flex-col gap-5 lg:hidden">
            {mobileSectionIds.map((id) => (
              <div key={id} className="relative rounded-card">
                {renderSection(id)}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.7fr_1fr] lg:gap-6 animate-pulse">
          <div className="flex flex-col gap-5">
            <div className="h-48 rounded-card bg-subtle/40" />
            <div className="h-44 rounded-card bg-subtle/40" />
            <div className="h-44 rounded-card bg-subtle/40" />
          </div>
          <div className="h-96 rounded-card bg-subtle/40" />
        </div>
      )}
    </main>
  );
}
