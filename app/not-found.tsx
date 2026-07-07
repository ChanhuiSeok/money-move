import Link from "next/link";
import { MascotImage } from "@/components/mascot/MascotImage";
import { buttonVariants } from "@/components/ui/buttonStyles";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70dvh] w-full max-w-md flex-1 flex-col items-center justify-center gap-6 p-5 text-center lg:max-w-lg">
      <MascotImage variant="cry" className="w-24" />
      <div>
        <h1 className="text-xl">이 페이지는 아직 없어요</h1>
        <p className="mt-2 text-sm text-muted">
          주소가 잘못 입력되었거나 페이지가 삭제되었어요. 홈에서 다시
          시작해봐요.
        </p>
      </div>
      <Link href="/" className={buttonVariants({ variant: "primary" })}>
        홈으로 가기
      </Link>
    </main>
  );
}
