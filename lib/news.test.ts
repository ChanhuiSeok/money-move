import { describe, expect, it } from "vitest";
import {
  cleanNewsText,
  formatNewsDate,
  mergeNewsItems,
  toNewsItem,
  topicQuery,
  type NewsItem,
} from "@/lib/news";

function item(title: string, pubDate: string, link = title): NewsItem {
  return { title, link, description: "", pubDate };
}

describe("cleanNewsText", () => {
  it("<b> 강조 태그를 벗긴다", () => {
    expect(cleanNewsText("오늘 <b>경제</b> 소식")).toBe("오늘 경제 소식");
  });

  it("HTML 엔티티를 디코드한다", () => {
    expect(cleanNewsText("&quot;코스피&quot; 상승 &amp; 환율 &lt;하락&gt;")).toBe(
      '"코스피" 상승 & 환율 <하락>',
    );
    expect(cleanNewsText("정부&#39;s 발표")).toBe("정부's 발표");
  });

  it("연속 공백은 하나로, 앞뒤 공백 제거", () => {
    expect(cleanNewsText("  많은   공백  ")).toBe("많은 공백");
  });
});

describe("toNewsItem", () => {
  it("텍스트를 정리하고 link를 고른다(link 우선)", () => {
    const item = toNewsItem({
      title: "금리 <b>인하</b>",
      originallink: "http://press.example/a",
      link: "https://n.news.naver.com/a",
      description: "한국은행 &amp; 기준금리",
      pubDate: "Mon, 30 Jun 2026 09:00:00 +0900",
    });
    expect(item.title).toBe("금리 인하");
    expect(item.link).toBe("https://n.news.naver.com/a");
    expect(item.description).toBe("한국은행 & 기준금리");
  });

  it("link가 비면 originallink로", () => {
    const item = toNewsItem({
      title: "x",
      originallink: "http://press.example/b",
      link: "",
      description: "y",
      pubDate: "",
    });
    expect(item.link).toBe("http://press.example/b");
  });
});

describe("topicQuery", () => {
  it("알려진 토픽은 해당 query", () => {
    expect(topicQuery("kospi")).toBe("코스피");
    expect(topicQuery("us")).toBe("미국증시");
  });

  it("모르는 값·null은 기본(전체=경제)", () => {
    expect(topicQuery("zzz")).toBe("경제");
    expect(topicQuery(null)).toBe("경제");
  });
});

describe("mergeNewsItems", () => {
  it("여러 리스트를 최신순으로 합친다", () => {
    const merged = mergeNewsItems([
      [item("A", "Tue, 30 Jun 2026 09:00:00 +0900")],
      [item("B", "Tue, 30 Jun 2026 11:00:00 +0900")],
    ]);
    expect(merged.map((m) => m.title)).toEqual(["B", "A"]);
  });

  it("같은 제목 기사는 제거하고 최신 것만 남긴다", () => {
    const merged = mergeNewsItems([
      [item("코스피 상승", "Tue, 30 Jun 2026 08:00:00 +0900", "x")],
      [item("코스피 상승", "Tue, 30 Jun 2026 12:00:00 +0900", "y")],
      [item("환율 하락", "Tue, 30 Jun 2026 10:00:00 +0900")],
    ]);
    expect(merged.map((m) => m.title)).toEqual(["코스피 상승", "환율 하락"]);
    // 남은 '코스피 상승'은 더 최신(12시) 쪽
    expect(merged[0].link).toBe("y");
  });
});

describe("formatNewsDate", () => {
  const now = Date.parse("2026-06-30T12:00:00+09:00");

  it("1시간 전", () => {
    expect(formatNewsDate("Tue, 30 Jun 2026 11:00:00 +0900", now)).toBe("1시간 전");
  });

  it("방금 전", () => {
    expect(formatNewsDate("Tue, 30 Jun 2026 11:59:40 +0900", now)).toBe("방금 전");
  });

  it("며칠 지나면 M.D", () => {
    expect(formatNewsDate("Mon, 22 Jun 2026 09:00:00 +0900", now)).toBe("6.22");
  });

  it("형식이 깨지면 빈 문자열", () => {
    expect(formatNewsDate("not-a-date", now)).toBe("");
  });
});
