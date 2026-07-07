"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MascotImage } from "@/components/mascot/MascotImage";
import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/buttonStyles";

/** 라우트 세그먼트 에러 경계. 여기서 잡힌 에러를 실제 모니터링 서비스(Sentry 등)로
   보내려면 이 console.error 자리에 리포팅 호출을 추가하면 된다. */
export default function ErrorBoundary({
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
    <main className="mx-auto flex min-h-[70dvh] w-full max-w-md flex-1 flex-col items-center justify-center gap-6 p-5 text-center lg:max-w-lg">
      <MascotImage variant="home" className="w-28" />
      <div>
        <h1 className="text-xl">어라, 잠깐 문제가 생겼어요</h1>
        <p className="mt-2 text-sm text-muted">
          걱정 마세요, 잘못은 아니에요. 다시 시도해보거나 홈으로 돌아가볼게요.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => unstable_retry()}>
          다시 시도
        </Button>
        <Link href="/" className={buttonVariants({ variant: "primary" })}>
          홈으로 가기
        </Link>
      </div>
    </main>
  );
}
