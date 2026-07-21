import { describe, expect, it } from "vitest";
import { getUserLevelInfo } from "@/lib/achievements";

describe("getUserLevelInfo", () => {
  it("XP < 100 일 때 Lv 0 (금융 새내기)", () => {
    const info = getUserLevelInfo(50);
    expect(info.level).toBe(0);
    expect(info.title).toBe("금융 새내기");
  });

  it("100 <= XP < 300 일 때 Lv 1 (경제학 인턴)", () => {
    const info = getUserLevelInfo(150);
    expect(info.level).toBe(1);
    expect(info.title).toBe("경제학 인턴");
  });

  it("XP >= 1000 일 때 최고 레벨 Lv 4 (머니 마스터)", () => {
    const info = getUserLevelInfo(1200);
    expect(info.level).toBe(4);
    expect(info.title).toBe("머니 마스터");
  });
});
