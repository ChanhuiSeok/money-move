import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";

export const metadata: Metadata = {
  title: "돈길 — 경제 문맹 퇴치",
  description:
    "가입 없이 바로 시작하는, 짧고 명랑한 한국 실생활 금융 레슨. 월급명세서·소득공제·세액공제·연금까지 한 입씩.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* 본문 — Pretendard(모던 고딕). App Router 루트 <head> 링크는 전역 적용됨 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* 디스플레이 — Hahmlet(현대적 세리프). 제목·강조 숫자에만 사용.
            폰트는 의도적으로 <link>로 로드(next/font CJK 서브셋 스트립 회피) → 규칙 예외 처리 */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@500;600;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
