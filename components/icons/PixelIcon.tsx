import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import iconWallet from "./assets/icon-wallet.png";
import iconBook from "./assets/icon-book.png";
import iconExam from "./assets/icon-exam.png";
import iconHouse from "./assets/icon-house.png";
import iconMoney from "./assets/icon-money.png";
import iconNews from "./assets/icon-news.png";
import iconPig from "./assets/icon-pig.png";
import iconStock from "./assets/icon-stock.png";

export type PixelIconName =
  | "wallet"
  | "book"
  | "exam"
  | "house"
  | "money"
  | "news"
  | "pig"
  | "stock";

const ASSETS: Record<PixelIconName, StaticImageData> = {
  wallet: iconWallet,
  book: iconBook,
  exam: iconExam,
  house: iconHouse,
  money: iconMoney,
  news: iconNews,
  pig: iconPig,
  stock: iconStock,
};

/** 카드 안에서 lucide 라인 아이콘 대신 쓰는 컬러 픽셀아트 아이콘.
 *  currentColor를 안 타는 완성된 그림이라 배경 원의 text-* 색은 무시된다 — 배경은 은은한 틴트 원 정도로만 쓴다.
 *  MascotImage와 같은 이유로 unoptimized+pixelated, 폭만 className으로 주고 높이는 h-auto로 비율 유지. */
export function PixelIcon({
  name,
  className,
}: {
  name: PixelIconName;
  className?: string;
}) {
  return (
    <Image
      src={ASSETS[name]}
      alt=""
      unoptimized
      draggable={false}
      className={cn(
        "h-auto w-6 select-none [image-rendering:pixelated]",
        className,
      )}
    />
  );
}

/** content/*.ts(값 배열)가 컴포넌트 참조를 그대로 담을 수 있게 하는 바인딩.
 *  .ts 파일은 JSX를 못 쓰므로, 이름별로 미리 묶은 컴포넌트를 값으로 내보낸다. */
export const WalletIcon = (props: { className?: string }) => (
  <PixelIcon name="wallet" {...props} />
);
export const BookIcon = (props: { className?: string }) => (
  <PixelIcon name="book" {...props} />
);
export const ExamIcon = (props: { className?: string }) => (
  <PixelIcon name="exam" {...props} />
);
export const HouseIcon = (props: { className?: string }) => (
  <PixelIcon name="house" {...props} />
);
export const MoneyIcon = (props: { className?: string }) => (
  <PixelIcon name="money" {...props} />
);
export const NewsIcon = (props: { className?: string }) => (
  <PixelIcon name="news" {...props} />
);
export const PigIcon = (props: { className?: string }) => (
  <PixelIcon name="pig" {...props} />
);
export const StockIcon = (props: { className?: string }) => (
  <PixelIcon name="stock" {...props} />
);
