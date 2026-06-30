import { describe, expect, it } from "vitest";
import { currentSeason } from "@/lib/season";

describe("currentSeason", () => {
  it("1~2월은 연말정산 시즌", () => {
    expect(currentSeason("2026-01-15")?.id).toBe("year-end");
    expect(currentSeason("2026-02-28")?.id).toBe("year-end");
  });

  it("11~12월은 미리 준비 시즌", () => {
    expect(currentSeason("2026-11-01")?.id).toBe("year-end-prep");
    expect(currentSeason("2026-12-31")?.id).toBe("year-end-prep");
  });

  it("그 외 달은 시즌 없음", () => {
    expect(currentSeason("2026-06-30")).toBeNull();
    expect(currentSeason("2026-05-01")).toBeNull();
    expect(currentSeason("2026-09-15")).toBeNull();
  });

  it("형식이 어긋나면 시즌 없음", () => {
    expect(currentSeason("")).toBeNull();
    expect(currentSeason("nonsense")).toBeNull();
  });
});
