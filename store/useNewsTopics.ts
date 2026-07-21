import { create } from "zustand";
import { newsTopics as defaultNewsTopics, type NewsTopic } from "@/lib/news";

export interface CustomNewsTopic {
  id: string;
  label: string;
  query: string;
  isCustom?: boolean;
}

export const RECOMMENDED_KEYWORDS = [
  "미국주식",
  "청약",
  "비트코인",
  "엔화",
  "반도체",
  "재건축",
  "금리전망",
  "배당주",
];

const STORAGE_KEY = "money-move:news-topics-order-v1";

interface NewsTopicsState {
  topics: CustomNewsTopic[];
  hydrated: boolean;
  hydrate: () => void;
  addTopic: (label: string) => boolean;
  removeTopic: (id: string) => void;
  reorderTopics: (newTopics: CustomNewsTopic[]) => void;
  resetTopics: () => void;
}

export const useNewsTopics = create<NewsTopicsState>((set, get) => ({
  topics: defaultNewsTopics,
  hydrated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CustomNewsTopic[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({ topics: parsed, hydrated: true });
          return;
        }
      }
    } catch {
      // 에러 무시
    }
    set({ topics: defaultNewsTopics, hydrated: true });
  },

  addTopic: (label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return false;
    const current = get().topics;
    const exists = current.some((t) => t.label === trimmed);
    if (exists) return false;

    const newTopic: CustomNewsTopic = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: trimmed,
      query: trimmed,
      isCustom: true,
    };

    const nextTopics = [...current, newTopic];
    set({ topics: nextTopics });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTopics));
      } catch {
        // 에러 무시
      }
    }
    return true;
  },

  removeTopic: (id: string) => {
    const nextTopics = get().topics.filter((t) => t.id !== id);
    set({ topics: nextTopics });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTopics));
      } catch {
        // 에러 무시
      }
    }
  },

  reorderTopics: (newTopics) => {
    set({ topics: newTopics });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTopics));
      } catch {
        // 에러 무시
      }
    }
  },

  resetTopics: () => {
    set({ topics: defaultNewsTopics });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // 에러 무시
      }
    }
  },
}));
