import type { Metadata } from "next";
import "./globals.css";

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
        {/* Pretendard(모던 고딕) — App Router 루트 <head> 링크는 전역 적용됨 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
