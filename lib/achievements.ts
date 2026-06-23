/** 배지(성취) 카탈로그 + 획득 판정 — 순수 함수.
   판정 기준은 모두 "단조 증가" 지표(완료 수·XP·역대 최고 스트릭·완료 레벨·배운 용어)라
   한 번 얻은 배지는 스트릭이 끊겨도 사라지지 않는다(저장 불필요, 진도에서 도출). */

export type AchievementStats = {
  completedCount: number;
  xp: number;
  bestStreak: number;
  levelsCompleted: number;
  termsLearned: number;
};

export type Badge = {
  id: string;
  /** 이모지 아이콘(명랑한 톤, 아이콘 플러밍 불필요) */
  emoji: string;
  title: string;
  /** 획득 조건 설명(아직 못 받았을 때 보여줌) */
  desc: string;
  test: (s: AchievementStats) => boolean;
};

/** 전체 배지 목록(표시 순서). */
export const BADGES: Badge[] = [
  {
    id: "first-step",
    emoji: "👣",
    title: "첫걸음",
    desc: "첫 레슨을 끝내요",
    test: (s) => s.completedCount >= 1,
  },
  {
    id: "streak-3",
    emoji: "🔥",
    title: "삼일 불꽃",
    desc: "3일 연속 학습해요",
    test: (s) => s.bestStreak >= 3,
  },
  {
    id: "streak-7",
    emoji: "🗓️",
    title: "일주일 개근",
    desc: "7일 연속 학습해요",
    test: (s) => s.bestStreak >= 7,
  },
  {
    id: "xp-100",
    emoji: "⚡",
    title: "100 XP",
    desc: "XP를 100점 모아요",
    test: (s) => s.xp >= 100,
  },
  {
    id: "level-basics",
    emoji: "🌱",
    title: "기초 완주",
    desc: "레벨 1을 끝내요",
    test: (s) => s.levelsCompleted >= 1,
  },
  {
    id: "level-all",
    emoji: "🏆",
    title: "세금 정복",
    desc: "모든 레벨을 끝내요",
    test: (s) => s.levelsCompleted >= 2,
  },
  {
    id: "terms-10",
    emoji: "📖",
    title: "용어 수집가",
    desc: "용어 10개를 배워요",
    test: (s) => s.termsLearned >= 10,
  },
];

/** 현재 획득한 배지 id 집합(단조 지표라 곧 "지금까지 획득"과 같다). */
export function earnedBadgeIds(stats: AchievementStats): Set<string> {
  return new Set(BADGES.filter((b) => b.test(stats)).map((b) => b.id));
}

/** before→after로 새로 획득한 배지(레슨 완료 직후 축하용). */
export function newlyEarnedBadges(
  before: AchievementStats,
  after: AchievementStats,
): Badge[] {
  const had = earnedBadgeIds(before);
  return BADGES.filter((b) => !had.has(b.id) && b.test(after));
}
