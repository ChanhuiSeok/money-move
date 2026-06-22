import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** 페이지 상단의 공통 "되돌아가기" 링크. 기본은 홈으로. */
export function BackLink({
  href = "/",
  label = "홈",
  className,
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="size-4" /> {label}
    </Link>
  );
}
