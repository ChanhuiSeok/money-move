/** 경험치(XP) 기반 캐릭터 레벨 시스템.
 *  누적 경험치 구간별로 등급(Lv 0 ~ Lv 4), 칭호, 다음 레벨 게이지 정보를 산출한다. */

export type LevelInfo = {
  level: 0 | 1 | 2 | 3 | 4;
  title: string;
  badgeEmoji: string;
  prevXp: number; // 현재 레벨 시작 기준 XP
  nextXp: number; // 다음 레벨 달성 기준 XP
};

/** 누적 XP를 기준으로 캐릭터 레벨 정보를 추출한다. */
export function getUserLevelInfo(xp: number): LevelInfo {
  if (xp < 100) {
    return { level: 0, title: "금융 새내기", badgeEmoji: "🌱", prevXp: 0, nextXp: 100 };
  }
  if (xp < 300) {
    return { level: 1, title: "경제학 인턴", badgeEmoji: "💼", prevXp: 100, nextXp: 300 };
  }
  if (xp < 600) {
    return { level: 2, title: "지갑 사수 대리", badgeEmoji: "💳", prevXp: 300, nextXp: 600 };
  }
  if (xp < 1000) {
    return { level: 3, title: "재테크 과장", badgeEmoji: "📈", prevXp: 600, nextXp: 1000 };
  }
  return { level: 4, title: "머니 마스터", badgeEmoji: "🏆", prevXp: 1000, nextXp: 1000 };
}
