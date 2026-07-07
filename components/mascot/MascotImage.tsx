import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import mascotHome from "./assets/mascot-home.png";
import mascotStudy from "./assets/mascot-study.png";
import mascotExam from "./assets/mascot-exam.png";
import mascotRun from "./assets/mascot-run.png";
import mascotBook from "./assets/mascot-book.png";
import mascotCry from "./assets/mascot-cry.png";

export type MascotVariant = "home" | "study" | "exam" | "run" | "book" | "cry";

const ASSETS: Record<MascotVariant, StaticImageData> = {
  home: mascotHome,
  study: mascotStudy,
  exam: mascotExam,
  run: mascotRun,
  book: mascotBook,
  cry: mascotCry,
};

const LABEL: Record<MascotVariant, string> = {
  home: "머니무브 마스코트가 반갑게 인사해요",
  study: "머니무브 마스코트가 공부하고 있어요",
  exam: "머니무브 마스코트가 결과 신문을 들고 있어요",
  run: "머니무브 마스코트가 힘차게 달려가요",
  book: "책과 동전 더미 — 잘했어요",
  cry: "머니무브 마스코트가 울고 있어요",
};

/** 머니무브 마스코트(픽셀아트). home=태블릿·동전과 함께 자랑스러운 포즈(홈·축하),
 *  study=가계부에 집중하는 포즈(학습·계산기), exam=결과 신문을 든 포즈(모의고사),
 *  run=달리는 포즈(학습 진행도 게이지·경로), book=책+동전 더미(정답 보상 — 캐릭터 아님).
 *  픽셀 선명도를 위해 최적화를 끄고(unoptimized) image-rendering:pixelated로 원본을 그대로 띄운다.
 *  크기는 className으로 폭만 지정하고(h-auto) 비율은 정적 import한 원본 크기로 유지된다. */
export function MascotImage({
  variant = "home",
  className,
  priority = false,
}: {
  variant?: MascotVariant;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={ASSETS[variant]}
      alt={LABEL[variant]}
      priority={priority}
      unoptimized
      draggable={false}
      className={cn(
        "h-auto select-none [image-rendering:pixelated]",
        className,
      )}
    />
  );
}
