"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./globals.css";

/** 루트 레이아웃 자체가 깨졌을 때만 뜨는 최후의 방어선.
   레이아웃을 대체하므로 ThemeProvider/AppShell 등 다른 컴포넌트에 기대지 않고
   최소한으로 자족적으로 구성한다. */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-5 text-center text-foreground antialiased">
        <div>
          <h1 className="text-xl">앗, 화면을 불러오지 못했어요</h1>
          <p className="mt-2 text-sm text-muted">
            새로고침하면 대부분 괜찮아져요. 계속되면 조금 있다 다시 와주세요.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-[15px] font-semibold"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-[15px] font-semibold text-white"
          >
            홈으로 가기
          </Link>
        </div>
      </body>
    </html>
  );
}
