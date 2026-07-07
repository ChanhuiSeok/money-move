"use client";

import Link from "next/link";
import { useEffect } from "react";
import { resolveMyToken } from "@/lib/personalize";
import { useProfile } from "@/store/useProfile";

/** 레슨 본문 속 "내 숫자" — `[예시값](my:id)` 자리를 렌더한다.
   - 프로필 있음: 내 값으로 치환(브랜드 틴트 강조 + 추정치 안내 툴팁)
   - 프로필 없음: 예시값을 그대로 두되, 탭하면 내 급여를 넣으러 가는 넛지
   하이드레이션 전에는 SSR과 동일하게 fallback 평문만 내보내 불일치를 막는다. */
export function MyNumberChip({ id, fallback }: { id: string; fallback: string }) {
  const profile = useProfile((s) => s.profile);
  const hydrated = useProfile((s) => s.hydrated);
  const hydrate = useProfile((s) => s.hydrate);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  if (!hydrated) return <>{fallback}</>;

  const resolved = resolveMyToken(id, profile);
  if (resolved) {
    return (
      <span
        title={`${resolved.label} · 프로필 기준 추정치`}
        className="rounded-md bg-brand-500/10 px-1 py-0.5 font-semibold text-brand-700 dark:text-brand-300"
      >
        {resolved.text}
      </span>
    );
  }

  return (
    <Link
      href="/profile"
      aria-label={`내 월급을 넣으면 여기가 내 숫자로 바뀌어요 (현재 예시: ${fallback})`}
      className="font-medium text-brand-600 underline decoration-dashed decoration-brand-400/70 underline-offset-4 transition-colors hover:decoration-brand-600"
    >
      {fallback}
      <span aria-hidden className="ml-0.5 text-xs">
        ✎
      </span>
    </Link>
  );
}
