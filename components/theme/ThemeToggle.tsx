"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

/** 서버 렌더와 클라이언트 첫 렌더는 false로 맞추고, 하이드레이션 직후 React가
   getSnapshot을 다시 불러 true로 — setState-in-effect 없이 "마운트 여부"를 얻는 표준 트릭. */
function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const OPTIONS: {
  mode: "system" | "light" | "dark";
  label: string;
  icon: LucideIcon;
}[] = [
  { mode: "system", label: "시스템", icon: Monitor },
  { mode: "light", label: "라이트", icon: Sun },
  { mode: "dark", label: "다크", icon: Moon },
];

/** 라이트·다크·시스템 3단 테마 선택(next-themes). 사이드바 하단·프로필 화면 양쪽에서 재사용.
   showLabel=false면 아이콘만 표시(라벨은 스크린리더용 title로만 제공) — PC 사이드바처럼 공간이 좁은 곳에서 사용. */
export function ThemeToggle({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  // next-themes는 마운트 전엔 theme을 알 수 없다(SSR엔 시스템/저장값 정보가 없음).
  // 마운트 전엔 전부 비활성으로 두어 서버 렌더와 일치시키고, 마운트 후 실제 값으로 바로잡는다.
  const mounted = useMounted();

  if (!showLabel) {
    const currentTheme = mounted ? resolvedTheme : "light";
    const toggleTheme = () => {
      setTheme(currentTheme === "dark" ? "light" : "dark");
    };

    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "flex size-9 items-center justify-center rounded-xl bg-surface text-brand-600 border border-border hover:bg-subtle hover:text-brand-500 transition-colors",
          className,
        )}
        title={`테마 전환 (${currentTheme === "dark" ? "라이트" : "다크"} 모드로)`}
      >
        {currentTheme === "dark" ? (
          <Moon className="size-[18px]" />
        ) : (
          <Sun className="size-[18px]" />
        )}
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="화면 테마"
      className={cn("grid grid-cols-3 gap-1 rounded-xl bg-subtle p-1", className)}
    >
      {OPTIONS.map((opt) => {
        const active = mounted && theme === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            role="radio"
            aria-checked={active}
            title={opt.label}
            onClick={() => setTheme(opt.mode)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-semibold transition-colors",
              active
                ? "bg-surface text-brand-600 shadow-sm"
                : "text-muted hover:text-foreground",
            )}
          >
            <opt.icon className="size-4" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

