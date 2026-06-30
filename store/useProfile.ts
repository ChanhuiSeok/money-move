import { create } from "zustand";
import type { Profile } from "@/lib/schema";
import {
  defaultProfile,
  loadProfile,
  normalizeProfile,
  saveProfile,
} from "@/lib/profile";

/* "내 프로필" 스토어. useProgress와 같은 패턴:
   순수 로직은 lib/profile.ts에 두고, 여기선 상태 보관 + 변경 시 localStorage 저장만.
   SSR 하이드레이션 불일치를 피하려고 초기값은 기본값으로 두고,
   클라이언트 마운트 후 hydrate()로 실제 저장값을 불러온다. */

type ProfileState = {
  profile: Profile;
  hydrated: boolean;
  hydrate: () => void;
  /** 프로필을 통째로 저장한다(정규화 후). */
  save: (profile: Profile) => void;
  reset: () => void;
};

export const useProfile = create<ProfileState>((set) => ({
  profile: defaultProfile(),
  hydrated: false,

  hydrate: () => set({ profile: loadProfile(), hydrated: true }),

  save: (profile) => {
    const next = normalizeProfile(profile);
    saveProfile(next);
    set({ profile: next });
  },

  reset: () => {
    const next = defaultProfile();
    saveProfile(next);
    set({ profile: next });
  },
}));
