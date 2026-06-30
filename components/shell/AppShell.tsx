"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import {
  MOBILE_NAV_ITEMS,
  NAV_ITEMS,
  isActiveNav,
  isImmersiveRoute,
} from "@/lib/nav";
import { cn } from "@/lib/utils";

/** 허브형 페이지에 사이드바(데스크탑)·하단 탭바(모바일)를 두르는 앱 셸.
   몰입형 라우트(레슨·복습·진단)에서는 셸을 숨기고 children만 전체화면으로 띄운다. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isImmersiveRoute(pathname)) return <>{children}</>;

  return (
    // 모바일: 화면 높이에 고정하고 콘텐츠만 내부 스크롤 → 스크롤바가 하단 탭바에 닿지 않음.
    // 데스크탑(lg): 기존처럼 문서 전체가 스크롤되고 사이드바는 sticky.
    <div className="flex h-dvh flex-col overflow-hidden lg:h-auto lg:min-h-dvh lg:flex-row lg:overflow-visible">
      <SideNav pathname={pathname} />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto lg:overflow-visible">
        {children}
      </div>
      <BottomNav pathname={pathname} />
    </div>
  );
}

/** 데스크탑 좌측 사이드바 — lg 이상에서만. 스크롤해도 고정. */
function SideNav({ pathname }: { pathname: string }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-surface px-3 py-5 lg:flex">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 px-2"
        aria-label="돈길 홈"
      >
        <Mascot mood="happy" className="size-8" />
        <span className="text-lg font-bold tracking-tight">돈길</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActiveNav(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-brand-500/10 text-brand-600"
                  : "text-muted hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              <item.icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <p className="px-3 pt-4 text-xs text-muted">경제 문맹 퇴치 · 돈길</p>
    </aside>
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
