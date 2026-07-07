import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "./assets/logo.png";

/** 머니무브 로고(픽셀아트 저금통 + 워드마크). 워드마크가 이미지에 포함돼 있어 텍스트를 따로 안 붙인다.
 *  MascotImage와 같은 이유로 unoptimized+pixelated, 높이만 className으로 주고 폭은 w-auto로 비율 유지. */
export function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={logo}
      alt="머니무브"
      priority={priority}
      unoptimized
      draggable={false}
      className={cn(
        "w-auto select-none [image-rendering:pixelated]",
        className,
      )}
    />
  );
}
