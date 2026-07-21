import { describe, it, expect, beforeEach } from "vitest";
import {
  useHomeOrder,
  DEFAULT_PC_COLUMNS,
  DEFAULT_MOBILE_SECTION_IDS,
} from "./useHomeOrder";

// node test environment mock
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    length: 0,
    key: () => null,
  };
}

describe("useHomeOrder store (Mobile Tab Toggle)", () => {
  beforeEach(() => {
    localStorage.clear();
    useHomeOrder.setState({
      pcColumns: DEFAULT_PC_COLUMNS,
      mobileSectionIds: DEFAULT_MOBILE_SECTION_IDS,
      mobileTab: "news",
      hydrated: false,
    });
  });

  it("setMobileTab('news')를 누르면 news-aside가 맨 앞으로 올라온다", () => {
    useHomeOrder.getState().setMobileTab("news");

    const { mobileSectionIds, mobileTab } = useHomeOrder.getState();
    expect(mobileTab).toBe("news");
    expect(mobileSectionIds[0]).toBe("news-aside");
  });

  it("setMobileTab('my-economy')를 누르면 news-aside가 맨 뒤로 이동한다", () => {
    useHomeOrder.getState().setMobileTab("news");
    useHomeOrder.getState().setMobileTab("my-economy");

    const { mobileSectionIds, mobileTab } = useHomeOrder.getState();
    expect(mobileTab).toBe("my-economy");
    expect(mobileSectionIds[mobileSectionIds.length - 1]).toBe("news-aside");
  });
});
