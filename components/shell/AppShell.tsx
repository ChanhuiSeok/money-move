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
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <SideNav pathname={pathname} />
      {/* 모바일 하단 탭바 높이만큼 아래 여백 확보 */}
      <div className="flex min-w-0 flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+4rem)] lg:pb-0">
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

/** 모바일 하단 탭바 — lg 미만에서만. 화면 하단 고정. */
function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
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
