import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { tileVariants } from "@/components/ui/tileStyles";
import { tools as TOOLS } from "@/content/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "계산기",
  description: "실수령액, 연말정산, 연금저축, 복리, 전세 vs 월세까지 — 배운 걸 내 숫자로 써먹는 계산기 모음.",
  path: "/tools",
});

/** 계산기 허브. 배운 걸 바로 써먹는 도구 모음. */
export default function ToolsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-6 lg:px-8 lg:py-10">
      <PageHeader
        title="계산기"
        subtitle="배운 걸 내 숫자로 바로 써먹어요. 모두 추정치예요."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={tileVariants({ className: "items-center gap-3.5 p-4" })}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-500/10">
              <t.icon className="w-8" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{t.title}</span>
              <span className="block text-xs text-muted">{t.desc}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted" />
          </Link>
        ))}
      </div>
    </main>
  );
}
