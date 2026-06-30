import { NextResponse } from "next/server";
import {
  mergeNewsItems,
  mixedQueries,
  toNewsItem,
  topicQuery,
  type NewsItem,
  type RawNaverNewsItem,
} from "@/lib/news";

/** 오늘의 경제뉴스 프록시. 네이버 검색 API를 서버에서만 호출해 키를 숨기고,
   업스트림 응답을 30분 캐시해 호출량(일 한도)을 아낀다.
   - ?topic=<id>: 주제별 검색.
   - ?topic=mixed: 여러 주제를 병렬로 가져와 합쳐 최신순으로(홈 카드용). */

const ENDPOINT = "https://openapi.naver.com/v1/search/news.json";
const REVALIDATE_SEC = 1800; // 30분

/** 한 검색어로 네이버 뉴스를 가져온다(실패 시 빈 배열). */
async function fetchNaver(
  query: string,
  display: number,
  clientId: string,
  clientSecret: string
): Promise<NewsItem[]> {
  const url = `${ENDPOINT}?query=${encodeURIComponent(
    query
  )}&display=${display}&sort=date`;
  try {
    const res = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      next: { revalidate: REVALIDATE_SEC },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: RawNaverNewsItem[] };
    return Array.isArray(data.items) ? data.items.map(toNewsItem) : [];
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const clientId = process.env.NAVER_SEARCH_CLIENT_ID;
  const clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    // 키 미설정(예: .env.local 없음) — 카드는 조용히 숨긴다.
    return NextResponse.json(
      { items: [], error: "unconfigured" },
      { status: 200 }
    );
  }

  const topic = new URL(request.url).searchParams.get("topic");

  if (topic === "mixed") {
    const lists = await Promise.all(
      mixedQueries.map((q) => fetchNaver(q, 2, clientId, clientSecret))
    );
    return NextResponse.json({ items: mergeNewsItems(lists) });
  }

  const items = await fetchNaver(topicQuery(topic), 10, clientId, clientSecret);
  return NextResponse.json({ items });
}
