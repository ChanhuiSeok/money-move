import { NextResponse } from "next/server";
import {
  interleaveNewsItems,
  mixedQueries,
  toNewsItem,
  topicQuery,
  type NewsItem,
  type RawNaverNewsItem,
} from "@/lib/news";

/** 오늘의 경제뉴스 프록시. 네이버 검색 API를 서버에서만 호출해 키를 숨긴다.
   태그를 누를 때마다 새 데이터를 받도록 캐시 없이(no-store) 매번 라이브 호출한다.
   - ?topic=<id>: 주제별 검색.
   - ?topic=mixed: 관리 쿼리들을 병렬로 가져와 '주제별 최신'을 번갈아 섞음(홈 카드용). */

export const dynamic = "force-dynamic"; // 라우트를 항상 동적으로 — 태그마다 fresh

const ENDPOINT = "https://openapi.naver.com/v1/search/news.json";

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
      cache: "no-store",
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
      mixedQueries.map((q) => fetchNaver(q, 10, clientId, clientSecret))
    );
    return NextResponse.json({ items: interleaveNewsItems(lists) });
  }

  const items = await fetchNaver(topicQuery(topic), 10, clientId, clientSecret);
  return NextResponse.json({ items });
}
