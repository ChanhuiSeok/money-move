import { describe, expect, it } from "vitest";
import {
  MOBILE_NAV_ITEMS,
  NAV_ITEMS,
  isActiveNav,
  isImmersiveRoute,
} from "@/lib/nav";

describe("isImmersiveRoute", () => {
  it("레슨 플레이어·복습·진단은 몰입형(셸 숨김)", () => {
    expect(isImmersiveRoute("/learn/welcome")).toBe(true);
    expect(isImmersiveRoute("/review")).toBe(true);
    expect(isImmersiveRoute("/diagnostic")).toBe(true);
  });

  it("허브형 페이지는 몰입형이 아니다(셸 노출)", () => {
    expect(isImmersiveRoute("/")).toBe(false);
    expect(isImmersiveRoute("/learn")).toBe(false); // 경로 트리는 허브
    expect(isImmersiveRoute("/tools")).toBe(false);
    expect(isImmersiveRoute("/tools/compound")).toBe(false);
    expect(isImmersiveRoute("/glossary")).toBe(false);
    expect(isImmersiveRoute("/achievements")).toBe(false);
  });
});

describe("isActiveNav", () => {
  it("홈은 정확히 일치할 때만 활성", () => {
    expect(isActiveNav("/", "/")).toBe(true);
    expect(isActiveNav("/tools", "/")).toBe(false);
  });

  it("나머지는 하위 경로까지 활성", () => {
    expect(isActiveNav("/tools", "/tools")).toBe(true);
    expect(isActiveNav("/tools/compound", "/tools")).toBe(true);
    expect(isActiveNav("/glossary", "/tools")).toBe(false);
  });
});

describe("내비 구성", () => {
  it("하단 탭바는 mobile=true만, 최대 5개", () => {
    expect(MOBILE_NAV_ITEMS.length).toBeLessThanOrEqual(5);
    expect(MOBILE_NAV_ITEMS.every((i) => i.mobile)).toBe(true);
    expect(MOBILE_NAV_ITEMS.length).toBeLessThan(NAV_ITEMS.length);
  });

  it("첫 항목은 홈", () => {
    expect(NAV_ITEMS[0].href).toBe("/");
  });
});
