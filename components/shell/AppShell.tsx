"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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

/** 데스크탑 상단 헤더 — lg 이상에서만. 로고 + 전체 메뉴 + 테마 토글을 한 줄에. */
function TopHeader({ pathname }: { pathname: string }) {
  return (
    <header className="sticky top-0 z-20 hidden shrink-0 border-b border-border bg-surface/95 backdrop-blur lg:block">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="머니무브 홈">
          <Logo className="h-8" priority />
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActiveNav(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-brand-500/10 text-brand-600"
                    : "text-muted hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle showLabel={false} className="shrink-0" />
      </div>
    </header>
  );
}

/** 모바일 하단 탭바 — lg 미만에서만. 스크롤 영역 바깥(아래)에 자리해 스크롤바와 겹치지 않음. */
function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="flex shrink-0 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const active = isActiveNav(pathname, item.href);
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
