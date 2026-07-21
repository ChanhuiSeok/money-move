import { create } from "zustand";

export type HomeSectionId =
  | "my-money"
  | "learn-status"
  | "scenarios"
  | "daily-term"
  | "news-aside";

export type MobileTab = "my-economy" | "news";

export interface HomeColumns {
  left: HomeSectionId[];
  right: HomeSectionId[];
}

export const ALL_SECTION_IDS: HomeSectionId[] = [
  "my-money",
  "learn-status",
  "scenarios",
  "daily-term",
  "news-aside",
];

export const DEFAULT_PC_COLUMNS: HomeColumns = {
  left: ["my-money", "learn-status", "scenarios", "daily-term"],
  right: ["news-aside"],
};

export const DEFAULT_MOBILE_SECTION_IDS: HomeSectionId[] = [
  "news-aside",
  "my-money",
  "learn-status",
  "scenarios",
  "daily-term",
];

export const SECTION_NAMES: Record<HomeSectionId, string> = {
  "my-money": "내 돈 (금융 대시보드)",
  "learn-status": "내 학습 (학습 진도)",
  scenarios: "지금 어떤 고민이 있나요?",
  "daily-term": "오늘의 한 입 🍪 (금융 용어)",
  "news-aside": "오늘의 경제뉴스 & 청약",
};

const PC_STORAGE_KEY = "money-move:home-pc-columns-v3";
const MOBILE_STORAGE_KEY = "money-move:home-mobile-order-v3";

interface HomeOrderState {
  pcColumns: HomeColumns;
  mobileSectionIds: HomeSectionId[];
  mobileTab: MobileTab;
  hydrated: boolean;
  hydrate: () => void;

  // PC 전용 조작 메소드
  setPcLeftSectionIds: (ids: HomeSectionId[]) => void;
  setPcRightSectionIds: (ids: HomeSectionId[]) => void;
  movePcSectionToPosition: (
    id: HomeSectionId,
    targetColumn: "left" | "right",
    index: number
  ) => void;
  resetPcColumns: () => void;

  // 모바일 전용 조작 메소드 (토글 탭)
  setMobileTab: (tab: MobileTab) => void;
  setMobileSectionIds: (ids: HomeSectionId[]) => void;
  resetMobileOrder: () => void;
}

export const useHomeOrder = create<HomeOrderState>((set) => ({
  pcColumns: DEFAULT_PC_COLUMNS,
  mobileSectionIds: DEFAULT_MOBILE_SECTION_IDS,
  mobileTab: "news",
  hydrated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;

    let pcResult = DEFAULT_PC_COLUMNS;
    let mobileResult = DEFAULT_MOBILE_SECTION_IDS;

    // 1. PC 데이터 복원
    try {
      const pcRaw = localStorage.getItem(PC_STORAGE_KEY);
      if (pcRaw) {
        const parsed = JSON.parse(pcRaw) as HomeColumns;
        if (
          parsed &&
          Array.isArray(parsed.left) &&
          Array.isArray(parsed.right)
        ) {
          const leftValid = parsed.left.filter((id) =>
            ALL_SECTION_IDS.includes(id)
          );
          const rightValid = parsed.right.filter((id) =>
            ALL_SECTION_IDS.includes(id)
          );
          const present = new Set([...leftValid, ...rightValid]);
          const missing = ALL_SECTION_IDS.filter((id) => !present.has(id));
          pcResult = {
            left: [...leftValid, ...missing],
            right: rightValid,
          };
        }
      }
    } catch {
      // 에러 무시
    }

    // 2. 모바일 데이터 복원
    try {
      const mobileRaw = localStorage.getItem(MOBILE_STORAGE_KEY);
      if (mobileRaw) {
        const parsed = JSON.parse(mobileRaw) as HomeSectionId[];
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((id) => ALL_SECTION_IDS.includes(id));
          const missing = ALL_SECTION_IDS.filter((id) => !valid.includes(id));
          mobileResult = [...valid, ...missing];
        }
      }
    } catch {
      // 에러 무시
    }

    const initialTab: MobileTab =
      mobileResult[0] === "news-aside" ? "news" : "my-economy";

    set({
      pcColumns: pcResult,
      mobileSectionIds: mobileResult,
      mobileTab: initialTab,
      hydrated: true,
    });
  },

  // PC 좌측 배열 설정
  setPcLeftSectionIds: (ids) => {
    set((state) => {
      const nextPc = { ...state.pcColumns, left: ids };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PC_STORAGE_KEY, JSON.stringify(nextPc));
        } catch {
          // 저장 에러 무시
        }
      }
      return { pcColumns: nextPc };
    });
  },

  // PC 우측 배열 설정
  setPcRightSectionIds: (ids) => {
    set((state) => {
      const nextPc = { ...state.pcColumns, right: ids };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PC_STORAGE_KEY, JSON.stringify(nextPc));
        } catch {
          // 저장 에러 무시
        }
      }
      return { pcColumns: nextPc };
    });
  },

  // PC 드래그앤드롭 위치 배치
  movePcSectionToPosition: (id, targetColumn, index) => {
    set((state) => {
      const nextLeft = state.pcColumns.left.filter((item) => item !== id);
      const nextRight = state.pcColumns.right.filter((item) => item !== id);

      const targetArr = targetColumn === "left" ? nextLeft : nextRight;
      const clampedIndex = Math.max(0, Math.min(index, targetArr.length));
      targetArr.splice(clampedIndex, 0, id);

      const nextPc = { left: nextLeft, right: nextRight };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(PC_STORAGE_KEY, JSON.stringify(nextPc));
        } catch {
          // 에러 무시
        }
      }
      return { pcColumns: nextPc };
    });
  },

  // PC 배치 초기화
  resetPcColumns: () => {
    set({ pcColumns: DEFAULT_PC_COLUMNS });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(PC_STORAGE_KEY);
      } catch {
        // 에러 무시
      }
    }
  },

  // 모바일 탭 토글 설정 (나의 경제 ↔ 경제 뉴스)
  setMobileTab: (tab) => {
    set((state) => {
      const remaining = state.mobileSectionIds.filter(
        (id) => id !== "news-aside"
      );
      const nextIds =
        tab === "news"
          ? ["news-aside", ...remaining]
          : [...remaining, "news-aside"];

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(MOBILE_STORAGE_KEY, JSON.stringify(nextIds));
        } catch {
          // 에러 무시
        }
      }
      return { mobileTab: tab, mobileSectionIds: nextIds };
    });
  },

  // 모바일 순서 직접 설정
  setMobileSectionIds: (ids) => {
    set((state) => {
      const tab: MobileTab = ids[0] === "news-aside" ? "news" : "my-economy";
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(MOBILE_STORAGE_KEY, JSON.stringify(ids));
        } catch {
          // 에러 무시
        }
      }
      return { mobileSectionIds: ids, mobileTab: tab };
    });
  },

  // 모바일 순서 초기화
  resetMobileOrder: () => {
    set({
      mobileSectionIds: DEFAULT_MOBILE_SECTION_IDS,
      mobileTab: "news",
    });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(MOBILE_STORAGE_KEY);
      } catch {
        // 에러 무시
      }
    }
  },
}));
