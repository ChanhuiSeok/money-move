import { describe, expect, it } from "vitest";
import { pageMetadata, SITE_URL, truncate } from "@/lib/seo";

describe("truncate", () => {
  it("짧으면 그대로", () => {
    expect(truncate("짧은 문장", 140)).toBe("짧은 문장");
  });

  it("길면 잘라내고 …를 붙인다", () => {
    const long = "가".repeat(200);
    const result = truncate(long, 140);
    expect(result.length).toBe(140);
    expect(result.endsWith("…")).toBe(true);
  });

  it("공백을 정규화한다", () => {
    expect(truncate("여러   줄\n\n텍스트")).toBe("여러 줄 텍스트");
  });
});

describe("pageMetadata", () => {
  it("홈은 사이트명을 덧붙이지 않는다", () => {
    const meta = pageMetadata({ title: "홈", description: "설명", path: "/" });
    expect(meta.openGraph?.title).toBe("홈");
    expect(meta.alternates?.canonical).toBe(SITE_URL);
  });

  it("하위 페이지는 사이트명을 덧붙인다", () => {
    const meta = pageMetadata({
      title: "학습",
      description: "설명",
      path: "/learn",
    });
    expect(meta.openGraph?.title).toBe("학습 · 머니무브");
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/learn`);
  });

  it("title과 description을 그대로 전달한다", () => {
    const meta = pageMetadata({
      title: "제목",
      description: "설명문",
      path: "/x",
    });
    expect(meta.title).toBe("제목");
    expect(meta.description).toBe("설명문");
    expect(meta.twitter).toMatchObject({ title: "제목 · 머니무브", description: "설명문" });
  });
});
