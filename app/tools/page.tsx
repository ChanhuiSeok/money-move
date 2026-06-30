import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BackLink } from "@/components/ui/BackLink";
import { tools as TOOLS } from "@/content/tools";

/** 계산기 허브. 배운 걸 바로 써먹는 도구 모음. */
export default function ToolsPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-6 lg:max-w-4xl lg:px-8 lg:py-8">
      <BackLink className="mb-2" />
      <h1 className="text-2xl font-bold tracking-tight">계산기</h1>
      <p className="mt-1 text-sm text-muted">
        배운 걸 내 숫자로 바로 써먹어요. 모두 추정치예요.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="flex items-center gap-3 rounded-card border border-border bg-surface p-4 transition-colors hover:border-brand-400 hover:bg-brand-500/5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
              <t.icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{t.title}</span>
              <span className="block text-xs text-muted">{t.desc}</span>
            </span>
            <ArrowRight className="size-4 text-muted" />
          </Link>
        ))}
      </div>
    </main>
  );
}
