import {
  Calculator,
  Home,
  PiggyBank,
  SlidersHorizontal,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/** 계산기·도구 메타. /tools 허브와 전역 검색이 함께 쓰는 단일 소스. */
export type ToolMeta = {
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  /** 검색 보조 키워드(본문에 없는 동의어 등). */
  keywords?: string[];
};

export const tools: ToolMeta[] = [
  {
    href: "/tools/take-home",
    icon: Calculator,
    title: "실수령액 계산기",
    desc: "내 월급, 실제로 얼마 들어올까?",
    keywords: ["세후", "월급", "연봉", "4대보험", "소득세"],
  },
  {
    href: "/tools/tax-simulator",
    icon: SlidersHorizontal,
    title: "연말정산 시뮬레이터",
    desc: "내 공제 항목 넣고 환급액 미리 보기",
    keywords: ["환급", "소득공제", "세액공제", "13월의 월급"],
  },
  {
    href: "/tools/pension-credit",
    icon: PiggyBank,
    title: "연금저축·IRP 세액공제",
    desc: "노후 준비하고 세금도 아끼기 (연금저축 vs IRP 배분까지)",
    keywords: ["IRP", "연금", "노후", "절세", "연금저축", "배분"],
  },
  {
    href: "/tools/compound",
    icon: TrendingUp,
    title: "복리 계산기",
    desc: "꾸준히 모으면 얼마까지 불어날까?",
    keywords: ["적금", "이자", "저축", "복리"],
  },
  {
    href: "/tools/rent-vs-jeonse",
    icon: Home,
    title: "전세 vs 월세",
    desc: "뭐가 더 이득일까? 월 실부담으로 비교",
    keywords: ["보증금", "전세대출", "기회비용", "집"],
  },
];
