import {
  BookOpen,
  Calculator,
  ClipboardCheck,
  GraduationCap,
  Home,
  Search,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react";

/* 전역 내비게이션 정의 + 라우트 분류(순수).
   허브형 페이지는 사이드바/하단탭 shell을 두르고, 몰입형 플로우(레슨·모의고사·진단)는
   집중을 위해 shell 없이 전체화면으로 띄운다. */

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** 모바일 하단 탭바에도 노출할지(공간상 5개로 제한). */
  mobile: boolean;
};

/** 데스크탑 상단 헤더 메뉴 목록 (순서대로) */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈", icon: Home, mobile: true },
  { href: "/learn", label: "학습", icon: GraduationCap, mobile: true },
  { href: "/exams", label: "모의고사", icon: ClipboardCheck, mobile: false },
  { href: "/tools", label: "계산기", icon: Calculator, mobile: true },
  { href: "/glossary", label: "사전", icon: BookOpen, mobile: true },
  { href: "/profile", label: "내 프로필", icon: UserRound, mobile: true },
];

/** 모바일 하단 탭바 메뉴 목록 — 홈 - 학습 - 계산기 - 사전 - 내 프로필 */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈", icon: Home, mobile: true },
  { href: "/learn", label: "학습", icon: GraduationCap, mobile: true },
  { href: "/tools", label: "계산기", icon: Calculator, mobile: true },
  { href: "/glossary", label: "사전", icon: BookOpen, mobile: true },
  { href: "/profile", label: "내 프로필", icon: UserRound, mobile: true },
];

/** 집중이 필요한 몰입형 라우트인지. true면 shell(사이드바/탭바)을 숨긴다.
   - /diagnostic: 단계형 세션
   - /learn/<lessonId>: 레슨 플레이어 (단, /learn 경로 트리는 허브)
   - /exams/<examId>: 모의고사 시험지 (단, /exams 목록은 허브) */
export function isImmersiveRoute(pathname: string): boolean {
  if (pathname === "/diagnostic") return true;
  if (/^\/learn\/.+/.test(pathname)) return true;
  if (/^\/exams\/.+/.test(pathname)) return true;
  return false;
}

/** 내비 항목 활성 여부. 홈은 정확히 일치, 나머지는 하위 경로까지 포함. */
export function isActiveNav(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
