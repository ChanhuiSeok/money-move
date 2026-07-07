import type { ReactNode } from "react";
import { BackLink } from "@/components/ui/BackLink";
import { cn } from "@/lib/utils";

/** 허브/일반 페이지의 공용 헤더. 되돌아가기 + 큼직한 제목 + 부제 + (선택)우측 액션.
 *  사이트 전반의 상단 위계를 통일해, 페이지마다 제각각이던 제목 크기/여백을 한곳에서 잡는다.
 *  back={false}면 되돌아가기 링크를 숨긴다(홈 등). */
export function PageHeader({
  title,
  subtitle,
  back = { href: "/", label: "홈" },
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: { href?: string; label?: string } | false;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-6", className)}>
      {back && (
        <BackLink href={back.href} label={back.label} className="mb-3" />
      )}
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
