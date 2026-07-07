import { beforeEach, describe, expect, it } from "vitest";
import {
  _resetRateLimitForTest,
  checkRateLimit,
  clientIpFromHeaders,
} from "@/lib/rateLimit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    _resetRateLimitForTest();
  });

  it("limit 이내면 계속 허용", () => {
    expect(checkRateLimit("a", 3, 1000, 0)).toBe(true);
    expect(checkRateLimit("a", 3, 1000, 0)).toBe(true);
    expect(checkRateLimit("a", 3, 1000, 0)).toBe(true);
  });

  it("limit을 넘으면 차단", () => {
    expect(checkRateLimit("a", 2, 1000, 0)).toBe(true);
    expect(checkRateLimit("a", 2, 1000, 0)).toBe(true);
    expect(checkRateLimit("a", 2, 1000, 0)).toBe(false);
  });

  it("윈도우가 지나면 다시 허용", () => {
    expect(checkRateLimit("a", 1, 1000, 0)).toBe(true);
    expect(checkRateLimit("a", 1, 1000, 500)).toBe(false);
    expect(checkRateLimit("a", 1, 1000, 1000)).toBe(true);
  });

  it("키가 다르면 서로 영향을 주지 않는다", () => {
    expect(checkRateLimit("a", 1, 1000, 0)).toBe(true);
    expect(checkRateLimit("b", 1, 1000, 0)).toBe(true);
  });
});

describe("clientIpFromHeaders", () => {
  it("x-forwarded-for의 첫 값을 쓴다", () => {
    const headers = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(clientIpFromHeaders(headers)).toBe("1.2.3.4");
  });

  it("x-forwarded-for가 없으면 x-real-ip를 쓴다", () => {
    const headers = new Headers({ "x-real-ip": "9.9.9.9" });
    expect(clientIpFromHeaders(headers)).toBe("9.9.9.9");
  });

  it("둘 다 없으면 unknown", () => {
    expect(clientIpFromHeaders(new Headers())).toBe("unknown");
  });
});
