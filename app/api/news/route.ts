import { NextResponse } from "next/server";
import {
  interleaveNewsItems,
  mixedQueries,
  toNewsItem,
  topicQuery,
  type NewsItem,
  type RawNaverNewsItem,
} from "@/lib/news";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rateLimit";

/** 오늘의 경제뉴스 프록시. 네이버 검색 API를 서버에서만 호출해 키를 숨긴다.
   - 검색어(topic)별로 REVALIDATE_SECONDS 동안 Next 데이터 캐시에 태워, 방문자 수와
     무관하게 네이버 호출량을 '토픽 개수'만큼으로 상한(무료 쿼터 25,000건/일 보호).
   - IP당 분당 RATE_LIMIT회로 라우트 자체 호출도 제한(캐시 우회 남용 방지).
   - ?topic=<id>: 주제별 검색.
   - ?topic=mixed: 관리 쿼리들을 병렬로 가져와 '주제별 최신'을 번갈아 섞음(홈 카드용). */

const ENDPOINT = "https://naverapihub.apigw.ntruss.com/search/v1/news";
const REVALIDATE_SECONDS = 120;
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

/** 한 검색어로 네이버 뉴스를 가져온다(실패 시 빈 배열). */
async function fetchNaver(
  query: string,
  display: number,
  clientId: string,
  clientSecret: string
): Promise<NewsItem[]> {
  const url = `${ENDPOINT}?query=${encodeURIComponent(
    query
  )}&display=${display}&sort=date&format=json`;
  try {
    const res = await fetch(url, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": clientId,
        "X-NCP-APIGW-API-KEY": clientSecret,
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: RawNaverNewsItem[] };
    return Array.isArray(data.items) ? data.items.map(toNewsItem) : [];
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  if (!checkRateLimit(`news:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { items: [], error: "rate_limited" },
      { status: 429 }
    );
  }

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
