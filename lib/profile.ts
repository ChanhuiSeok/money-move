import { profileSchema, type Profile } from "@/lib/schema";
import { estimateTakeHome, type TakeHome } from "@/lib/takehome";

/* "내 프로필" — 내 급여·가족 상황의 단일 소스 (localStorage).
   순수 헬퍼는 입력을 바꾸지 않는다. 저장/로드는 진도(lib/progress.ts)와 같은 패턴. */

export const PROFILE_STORAGE_KEY = "donpath:profile:v1";
export const DEFAULT_MONTHLY_NONTAX = 200_000; // 보통 식대 20만원

export function defaultProfile(): Profile {
  return {
    period: "month",
    amount: 0,
    monthlyNontax: DEFAULT_MONTHLY_NONTAX,
    dependents: 1,
    children: 0,
  };
}

/** 급여를 넣어 둔 상태인지(미설정이면 홈/계산기에서 입력 유도). */
export function hasProfile(p: Profile): boolean {
  return p.amount > 0;
}

/** 입력값을 정규화한다(자녀 수는 본인 뺀 부양가족 수 이내로 클램프). */
export function normalizeProfile(p: Profile): Profile {
  const dependents = Math.max(1, Math.floor(p.dependents));
  return {
    period: p.period,
    amount: Math.max(0, p.amount),
    monthlyNontax: Math.max(0, p.monthlyNontax),
    dependents,
    children: Math.min(Math.max(0, Math.floor(p.children)), dependents - 1),
  };
}

/** 프로필 → 연봉(세전, 비과세 포함). */
export function annualGross(p: Profile): number {
  return p.period === "month" ? p.amount * 12 : p.amount;
}

/** 프로필 → 총급여(연, 비과세 제외). 연말정산·연금 계산기의 '총급여' 기준. */
export function taxableAnnual(p: Profile): number {
  return Math.max(0, annualGross(p) - p.monthlyNontax * 12);
}

/** 프로필로 월 실수령액을 추정한다(실수령액 계산기와 같은 로직). */
export function profileTakeHome(p: Profile): TakeHome {
  const children = Math.min(p.children, Math.max(0, p.dependents - 1));
  return estimateTakeHome(
    annualGross(p),
    p.dependents,
    p.monthlyNontax * 12,
    children,
  );
}

/* ── 저장/로드 (localStorage) ──────────────────────────── */

function getStorage(): Storage | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

/** localStorage에서 프로필을 읽어 검증한다. 없거나 깨졌으면 기본값. */
export function loadProfile(): Profile {
  const storage = getStorage();
  if (!storage) return defaultProfile();
  const raw = storage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return defaultProfile();
  try {
    const parsed = profileSchema.safeParse(JSON.parse(raw));
    return parsed.success ? normalizeProfile(parsed.data) : defaultProfile();
  } catch {
    return defaultProfile();
  }
}

/** 프로필을 localStorage에 저장한다(서버/비가용 환경에선 무시). */
export function saveProfile(profile: Profile): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* 용량 초과 등은 조용히 무시 */
  }
}
