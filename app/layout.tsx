import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const HOME_TITLE = "머니무브 - 경제 문맹 퇴치";
const HOME_DESCRIPTION =
  "가입 없이 바로 시작하는, 짧고 명랑한 한국 실생활 금융 레슨. 월급명세서·소득공제·세액공제·연금까지 한 입씩.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // next-themes가 하이드레이션 전에 <html data-theme>를 직접 써서(깜빡임 방지)
    // React가 모르는 속성이 됨 — suppressHydrationWarning으로 이 불일치만 무시(라이브러리 공식 권장).
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        {/* 본문 — Pretendard(모던 고딕). App Router 루트 <head> 링크는 전역 적용됨 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          storageKey="donpath:theme:v1"
          disableTransitionOnChange
        >
          <AppShell>{children}</AppShell>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
