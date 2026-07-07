"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useProgress } from "@/store/useProgress";
import { getUserLevelInfo } from "@/lib/achievements";
import { MascotImage, type MascotVariant } from "@/components/mascot/MascotImage";
import {
  MOBILE_NAV_ITEMS,
  NAV_ITEMS,
  isActiveNav,
  isImmersiveRoute,
} from "@/lib/nav";
import { cn } from "@/lib/utils";

/** 허브형 페이지에 상단 헤더(데스크탑)·하단 탭바(모바일)를 두르는 앱 셸.
   몰입형 라우트(레슨·모의고사·진단)에서는 셸을 숨기고 children만 전체화면으로 띄운다.
   테마 하이드레이션·OS 다크모드 감지는 layout.tsx의 next-themes ThemeProvider가 맡는다. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isImmersiveRoute(pathname)) return <>{children}</>;

  return (
    // 모바일: 화면 높이에 고정하고 콘텐츠만 내부 스크롤 → 스크롤바가 하단 탭바에 닿지 않음.
    // 데스크탑(lg): 문서 전체가 스크롤되고 상단 헤더는 sticky.
    <div className="flex h-dvh flex-col overflow-hidden lg:h-auto lg:min-h-dvh lg:overflow-visible">
      <TopHeader pathname={pathname} />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto lg:overflow-visible">
        {children}
      </div>
      <BottomNav pathname={pathname} />
    </div>
  );
}

function HeaderAvatar() {
  const hydrate = useProgress((s) => s.hydrate);
  const hydrated = useProgress((s) => s.hydrated);
  const progress = useProgress((s) => s.progress);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) return null;

  const lvl = getUserLevelInfo(progress.xp);

  return (
    <Link
      href="/profile"
      className="flex items-center gap-1.5 rounded-full border border-border bg-surface pl-1.5 pr-2.5 py-1 hover:bg-subtle active:scale-95 transition-all text-xs font-bold text-foreground"
    >
      <div className="flex size-6 items-center justify-center overflow-hidden rounded-full bg-subtle border border-brand-500/10 shrink-0">
        <MascotImage
          variant={`lv${lvl.level}` as MascotVariant}
          className="max-h-full max-w-full object-contain h-auto w-auto scale-[1.75] -translate-y-[2px]"
        />
      </div>
      <span>Lv.{lvl.level}</span>
    </Link>
  );
}

/** 상단 헤더 — 데스크탑 및 모바일 공용.
 *  모바일에서는 좌측 로고, 우측 테마 토글만 보이고 메뉴는 하단 탭바로 위임. */
function TopHeader({ pathname }: { pathname: string }) {
  return (
    <header className="sticky top-0 z-20 shrink-0 border-b-2 border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="머니무브 홈">
          <Logo className="h-10" priority />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActiveNav(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors border-2 border-transparent",
                  active
                    ? "bg-brand-500/10 text-brand-600 border-brand-500/30"
                    : "text-muted hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 모바일 뷰에서 로고와 우측 테마 토글 간격을 벌려주는 spacer */}
        <div className="flex-1 lg:hidden" />

        {/* 헤더 프로필 레벨 아바타 배지 */}
        <HeaderAvatar />

        <ThemeToggle showLabel={false} className="shrink-0" />
      </div>
    </header>
  );
}

/** 모바일 하단 탭바 — lg 미만에서만. 스크롤 영역 바깥(아래)에 자리해 스크롤바와 겹치지 않음. */
function BottomNav({ pathname }: { pathname: string }) {
  const [learnMenuOpen, setLearnMenuOpen] = useState(false);

  return (
    <nav className="relative flex shrink-0 border-t-2 border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isLearnTab = item.href === "/learn";
        const active = isLearnTab
          ? isActiveNav(pathname, "/learn") || isActiveNav(pathname, "/exams")
          : isActiveNav(pathname, item.href);

        if (isLearnTab) {
          return (
            <div key={item.href} className="relative flex flex-1 flex-col items-center justify-center">
              {/* 팝오버 형태의 학습/모의고사 선택 드롭다운 */}
              {learnMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setLearnMenuOpen(false)}
                  />
                  <div className="absolute bottom-full mb-3.5 z-40 w-32 rounded-xl border-2 border-border bg-surface p-1 flex flex-col
                    before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:h-0 before:w-0 before:border-8 before:border-transparent before:border-t-border
                    after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:-translate-y-[1px] after:h-0 after:w-0 after:border-[7px] after:border-transparent after:border-t-surface"
                  >
                    <Link
                      href="/learn"
                      onClick={() => setLearnMenuOpen(false)}
                      className={cn(
                        "flex h-9 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        isActiveNav(pathname, "/learn")
                          ? "bg-brand-500/10 text-brand-600"
                          : "text-muted hover:bg-foreground/5 hover:text-foreground",
                      )}
                    >
                      학습 코스
                    </Link>

                    {/* 디바이터 라인을 독립하여 링크 패딩 간섭 제거 */}
                    <div className="h-px bg-border/40 my-0.5 mx-1" />

                    <Link
                      href="/exams"
                      onClick={() => setLearnMenuOpen(false)}
                      className={cn(
                        "flex h-9 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        isActiveNav(pathname, "/exams")
                          ? "bg-brand-500/10 text-brand-600"
                          : "text-muted hover:bg-foreground/5 hover:text-foreground",
                      )}
                    >
                      모의고사
                    </Link>
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() => setLearnMenuOpen(!learnMenuOpen)}
                className={cn(
                  "flex w-full flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors",
                  active ? "text-brand-600" : "text-muted",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </button>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors",
              active ? "text-brand-600" : "text-muted",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
